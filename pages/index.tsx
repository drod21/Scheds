import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase-client'
import Auth from '../components/auth'
import Account from '../components/account'
import Layout from '../layout'

export default function Home() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Layout session={session}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </Layout>
  )
}