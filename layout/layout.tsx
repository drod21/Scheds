import { useId, useState } from 'react';
import Link from 'next/link';
import {
	AppShell,
	Burger,
	Button,
	Footer,
	Header,
	MantineProvider,
	MediaQuery,
	Navbar,
	useMantineTheme,
} from '@mantine/core';
import type { Session } from '@supabase/supabase-js';
import { match } from 'ts-pattern';
import { AuthState, AuthStateEnum } from '../pages/_app';
import styles from './Layout.module.scss';

type Props = { authState: AuthState; children: React.ReactNode; session: Session };
const buildLink = (name: string, onClick): JSX.Element => (
	<Navbar.Section className={styles.link} onClick={onClick}>
		<Link
			href={match(name)
				.with('Home', () => '/')
				.otherwise(() => `/${name.toLowerCase()}`)}
		>
			<Button component='a' size='md' style={{ paddingLeft: 20, paddingRight: 20, width: 100 }}>
				{name}
			</Button>
		</Link>
	</Navbar.Section>
);
const LoginLink = ({ onClick }: { onClick; key }) => buildLink('Login', onClick);
const LogoutLink = ({ onClick }: { onClick; key }) => buildLink('Logout', onClick);
const ProfileLink = ({ onClick }: { onClick; key }) => buildLink('Profile', onClick);
const HomeLink = ({ onClick }: { onClick; key }) => buildLink('Home', onClick);
const TasksLink = ({ onClick }: { onClick; key }) => buildLink('Tasks', onClick);

export default function Layout({ authState, children, session }: Props) {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const closeIfOpened = () => opened && setOpened(false);
	const id = useId();
	const links = [
		<HomeLink key={`${id}-home`} onClick={closeIfOpened} />,
		...match(authState)
			.with(AuthStateEnum.Authenticated, () => [
				<ProfileLink key={`${id}-profile`} onClick={closeIfOpened} />,
				<TasksLink key={`${id}-tasks`} onClick={closeIfOpened} />,
				<LogoutLink key={`${id}-logout`} onClick={closeIfOpened} />,
			])
			.otherwise(() => [<LoginLink key={`${id}-login`} onClick={closeIfOpened} />]),
	];

	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<AppShell
				styles={{
					main: {
						background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
					},
				}}
				navbarOffsetBreakpoint='sm'
				asideOffsetBreakpoint='sm'
				fixed
				navbar={
					<Navbar p='md' hiddenBreakpoint='sm' hidden={!opened} width={{ sm: 200, lg: 300 }}>
						{links.map(x => x)}
					</Navbar>
				}
				footer={
					<Footer height={60} p='md'>
						Application footer
					</Footer>
				}
				header={
					<Header height={70} p='md'>
						<div className={styles.header}>
							<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
								<Burger
									opened={opened}
									onClick={() => setOpened(o => !o)}
									size='sm'
									color={theme.colors.gray[6]}
									mr='xl'
								/>
							</MediaQuery>

							{/* {links.map((x) => x)} */}
						</div>
					</Header>
				}
			>
				{children}
			</AppShell>
		</MantineProvider>
	);
}
