export function smartFormat(value: any, columnName?: string): string {
    if (value === null || value === undefined) return "-"

    // 1. Column Name Heuristics (Strongest Signal)
    if (columnName) {
        const lowerCol = columnName.toLowerCase()
        if (lowerCol.includes("price") || lowerCol.includes("cost") || lowerCol.includes("revenue") || lowerCol.includes("profit") || lowerCol.includes("amount") || lowerCol.includes("sales")) {
            return formatCurrency(value)
        }
        if (lowerCol.includes("percent") || lowerCol.includes("rate") || lowerCol.includes("growth") || lowerCol.includes("margin") || lowerCol.includes("change")) {
            return formatPercent(value)
        }
        if (lowerCol.includes("date") || lowerCol.includes("time") || lowerCol.includes("day") || lowerCol.includes("month")) {
            return formatDate(value)
        }
    }

    // 2. Value Type Heuristics (Mid Signal)
    if (typeof value === 'number') {
        // If it looks like a year (e.g. 2023), leave it as string maybe? No, usually number.
        // If it's a float < 1 and not 0, it MIGHT be a percent, but safer to treat as number unless column name says so.
        // We generally default to localized number.
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
    }

    if (typeof value === 'string') {
        // Check if date
        const date = Date.parse(value)
        if (!isNaN(date) && value.includes('-')) { // Simple check to avoid parsing simple numbers as dates
            return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
    }

    return String(value)
}

function formatCurrency(val: any) {
    const num = Number(val)
    if (isNaN(num)) return String(val)
    // Compact for large numbers
    if (Math.abs(num) >= 1000000) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(num)
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
}

function formatPercent(val: any) {
    const num = Number(val)
    if (isNaN(num)) return String(val)
    // If value is like 0.15 -> 15%. If value is 15 -> 15%.
    // Heuristic: if small float (<1), multiply by 100.
    // But be careful. 0.5% vs 50%.
    // We'll assume raw data is usually decimal (0.15) for rates.
    // If > 1, assume it's already percentage points (e.g. 15.5) unless huge.

    let finalNum = num
    if (Math.abs(num) <= 1.0) {
        finalNum = num // Intl handles scaling for style: 'percent' automatically? Yes, 0.15 -> 15%
    } else {
        // If it's > 1, Intl will make 15 -> 1500%. We need to divide by 100.
        finalNum = num / 100
    }
    return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(finalNum)
}

function formatDate(val: any) {
    const date = new Date(val)
    if (isNaN(date.getTime())) return String(val)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
