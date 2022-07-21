import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';

export { default } from './profile';
export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
