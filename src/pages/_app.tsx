import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import patrickJpg from '../../assets/patrick.jpg';
import '../styles/index.css';
import { StaticImageData } from 'next/image';

const resolveSrc = (image: string | StaticImageData): string => {
  return typeof image === 'string' ? image : image.src;
};

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
              url: resolveSrc(patrickJpg),
            },
          ],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
