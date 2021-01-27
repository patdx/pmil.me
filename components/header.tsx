import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

const Header = () => {
  const router = useRouter();

  return (
    <div className="p-4 grid text-center grid-cols-3 divide-x divide-blue-100 sm:w-96 sm:mx-auto">
      {LINKS.map((link, index) => (
        <div className="px-2" key={index}>
          <Link href={link.url}>
            {/* bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex justify-center items-center hover:shadow h-12 */}
            <a
              className={classNames(
                'h-12 flex justify-center items-center hover:bg-blue-200 text-blue-900 hover:text-black rounded',
                {
                  'font-bold': router.pathname === link.url,
                }
              )}
            >
              {link.title}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Header;
