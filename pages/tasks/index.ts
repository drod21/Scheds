import { pipe, R } from '@mobily/ts-belt';
import { supabase } from '../../utils/supabase-client';
import type { GetServerSidePropsContext } from 'next';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Definitions } from '../../types/database';

export { default } from './tasks';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const { user } = session;

	return pipe(
		R.fromNullable(user, 'Unauthorized'),
		R.match(
			async user => {
				const { data: tasks }: PostgrestResponse<Definitions['tasks']> = await supabase
					.from('tasks')
					.select('*')
					.eq('user_id', user.id);

				return { props: { tasks } };
			},
			error => Promise.resolve({ props: { error, tasks: [] } }),
		),
	);
}
