// User types
export interface User {
  id: string;
  email: string;
  name: string;
  college: string;
  password?: string;
  verified: boolean;
  verified_at?: Date;
  role: 'user' | 'admin';
  avatar?: string;
  interests?: string[];
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// Subscription types
export interface Subscription {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ai' | 'ott' | 'music' | 'productivity' | 'learning' | 'other';
  type: 'peer' | 'managed' | 'both';
  features: string[];
  created_at: Date;
  updated_at: Date;
}

// Listing types (Peer Marketplace)
export interface Listing {
  id: string;
  owner_id: string;
  subscription_id: string;
  total_slots: number;
  available_slots: number;
  price_per_user: number;
  duration_days: number;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  members: string[];
  requests: ListingRequest[];
  created_at: Date;
  updated_at: Date;
}

export interface ListingRequest {
  id: string;
  user_id: string;
  listing_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
}

// Group types (Managed Subscriptions)
export interface Group {
  id: string;
  subscription_id: string;
  name: string;
  type: 'managed' | 'peer';
  owner_id?: string;
  members: GroupMember[];
  total_slots: number;
  filled_slots: number;
  price_per_user: number;
  status: 'recruiting' | 'full' | 'active' | 'expired';
  credentials?: GroupCredentials;
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface GroupMember {
  user_id: string;
  joined_at: Date;
  payment_status: 'pending' | 'completed' | 'failed';
  access_granted: boolean;
  expiry_date?: Date;
}

export interface GroupCredentials {
  username: string;
  password: string;
  shared_at: Date;
  access_log: AccessLog[];
}

export interface AccessLog {
  user_id: string;
  accessed_at: Date;
  ip_address?: string;
}

// Payment types
export interface Payment {
  id: string;
  user_id: string;
  group_id?: string;
  listing_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'razorpay' | 'stripe';
  transaction_id?: string;
  razorpay_id?: string;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  type: 'join_request' | 'approval' | 'rejection' | 'payment' | 'access' | 'expiry' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: Date;
}

// Waitlist types
export interface Waitlist {
  id: string;
  user_id: string;
  group_id: string;
  position: number;
  status: 'active' | 'joined' | 'expired';
  created_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard stats
export interface DashboardStats {
  activeGroups: number;
  totalSpentOnSubscriptions: number;
  upcomingExpirations: Group[];
  recentPayments: Payment[];
  notifications: Notification[];
}

// Admin stats
export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  totalRevenue: number;
  activeListings: number;
  recentTransactions: Payment[];
}
