import { useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { match } from 'ts-pattern'

import { supabase } from '../utils/supabase-client'
import Layout from '../layout'
import '../styles/globals.scss'

export enum AuthStateEnum {
	Loading = 'loading',
	Authenticated = 'authenticated',
	Unauthenticated = 'unauthenticated',
}

export type AuthState = AuthStateEnum

function MyApp({ Component, pageProps }: AppProps & { session: Session }) {
	const [session, setSession] = useState(null)
	const [authState, setAuthState] = useState<AuthState>(AuthStateEnum.Loading)
	const props = { ...pageProps, session }

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			updateSupabaseCookie(event, session)
			match(event)
				.with('SIGNED_IN', () => {
					setAuthState(AuthStateEnum.Authenticated)
				})
				.with('SIGNED_OUT', () => setAuthState(AuthStateEnum.Unauthenticated))
				.otherwise(() => setAuthState(AuthStateEnum.Loading))
		})

		checkUser()

		return () => {
			authListener?.unsubscribe()
		}
	}, [])

	async function updateSupabaseCookie(event: AuthChangeEvent, session: Session | null) {
		await fetch('/api/auth', {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			credentials: 'same-origin',
			body: JSON.stringify({ event, session }),
		})
	}

	async function checkUser() {
		const user = supabase.auth.user()
		setAuthState(() => (user ? AuthStateEnum.Authenticated : AuthStateEnum.Unauthenticated))
	}

	useEffect(() => {
		setSession(supabase.auth.session())

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	return (
		<Layout session={session} authState={authState}>
			<Component {...props} />
		</Layout>
	)
}

export default MyApp
