import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'violet' | 'emerald' | 'detonation' | 'amber';
  size?: 'xs' | 'sm';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'xs',
  icon,
  className = ''
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-white/10 border-white/10 text-white/80',
    cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    violet: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    detonation: 'bg-red-500/15 border-red-500/30 text-red-300',
    amber: 'bg-amber-500/15 border-amber-500/30 text-amber-300'
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 tracking-wider',
    sm: 'text-xs px-2.5 py-1 tracking-wide'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono-data uppercase font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
