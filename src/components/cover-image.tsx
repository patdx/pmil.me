import cn from "clsx";

type Props = {
  title: string;
  src?: string;
  href?: string;
};

const CoverImage = ({ title, src, href }: Props) => {
  const image = src ? (
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn(
        "shadow-small",
        href && "hover:shadow-medium transition-shadow duration-200"
      )}
    />
  ) : undefined;

  return href ? (
    <a className="block sm:mx-0" href={href} aria-label={title}>
      {image}
    </a>
  ) : (
    <div className="sm:mx-0">{image}</div>
  );
};

export default CoverImage;
