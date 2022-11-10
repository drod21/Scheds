import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { match } from 'ts-pattern';
import { useSession, useUser } from '@supabase/auth-helpers-react';

import Layout from '../layout';
import '../styles/globals.scss';

export enum AuthStateEnum {
	Loading = 'loading',
	Authenticated = 'authenticated',
	Unauthenticated = 'unauthenticated',
}

export type AuthState = AuthStateEnum;

function MyApp({ Component, pageProps }) {
	let authState = AuthStateEnum.Loading;
	const session = useSession();
	const user = useUser();
	const props = { ...pageProps, session };

	if (user && session) {
		authState = AuthStateEnum.Authenticated;
	}

	return (
		<Layout authState={authState}>
			<Component session={session} {...props} />
		</Layout>
	);
}

export default MyApp;
