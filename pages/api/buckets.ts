import { pipe, R } from '@mobily/ts-belt';
import { PostgrestResponse } from '@supabase/supabase-js';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Definitions } from '../../types/database';
import { supabase } from '../../utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Definitions['energy'][]>) {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const user = session?.user;

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
			error => Promise.resolve([]),
		),
	);

	res.status(200).json(buckets);
}
