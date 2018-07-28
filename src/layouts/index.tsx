import * as React from 'react'
import Helmet from 'react-helmet'
import GatsbyLink from 'gatsby-link'

// import './index.css'
import './index.scss'
import 'font-awesome/css/font-awesome.css'

import { Route } from 'react-router-dom'

interface LayoutProps {
  children: any
  data: any
}

export const TabLink = ({
  to,
  children,
  activeOnlyWhenExact,
}: any) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <li
        className={
          match ? 'is-active has-text-weight-semibold' : ''
        }
      >
        <GatsbyLink to={to}>{children}</GatsbyLink>
      </li>
    )}
  />
)

export default ({ children, data }: LayoutProps) => (
  <React.Fragment>
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
            <TabLink to="/" activeOnlyWhenExact={true}>
              About
            </TabLink>
            <TabLink to="/projects">Projects</TabLink>
            <TabLink to="/contact">Contact</TabLink>
          </ul>
        </nav>
      </div>
    </section>
    <section className="section">{children()}</section>
  </React.Fragment>
)

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
