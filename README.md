# BluLedger Frontend

Next.js frontend for BluLedger financial management system.

## Features

- **Modern Dashboard**: Real-time financial overview with KPIs, charts, and analytics
- **Multi-tenancy**: Organization-based data isolation and management
- **Account Management**: Track multiple accounts with different currencies and types
- **Transaction Tracking**: Income, expense, and transfer transaction management
- **Authentication**: Secure JWT-based authentication with automatic token refresh
- **Responsive Design**: Beautiful UI with smooth animations and dark mode support

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, HeroUI
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your backend API URL
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # UI components
│   └── DashboardLayout.tsx
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useAccounts.ts
│   └── useTransactions.ts
├── services/              # API services
│   ├── auth.service.ts
│   ├── account.service.ts
│   └── transaction.service.ts
├── lib/                   # Utilities and configs
│   └── api-client.ts      # Axios instance
└── types/                 # TypeScript types
    └── api.ts
```

## Key Features

### Authentication
- User registration and login
- JWT token management with automatic refresh
- Protected routes with authentication guards
- Session persistence across page reloads

### Dashboard
- Financial KPIs (revenue, expenses, profit, cashflow)
- Interactive charts for revenue, expenses, and cashflow trends
- Recent transactions table
- Account balance overview

### Organizations
- Create and manage multiple organizations
- Switch between organizations seamlessly
- Role-based access control (admin, member, viewer)
- Organization-scoped data isolation

### Accounts
- Create accounts with different types (Asset, Liability, Equity, etc.)
- Multi-currency support
- Real-time balance tracking
- Account categorization

### Transactions
- Record income, expense, and transfer transactions
- Automatic balance calculations
- Transaction categories and tags
- Date and time tracking
- Transaction history with filtering

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## API Integration

The frontend communicates with the BluLedger backend API. All API requests include:

- **Authorization**: JWT token in Authorization header
- **Organization Context**: `x-org-id` header for multi-tenant data isolation

The API client (`src/lib/api-client.ts`) handles:
- Automatic token attachment to requests
- Token refresh on expiration
- Error handling and retry logic
- Redirect to login on authentication failure

## Authentication Flow

1. User logs in via `/login` page
2. Backend returns access token (stored in localStorage) and refresh token (HTTP-only cookie)
3. Protected routes verify authentication status
4. On token expiration, client automatically refreshes using refresh token
5. On logout, tokens are cleared and user is redirected to login

## Multi-Tenancy

All data operations are scoped to the selected organization:

1. User selects an organization from their list
2. Organization ID is stored in localStorage
3. All API requests include `x-org-id` header
4. Backend returns only data belonging to that organization
5. Users can switch organizations via the UI

## Pages

- **Home** (`/`): Landing page with auto-redirect based on auth status
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration
- **Dashboard** (`/dashboard`): Main financial overview
- **Reports** (`/dashboard/reports`): Detailed financial reports
- **Settings** (`/dashboard/settings`): Application settings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
