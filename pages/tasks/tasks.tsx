import { Button } from '@mantine/core'
import { supabase } from '../../utils/supabase-client'

function Tasks({ tasks }) {
	console.log(tasks)
	return (
		<div>
			Add Task
			<Button
				onClick={async () => {
					const userId = await supabase.auth.user()?.id
					console.log(userId)
					const res = await supabase.from('tasks').insert([
						{
							name: 'New Task',
							size: 'small',
							user_id: userId,
						},
					])
					console.log({ res })
				}}
			>
				Add task
			</Button>
		</div>
	)
}

export default Tasks
