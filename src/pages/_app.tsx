import 'tailwindcss/tailwind.css';
import '../styles/main.css';

import type {AppProps} from 'next/app';
import Head from 'next/head';
import {ThemeProvider} from 'next-themes';

export default function App({Component, pageProps}: AppProps) {
	return (
		<div className="py-24 px-4">
			<Head>
				<title>zulfikar/blog</title>
			</Head>

			<ThemeProvider attribute='class'>
				<Component {...pageProps} />
			</ThemeProvider>
		</div>
	);
}
