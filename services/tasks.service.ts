import { supabase } from '../utils/supabase-client';

export const updateTask = async ({ description, id, name, size, status }) => {
	const userId = await supabase.auth.user()?.id;
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
