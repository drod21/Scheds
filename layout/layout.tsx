import { AppShell, Header, MantineProvider, Navbar } from '@mantine/core';
import type { Session } from '@supabase/supabase-js';

export default function Layout({ children, session }: { children: React.ReactNode, session: Session }) {
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }}>
            <AppShell
                padding="md"
                navbar={<Navbar width={{ base: 300 }} height={500} p="xs"><Navbar.Section>1</Navbar.Section></Navbar>}
                header={<Header height={60} p="xs">{/* Header content */}</Header>}
                styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                 })}
                >
                    {children}
                </AppShell>
        </MantineProvider>
    );
}