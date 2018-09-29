import * as React from 'react'
import Helmet from 'react-helmet'
import GatsbyLink from 'gatsby-link'

import './index.scss'
import 'font-awesome/css/font-awesome.css'
import { StaticQuery, graphql } from 'gatsby'

interface LayoutProps {
  children: JSX.Element
}

export const TabLink = ({ to, children }: any) => (
  <li>
    <GatsbyLink
      to={to}
      getProps={({ isCurrent }) =>
        isCurrent
          ? {
              className: 'has-text-weight-semibold',
              // bulma sets 0.9 opacity, reset to 1 on full selection
              style: { opacity: 1 },
            }
          : null
      }
    >
      {children}
    </GatsbyLink>
  </li>
)

export const Layout = ({ children }: LayoutProps) => (
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
      render={data => (
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            {
              name: 'keywords',
              content: 'sample, something',
            },
          ]}
        />
      )}
    />
    <section className="hero is-primary is-bold">
      <div className="hero-body">
        <div className="container">
          <GatsbyLink to="/">
            <h1 className="title">Patrick Miller</h1>
            <h2 className="subtitle">Software developer</h2>
          </GatsbyLink>
        </div>
      </div>
      <div className="hero-foot">
        <nav className="tabs is-centered">
          <ul>
            <TabLink to="/">
              {/* activeOnlyWhenExact={true} */}
              About
            </TabLink>
            <TabLink to="/projects">Projects</TabLink>
            <TabLink to="/contact">Contact</TabLink>
          </ul>
        </nav>
      </div>
    </section>
    <section className="section">{children}</section>
  </React.Fragment>
)
