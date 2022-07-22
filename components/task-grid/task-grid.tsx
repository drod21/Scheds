import { Grid, Text, Title } from '@mantine/core';

export default function TaskGrid({ tasks }) {
	const todo = tasks.filter((task) => task.status === 'todo');
	const open = tasks.filter((task) => task.status === 'open');
	const inProgress = tasks.filter((task) => task.status === 'in progress');
	const completed = tasks.filter((task) => task.status === 'completed');

	return (
		<Grid grow>
			<Grid.Col span={4}>
				<Title>To-Do</Title>
			</Grid.Col>
		</Grid>
	);
}
