import { useRouter } from 'next/navigation';
import { Button, SimpleGrid, Space } from '@mantine/core';
import { supabase } from '../../utils/supabase-client';
import Card from '../../components/card';

import { pipe, R } from '@mobily/ts-belt';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Definitions } from '../../types/database';

export default async function Buckets() {
	const router = useRouter();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const { user } = session;

	const buckets = await pipe(
		R.fromNullable(user, 'Unauthorized'),
		R.match(
			async user => {
				const { data: energy }: PostgrestResponse<Definitions['energy']> = await supabase
					.from('energy')
					.select('*')
					.eq('user_id', user.id);

				return energy;
			},
			error => Promise.resolve([] as Definitions['energy'][]),
		),
	);

	const addBucket = async e => {
		e.preventDefault();
		const userId = user.id;
		await supabase.from('energy').insert([
			{
				created_at: new Date(),
				size: 'small',
				user_id: userId,
			},
		]);
	};

	return (
		<div>
			Add Energy Bucket
			<SimpleGrid cols={4}>
				{/* {isRefreshing ? (
					<Loader />
				) : ( */}
				{buckets?.map((bucket, idx) => (
					<>
						<Card onClick={() => router.push(`${bucket.id}`)} key={bucket.id} title={idx.toString()}>
							{bucket.size}
						</Card>
						<Space w='sm' />
					</>
				))}
				{/* )} */}
			</SimpleGrid>
			<Button onClick={addBucket}>Add Energy Bucket</Button>
		</div>
	);
}