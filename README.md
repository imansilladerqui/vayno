# Vayno - Smart Parking Management System

A comprehensive parking lot management application that gives you complete control over your parking business operations. Monitor occupancy, track revenue, and manage your parking spots in real-time from anywhere.

## 🚗 Features

### Real-Time Monitoring

- **Live Parking Grid**: Visual representation of all parking spots with real-time status updates
- **Spot Management**: Track occupied, available, and reserved parking spots
- **Vehicle Tracking**: Monitor vehicle entry/exit times and license plates
- **Duration Tracking**: Automatic calculation of parking duration and fees

### Revenue Analytics

- **Daily Revenue Tracking**: Monitor daily income with trend analysis
- **Comprehensive Dashboard**: Overview of key metrics including occupancy rates
- **Revenue Insights**: Track performance with percentage changes and trends
- **Activity Feed**: Real-time updates on parking activities

### Business Control

- **Independent Management**: Run your parking business without relying on employees
- **Complete Oversight**: Full visibility into all parking operations
- **Spot Control**: Mark spots as occupied, available, or reserved
- **Fee Management**: Track and calculate parking fees automatically

## 🛠️ Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM for navigation
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase for database and authentication
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd vayno
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env.local file with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📱 Application Structure

### Pages

- **Dashboard**: Overview of parking metrics and real-time status
- **Parking**: Detailed view of all parking spots with management controls
- **Activity**: Log of all parking activities and transactions
- **Settings**: Application configuration and preferences

### Key Components

- **ParkingGrid**: Visual representation of parking spots
- **StatCard**: Key metrics display cards
- **ActivityFeed**: Real-time activity updates
- **DashboardLayout**: Consistent layout wrapper

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Lovable Platform

Simply open [Lovable](https://lovable.dev/projects/60dbe269-653e-4a45-92f5-aa61aeece90f) and click on Share → Publish.

### Custom Domain

Connect a custom domain by navigating to Project > Settings > Domains and clicking Connect Domain.

## 📊 Usage

1. **Dashboard**: Monitor overall parking lot status and revenue metrics
2. **Parking Management**: View and manage individual parking spots
3. **Real-time Updates**: Track vehicle entries and exits as they happen
4. **Revenue Tracking**: Monitor daily income and occupancy trends
5. **Spot Control**: Mark spots as occupied or available manually

## 🤝 Contributing

This project supports multiple development workflows:

- **Lovable IDE**: Edit directly in the browser at the [project URL](https://lovable.dev/projects/60dbe269-653e-4a45-92f5-aa61aeece90f)
- **Local Development**: Clone and develop with your preferred IDE
- **GitHub Codespaces**: Use cloud-based development environment
- **GitHub Web Editor**: Edit files directly in the GitHub interface

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using Lovable**
