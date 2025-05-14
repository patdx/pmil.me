import type {
	BlockObjectResponse,
	RichTextItemResponse,
	TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { Link } from 'react-router'
import { Fragment } from 'react/jsx-runtime'
import { cn } from '~/lib/utils'

const styles = {} as any

// https://github.com/samuelkraft/notion-blog-nextjs/blob/master/components/notion/renderer.js

interface BlockProps {
	block: BlockObjectResponse
}

const renderNestedList = (blocks: BlockObjectResponse) => {
	const { type } = blocks
	const value = blocks[type]
	if (!value) return null

	const isNumberedList = value.children[0].type === 'numbered_list_item'

	if (isNumberedList) {
		return (
			<ol>
				<Blocks blocks={value.children} />
			</ol>
		)
	}
	return (
		<ul>
			<Blocks blocks={value.children} />
		</ul>
	)
}

export function Blocks({ blocks }: { blocks: BlockObjectResponse[] }) {
	return (
		<>
			{blocks.map((block) => (
				<Block key={block.id} block={block} />
			))}
		</>
	)
}

export function Block({ block }: BlockProps) {
	const { type, id } = block
	const value = block[type]

	switch (type) {
		case 'paragraph':
			return (
				<p>
					<Text value={block.paragraph.rich_text} />
				</p>
			)
		case 'heading_1':
			return (
				<h1>
					<Text value={value.rich_text} />
				</h1>
			)
		case 'heading_2':
			return (
				<h2>
					<Text value={value.rich_text} />
				</h2>
			)
		case 'heading_3':
			return (
				<h3>
					<Text value={value.rich_text} />
				</h3>
			)
		case 'bulleted_list':
			return (
				<ul>
					<Blocks blocks={value.children} />
				</ul>
			)
		case 'numbered_list':
			return (
				<ol>
					<Blocks blocks={value.children} />
				</ol>
			)
		case 'bulleted_list_item':
		case 'numbered_list_item':
			return (
				<li key={block.id}>
					<Text value={value.rich_text} />
					{!!value.children && renderNestedList(block)}
				</li>
			)
		case 'to_do':
			return (
				<div>
					<label htmlFor={id}>
						<input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
						<Text value={value.rich_text} />
					</label>
				</div>
			)
		case 'toggle':
			return (
				<details>
					<summary>
						<Text value={value.rich_text} />
					</summary>
					<Blocks blocks={block.children} />
				</details>
			)
		case 'child_page':
			return (
				<div className={styles.childPage}>
					<strong>{value?.title}</strong>
					<Blocks blocks={block.children} />
				</div>
			)
		case 'image': {
			const src =
				value.type === 'external' ? value.external.url : value.file.url
			const caption = value.caption ? value.caption[0]?.plain_text : ''
			return (
				<figure>
					<img src={src} alt={caption} />
					{caption && <figcaption>{caption}</figcaption>}
				</figure>
			)
		}
		case 'divider':
			return <hr key={id} />
		case 'quote':
			return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>
		case 'code':
			return (
				<pre className={styles.pre}>
					<code className={styles.code_block} key={id}>
						{value.rich_text[0].plain_text}
					</code>
				</pre>
			)
		case 'file': {
			const srcFile =
				value.type === 'external' ? value.external.url : value.file.url
			const splitSourceArray = srcFile.split('/')
			const lastElementInArray = splitSourceArray[splitSourceArray.length - 1]
			const captionFile = value.caption ? value.caption[0]?.plain_text : ''
			return (
				<figure>
					<div className={styles.file}>
						📎 <Link to={srcFile}>{lastElementInArray.split('?')[0]}</Link>
					</div>
					{captionFile && <figcaption>{captionFile}</figcaption>}
				</figure>
			)
		}
		case 'bookmark': {
			const href = value.url
			return (
				<a
					href={href}
					target="_blank"
					rel="noreferrer noopener"
					className={styles.bookmark}
				>
					{href}
				</a>
			)
		}
		case 'table':
			return (
				<table className={styles.table}>
					<tbody>
						{block.children?.map((child, index) => {
							const RowElement =
								value.has_column_header && index === 0 ? 'th' : 'td'
							return (
								<tr key={child.id}>
									{child.table_row?.cells?.map((cell, i) => (
										<RowElement key={`${cell.plain_text}-${i}`}>
											<Text value={cell} />
										</RowElement>
									))}
								</tr>
							)
						})}
					</tbody>
				</table>
			)
		case 'column_list':
			return (
				<div className={styles.row}>
					<Blocks blocks={block.children} />
				</div>
			)
		case 'column':
			return (
				<div>
					<Blocks blocks={block.children} />
				</div>
			)
		default:
			return `❌ Unsupported block (${
				type === 'unsupported' ? 'unsupported by Notion API' : type
			})`
	}
}

function Text({ value }: { value: RichTextItemResponse[] }) {
	if (!value) {
		return null
	}

	return value.map((item, index) => {
		if (item.type === 'text') {
			const {
				annotations: { bold, code, color, italic, strikethrough, underline },
				text,
			} = item

			if (text == null || text.content.length === 0) {
				console.log(`found a null text at index ${index}`)
				console.log(item)
				return <Fragment key={index} />
			}

			return (
				<span
					key={index}
					className={cn(
						bold && 'font-bold',
						code && 'font-mono bg-gray-100 px-1 py-0.5 rounded',
						italic && 'italic',
						strikethrough && 'line-through',
						underline && 'underline'
					)}
					// data-comment="text-segment"
					// data-text={JSON.stringify(text)}
					style={color !== 'default' ? { color } : {}}
				>
					{text.link ? (
						<Link to={text.link.url}>{text.content}</Link>
					) : (
						text.content
					)}
				</span>
			)
		} else if (item.type === 'mention') {
			// {
			// 	type: 'mention',
			// 	mention: {
			// 		type: 'link_mention',
			// 		link_mention: {
			// 			href: 'https://min.io/docs/minio/linux/integrations/setup-nginx-proxy-with-minio.html',
			// 			title: 'Configure NGINX Proxy for MinIO Server — MinIO Object Storage for Linux',
			// 			icon_url: 'https://min.io/docs/minio/linux/_static/favicon.png',
			// 			description: 'The following documentation provides a baseline for configuring NGINX to proxy requests to MinIO in a Linux environment.\n' +
			// 				'It is not intended as a comprehensive approach to NGINX, proxying, or reverse proxying in general.\n' +
			// 				'Modify the configuration as necessary for your infrastructure.'
			// 		}
			// 	},
			// 	annotations: {
			// 		bold: false,
			// 		italic: false,
			// 		strikethrough: false,
			// 		underline: false,
			// 		code: false,
			// 		color: 'default'
			// 	},
			// 	plain_text: 'https://min.io/docs/minio/linux/integrations/setup-nginx-proxy-with-minio.html',
			// 	href: 'https://min.io/docs/minio/linux/integrations/setup-nginx-proxy-with-minio.html'
			// }
			const { mention, href } = item
			const title =
				mention?.type === 'link_mention'
					? mention.link_mention?.title
					: item.plain_text

			return (
				<a
					key={index}
					// TODO: other types of mentions?
					href={href!}
					target="_blank"
					rel="noopener noreferrer"
					className="border border-gray-300 rounded py-0.5 px-0.5 mx-0.5 bg-gray-50 text-gray-800 no-underline"
				>
					{title}
				</a>
			)
		} else if (item.type === 'equation') {
			console.warn('equation not implemented')
			return null
		}
	})
}
