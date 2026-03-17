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
  'Anastasia','Andre','Andrea','Angus','Chris','Daniel','Dormehl',
  'Francois','James','Jenna','Lloyd','Luc','Lungile','Michael',
  'Natalia','Nic','Oliver','Rosie'
]

async function main() {
  for (const name of members) {
    const email = `${name.toLowerCase()}@riivo.io`
    const password = name === 'Daniel' ? 'password123' : 'password'

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error(`FAILED ${email}:`, error.message)
      continue
    }

    console.log(`Created ${email} (${data.user.id})`)

    // Link to existing profile
    const { error: linkErr } = await supabase
      .from('profiles')
      .update({
        auth_user_id: data.user.id,
        role: name === 'Daniel' ? 'admin' : 'user',
      })
      .eq('username', name)

    if (linkErr) {
      console.error(`  Failed to link profile for ${name}:`, linkErr.message)
    } else {
      console.log(`  Linked profile for ${name}`)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)
