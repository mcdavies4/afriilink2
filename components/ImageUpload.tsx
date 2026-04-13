'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  type: 'avatar' | 'header'
  currentUrl?: string | null
  onUpload: (url: string) => void
  label: string
}

export function ImageUpload({ type, currentUrl, onUpload, label }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [preview, setPreview]     = useState<string | null>(currentUrl ?? null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Max file size is 5MB'); return }
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return }

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Upload to Supabase Storage
      const bucket = type === 'header' ? 'headers' : 'avatars'
      const ext    = file.name.split('.').pop() ?? 'jpg'
      const path   = `${user.id}/image.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw new Error(uploadError.message)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      // Add cache-busting so the new image shows immediately
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`

      // Save to profile
      const field = type === 'header' ? 'header_url' : 'avatar_url'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [field]: urlWithCacheBust })
        .eq('id', user.id)

      if (updateError) throw new Error(updateError.message)

      setPreview(urlWithCacheBust)
      onUpload(urlWithCacheBust)
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
      setPreview(currentUrl ?? null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const field = type === 'header' ? 'header_url' : 'avatar_url'
    await supabase.from('profiles').update({ [field]: null }).eq('id', user.id)
    setPreview(null)
    onUpload('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  if (type === 'header') {
    return (
      <div>
        <label className="block text-sm font-semibold mb-2">{label}</label>
        <div
          className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer group"
          style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {preview ? (
            <img src={preview} alt="Header" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ color: 'var(--text-muted)' }}>
              <Upload size={24} />
              <p className="text-xs font-medium">Click or drag to upload header</p>
              <p className="text-xs opacity-60">Recommended: 1200×400px</p>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            {uploading
              ? <Loader2 size={24} className="text-white animate-spin" />
              : <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <Camera size={18} /> {preview ? 'Change header' : 'Upload header'}
                </div>
            }
          </div>
        </div>
        {error && (
          <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>JPG, PNG or WebP · Max 5MB</p>
          {preview && !uploading && (
            <button type="button" onClick={handleRemove}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500">
              <X size={11} /> Remove
            </button>
          )}
        </div>
      </div>
    )
  }

  // Avatar
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed group flex-shrink-0"
          style={{ borderColor: 'var(--border-strong)', background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera size={20} className="text-white opacity-70" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            {uploading
              ? <Loader2 size={16} className="text-white animate-spin" />
              : <Camera size={16} className="text-white" />
            }
          </div>
        </div>

        <div className="flex-1">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all disabled:opacity-60"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)', background: 'var(--bg-base)' }}>
            {uploading
              ? <><Loader2 size={14} className="animate-spin" /> Uploading...</>
              : <><Upload size={14} /> {preview ? 'Change photo' : 'Upload photo'}</>
            }
          </button>
          {preview && !uploading && (
            <button type="button" onClick={handleRemove}
              className="flex items-center gap-1 text-xs mt-2 text-red-400 hover:text-red-500">
              <X size={12} /> Remove photo
            </button>
          )}
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>JPG, PNG or WebP · Max 5MB</p>
          {error && (
            <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}
