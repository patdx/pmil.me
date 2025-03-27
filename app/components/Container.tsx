import clsx from 'clsx'
import type { FC, ReactNode } from 'react'

export const Container: FC<{ className?: string; children: ReactNode }> = (
	props
) => {
	return (
		<div className={clsx('container mx-auto max-w-6xl px-5', props.className)}>
			{props.children}
		</div>
	)
}
