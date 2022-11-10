import { supabase } from '../utils/supabase-client';

export const updateTask = async ({ description, id, name, size, status }) => {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const {
		user: { id: userId },
	} = session;
	const task = await supabase
		.from('tasks')
		.update({
			description,
			name,
			size,
			status,
		})
		.match({ id, user_id: userId })
		.single();

	return task;
};
