import React, { cloneElement, isValidElement } from 'react';

const merge = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  asChild?: boolean;
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
  className,
  asChild = false,
  ...rest
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold tracking-wide transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[rgba(7,17,32,0.35)] disabled:cursor-not-allowed disabled:opacity-60';
  const variants: Record<'primary' | 'secondary', string> = {
    primary:
      'bg-[var(--color-accent)] text-[var(--color-text-strong)] shadow-soft hover:bg-[var(--color-accent-strong)] hover:shadow-[0_20px_40px_rgba(75,163,255,0.45)]',
    secondary:
      'border border-[var(--color-accent)] bg-transparent text-[var(--color-accent)] hover:bg-[rgba(75,163,255,0.12)] hover:text-[var(--color-text-strong)]',
  };
  const mergedClassName = merge(base, variants[variant], className);

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement, {
      className: merge(mergedClassName, (children.props as { className?: string }).className),
      onClick,
      ...rest,
    } as Record<string, unknown>);
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={mergedClassName}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

type CardProps<T extends React.ElementType = 'section'> = {
  children: React.ReactNode;
  className?: string;
  component?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'children' | 'className'>;

export const Card = <T extends React.ElementType = 'section'>({ children, className, component, ...rest }: CardProps<T>) => {
  const Component = (component || 'section') as React.ElementType;
  return (
    <Component
      {...(rest as Record<string, unknown>)}
      className={merge('glass-card rounded-3xl border backdrop-blur-xl px-6 py-6 text-[var(--color-text)]', className)}
    >
      {children}
    </Component>
  );
};

export { merge };
