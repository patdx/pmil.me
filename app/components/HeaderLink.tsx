import clsx from 'clsx'
import { NavLink } from 'react-router'
import type { FC, ReactNode } from 'react'

export const HeaderLink: FC<{
	href: string
	className?: string
	children: ReactNode
}> = (props) => {
	return (
		<NavLink
			to={props.href}
			className={({ isActive }) =>
				clsx(
					props.className,
					'relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
					'hover:bg-accent hover:text-accent-foreground',
					isActive
						? 'text-foreground'
						: 'text-foreground/60 hover:text-foreground/80',
					'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform hover:after:scale-x-100',
					isActive && 'after:scale-x-100'
				)
			}
		>
			{props.children}
		</NavLink>
	)
}
