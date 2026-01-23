export interface DashboardPreference {
    user_email: string;
    widget_config: Record<string, boolean>;
    layout_order: string[];
}

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
    numeric_columns: Array<{
        name: string;
        min: number;
        max: number;
        median: number;
        sum: number;
    }>;

    // Trend data
    current_period_data: Array<{ period: string; value: number }>;
    previous_period_data: Array<{ period: string; value: number }>;
}

export interface DashboardStats {
    dataset_id: number;
    filename: string;
    total_rows: number;
    total_columns: number;
    total_cells: number;
    missing_cells: number;
    missing_percentage: number;
    duplicate_rows: number;

    column_stats: any[];
    smart_analysis?: {
        identified_date_col?: string;
        identified_value_col?: string;
        identified_category_col?: string;
        sales_over_time: any[];
        top_categories: any[];

        total_sales: number;
        average_sales: number;
        best_month: string;
        top_product: string;

        insights: any[];
        summary?: string;
    };
}
