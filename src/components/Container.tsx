import type { ParentComponent } from 'solid-js';
import clsx from 'clsx';

export const Container: ParentComponent<{ class?: string }> = (props) => {
  return (
    <div class={clsx('container mx-auto max-w-6xl px-5', props.class)}>
      {props.children}
    </div>
  );
};
