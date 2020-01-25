import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';
import { Layout } from '../components/layout';
import humanizeUrl from 'humanize-url';
import classNames from 'classnames';

/** add even spacing between elements */
export const ContentWrapper = ({
  children,
  columnClassnames,
}: {
  children: any;
  columnClassnames?: any;
}) => (
  <div className="columns">
    <div className={classNames('column', columnClassnames)}>
      {children}
    </div>
  </div>
);

export default ({
  data: { markdownRemark: post },
}: {
  data: any;
}) => (
  <Layout>
    <div className="container">
      <div className="columns">
        <div className="column">
          <div className="card">
            <div className="card-content">
              <ContentWrapper>
                <h1 className="title">
                  {post.frontmatter.title}
                </h1>
                <h2 className="subtitle">
                  {post.frontmatter.description}
                </h2>
                <p>{post.frontmatter.technologies}</p>
              </ContentWrapper>

              {/* show button if externalUrl exists */}
              {post.frontmatter.externalUrl && (
                <ContentWrapper columnClassnames="has-text-centered">
                  <a
                    href={post.frontmatter.externalUrl}
                    target="_blank"
                    className="button is-large is-primary"
                    style={{
                      flexDirection: 'column',
                      margin: 'auto',
                      height: 'unset',
                    }}
                  >
                    <div>
                      <span>View Project</span>
                      <span className="icon">
                        <i
                          className="fa fa-external-link"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="has-text-greyfff is-size-7">
                      {humanizeUrl(
                        post.frontmatter.externalUrl
                      )}
                    </div>
                  </a>
                </ContentWrapper>
              )}

              {/* show description if markdown content exists */}
              {post.html && (
                <ContentWrapper>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: post.html,
                    }}
                  />
                </ContentWrapper>
              )}
            </div>
          </div>
        </div>
        <div className="column is-one-third">
          <Img
            fluid={
              post.frontmatter.imageUrl.childImageSharp
                .fluid
            }
          />
        </div>
      </div>
    </div>
  </Layout>
);

export const query = graphql`
  query ProjectQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        technologies
        imageUrl {
          relativePath
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
        externalUrl
      }
    }
  }
`;
