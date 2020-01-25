import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';
import { Layout } from '../components/layout';

const IndexPage = ({ data }: any) => (
  <Layout>
    <div className="container">
      <div
        className="columns"
        style={{ flexDirection: 'row-reverse' }}
      >
        <div className="column is-one-third">
          <Img
            fluid={data.profileImage.childImageSharp.fluid}
          />
        </div>
        <div className="column">
          <div className="content">
            <p>
              Hello! My name is Patrick Miller. I work as a
              software engineer in Osaka, Japan.
            </p>
            <p>
              I work on web and mobile applications using
              Angular, Ionic 4, Electron, etc.
            </p>
            <p>
              I also have past experience in QA, IT and
              mechanical engineering.
            </p>
            <p>
              Here are some various older projects that
              might be interesting. Feel free to contact me!
              Thank you.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default IndexPage;

export const query = graphql`
  query AboutPageQuery {
    profileImage: file(
      relativePath: { eq: "img/patrick-arashiyama.jpg" }
    ) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`;
