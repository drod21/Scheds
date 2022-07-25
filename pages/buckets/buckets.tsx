import { useEffect, useState } from 'react';
import { Button, SimpleGrid, Space } from '@mantine/core';
import { Definitions } from '../../types/database';
import { supabase } from '../../utils/supabase-client';
import Card from '../../components/card';
import { pipe, R } from '@mobily/ts-belt';
import { PostgrestResponse } from '@supabase/supabase-js';

export default function Buckets() {
	const [energy, setEnergy] = useState([]);
	const [error, setError] = useState<any>(null);
	useEffect(() => {
		const user = supabase.auth.user();
		pipe(
			R.fromNullable(user, 'Unauthorized'),
			R.match(
				async user => {
					const { data: energy }: PostgrestResponse<Definitions['energy']> = await supabase
						.from('energy')
						.select('*')
						.eq('user_id', user.id);
					setEnergy(energy);
				},
				async error => setError(error),
			),
		);
	}, []);
	return (
		<div>
			Add Energy Bucket
			<SimpleGrid cols={4}>
				{energy?.map((bucket, idx) => (
					<>
						<Card key={bucket.id} title={idx.toString()}>
							{bucket.size}
						</Card>
						<Space w='sm' />
					</>
				))}
			</SimpleGrid>
			<Button
				onClick={async () => {
					const userId = supabase.auth.user()?.id;
					const { data: energy } = await supabase.from('energy').insert([
						{
							created_at: new Date(),
							size: 'small',
							user_id: userId,
						},
					]);
					setEnergy(prev => [...prev, ...energy]);
				}}
			>
				Add Energy Bucket
			</Button>
		</div>
	);
}
