"use client"

export function MiniSparkline({ data, color = "#8b5cf6" }: { data: number[]; color?: string }) {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`spark-gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
            <polygon
                points={`0,100 ${points} 100,100`}
                fill={`url(#spark-gradient-${color.replace("#", "")})`}
            />
        </svg>
    );
}
