import React from 'react'
import { cn } from './utils'

export interface BadgeProps {
    children: React.ReactNode
    className?: string
}

export function Badge({ className, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                'bg-blue-100 text-blue-800',
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}
