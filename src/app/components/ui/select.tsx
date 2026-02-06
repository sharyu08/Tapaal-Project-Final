import React, { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from './utils';

// 1. Create Context to handle deep nesting
interface SelectContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedValue: string;
    onValueChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

function useSelectContext() {
    const context = useContext(SelectContext);
    if (!context) throw new Error("Select components must be used within a <Select />");
    return context;
}

// 2. Main Select Component
export interface SelectProps {
    children: ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export function Select({ children, value, onValueChange, className }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    // Handle controlled vs uncontrolled value
    const selectedValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
        setIsOpen(false);
    };

    return (
        <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, onValueChange: handleValueChange }}>
            <div className={cn('relative w-full', className)}>
                {children}
            </div>
        </SelectContext.Provider>
    );
}

// 3. Select Trigger
export interface SelectTriggerProps {
    children: ReactNode;
    className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
    const { isOpen, setIsOpen, selectedValue } = useSelectContext();

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                className
            )}
        >
            {/* If children is SelectValue, it will handle itself, otherwise display children */}
            {children}
            <svg
                className={cn('h-4 w-4 transition-transform text-gray-500', isOpen && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
}

// 4. Select Value (Displays placeholder or selected item text)
export function SelectValue({ placeholder }: { placeholder?: string }) {
    const { selectedValue } = useSelectContext();
    return <span>{selectedValue || placeholder}</span>;
}

// 5. Select Content (The Dropdown)
export function SelectContent({ children, className }: { children: ReactNode; className?: string }) {
    const { isOpen } = useSelectContext();

    if (!isOpen) return null;

    return (
        <div className={cn(
            'absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-gray-300 bg-white shadow-lg',
            'max-h-60 overflow-auto py-1',
            className
        )}>
            {children}
        </div>
    );
}

// 6. Select Item
export interface SelectItemProps {
    children: ReactNode;
    value: string;
    className?: string;
}

export function SelectItem({ children, value, className }: SelectItemProps) {
    const { onValueChange, selectedValue } = useSelectContext();
    const isSelected = selectedValue === value;

    return (
        <div
            onClick={() => onValueChange(value)}
            className={cn(
                'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors',
                isSelected && 'bg-blue-50 text-blue-700 font-medium',
                className
            )}
        >
            {children}
        </div>
    );
}