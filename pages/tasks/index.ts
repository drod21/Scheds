import { supabase } from '../../utils/supabase-client'

export { default } from './tasks'

export async function getStaticProps(req) {
	// Call an external API endpoint to get posts
	const { user } = await supabase.auth.api.getUserByCookie(req)
	console.log(user, req)
	const { data: tasks, error } = await supabase
		.from('tasks')
		.select('*')
		.filter('user_id', 'eq', user?.id ?? '')

	console.log({ tasks })

	// By returning { props: { posts } }, the Blog component
	// will receive `posts` as a prop at build time
	return {
		props: {
			tasks,
		},
	}
}
