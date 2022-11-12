import '../styles/globals.scss';
import Head from 'next/head';

function Layout({ children }) {
	return (
		<html>
			<Head>
				<title>Scheds</title>
			</Head>
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}

export default Layout;
