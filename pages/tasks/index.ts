import { pipe, R } from '@mobily/ts-belt';
import { supabase } from '../../utils/supabase-client';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { definitions } from '../../types/database';

export { default } from './tasks';

export async function getServerSideProps({ req, res }) {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	return pipe(
		R.fromNullable(user, 'Unauthorized'),
		R.match(
			async (user) => {
				const { data: tasks }: PostgrestResponse<definitions['tasks']> = await supabase
					.from('tasks')
					.select('*')
					.eq('user_id', user.id);

				return { props: { tasks } };
			},
			(error) => res.status(401).send(error),
		),
	);
}
