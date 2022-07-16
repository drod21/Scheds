import type { Session } from '@supabase/supabase-js'
import Account from '../components/account'
import enforceAuthenticated from '../utils/auth'


export default function Home({ session }: { session: Session }) {
  return (
      <Account key={session.user.id} session={session} />
  )
}

export const getServerSideProps = enforceAuthenticated()