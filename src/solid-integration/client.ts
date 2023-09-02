import { sharedConfig, Suspense } from 'solid-js';
import { createComponent, hydrate, render } from 'solid-js/web';

export default (element: HTMLElement) =>
	(Component: any, props: any, slotted: any, { client }: { client: string }) => {
		if (!element.hasAttribute('ssr')) return;

		const isHydrate = client !== 'only';
		const bootstrap = isHydrate ? hydrate : render;

		let _slots: Record<string, any> = {};
		if (Object.keys(slotted).length > 0) {
			// hydrating
			if (sharedConfig.context) {
				element.querySelectorAll('astro-slot').forEach((slot) => {
					_slots[slot.getAttribute('name') || 'default'] = slot.cloneNode(true);
				});
			} else {
				for (const [key, value] of Object.entries(slotted)) {
					_slots[key] = document.createElement('astro-slot');
					if (key !== 'default') _slots[key].setAttribute('name', key);
					_slots[key].innerHTML = value;
				}
			}
		}

		const { default: children, ...slots } = _slots;
		const renderId = element.dataset.solidRenderId;

		const dispose = bootstrap(
			() => {
				const inner = () =>
					createComponent(Component, {
						...props,
						...slots,
						children,
					});

				if (isHydrate) {
					return createComponent(Suspense, {
						get children() {
							return inner();
						},
					});
				} else {
					return inner();
				}
			},
			element,
			{
				renderId,
			}
		);

		element.addEventListener('astro:unmount', () => dispose(), { once: true });
	};
