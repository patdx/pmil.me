import Container from "../components/container";
import MoreStories from "../components/more-stories";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import { CMS_NAME } from "../lib/constants";
import Post from "../types/post";
import Header from "../components/header";
import { NextSeo } from "next-seo";

type Props = {
  allPosts: Post[];
};

const Projects = ({ allPosts }: Props) => {
  const morePosts = allPosts;
  return (
    <>
      <NextSeo title="Projects | Patrick Miller" />
      <Layout>
        <Container className="grid gap-4 py-4">
          <Header />
          <MoreStories posts={morePosts} />
        </Container>
      </Layout>
    </>
  );
};

export default Projects;

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
};
