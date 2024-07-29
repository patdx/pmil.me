import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

export const HeaderLink: FC<{
	href: string;
	className?: string;
	children: ReactNode;
}> = (props) => {
	return (
		<NavLink
			to={props.href}
			className={({ isActive }) =>
				clsx(
					props.className,
					'transition',
					'h-12 flex justify-center items-center hover:bg-blue-200 text-blue-900 hover:text-black rounded',
					isActive && 'font-bold',
				)
			}
		>
			{props.children}
		</NavLink>
	);
};
