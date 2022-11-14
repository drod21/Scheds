import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabase-client';
import Card from '../../components/card';
import useSWR from 'swr';

import { Button, Loader } from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';

export default function Buckets() {
	const router = useRouter();
	const user = useUser();

	const { data: buckets } = useSWR('/api/buckets', url => fetch('/api/buckets').then(r => r.json()));

	const addBucket = async e => {
		e.preventDefault();
		const userId = user.id;
		await supabase.from('energy').insert([{ created_at: new Date(), size: 'small', user_id: userId }]);
	};

	return (
		<div>
			Add Energy Bucket
			<div className='container'>
				<div className='row'>
					{buckets?.map((bucket, idx) => (
						<div className='col-3' key={bucket.id}>
							<Card onClick={() => router.push(`${bucket.id}`)} title={idx.toString()}>
								{bucket.size}
							</Card>
						</div>
					))}
				</div>
			</div>
			<Button onClick={addBucket}>Add Energy Bucket</Button>
		</div>
	);
}
