import type { ReactNode } from 'react';

export default function Show(props: { when?: any; children: ReactNode }) {
	if (props.when) {
		return props.children;
	} else {
		return null;
	}
}
