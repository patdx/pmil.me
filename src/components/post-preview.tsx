import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';

type Props = {
  title: string;
  coverImage?: string;
  date: string;
  excerpt: string;
  author: string;
  slug: string;
};

const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  const inner = (
    <div className="flex items-end">
      <div className="flex-1 bg-white opacity-90 text-black px-2 py-4 border border-gray-200 rounded-b-md shadow group-hover:opacity-100 group-hover:border-gray-300 text-3xl sm:text-lg">
        <h3 className="font-bold ">{title}</h3>
        <p>{excerpt}</p>
      </div>
    </div>
  );

  return (
    <Link
      as={`/projects/${slug}`}
      href="/projects/[slug]"
      className={clsx(
        'aspect-w-1 aspect-h-1 rounded-md overflow-hidden',
        'hover:shadow-medium',
        'shadow-small',
        'group'
      )}
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={`Cover Image for ${title}`}
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      ) : undefined}
      {inner}
    </Link>
  );
};

export default PostPreview;
