export interface User {
  id: string;
  email: string;
  companyName: string;
  shopDomain?: string;
  tenantId: string;
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Customer {
  id: string;
  shopifyId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  totalSpent: number;
  ordersCount: number;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  shopifyId: string;
  orderNumber: string;
  email: string;
  totalPrice: number;
  subtotalPrice: number;
  totalTax: number;
  currency: string;
  financialStatus: string;
  fulfillmentStatus?: string;
  processedAt: Date;
  customerData?: any;
  lineItems?: LineItem[];
  createdAt: Date;
}

export interface LineItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  variantTitle?: string;
}

export interface Product {
  id: string;
  shopifyId: string;
  title: string;
  vendor?: string;
  productType?: string;
  handle: string;
  status: string;
  tags?: string;
  variants?: any;
  images?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  customerGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
  }[];
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface WebhookEvent {
  id: string;
  topic: string;
  shopDomain: string;
  payload: any;
  processedAt?: Date;
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
}
