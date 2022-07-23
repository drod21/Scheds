import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabase-client';
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Profile({ session }: { session: Session }) {
	const form = useForm({ initialValues: { username: '' } });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			const user = supabase.auth.user();

			let { data, error, status } = await supabase.from('profiles').select(`username`).eq('id', user.id).single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				form.setValues({ username: data.username });
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({ username }) {
		try {
			setLoading(true);
			const user = supabase.auth.user();

			const updates = {
				id: user.id,
				username,
				updated_at: new Date(),
			};

			let { error } = await supabase.from('profiles').upsert(updates, {
				returning: 'minimal', // Don't return the value after inserting
			});

			if (error) {
				throw error;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Box sx={{ maxWidth: 300 }} mx='auto'>
			<form onSubmit={form.onSubmit(updateProfile)}>
				<Group position='apart'>
					<TextInput label='Email' value={session.user.email} disabled />
					<TextInput
						label='Username'
						placeholder='Please enter a username'
						{...form.getInputProps('username')}
						required
					/>
				</Group>
				<Group position='right'>
					<Button type='submit' disabled={loading}>
						{loading ? 'Loading ...' : 'Update'}
					</Button>
				</Group>
			</form>
		</Box>
	);
}
