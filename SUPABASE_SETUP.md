# Supabase Email Confirmation Setup

You need to tell Supabase where to redirect users after they confirm their email.

## Steps

1. Go to **supabase.com** → your project
2. Click **Authentication** (left sidebar)
3. Click **URL Configuration**
4. Under **Redirect URLs** → click **Add URL**
5. Add: `https://afriilink2.vercel.app/auth/confirm`
6. Also add: `http://localhost:3000/auth/confirm` (for local testing)
7. Click **Save**

Also under **Site URL** set:
`https://afriilink2.vercel.app`

That's it — email confirmation will now work correctly.
