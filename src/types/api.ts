// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
}

// Account Types
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
  id: string;
  organizationId: string;
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  currency?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateAccountDto {
  name?: string;
  type?: AccountType;
  currency?: string;
  description?: string;
  isActive?: boolean;
}

// Transaction Types
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  id: string;
  organizationId: string;
  type: TransactionType;
  amount: string;
  currency: string;
  description: string | null;
  date: string;
  category: string | null;
  tags: string[];
  fromAccountId: string | null;
  toAccountId: string | null;
  fromAccount?: { id: string; name: string } | null;
  toAccount?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  fromAccountId?: string;
  toAccountId?: string;
}

export interface UpdateTransactionDto {
  type?: TransactionType;
  amount?: number;
  currency?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  fromAccountId?: string;
  toAccountId?: string;
}
