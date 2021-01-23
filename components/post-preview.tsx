import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import Link from "next/link";
import Author from "../types/author";
import classNames from "classnames";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
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
  return (
    <Link as={`/projects/${slug}`} href="/projects/[slug]">
      <a
        className={classNames(
          "aspect-w-1 aspect-h-1 rounded-md overflow-hidden",
          "hover:shadow-medium transition-shadow duration-200",
          "shadow-small"
        )}
      >
        <img
          src={coverImage}
          alt={`Cover Image for ${title}`}
          className={classNames("object-cover")}
        />
        <div className="flex items-end">
          <div className="flex-1 bg-black opacity-80 text-white p-2">
            <h3 className="font-bold">{title}</h3>
            <p>{excerpt}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default PostPreview;
