import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { supabase } from '../../utils/supabase-client';
export default function Login() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');

	const handleLogin = async (email: string) => {
		try {
			setLoading(true);
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			const e = error;
			alert(e.error_description || e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='row flex flex-center'>
			<div className='col-6 form-widget'>
				<h1 className='header'>Supabase + Next.js</h1>
				<p className='description'>Sign in via magic link with your email below</p>
				<div>
					<TextInput type='email' placeholder='Your email' value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<div>
					<Button
						onClick={e => {
							e.preventDefault();
							handleLogin(email);
						}}
						disabled={loading}
					>
						<span>{loading ? 'Loading' : 'Send magic link'}</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
