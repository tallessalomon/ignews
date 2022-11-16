import type { AppProps } from 'next/app'
import "../styles/global.scss";
import { Header } from './../components/Header/index';

export default function App({ Component, pageProps }: AppProps) {
  return (
		<>
			<Header />
			<Component {...pageProps} />
		</>
	);
}
