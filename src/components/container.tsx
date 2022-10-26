import clsx from 'clsx';
import { ReactNode, FunctionComponent } from 'react';

const Container: FunctionComponent<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={clsx('container mx-auto px-5 max-w-6xl', className)}>
      {children}
    </div>
  );
};

export default Container;
