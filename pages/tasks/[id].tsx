import { useReducer } from 'react';
import { R, pipe } from '@mobily/ts-belt';
import { Button, Grid, Paper, Select, Space, Textarea, TextInput, Title } from '@mantine/core';
import { match } from 'ts-pattern';
import { supabase } from '../../utils/supabase-client';
import { Status, Size } from '../../types/enums';
import type { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import type { Definitions } from '../../types/database';
import { updateTask } from '../../services/tasks.service';

const statusOptions = [
	{ label: 'To Do', value: Status.ToDo },
	{ label: 'Open', value: Status.Open },
	{ label: 'In Progress', value: Status.InProgress },
	{ label: 'Completed', value: Status.Completed },
];
const sizes = Object.values(Size);

enum Actions {
	SetName = 'setName',
	SetDescription = 'setDescription',
	SetSize = 'setSize',
	SetStatus = 'setStatus',
	SetTask = 'setTask',
}

const reducer = (state: Definitions['tasks'], action): Definitions['tasks'] =>
	match(action.type)
		.with(Actions.SetName, () => ({ ...state, name: action.payload }))
		.with(Actions.SetDescription, () => ({ ...state, description: action.payload }))
		.with(Actions.SetSize, () => ({ ...state, size: action.payload }))
		.with(Actions.SetStatus, () => ({ ...state, status: action.payload }))
		.with(Actions.SetTask, () => ({ ...state, ...action.payload }))
		.otherwise(() => state);

export default function Task({ task }: { task: Definitions['tasks'] }) {
	const [{ description, id, name, size, status }, dispatch] = useReducer(reducer, task);
	const setSelect = name => val => dispatch({ type: name, payload: val });
	const updateText = type => e => dispatch({ type, payload: e.target.value });
	const postUpdate = async () => {
		const task = await updateTask({ id, name, description, size, status });
		dispatch({ type: Actions.SetTask, payload: task });
	};

	return (
		<Paper shadow='md' radius='md' p='xl'>
			<Title order={2}>Edit Task</Title>
			<Space h='md' />
			<Grid grow>
				<Grid.Col span={3}>
					<TextInput onChange={updateText(Actions.SetName)} value={name} />
				</Grid.Col>
				<Grid.Col span={2}>
					<Select onChange={setSelect(Actions.SetSize)} value={size} data={sizes} />
				</Grid.Col>
				<Grid.Col span={2}>
					<Select onChange={setSelect(Actions.SetStatus)} value={status} data={statusOptions} />
				</Grid.Col>
				<Grid.Col span={12}>
					<Textarea onChange={updateText(Actions.SetDescription)} value={description} />
				</Grid.Col>
			</Grid>
			<Space h='md' />
			<Button onClick={postUpdate}>Update Task</Button>
		</Paper>
	);
}

export async function getServerSideProps({ req, res, query }) {
	const { user }: { user: User } = await supabase.auth.api.getUserByCookie(req);

	return pipe(
		R.fromNullable(user, 'Unauthorized'),
		R.match(
			async user => {
				const { data: task }: PostgrestSingleResponse<Definitions['tasks']> = await supabase
					.from('tasks')
					.select('*')
					.eq('id', query.id)
					.eq('user_id', user.id)
					.single();

				return { props: { task } };
			},
			error => res.status(401).send(error),
		),
	);
}
