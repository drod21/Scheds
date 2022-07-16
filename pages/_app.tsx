import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase-client'
import Layout from '../layout'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps & { session: Session }) {
  const [session, setSession] = useState(null)
  const props = { ...pageProps, session }
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        updateSupabaseCookie(event, session);
    });

    return () => {
        authListener?.unsubscribe();
    };
});

async function updateSupabaseCookie(event: AuthChangeEvent, session: Session | null) {
    await fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
    });
}

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <Layout session={session}>
    <Component { ...props } />
  </Layout>
}

export default MyApp
