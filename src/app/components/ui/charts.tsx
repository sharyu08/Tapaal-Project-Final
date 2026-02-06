import * as React from 'react';
import { cn } from './utils';

// --- BAR CHART ---
export interface BarChartProps {
    data?: Array<{ [key: string]: any; name?: string; value?: number }>;
    className?: string;
    height?: number;
    children?: React.ReactNode;
    fill?: string;
    dataKey?: string;
    name?: string;
}

export function BarChart({ data, className, height = 200, children, fill, dataKey, name }: BarChartProps) {
    if (!data || !data.length) return <div style={{ height }} className="flex items-center justify-center text-gray-400">No data</div>;

    const keys = Object.keys(data[0]).filter(key => key !== 'name');
    const maxValue = Math.max(...[].concat(...data.map(item =>
        keys.map(k => typeof item[k] === 'number' ? item[k] : (item.value || 0))
    )), 1); // Avoid division by zero

    return (
        <div className={cn('w-full flex flex-col', className)} style={{ height }}>
            <div className="flex-1 flex items-end gap-2 px-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <div className="flex items-end gap-1 w-full h-full">
                            {keys.map((key, kIdx) => {
                                const val = typeof item[key] === 'number' ? item[key] : (item.value || 0);
                                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                                return (
                                    <div
                                        key={key}
                                        className="w-full rounded-t transition-all hover:opacity-80"
                                        style={{
                                            height: `${(val / maxValue) * 100}%`,
                                            backgroundColor: fill || colors[kIdx % colors.length],
                                            minHeight: val > 0 ? '4px' : '0px'
                                        }}
                                        title={`${key}: ${val}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-[10px] mt-2 text-gray-500 truncate w-full text-center">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
            {children}
        </div>
    );
}

// --- PIE CHART ---
export interface PieChartProps {
    data: Array<{ name: string; value: number; color?: string }>;
    className?: string;
    size?: number;
    dataKey?: string;
}

export function PieChart({ data, className, size = 200, dataKey }: PieChartProps) {
    const total = data.reduce((sum, item) => sum + (dataKey ? (item as any)[dataKey] : item.value), 0);
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    let cumulativePercent = 0;

    // Helper to calculate SVG coordinates
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className={cn('flex flex-col md:flex-row items-center gap-6', className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                    {data.map((item, index) => {
                        const value = dataKey ? (item as any)[dataKey] : item.value;
                        const percent = value / total;
                        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                        cumulativePercent += percent;
                        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                        const largeArcFlag = percent > 0.5 ? 1 : 0;

                        const pathData = [
                            `M ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            `L 0 0`,
                        ].join(' ');

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={item.color || colors[index % colors.length]}
                                stroke="#fff"
                                strokeWidth="0.02"
                            />
                        );
                    })}
                </svg>
                {/* Donut Hole */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full flex flex-col items-center justify-center shadow-inner" style={{ width: '60%', height: '60%' }}>
                        <span className="text-xl font-bold">{total}</span>
                        <span className="text-[10px] text-gray-400 uppercase">Total</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || colors[index % colors.length] }} />
                        <span className="text-xs font-medium text-gray-600">{item.name}: {dataKey ? (item as any)[dataKey] : item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- LINE CHART ---
export function LineChart({ data, className, height = 200 }: { data: any[], className?: string, height?: number }) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={points}
                />
                {data.map((d, i) => (
                    <circle
                        key={i}
                        cx={(i / (data.length - 1)) * 100}
                        cy={100 - (d.value / maxValue) * 100}
                        r="3"
                        fill="white"
                        stroke="#3B82F6"
                        strokeWidth="1"
                    />
                ))}
            </svg>
        </div>
    );
}

// Dummy helper components to prevent errors when used like Recharts
export const ResponsiveContainer = ({ children }: any) => <div className="w-full h-full">{children}</div>;
export const XAxis = () => null;
export const YAxis = () => null;
export const Tooltip = () => null;
export const Legend = () => null;
export const CartesianGrid = () => null;
export const Cell = ({ fill }: any) => <div style={{ backgroundColor: fill }} />;
export const Bar = BarChart;
export const Line = LineChart;
export const Pie = PieChart;