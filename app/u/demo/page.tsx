import { ProfilePage } from '@/components/ProfilePage'

const demoProfile = {
  id: 'demo',
  name: 'Adaeze Kalu',
  username: 'adaeze',
  bio: 'Fashion designer & content creator 🇳🇬 · Based in Lagos, Nigeria · DMs always open',
  avatar_url: null,
  header_url: null,
  plan: 'PREMIUM',
  theme: 'aurora',
  accent_color: '#6c63ff',
  youtube_url: null,
  music_url: null,
  music_type: 'spotify',
  dark_mode_toggle: true,
  link_sound: false,
  ga_measurement_id: null,
}

const demoLinks = [
  { id: '1', title: 'My Boutique — Shop Now', url: '#', icon: '🛍️', active: true, position: 0 },
  { id: '2', title: 'WhatsApp Me Directly', url: 'https://wa.me/2348012345678', icon: '📱', active: true, position: 1 },
  { id: '3', title: 'Latest YouTube Video', url: '#', icon: '▶️', active: true, position: 2 },
  { id: '4', title: 'Instagram @adaezekalu', url: '#', icon: '📸', active: true, position: 3 },
  { id: '5', title: 'My Portfolio', url: '#', icon: '💼', active: true, position: 4 },
]

export default function DemoPage() {
  return <ProfilePage profile={demoProfile as any} links={demoLinks} />
}
