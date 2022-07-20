import { supabase } from '../../utils/supabase-client'

export { default } from './tasks'

export async function getServerSideProps({ req, res }) {
	const { user } = await supabase.auth.api.getUserByCookie(req)

	if (!user) {
		return res.status(401).send('Unathorized')
	}
	const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user?.id)

	return { props: { tasks } }
}
