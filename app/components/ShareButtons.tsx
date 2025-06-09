import { useEffect, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Twitter, Linkedin, Share2 } from 'lucide-react'

interface ShareButtonsProps {
	url: string
	title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
	const twitterRef = useRef<HTMLAnchorElement>(null)
	const linkedinRef = useRef<HTMLAnchorElement>(null)
	const blueskyRef = useRef<HTMLAnchorElement>(null)

	useEffect(() => {
		// Ensure window is defined (runs only in browser)
		if (typeof window !== 'undefined') {
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
		}
	}, [url, title])

	// Fallback URLs for server-side rendering or if JS fails
	const initialTwitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		title
	)}&url=${encodeURIComponent(url)}`
	const initialLinkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
		url
	)}`
	const initialBlueskyHref = `https://bsky.app/intent/compose?text=${encodeURIComponent(
		`${title}\n\n${url}`
	)}`

	return (
		<div className="flex gap-4" role="group" aria-label="Share article">
			<Button variant="outline" asChild>
				<a
					ref={twitterRef}
					href={initialTwitterHref}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Share on Twitter"
				>
					<Twitter className="mr-2 h-4 w-4" />
					Twitter
				</a>
			</Button>
			<Button variant="outline" asChild>
				<a
					ref={linkedinRef}
					href={initialLinkedInHref}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Share on LinkedIn"
				>
					<Linkedin className="mr-2 h-4 w-4" />
					LinkedIn
				</a>
			</Button>
			<Button variant="outline" asChild>
				<a
					ref={blueskyRef}
					href={initialBlueskyHref}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Share on Bluesky"
				>
					<Share2 className="mr-2 h-4 w-4" />
					Bluesky
				</a>
			</Button>
		</div>
	)
}
