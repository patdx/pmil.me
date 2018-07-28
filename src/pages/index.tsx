import Img from 'gatsby-image'
import * as React from 'react'

const IndexPage = ({ data }: any) => (
  <div className="container">
    <div
      className="columns"
      style={{ flexDirection: 'row-reverse' }}
    >
      <div className="column is-one-third">
        <Img
          sizes={data.profileImage.childImageSharp.sizes}
        />
      </div>
      <div className="column">
        <div className="content">
          <p>
            Hello! My name is Patrick Miller. I work as a
            software developer in Osaka, Japan.
          </p>
          <p>
            I previously studied mechanical engineering, and I
            have experience in QA, IT and software
            development.
          </p>
          <p>
            Here are some various projects that might be
            interesting. Feel free to contact me! Thank you.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default IndexPage

export const query = graphql`
  query AboutPageQuery {
    profileImage: file(
      relativePath: { eq: "img/patrick-arashiyama.jpg" }
    ) {
      childImageSharp {
        sizes {
          ...GatsbyImageSharpSizes_noBase64
        }
      }
    }
  }
`
