import { Session } from "@supabase/supabase-js";
import Account from "../../components/account";

export default function Profile(props: { session: Session }) {
  return <Account session={props.session} />
}