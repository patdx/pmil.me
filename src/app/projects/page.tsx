// import { NextSeo } from 'next-seo';
import Container from '../../components/container';
import Layout from '../../components/layout';
import PostPreview from '../../components/post-preview';
import { getAllPosts } from '../../lib/api';

const Projects = () => {
  const posts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]);

  // {/* <NextSeo title="Projects | Patrick Miller" /> */}

  return (
    // <Layout>
    <Container className="grid gap-4 py-4">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 container mx-auto max-w-4xl">
          {posts.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      </section>
    </Container>
    // </Layout>
  );
};

export default Projects;
