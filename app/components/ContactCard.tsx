import { Card, CardContent } from '~/components/ui/card'

interface ContactCardProps {
	href: string
	icon: React.ComponentType<{ className?: string }>
	children: React.ReactNode
}

export function ContactCard({ href, icon: Icon, children }: ContactCardProps) {
	return (
		<Card className="overflow-hidden transition-all duration-200 hover:bg-muted hover:shadow-lg">
			<CardContent className="p-0">
				<a
					href={href}
					target="_blank"
					rel="noreferrer"
					className="flex h-16 items-center gap-4 px-6"
				>
					<Icon className="h-5 w-5 text-primary" />
					<span className="font-medium">{children}</span>
				</a>
			</CardContent>
		</Card>
	)
}