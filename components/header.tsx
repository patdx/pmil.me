import Link from "next/link";

const LINKS = [
  {
    title: "About",
    url: "/",
  },
  {
    title: "Projects",
    url: "/projects",
  },
  {
    title: "Contact",
    url: "/contact",
  },
];

const Header = () => {
  return (
    <>
      <div className="grid gap-2 text-center sm:grid-cols-3 sm:mx-16">
        {LINKS.map((link, index) => (
          <Link href={link.url} key={index}>
            <a className="bg-gray-300 rounded-md h-8 flex justify-center items-center hover:shadow hover:bg-gray-500">
              {link.title}
            </a>
          </Link>
        ))}
      </div>
      {/* <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
        <Link href="/">
          <a className="hover:underline">Blog</a>
        </Link>
      </h2> */}
    </>
  );
};

export default Header;
