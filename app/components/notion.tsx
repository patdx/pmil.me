import type {
	BlockObjectResponse,
	TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { Link } from '@remix-run/react';

const styles = {} as any;

// https://github.com/samuelkraft/notion-blog-nextjs/blob/master/components/notion/renderer.js

interface BlockProps {
	block: BlockObjectResponse;
}

const renderNestedList = (blocks: BlockObjectResponse) => {
	const { type } = blocks;
	const value = blocks[type];
	if (!value) return null;

	const isNumberedList = value.children[0].type === 'numbered_list_item';

	if (isNumberedList) {
		return (
			<ol>
				<Blocks blocks={value.children} />
			</ol>
		);
	}
	return (
		<ul>
			<Blocks blocks={value.children} />
		</ul>
	);
};

export function Blocks({ blocks }: { blocks: BlockObjectResponse[] }) {
	return (
		<>
			{blocks.map((block) => (
				<Block key={block.id} block={block} />
			))}
		</>
	);
}

export function Block({ block }: BlockProps) {
	const { type, id } = block;
	const value = block[type];

	switch (type) {
		case 'paragraph':
			return (
				<p>
					<Text title={block.paragraph.rich_text} />
				</p>
			);
		case 'heading_1':
			return (
				<h1>
					<Text title={value.rich_text} />
				</h1>
			);
		case 'heading_2':
			return (
				<h2>
					<Text title={value.rich_text} />
				</h2>
			);
		case 'heading_3':
			return (
				<h3>
					<Text title={value.rich_text} />
				</h3>
			);
		case 'bulleted_list':
			return (
				<ul>
					<Blocks blocks={value.children} />
				</ul>
			);
		case 'numbered_list':
			return (
				<ol>
					<Blocks blocks={value.children} />
				</ol>
			);
		case 'bulleted_list_item':
		case 'numbered_list_item':
			return (
				<li key={block.id}>
					<Text title={value.rich_text} />
					{!!value.children && renderNestedList(block)}
				</li>
			);
		case 'to_do':
			return (
				<div>
					<label htmlFor={id}>
						<input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
						<Text title={value.rich_text} />
					</label>
				</div>
			);
		case 'toggle':
			return (
				<details>
					<summary>
						<Text title={value.rich_text} />
					</summary>
					<Blocks blocks={block.children} />
				</details>
			);
		case 'child_page':
			return (
				<div className={styles.childPage}>
					<strong>{value?.title}</strong>
					<Blocks blocks={block.children} />
				</div>
			);
		case 'image': {
			const src =
				value.type === 'external' ? value.external.url : value.file.url;
			const caption = value.caption ? value.caption[0]?.plain_text : '';
			return (
				<figure>
					<img src={src} alt={caption} />
					{caption && <figcaption>{caption}</figcaption>}
				</figure>
			);
		}
		case 'divider':
			return <hr key={id} />;
		case 'quote':
			return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
		case 'code':
			return (
				<pre className={styles.pre}>
					<code className={styles.code_block} key={id}>
						{value.rich_text[0].plain_text}
					</code>
				</pre>
			);
		case 'file': {
			const srcFile =
				value.type === 'external' ? value.external.url : value.file.url;
			const splitSourceArray = srcFile.split('/');
			const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
			const captionFile = value.caption ? value.caption[0]?.plain_text : '';
			return (
				<figure>
					<div className={styles.file}>
						📎 <Link to={srcFile}>{lastElementInArray.split('?')[0]}</Link>
					</div>
					{captionFile && <figcaption>{captionFile}</figcaption>}
				</figure>
			);
		}
		case 'bookmark': {
			const href = value.url;
			return (
				<a
					href={href}
					target="_blank"
					rel="noreferrer noopener"
					className={styles.bookmark}
				>
					{href}
				</a>
			);
		}
		case 'table':
			return (
				<table className={styles.table}>
					<tbody>
						{block.children?.map((child, index) => {
							const RowElement =
								value.has_column_header && index === 0 ? 'th' : 'td';
							return (
								<tr key={child.id}>
									{child.table_row?.cells?.map((cell, i) => (
										<RowElement key={`${cell.plain_text}-${i}`}>
											<Text title={cell} />
										</RowElement>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			);
		case 'column_list':
			return (
				<div className={styles.row}>
					<Blocks blocks={block.children} />
				</div>
			);
		case 'column':
			return (
				<div>
					<Blocks blocks={block.children} />
				</div>
			);
		default:
			return `❌ Unsupported block (${
				type === 'unsupported' ? 'unsupported by Notion API' : type
			})`;
	}
}

function Text({ title }: { title: TextRichTextItemResponse[] }) {
	if (!title) {
		return null;
	}
	return title.map((value, index) => {
		const {
			annotations: { bold, code, color, italic, strikethrough, underline },
			text,
		} = value;
		return (
			<span
				className={[
					bold ? styles.bold : '',
					code ? styles.code : '',
					italic ? styles.italic : '',
					strikethrough ? styles.strikethrough : '',
					underline ? styles.underline : '',
				].join(' ')}
				style={color !== 'default' ? { color } : {}}
				key={index}
			>
				{text.link ? (
					<Link to={text.link.url}>{text.content}</Link>
				) : (
					text.content
				)}
			</span>
		);
	});
}
