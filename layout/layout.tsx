import { useId } from 'react'
import Link from 'next/link'
import { AppShell, Button, Header, MantineProvider, Navbar } from '@mantine/core'
import type { Session } from '@supabase/supabase-js'
import { match } from 'ts-pattern'
import { AuthState, AuthStateEnum } from '../pages/_app'
import styles from './Layout.module.scss'

type Props = { authState: AuthState; children: React.ReactNode; session: Session }
const buildLink = (name: string): JSX.Element => (
	<Navbar.Section className={styles.link}>
		<Link
			href={match(name)
				.with('Home', () => '/')
				.otherwise(() => `/${name.toLowerCase()}`)}
		>
			<Button component='a'>{name}</Button>
		</Link>
	</Navbar.Section>
)
const LoginLink = () => buildLink('Login')
const LogoutLink = () => buildLink('Logout')
const ProfileLink = () => buildLink('Profile')
const HomeLink = () => buildLink('Home')

export default function Layout({ authState, children, session }: Props) {
	const id = useId()
	const links = [
		<HomeLink key={`${id}-home`} />,
		...match(authState)
			.with(AuthStateEnum.Authenticated, () => [
				<ProfileLink key={`${id}-profile`} />,
				<LogoutLink key={`${id}-logout`} />,
			])
			.otherwise(() => [<LoginLink key={`${id}-login`} />]),
	]

	return (
		<MantineProvider theme={{ colorScheme: 'dark' }}>
			<AppShell
				padding='md'
				navbar={
					<Navbar width={{ base: 300 }} height={500} p='xs'>
						{links.map((x) => x)}
					</Navbar>
				}
				header={
					<Header height={60} p='xs'>
						Header
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
