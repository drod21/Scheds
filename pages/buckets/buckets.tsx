import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Loader, SimpleGrid, Space } from '@mantine/core';
import { supabase } from '../../utils/supabase-client';
import Card from '../../components/card';

export default function Buckets({ buckets, error }) {
	const router = useRouter();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const addBucket = async e => {
		e.preventDefault();
		const userId = supabase.auth.user()?.id;
		await supabase.from('energy').insert([
			{
				created_at: new Date(),
				size: 'small',
				user_id: userId,
			},
		]);
		router.replace(router.asPath);
		setIsRefreshing(true);
	};

	useEffect(() => {
		setIsRefreshing(false);
	}, [buckets]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			Add Energy Bucket
			<SimpleGrid cols={4}>
				{isRefreshing ? (
					<Loader />
				) : (
					buckets?.map((bucket, idx) => (
						<>
							<Card onClick={() => router.push(`${router.asPath}/${bucket.id}`)} key={bucket.id} title={idx.toString()}>
								{bucket.size}
							</Card>
							<Space w='sm' />
						</>
					))
				)}
			</SimpleGrid>
			<Button onClick={addBucket}>Add Energy Bucket</Button>
		</div>
	);
}
