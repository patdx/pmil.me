import humanizeUrl from 'humanize-url';
// import { NextSeo } from 'next-seo';
// import { useRouter } from 'next/router';
import Container from '../../../components/container';
import CoverImage from '../../../components/cover-image';

import PostBody from '../../../components/post-body';
import PostTitle from '../../../components/post-title';
import { getAllPosts, getPostBySlug } from '../../../lib/api';
import { markdownToHtml } from '../../../lib/markdown-to-html';
// import { markdownToHtml } from '../../../lib/markdown-to-html';

const Post = async ({ params }: { params: { slug: string } }) => {
  if (!params.slug) {
    console.log('missing slug');
    return null;
  }

  if (params.slug === '[slug]') {
    console.warn(`invalid slug "[slug]"`);
    return null;
  }

  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'technologies',
    'externalUrl',
  ]);

  // const content = 'pending';

  // const content = await markdownToHtml(post.content || '').then((html) =>
  //   html.trim()
  // );

  const content = post.content;

  // const router = useRouter();

  const externalUrl = post.externalUrl;

  // const content = post.content.trim();

  return (
    // <Layout>
    <Container className="grid gap-4 py-4">
      <article className="mb-32">
        {/* <NextSeo
          title={`${post.title} | Patrick Miller`}
          openGraph={{
            images: post.ogImage ? [{ url: post.ogImage.url }] : [],
          }}
        /> */}
        <PostTitle>{post.title}</PostTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-2 grid gap-4 content-start">
            {Boolean(content) && <PostBody content={content} />}
            {Boolean(externalUrl) && (
              <p>
                <a
                  href={externalUrl}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                  target="_blank"
                >
                  View Project ({humanizeUrl(externalUrl)})
                </a>
              </p>
            )}
          </div>
          <div className="col-span-1 grid gap-4 grid-cols-1 content-start">
            <CoverImage title={post.title} src={post.coverImage} />
            {Boolean(post.technologies) && <p>{post.technologies}</p>}
          </div>
        </div>
      </article>
    </Container>
    // </Layout>
  );
};

export default Post;

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);

  return posts.map((posts) => ({
    slug: posts.slug,
  }));
}
