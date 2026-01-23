/**
 * K2M Analytics - Dashboard Types
 * ================================
 * TypeScript interfaces for dashboard-related data structures.
 */

// ============ User Preferences ============

export interface DashboardPreference {
    user_email: string;
    widget_config: Record<string, boolean>;
    layout_order: string[];
}

// ============ Dataset Types ============

export interface Dataset {
    id: number;
    filename: string;
    file_path: string;
    file_size: number;
    total_rows: number;
    total_columns: number;
    uploaded_at: string;
}

// ============ Analytics Types ============

export interface TimeSeriesPoint {
    date: string;
    value: number;
}

export interface CategoryPoint {
    name: string;
    value: number;
    growth?: number;
}

export interface Insight {
    text: string;
    type: "positive" | "warning" | "info";
}

export interface ColumnStats {
    name: string;
    type: "numeric" | "categorical" | "datetime";
    missing_count: number;
    unique_count: number;
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    std?: number;
    distribution?: Array<{ name: string; value: number }>;
}

export interface NumericColumnSummary {
    name: string;
    min: number;
    max: number;
    median: number;
    sum: number;
}

export interface PeriodDataPoint {
    period: string;
    value: number;
}

// ============ Smart Analysis ============

export interface SmartAnalysis {
    identified_date_col?: string;
    identified_value_col?: string;
    identified_category_col?: string;

    sales_over_time: TimeSeriesPoint[];
    top_categories: CategoryPoint[];

    total_sales: number;
    average_sales: number;
    best_month: string;
    top_product: string;

    insights: Insight[];
    summary?: string;
}

// ============ Dashboard Stats ============

export interface DashboardStats {
    dataset_id: number;
    filename: string;
    total_rows: number;
    total_columns: number;
    total_cells: number;
    missing_cells: number;
    missing_percentage: number;
    duplicate_rows: number;

    column_stats: ColumnStats[];
    smart_analysis?: SmartAnalysis;
}

// ============ Advanced Stats ============

export interface AdvancedStats {
    dataset_id: number;
    transaction_count: number;

    // Growth & Trends
    growth_rate?: number;
    growth_direction: "up" | "down" | "neutral";

    // Data Health
    data_health_score: number;
    data_quality_issues: string[];

    // Counts
    unique_categories: number;
    unique_products: number;

    // Date Range
    date_range_start?: string;
    date_range_end?: string;
    date_span_days?: number;

    // Numeric Summary
    numeric_columns: NumericColumnSummary[];

    // Trend data
    current_period_data: PeriodDataPoint[];
    previous_period_data: PeriodDataPoint[];
}

// ============ Filter Types ============

export interface SuggestedFilter {
    column: string;
    type: "date" | "categorical";
    values: string[];
    count: number;
    priority: number;
}

// ============ Anomaly Types ============

export interface Anomaly {
    id: string;
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    metric: string;
    change: number;
    timestamp: string;
    status: "new" | "investigating" | "resolved";
}

