import { useEffect, useRef } from 'react'

interface ShareButtonsProps {
	url: string
	title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
	const twitterRef = useRef<HTMLAnchorElement>(null)
	const linkedinRef = useRef<HTMLAnchorElement>(null)
	const blueskyRef = useRef<HTMLAnchorElement>(null)

	useEffect(() => {
		const fullUrl = `${window.location.origin}${url}`
		if (twitterRef.current) {
			twitterRef.current.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				title
			)}&url=${encodeURIComponent(fullUrl)}`
		}
		if (linkedinRef.current) {
			linkedinRef.current.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				fullUrl
			)}`
		}
		if (blueskyRef.current) {
			blueskyRef.current.href = `https://bsky.app/intent/compose?text=${encodeURIComponent(
				`${title}\n\n${fullUrl}`
			)}`
		}
	}, [url, title])

	return (
		<div className="flex gap-4" role="group" aria-label="Share article">
			<a
				ref={twitterRef}
				href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
					title
				)}&url=${encodeURIComponent(url)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-400 hover:text-blue-600"
			>
				Share on Twitter
			</a>
			<a
				ref={linkedinRef}
				href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
					url
				)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-700 hover:text-blue-900"
			>
				Share on LinkedIn
			</a>
			<a
				ref={blueskyRef}
				href={`https://bsky.app/intent/compose?text=${encodeURIComponent(
					`${title}\n\n${url}`
				)}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sky-500 hover:text-sky-700"
			>
				Share on Bluesky
			</a>
		</div>
	)
}
