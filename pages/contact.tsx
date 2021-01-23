import classNames from "classnames";
import { FC } from "react";
import Container from "../components/container";
import Header from "../components/header";
import Layout from "../components/layout";

interface LinkProps {
  to: string;
  icon: string;
  text: string;
}

const LINKS: LinkProps[] = [
  {
    to: "mailto:pamiller.pdx@gmail.com",
    icon: "fa-envelope",
    text: "pamiller.pdx@gmail.com",
  },
  {
    to: "https://github.com/patdx",
    icon: "fa-github",
    text: "Github",
  },
  {
    to: "https://www.linkedin.com/in/pamiller",
    icon: "fa-linkedin",
    text: "LinkedIn",
  },
  {
    to: "http://codepen.io/patdx/",
    icon: "fa-codepen",
    text: "CodePen",
  },
];

const Contact: FC = () => {
  return (
    <Layout>
      <Container className="grid gap-4 pt-4">
        <Header></Header>
        <div className="grid gap-2 sm:grid-cols-2">
          {LINKS.map(({ to, icon, text }, index) => (
            <a
              href={to}
              target="_blank"
              className="bg-blue-200 hover:bg-blue-400 rounded-md h-8 flex justify-center items-center"
            >
              <span className="icon is-large">
                <i className={`fa fa-lg ${icon}`} />
              </span>
              <span>{text}</span>
            </a>
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default Contact;
