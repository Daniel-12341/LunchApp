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

async function main() {
  // Check Daniel's auth user
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 100 })
  const daniel = users.users.find(u => u.email === 'daniel@riivo.io')
  console.log('Auth user:', daniel?.id, daniel?.email)

  // Check all profiles with username Daniel or username123
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .or('username.eq.Daniel,username.eq.username123')

  console.log('\nProfiles:', JSON.stringify(profiles, null, 2))

  // Check profile linked to Daniel's auth_user_id
  if (daniel) {
    const { data: linked, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', daniel.id)

    console.log('\nLinked profiles:', JSON.stringify(linked, null, 2))
    if (error) console.log('Error:', error.message)
  }
}

main().catch(console.error)
