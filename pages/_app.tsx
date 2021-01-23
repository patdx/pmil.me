import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import '../styles/index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="Patrick Miller"
        description="Portfolio of Patrick Miller"
        openGraph={{
          type: 'website',
          locale: 'en_us',
          url: 'https://pmil.me/',

          images: [
            {
              url: '/assets/img/patrick-arashiyama.jpg',
            },
          ],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
