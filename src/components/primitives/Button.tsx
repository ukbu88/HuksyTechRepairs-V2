import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'ink' | 'signal' | 'outline' | 'quiet';
type Size = 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type LinkProps = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'href' | 'className'
  >;
type ButtonProps = BaseProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'className'
  >;

function classes(variant: Variant, size: Size, className?: string): string {
  return [styles.button, styles[variant], size === 'lg' ? styles.lg : '', className ?? '']
    .filter(Boolean)
    .join(' ');
}

/** The one button. Renders a Link when given href, a <button> otherwise. */
export function Button(props: LinkProps | ButtonProps) {
  if (props.href !== undefined) {
    const { href, variant = 'ink', size = 'md', children, className, ...rest } = props;
    return (
      <Link href={href} className={classes(variant, size, className)} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant = 'ink', size = 'md', children, className, type = 'button', ...rest } = props;
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
