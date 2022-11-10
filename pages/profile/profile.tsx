import { useEffect, useState } from 'react';
import { TextInput, Button, Group, Box, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { supabase } from '../../utils/supabase-client';
import type { Session } from '@supabase/supabase-js';
import { useUser } from '@supabase/auth-helpers-react';

export default function Profile({ session }: { session: Session }) {
	const user = useUser();
	const form = useForm({
		initialValues: { firstName: '', lastName: '', username: '' },
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getProfile() {
			try {
				setLoading(true);
				if (!user) {
					throw new Error('User not found');
				}

				let { data, error, status } = await supabase
					.from('profiles')
					.select('first_name, last_name, username')
					.eq('id', user.id)
					.single();

				if (error && status !== 406) {
					throw error;
				}

				if (data) {
					form.setValues({ ...data, firstName: data.first_name, lastName: data.last_name });
				}
			} catch (error) {
				alert(error.message);
			} finally {
				setLoading(false);
			}
		}
		getProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	async function updateProfile({ firstName, lastName, username }) {
		try {
			setLoading(true);
			if (!user) {
				throw new Error('User not found');
			}

			const updates = {
				first_name: firstName,
				id: user.id,
				last_name: lastName,
				username,
				updated_at: new Date(),
			};

			let { error } = await supabase.from('profiles').upsert(updates);

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
