import React from 'react';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'pill';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  shortcut?: string;
  isActive?: boolean;
}

export function GlassButton({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  shortcut,
  isActive = false,
  className = '',
  ...props
}: GlassButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100';

  const variantStyles = {
    primary:
      'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.35)] border border-white font-semibold',
    secondary:
      'glass-pill text-white/80 hover:text-white hover:border-white/20 active:bg-white/10',
    ghost:
      'text-white/60 hover:text-white hover:bg-white/5 active:bg-white/10 border border-transparent',
    danger:
      'bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500/25 hover:border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.2)]',
    pill:
      'rounded-full glass-pill text-xs text-white/70 hover:text-white'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    md: 'text-xs px-3.5 py-2 rounded-xl gap-2',
    lg: 'text-sm px-5 py-2.5 rounded-2xl gap-2.5',
    icon: 'w-9 h-9 rounded-full p-0'
  };

  const activeStyles = isActive ? 'glass-button-active text-white font-semibold' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${activeStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {shortcut && (
        <kbd className="ml-1.5 px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono-data text-white/60 border border-white/10">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
