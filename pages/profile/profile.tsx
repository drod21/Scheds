import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabase-client';
import { TextInput, Button, Group, Box, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Profile({ session }: { session: Session }) {
	const form = useForm({
		initialValues: { firstName: '', lastName: '', username: '' },
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			const user = supabase.auth.user();
			if (!user) {
				throw new Error('User not found');
			}

			let { data, error, status } = await supabase.from('profiles').select(`username`).eq('id', user.id).single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				form.setValues({ ...data });
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({ firstName, lastName, username }) {
		try {
			setLoading(true);
			const user = supabase.auth.user();
			if (!user) {
				throw new Error('User not found');
			}

			const updates = {
				firstName,
				id: user.id,
				lastName,
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
		<Box sx={{ maxWidth: 500 }} mx='auto'>
			<form onSubmit={form.onSubmit(updateProfile)}>
				<Group position='apart'>
					<TextInput label='Email' value={session?.user?.email ?? ''} disabled />
					<Grid>
						<Grid.Col span={6}>
							<TextInput
								label='First Name'
								placeholder='First name'
								size='md'
								{...form.getInputProps('firstName')}
								required
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<TextInput
								label='Last Name'
								placeholder='Last name'
								size='md'
								{...form.getInputProps('lastName')}
								required
							/>
						</Grid.Col>
					</Grid>
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
