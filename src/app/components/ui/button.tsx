import * as React from "react"
import { cn } from "./utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {

        // Base styles for all buttons
        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"

        // Variant mapping
        const variants = {
            default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
            destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
            outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            link: "text-blue-600 underline-offset-4 hover:underline",
        }

        // Size mapping
        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10",
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        )
    }
)

Button.displayName = "Button"

export { Button }