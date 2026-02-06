import * as React from 'react'
import { useState, createContext, useContext } from 'react'
import { cn } from './utils'

// 1. Create Context
interface TabsContextType {
    activeTab: string
    onTabChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
    const context = useContext(TabsContext)
    if (!context) throw new Error("Tabs components must be used within <Tabs />")
    return context
}

// 2. Main Container
export interface TabsProps {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    className?: string
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
    const [internalValue, setInternalValue] = useState(value || defaultValue || '')

    // Support controlled component pattern
    const activeTab = value !== undefined ? value : internalValue

    const handleTabChange = (newValue: string) => {
        setInternalValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
            <div className={cn('w-full', className)}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

// 3. Tab List (The background/container for triggers)
export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500',
            className
        )}>
            {children}
        </div>
    )
}

// 4. Tab Trigger (The button)
export interface TabsTriggerProps {
    value: string
    children: React.ReactNode
    className?: string
    disabled?: boolean
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
    const { activeTab, onTabChange } = useTabsContext()
    const isActive = activeTab === value

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onTabChange(value)}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                'disabled:pointer-events-none disabled:opacity-50',
                isActive
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'hover:bg-gray-50 hover:text-gray-900',
                className
            )}
        >
            {children}
        </button>
    )
}

// 5. Tab Content (The panel)
export interface TabsContentProps {
    value: string
    children: React.ReactNode
    className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const { activeTab } = useTabsContext()

    if (activeTab !== value) return null

    return (
        <div
            role="tabpanel"
            className={cn(
                'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                className
            )}
        >
            {children}
        </div>
    )
}