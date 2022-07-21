import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { match } from 'ts-pattern';

import { supabase } from '../utils/supabase-client';
import Layout from '../layout';
import '../styles/globals.scss';

export enum AuthStateEnum {
	Loading = 'loading',
	Authenticated = 'authenticated',
	Unauthenticated = 'unauthenticated',
}

export type AuthState = AuthStateEnum;

function MyApp({ Component, pageProps }: AppProps & { session: Session }) {
	const [session, setSession] = useState(null);
	const [authState, setAuthState] = useState<AuthState>(AuthStateEnum.Loading);
	const props = { ...pageProps, session };

	const updateAuthState = (event) =>
		setAuthState(() =>
			match(event)
				.with('SIGNED_IN', () => AuthStateEnum.Authenticated)
				.with('SIGNED_OUT', () => AuthStateEnum.Unauthenticated)
				.otherwise(() => AuthStateEnum.Loading),
		);

	useEffect(() => {
		setSession(supabase.auth.session());
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			await updateSupabaseCookie(event, session);
			updateAuthState(event);
			setSession(session);
		});

		checkUser();

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	async function updateSupabaseCookie(event: AuthChangeEvent, session: Session | null) {
		await fetch('/api/auth', {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			credentials: 'same-origin',
			body: JSON.stringify({ event, session }),
		});
	}

	async function checkUser() {
		const user = supabase.auth.user();
		setAuthState(() => (user ? AuthStateEnum.Authenticated : AuthStateEnum.Unauthenticated));
	}

	return (
		<Layout session={session} authState={authState}>
			<Component {...props} />
		</Layout>
	);
}

export default MyApp;
