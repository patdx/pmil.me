import '../styles/index.css';
import clsx from 'clsx';
import Link from 'next/link';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Patrick Miller</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen">
          <NavHeader />
          {/* <main></main> */}

          {/* this "children" seems to come with an extra div */}
          {children}
        </div>
      </body>
    </html>
  );
}

const LINKS = [
  {
    title: 'About',
    url: '/',
  },
  {
    title: 'Projects',
    url: '/projects',
  },
  {
    title: 'Contact',
    url: '/contact',
  },
];

const NavHeader = () => {
  // const router = useRouter();
  // const pathname = usePathname();

  return (
    <div className="p-4 grid text-center grid-cols-3 divide-x divide-blue-100 sm:w-96 sm:mx-auto">
      {LINKS.map((link, index) => (
        <div className="px-2" key={index}>
          <Link
            href={link.url}
            className={clsx(
              'h-12 flex justify-center items-center hover:bg-blue-200 text-blue-900 hover:text-black rounded'
              // pathname === link.url && 'font-bold'
              // // {
              // //   'font-bold': router.pathname === link.url,
              // // }
            )}
          >
            {/* bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex justify-center items-center hover:shadow h-12 */}

            {link.title}
          </Link>
        </div>
      ))}
    </div>
  );
};
