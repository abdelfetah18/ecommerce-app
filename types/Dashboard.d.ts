interface DashboardStats {
    todayRevenue: number;
    todayRevenuePercentage: number;
    totalRevenue: number;
    totalRevenuePercentage: number;
    totalCustomers: number;
    totalCustomersPercentage: number;
};

type AdminPage = 'dashboard' | 'orders' | 'products' | 'categories' | 'create_product' | 'layout_contents';

interface DasboardPage {
    Icon: IconType;
    name: string;
    page: AdminPage;
    path: string;
};

interface InfoCard {
    title: string;
    value: string;
    percent: number;
};

interface ChartUser {
    mounthOrders: Order[];
    user: User;
    totalRevenue: number;
    ordersCount: number;
};

interface ChartData {
    date: string;
    value: number;
};
