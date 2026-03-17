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
  // Get Daniel's auth user id
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 100 })
  const daniel = users.users.find(u => u.email === 'daniel@riivo.io')

  if (!daniel) {
    console.error('Daniel auth user not found!')
    return
  }

  // Check all profiles to see current state
  const { data: allProfiles } = await supabase.from('profiles').select('username, auth_user_id, role')
  console.log('All profiles:', allProfiles?.length)

  // Check if Daniel profile exists (might have different casing or been deleted)
  const danielProfile = allProfiles?.find(p => p.username === 'Daniel')

  if (danielProfile) {
    // Update existing
    const { error } = await supabase
      .from('profiles')
      .update({ auth_user_id: daniel.id, role: 'admin' })
      .eq('username', 'Daniel')
    console.log(error ? `Update error: ${error.message}` : 'Updated Daniel profile to admin')
  } else {
    // Create new profile for Daniel
    const { error } = await supabase
      .from('profiles')
      .insert({
        auth_user_id: daniel.id,
        username: 'Daniel',
        role: 'admin',
      })
    console.log(error ? `Insert error: ${error.message}` : 'Created Daniel admin profile')
  }

  // Also check for orphaned username123 profile and clean up
  const old = allProfiles?.find(p => p.username === 'username123')
  if (old) {
    await supabase.from('profiles').delete().eq('username', 'username123')
    console.log('Cleaned up old username123 profile')
  }

  // Verify
  const { data: check } = await supabase
    .from('profiles')
    .select('username, role, auth_user_id')
    .eq('auth_user_id', daniel.id)
    .single()
  console.log('Verified:', check)
}

main().catch(console.error)
