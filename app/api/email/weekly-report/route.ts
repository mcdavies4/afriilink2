import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, name, username, weekly_report')
    .eq('weekly_report', true)
    .limit(500)

  if (!profiles?.length) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const profile of profiles) {
    try {
      const [{ count: views }, { count: prevViews }, { data: links }] = await Promise.all([
        supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id).gte('created_at', sevenDaysAgo),
        supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id).gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
        supabaseAdmin.from('links').select('id, title, link_clicks(count)').eq('user_id', profile.id),
      ])

      const clicks = links?.reduce((sum: number, l: any) => sum + (l.link_clicks?.[0]?.count ?? 0), 0) ?? 0
      const viewsDelta = (prevViews ?? 0) > 0
        ? Math.round((((views ?? 0) - (prevViews ?? 0)) / (prevViews ?? 1)) * 100)
        : null

      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id)
      if (!authUser?.user?.email) continue

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://afriilink2.vercel.app'
      const firstName = profile.name?.split(' ')[0] ?? 'creator'

      // Email HTML
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f3ff;margin:0;padding:20px;">
<div style="max-width:540px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(108,99,255,0.12);">
<div style="background:linear-gradient(135deg,#6c63ff,#a855f7,#ff3cac);padding:32px;text-align:center;">
  <h1 style="color:white;margin:0;font-size:22px;font-weight:800;">Your weekly report 📊</h1>
  <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Here's how your page performed this week, ${firstName}</p>
</div>
<div style="padding:28px 32px;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
    <div style="background:#f4f3ff;border-radius:16px;padding:20px;text-align:center;">
      <div style="font-size:32px;font-weight:800;color:#6c63ff;">${(views ?? 0).toLocaleString()}</div>
      <div style="font-size:12px;color:#9896b8;margin-top:4px;">Page views</div>
      ${viewsDelta !== null ? `<div style="font-size:11px;font-weight:600;margin-top:6px;color:${viewsDelta >= 0 ? '#00d97e' : '#ff6b35'}">${viewsDelta >= 0 ? '↑' : '↓'} ${Math.abs(viewsDelta)}% vs last week</div>` : ''}
    </div>
    <div style="background:#fff7f4;border-radius:16px;padding:20px;text-align:center;">
      <div style="font-size:32px;font-weight:800;color:#ff6b35;">${clicks.toLocaleString()}</div>
      <div style="font-size:12px;color:#9896b8;margin-top:4px;">Total clicks</div>
    </div>
  </div>
  <div style="text-align:center;margin-bottom:20px;">
    <a href="${appUrl}/analytics" style="background:linear-gradient(135deg,#6c63ff,#a855f7);color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:14px;display:inline-block;">
      View full analytics →
    </a>
  </div>
  <div style="background:#f9f8ff;border-radius:12px;padding:16px;text-align:center;">
    <a href="${appUrl}/u/${profile.username}" style="color:#6c63ff;font-weight:700;font-size:14px;text-decoration:none;">
      afriilink.com/u/${profile.username}
    </a>
  </div>
</div>
<div style="padding:16px 32px 28px;text-align:center;border-top:1px solid #f0efff;">
  <p style="font-size:11px;color:#9896b8;margin:0;">
    <a href="${appUrl}/settings" style="color:#6c63ff;">Unsubscribe from weekly reports</a>
  </p>
</div>
</div></body></html>`

      // Log for now — integrate Resend/SendGrid here
      console.log(`Weekly report prepared for ${authUser.user.email} — views: ${views}, clicks: ${clicks}`)
      // await sendEmail({ to: authUser.user.email, subject: 'Your Afriilink weekly report', html })
      sent++
    } catch (err) {
      console.error(`Failed for ${profile.id}:`, err)
    }
  }

  return NextResponse.json({ sent, total: profiles.length })
}
