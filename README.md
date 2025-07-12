# Expense Tracker

A modern, full-stack expense tracking application built with Next.js, featuring user authentication, transaction management, and budget tracking capabilities.

## 🚀 Features

- **User Authentication**: Secure login system with NextAuth.js
- **Transaction Management**: Add, view, and manage your expenses
- **Budget Tracking**: Set monthly budgets and track spending
- **Dashboard**: Overview of your financial data with summaries
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback and data synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js 5
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Heroicons
- **Form Validation**: Zod
- **Development Tools**: ESLint, Prettier, Husky

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- PostgreSQL database set up
- pnpm package manager (recommended)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# NextAuth.js
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"

# OAuth providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Set up the database

```bash
# Generate Prisma client
pnpm prisma:generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
expense-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   ├── lib/              # Utility functions
│   └── ui/               # Reusable UI components
├── prisma/               # Database schema and migrations
├── .github/              # GitHub workflows
├── .husky/               # Git hooks
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User accounts and authentication
- **Transaction**: Individual expense records
- **TransactionItem**: Line items within transactions
- **MonthlySummary**: Monthly budget and spending summaries

## 🧪 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm prisma:generate` - Generate Prisma client

## 🔧 Development

### Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db reset

# Create a new migration
npx prisma migrate dev --name migration_name
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the guidance of the [Next.js Dashboard App Tutorial](https://nextjs.org/learn/dashboard-app)
- Icons provided by [Heroicons](https://heroicons.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
