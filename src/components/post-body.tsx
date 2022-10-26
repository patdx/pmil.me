// import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    // <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    <pre className="prose whitespace-pre-wrap">{content}</pre>
  );
};

export default PostBody;
