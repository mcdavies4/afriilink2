import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({
      error: 'Image upload not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to Vercel environment variables.'
    }, { status: 503 })
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'File must be an image.' }, { status: 400 })

    // Build Cloudinary signed upload using fetch — no SDK needed
    const cloudName   = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey      = process.env.CLOUDINARY_API_KEY
    const apiSecret   = process.env.CLOUDINARY_API_SECRET

    const folder    = type === 'header' ? 'afriilink/headers' : 'afriilink/avatars'
    const publicId  = `${folder}/${user.id}`
    const timestamp = Math.floor(Date.now() / 1000).toString()

    const transformation = type === 'header'
      ? 'c_fill,g_auto,h_400,w_1200,q_auto,f_auto'
      : 'c_fill,g_face,h_400,w_400,q_auto,f_auto'

    // Generate signature using Web Crypto (works on Vercel)
    const paramsToSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}&transformation=${transformation}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(apiSecret)
    const msgData = encoder.encode(paramsToSign)
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)

    // Convert to SHA-1 style hex — Cloudinary uses SHA-1 not HMAC
    // Use a simple SHA1 implementation via the string approach
    const signStr = paramsToSign + apiSecret
    const msgBuffer = encoder.encode(signStr)
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Build upload form
    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('api_key', apiKey)
    uploadForm.append('timestamp', timestamp)
    uploadForm.append('signature', signature)
    uploadForm.append('public_id', publicId)
    uploadForm.append('overwrite', 'true')
    uploadForm.append('transformation', transformation)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    const uploadData = await uploadRes.json()

    if (!uploadRes.ok) {
      console.error('Cloudinary error:', uploadData)
      return NextResponse.json({
        error: uploadData.error?.message ?? 'Upload to Cloudinary failed'
      }, { status: 400 })
    }

    // Save URL to profile
    const updateField = type === 'header' ? 'header_url' : 'avatar_url'
    await supabase.from('profiles').update({ [updateField]: uploadData.secure_url }).eq('id', user.id)

    return NextResponse.json({ url: uploadData.secure_url })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 })
  }
}
