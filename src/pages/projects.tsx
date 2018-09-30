import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import * as React from "react";
import { Layout } from "../components/layout";

export const Card = ({ node }: { node: any }) => (
  <div className="column is-one-third">
    <Link to={node.fields.slug}>
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
    </Link>
  </div>
);

export default ({ data }: { data: any }) => (
  <Layout>
    <div className="container">
      <div className="columns">
        <div className="column">
          Here are some older projects I've worked on!
        </div>
      </div>
      <div className="columns is-multiline">
        {data.allMarkdownRemark.edges.map(
          ({ node }: any) => (
            <Card key={node.id} node={node} />
          )
        )}
      </div>
    </div>
  </Layout>
);

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
                sizes(maxWidth: 500, maxHeight: 500) {
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
`;
