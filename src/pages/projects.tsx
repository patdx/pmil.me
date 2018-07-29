import * as React from 'react'
import GatsbyLink from 'gatsby-link'
import Img from 'gatsby-image'

export const Card = ({ node }: { node: any }) => (
  <div className="column is-one-third">
    <GatsbyLink to={node.fields.slug}>
      <div className="card">
        <div className="card-image">
          <Img
            sizes={
              node.frontmatter.imageUrl.childImageSharp
                .sizes
            }
          />
        </div>
        <div className="card-content">
          <h1 className="title">
            {node.frontmatter.title}
          </h1>
          <h2 className="subtitle">
            {node.frontmatter.description}
          </h2>
          <p>{node.frontmatter.technologies}</p>
        </div>
      </div>
    </GatsbyLink>
  </div>
)

export default ({ data }: { data: any }) => (
  <div className="container">
    <div className="columns">
      <div className="column">
        Here are some older projects I've worked on!
      </div>
    </div>
    <div className="columns is-multiline">
      {data.allMarkdownRemark.edges.map(({ node }: any) => (
        <Card key={node.id} node={node} />
      ))}
    </div>
  </div>
)

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { fields: [fields___slug], order: ASC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            description
            technologies
            imageUrl {
              childImageSharp {
                sizes(maxWidth: 200, maxHeight: 200) {
                  ...GatsbyImageSharpSizes_noBase64
                }
              }
            }
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
