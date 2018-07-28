import * as React from 'react'
import Img from 'gatsby-image'

export default ({ data }: { data: any }) => {
  const post = data.markdownRemark
  return (
    <div className="container">
      <div
        className="columns"
        style={{ flexDirection: 'row-reverse' }}
      >
        <div className="column is-one-third">
          <Img
            sizes={
              post.frontmatter.imageUrl.childImageSharp
                .sizes
            }
          />
        </div>
        <div className="column">
          <h1 className="title">
            {post.frontmatter.title}
          </h1>
          <a
            href={post.frontmatter.externalUrl}
            target="_blank"
            className="button is-large"
          >
            <span>Visit External Page</span>
            <span className="icon">
              <i
                className="fa fa-external-link"
                aria-hidden="true"
              />
            </span>
          </a>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post.html }}
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
