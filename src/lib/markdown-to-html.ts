import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePresetMinify from 'rehype-preset-minify';

export async function markdownToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse as any)
    .use(remarkRehype)
    .use(rehypeExternalLinks)
    .use(rehypePresetMinify)
    .use(rehypeStringify as any)
    .process(markdown);

  return file.toString();
}
