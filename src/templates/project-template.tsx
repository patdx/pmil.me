import * as React from 'react'
import Img from 'gatsby-image'

/** add even spacing between elements */
export const ContentWrapper = ({ children }: any) => (
  <div className="columns">
    <div className="column">{children}</div>
  </div>
)

export default ({ data }: { data: any }) => {
  const post = data.markdownRemark
  return (
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
              <ContentWrapper>
                <a
                  href={post.frontmatter.externalUrl}
                  target="_blank"
                  className="button is-large"
                >
                  <span>View Project</span>
                  <span className="icon">
                    <i
                      className="fa fa-external-link"
                      aria-hidden="true"
                    />
                  </span>
                </a>
                <div className="has-text-grey">
                  {post.frontmatter.externalUrl}
                </div>
              </ContentWrapper>
              {/* only show description if markdown content exists */}
              {post.html ? (
                <ContentWrapper>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: post.html,
                    }}
                  />
                </ContentWrapper>
              ) : null}
            </div>
          </div>
        </div>
        <div className="column is-one-third">
          <Img
            sizes={
              post.frontmatter.imageUrl.childImageSharp
                .sizes
            }
          />
        </div>
      </div>
    </div>
  )
}

export const query = graphql`
  query ProjectQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        technologies
        imageUrl {
          childImageSharp {
            sizes(maxWidth: 1000) {
              ...GatsbyImageSharpSizes_noBase64
            }
          }
        }
        externalUrl
      }
    }
  }
`
