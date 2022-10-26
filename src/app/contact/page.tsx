// import { NextSeo } from 'next-seo';
import { FC } from 'react';
import { IconType } from 'react-icons';
import {
  IoLogoCodepen,
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail,
} from 'react-icons/io5';
import Container from '../../components/container';

interface LinkProps {
  to: string;
  Icon: IconType;
  text: string;
}

const LINKS: LinkProps[] = [
  {
    to: 'mailto:pamiller.pdx@gmail.com',
    Icon: IoMail,
    text: 'pamiller.pdx@gmail.com',
  },
  {
    to: 'https://github.com/patdx',
    Icon: IoLogoGithub,
    text: 'Github',
  },
  {
    to: 'https://www.linkedin.com/in/pamiller',
    Icon: IoLogoLinkedin,
    text: 'LinkedIn',
  },
  {
    to: 'http://codepen.io/patdx/',
    Icon: IoLogoCodepen,
    text: 'CodePen',
  },
];

const ContactPage: FC = () => {
  return (
    <>
      {/* <NextSeo title="Contact | Patrick Miller" /> */}
      {/* <Layout> */}
      <Container className="grid gap-4 py-4">
        <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
          {LINKS.map(({ to, Icon, text }, index) => (
            <a
              key={index}
              href={to}
              target="_blank"
              className="flex gap-2 border hover:bg-white shadow-none hover:shadow-lg rounded-md h-16 justify-center items-center transition-shadow transition-colors"
            >
              <Icon size="1.5em" />
              <span>{text}</span>
            </a>
          ))}
        </div>
      </Container>
      {/* </Layout> */}
    </>
  );
};

export default ContactPage;
