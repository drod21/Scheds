import { NextApiRequest, NextApiResponse } from 'next'
import { match } from 'ts-pattern'
import { supabase } from '../../utils/supabase-client'

const handler = (req: NextApiRequest, res: NextApiResponse) =>
	match(req.method)
		.with('POST', () => supabase.auth.api.setAuthCookie(req, res))
		.otherwise(() => {
			res.setHeader('Allow', ['POST'])
			res.status(405).json({
				message: `Method ${req.method} not allowed`,
			})
		})

export default handler
