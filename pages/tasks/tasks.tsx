import { useEffect, useState } from 'react';
import { Button, Loader, SimpleGrid, Space } from '@mantine/core';
import { useRouter } from 'next/router';
import Card from '../../components/card';
import { supabase } from '../../utils/supabase-client';

export default function Tasks({ error, tasks }) {
	const router = useRouter();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const addTask = async e => {
		e.preventDefault();
		const userId = supabase.auth.user()?.id;
		await supabase.from('tasks').insert([
			{
				size: 'small',
				user_id: userId,
			},
		]);
		router.replace(router.asPath);
		setIsRefreshing(true);
	};
	useEffect(() => {
		setIsRefreshing(false);
	}, [tasks]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			Add Tasks Bucket
			<SimpleGrid cols={4}>
				{isRefreshing ? (
					<Loader />
				) : (
					tasks?.map((task, idx) => (
						<>
							<Card
								onClick={() => router.push(`${router.asPath}/${task.id}`)}
								key={task.id}
								title={idx.toString()}
								subtitle={task.name}
							>
								{task.size}
							</Card>
							<Space w='sm' />
						</>
					))
				)}
			</SimpleGrid>
			<Button onClick={addTask}>Add Task</Button>
		</div>
	);
}
