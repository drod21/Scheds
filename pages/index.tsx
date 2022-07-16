import type { Session } from '@supabase/supabase-js'
import Account from '../components/account'
import { supabase } from '../utils/supabase-client'


export default function Home({ session }: { session: Session }) {
  return (
      <Account key={session.user.id} session={session} />
  )
}

export async function getServerSideProps({ req }) {
    const { user } = await supabase.auth.api.getUserByCookie(req);

    if (!user) {
        return { props: {}, redirect: { destination: '/login' } };
    }

    return { props: {} };
}