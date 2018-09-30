import * as React from "react";
import { Layout } from "../components/layout";

interface LinkProps {
  to: string;
  icon: string;
  text: string;
}

const links: LinkProps[] = [
  {
    to: "mailto:pamiller.pdx@gmail.com",
    icon: "fa-envelope",
    text: "pamiller.pdx@gmail.com"
  },
  {
    to: "https://github.com/patdx",
    icon: "fa-github",
    text: "Github"
  },
  {
    to: "https://www.linkedin.com/in/pamiller",
    icon: "fa-linkedin",
    text: "LinkedIn"
  },
  {
    to: "http://codepen.io/patdx/",
    icon: "fa-codepen",
    text: "CodePen"
  }
];

export const Link = ({ to, icon, text }: LinkProps) => (
  <div className="column is-6" key={to}>
    <a
      href={to}
      target="_blank"
      className="button is-large is-fullwidth"
    >
      <span className="icon is-large">
        <i className={`fa fa-lg ${icon}`} />
      </span>
      <span>{text}</span>
    </a>
  </div>
);

export default () => (
  <Layout>
    <div className="container">
      <div className="columns is-multiline">
        {links.map(Link)}
      </div>
    </div>
  </Layout>
);
