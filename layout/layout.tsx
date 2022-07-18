import { AppShell, Button, Header, MantineProvider, Navbar } from '@mantine/core'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'
import { match } from 'ts-pattern'
import { AuthState, AuthStateEnum } from '../pages/_app'

type Props = { authState: AuthState; children: React.ReactNode; session: Session }
const LoginLink = () => (
	<Navbar.Section>
		<Link href='/login'>
			<Button component='a'>Login</Button>
		</Link>
	</Navbar.Section>
)
const LogoutLink = () => (
	<Navbar.Section>
		<Link href='/logout'>
			<Button component='a'>Logout</Button>
		</Link>
	</Navbar.Section>
)
const ProfileLink = () => (
	<Navbar.Section>
		<Link href='/profile'>
			<Button component='a'>Profile</Button>
		</Link>
	</Navbar.Section>
)
export default function Layout({ authState, children, session }: Props) {
	const links = [
		match(authState)
			.with(AuthStateEnum.Authenticated, () => [<ProfileLink key={1} />, <LogoutLink key={2} />])
			.otherwise(() => <LoginLink />),
	]

	return (
		<MantineProvider theme={{ colorScheme: 'dark' }}>
			<AppShell
				padding='md'
				navbar={
					<Navbar width={{ base: 300 }} height={500} p='xs'>
						<Navbar.Section>1</Navbar.Section>
					</Navbar>
				}
				header={
					<Header height={60} p='xs'>
						{links.map((x) => x)}
					</Header>
				}
				styles={(theme) => ({
					main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
				})}
			>
				{children}
			</AppShell>
		</MantineProvider>
	)
}
