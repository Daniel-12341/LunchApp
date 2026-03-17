import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const members = [
  { name: 'Anastasia', location: 'Greyton',        lat: -34.0382, lng: 19.6102, emoji: '🎬🏡', funLabel: 'Taking the best videos of Greyton' },
  { name: 'Andre',     location: 'Paarl',          lat: -33.7312, lng: 18.9706, emoji: '🏉💪', funLabel: 'Practicing his passes' },
  { name: 'Andrea',    location: 'Rondebosch',     lat: -33.9570, lng: 18.4780, emoji: '👶❤️', funLabel: 'Looking after Jack' },
  { name: 'Angus',     location: 'Rondebosch',     lat: -33.9610, lng: 18.4740, emoji: '💇✂️', funLabel: 'Getting a fresh haircut' },
  { name: 'Chris',     location: 'Greyton',        lat: -34.0410, lng: 19.6050, emoji: '🎭🔫', funLabel: 'Loving Mafia!' },
  { name: 'Daniel',    location: 'Stellenbosch',   lat: -33.9321, lng: 18.8602, emoji: '🏓🔥', funLabel: 'Smashing padel balls' },
  { name: 'Dormehl',   location: 'Sea Point',      lat: -33.9180, lng: 18.3850, emoji: '🧘🏋️', funLabel: 'Practicing Pilates and gyming' },
  { name: 'Francois',  location: 'Foreshore',      lat: -33.9170, lng: 18.4260, emoji: '🦾🏆', funLabel: 'Hyrox man' },
  { name: 'James',     location: 'In the sea',     lat: -34.1500, lng: 18.7000, emoji: '🐟🎣', funLabel: 'The tuna specialist' },
  { name: 'Jenna',     location: 'Somerset West',  lat: -34.0825, lng: 18.8430, emoji: '🥾⛰️', funLabel: 'Hiker' },
  { name: 'Lloyd',     location: 'Simonstown',     lat: -34.1908, lng: 18.4326, emoji: '💍🏔️🧗', funLabel: 'Mountain adventurer' },
  { name: 'Luc',       location: 'Muizenberg',     lat: -34.1088, lng: 18.4716, emoji: '⚽🌊', funLabel: 'Soccer by the sea' },
  { name: 'Lungile',   location: 'Rondebosch',     lat: -33.9550, lng: 18.4690, emoji: '😂🤪', funLabel: 'Life of the party' },
  { name: 'Michael',   location: 'Greyton',        lat: -34.0350, lng: 19.6130, emoji: '♟️🧠', funLabel: 'Chess strategist' },
  { name: 'Natalia',   location: 'Hermanus',       lat: -34.4187, lng: 19.2345, emoji: '🐋👀', funLabel: 'Whale watching' },
  { name: 'Nic',       location: 'Newlands',       lat: -33.9806, lng: 18.4584, emoji: '⭐👶👑', funLabel: 'Baby leader' },
  { name: 'Oliver',    location: 'Greyton',        lat: -34.0430, lng: 19.6080, emoji: '🔍🕵️', funLabel: 'Murder mystery master' },
  { name: 'Rosie',     location: 'Rondebosch',     lat: -33.9590, lng: 18.4790, emoji: '🎨🎭', funLabel: 'Art, museums and theatre' },
]

async function main() {
  // Get all auth users to link
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 100 })

  for (const member of members) {
    const email = `${member.name.toLowerCase()}@riivo.io`
    const authUser = authUsers.users.find(u => u.email === email)

    const { error } = await supabase.from('profiles').insert({
      auth_user_id: authUser?.id ?? null,
      username: member.name,
      role: member.name === 'Daniel' ? 'admin' : 'user',
      location_name: member.location,
      lat: member.lat,
      lng: member.lng,
      emoji: member.emoji,
      fun_label: member.funLabel,
    })

    if (error) {
      console.error(`FAILED ${member.name}:`, error.message)
    } else {
      console.log(`Created profile: ${member.name} (${authUser ? 'linked' : 'no auth'})`)
    }
  }

  const { data: count } = await supabase.from('profiles').select('username')
  console.log(`\nDone! ${count?.length} profiles total.`)
}

main().catch(console.error)
