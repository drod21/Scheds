import { R, pipe } from '@mobily/ts-belt';
import { Button, Grid, Paper, Select, Textarea, TextInput } from '@mantine/core';
import type { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import type { definitions } from '../../types/database';
import { supabase } from '../../utils/supabase-client';
import { useState } from 'react';

enum Size {
	Small = 'small',
	Medium = 'medium',
	Large = 'large',
}

enum Status {
	ToDo = 'todo',
	Open = 'open',
	InProgress = 'in-progress',
	Completed = 'completed',
}

const statusOptions = [
	{ label: 'To Do', value: Status.ToDo },
	{ label: 'Open', value: Status.Open },
	{ label: 'In Progress', value: Status.InProgress },
	{ label: 'Completed', value: Status.Completed },
];
const sizes = [Size.Small, Size.Medium, Size.Large];

export default function Task({ task }: { task: definitions['tasks'] }) {
	const [name, setName] = useState(() => task.name);
	const [size, setSize] = useState<string>(() => task.size);
	const [status, setStatus] = useState(() => task.status);
	const [description, setDescription] = useState(() => task.description);

	const updateTask = async () => {
		const userId = await supabase.auth.user()?.id;
		await supabase
			.from('tasks')
			.update(
				{
					description,
					name,
					size,
					status,
				},
				{ count: 'exact', returning: 'representation' },
			)
			.match({ id: task.id, user_id: userId });
	};

	return (
		<Paper>
			<Grid grow>
				<Grid.Col span={3}>
					<TextInput onChange={(e) => setName(e.currentTarget.value)} value={name} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Select onChange={setSize} value={size} data={sizes} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Select onChange={setStatus} value={status} data={statusOptions} />
				</Grid.Col>
				<Grid.Col span={12}>
					<Textarea onChange={(e) => setDescription(e.currentTarget.value)} value={description} />
				</Grid.Col>
			</Grid>
			<Button onClick={updateTask}>Update Task</Button>
		</Paper>
	);
}

export async function getServerSideProps({ req, res, query }) {
	const { user }: { user: User } = await supabase.auth.api.getUserByCookie(req);

	return pipe(
		R.fromNullable(user, 'Unauthorized'),
		R.match(
			async (user) => {
				const { data: task }: PostgrestSingleResponse<definitions['tasks']> = await supabase
					.from('tasks')
					.select('*')
					.eq('id', query.id)
					.eq('user_id', user.id)
					.single();

				return { props: { task } };
			},
			(error) => res.status(401).send(error),
		),
	);
}
