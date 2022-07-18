import { Session } from '@supabase/supabase-js'
import Account from '../../components/account'
import { enforceAuthenticated } from '../../utils/enforceAuthenticated'

export default function Profile(props: { session: Session }) {
	return <Account session={props.session} />
}
export const getServerSideProps = enforceAuthenticated()
