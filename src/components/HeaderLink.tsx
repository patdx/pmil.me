import clsx from 'clsx';
import type { ParentComponent } from 'solid-js';
import { useAstro } from './AstroProvider';

export const HeaderLink: ParentComponent<{
  href: string;
  class?: string;
  /** Astro.url.pathname */
  // pathname: string;
}> = (props) => {
  const Astro = useAstro();

  const isActive = () =>
    props.href === Astro?.props.pathname ||
    props.href === Astro?.props.pathname.replace(/\/$/, '');

  const classes = () =>
    clsx(
      props.class,
      'transition',
      'h-12 flex justify-center items-center hover:bg-blue-200 text-blue-900 hover:text-black rounded',
      isActive() && 'font-bold'
    );

  return (
    <a href={props.href} class={classes()}>
      {props.children}
    </a>
  );
};
