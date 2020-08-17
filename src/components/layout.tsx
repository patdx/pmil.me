import 'font-awesome/css/font-awesome.css';
import { graphql, Link, StaticQuery } from 'gatsby';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import './layout.scss';
import image from '../data/img/patrick-arashiyama.jpg';

export const TabLink = ({
  to,
  children,
  activeStrategy,
}: {
  to: any;
  children: any;
  activeStrategy: 'isCurrent' | 'isPartiallyCurrent';
}) => (
  <li>
    <Link
      to={to}
      getProps={(props) =>
        props[activeStrategy]
          ? {
              className: 'has-text-weight-semibold',
              // bulma sets 0.9 opacity, reset to 1 on full selection
              style: { opacity: 1 },
            }
          : null
      }
    >
      {children}
    </Link>
  </li>
);

export const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <React.Fragment>
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => (
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            {
              name: `description`,
              content: 'Portfolio of Patrick Miller',
            },
            {
              property: `og:title`,
              content: 'Patrick Miller',
            },
            {
              property: `og:description`,
              content: 'Portfolio of Patrick Miller',
            },
            {
              property: `og:type`,
              content: `website`,
            },
            {
              property: 'og:image',
              content: image,
            },
            {
              property: 'og:url',
              content: 'https://pmil.me',
            },
            // {
            //   name: `twitter:card`,
            //   content: `summary`,
            // },
            // {
            //   name: `twitter:creator`,
            //   content: site.siteMetadata.author,
            // },
            // {
            //   name: `twitter:title`,
            //   content: title,
            // },
            // {
            //   name: `twitter:description`,
            //   content: metaDescription,
            // },
          ]}
        />
      )}
    />
    <section className="hero is-primary is-bold">
      <div className="hero-body">
        <div className="container">
          <Link to="/">
            <h1 className="title">Patrick Miller</h1>
            <h2 className="subtitle">Software developer</h2>
          </Link>
        </div>
      </div>
      <div className="hero-foot">
        <nav className="tabs is-centered">
          <ul>
            <TabLink to="/" activeStrategy="isCurrent">
              About
            </TabLink>
            <TabLink
              to="/projects"
              activeStrategy="isPartiallyCurrent" // Projects has subpages
            >
              Projects
            </TabLink>
            <TabLink
              to="/contact"
              activeStrategy="isCurrent"
            >
              Contact
            </TabLink>
          </ul>
        </nav>
      </div>
    </section>
    <section className="section">{children}</section>
  </React.Fragment>
);
