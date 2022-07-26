import { pipe, R } from '@mobily/ts-belt';
import { supabase } from '../../utils/supabase-client';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Definitions } from '../../types/database';

export { default } from './buckets';

export async function getServerSideProps({ req }) {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	return pipe(
		R.fromNullable(user, 'Unauthorized'),
		R.match(
			async user => {
				const { data: energy }: PostgrestResponse<Definitions['energy']> = await supabase
					.from('energy')
					.select('*')
					.eq('user_id', user.id);

				return { props: { buckets: energy } };
			},
			error => Promise.resolve({ props: { error, buckets: [] } }),
		),
	);
}
