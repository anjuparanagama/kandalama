# Kandalama - Property Listing Platform

A modern, full-featured real estate property listing platform built with Next.js, React, and Supabase. Browse, filter, and post properties in your area with an intuitive user interface.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

✨ **Core Features**
- 🏠 Browse property listings with advanced filtering
- 🔍 Filter by category (House, Land, Commercial, Room, Annex)
- 💰 Filter by price range and listing type (Sale/Rent)
- 👤 User authentication (Login/Register)
- 📝 Post and manage property advertisements
- 🖼️ Multi-image support for properties
- ⭐ Featured property showcase
- 📊 View count tracking
- 🎨 Dark/Light theme support
- 📱 Fully responsive design

**Property Details**
- Location-based search (City/District filtering)
- Property specifications (Bedrooms, Bathrooms, Area)
- Contact information
- Detailed descriptions
- Active/Inactive status management
- Timestamp tracking (Created/Updated)

## Tech Stack

### Frontend
- **Framework**: Next.js 13.5 (App Router)
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3 + Tailwind Merge
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Notifications**: Sonner
- **Theme**: Next Themes (Dark/Light mode)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Authentication
- **API Client**: @supabase/supabase-js

### Development
- **Package Manager**: npm
- **Deployment**: Netlify
- **Linting**: ESLint
- **Code Quality**: TypeScript strict mode

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9+ or yarn
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kandalama
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
kandalama/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── login/                   # Authentication pages
│   ├── register/
│   ├── properties/              # Property listing pages
│   │   ├── page.tsx            # Properties list
│   │   └── [id]/               # Property detail page
│   ├── post-ad/                # Create property listing
│   ├── about/                  # About page
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── Navbar.tsx              # Navigation bar
│   ├── Footer.tsx              # Footer
│   ├── PropertyCard.tsx         # Property listing card
│   ├── CategoryCard.tsx         # Category filter card
│   ├── FilterSidebar.tsx        # Search/filter sidebar
│   └── ui/                     # shadcn/ui components
│
├── hooks/                       # Custom React hooks
│   └── use-toast.ts            # Toast notifications
│
├── lib/                         # Utility functions & config
│   ├── supabase.ts             # Supabase client & types
│   ├── dummyData.ts            # Sample data
│   └── utils.ts                # Utility functions
│
├── public/                      # Static assets
│   └── font/
│
├── supabase/                    # Database migrations
│   └── migrations/
│       └── 20260209150838_create_properties_schema.sql
│
├── package.json                # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind CSS config
├── next.config.js             # Next.js config
├── postcss.config.js          # PostCSS config
└── netlify.toml               # Netlify deployment config
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (Get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Add more environment variables as needed
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never commit sensitive keys to version control.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run typecheck` | Run TypeScript type checking |

## Database Schema

The application uses Supabase with the following main tables:

**properties** table contains:
- `id` - Unique identifier
- `user_id` - Property owner
- `title` - Property title
- `description` - Detailed description
- `price` - Price amount
- `category` - Type (house, land, commercial, room, annex)
- `listing_type` - Sale or Rent
- `location` - Specific address
- `city` - City name
- `district` - District name
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms
- `area_sqft` - Property area
- `contact_number` - Owner contact
- `is_featured` - Featured listing flag
- `is_active` - Active listing flag
- `views_count` - View counter
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**property_images** table:
- Stores multiple images per property
- Supports primary image designation
- Display order customization

## Deployment

### Netlify (Configured)

The project is configured for deployment on Netlify with Next.js support.

1. **Connect Repository**
   - Push to GitHub/GitLab
   - Connect repository to Netlify

2. **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify dashboard

3. **Deploy**
   - Automatic deployment on push to main branch
   - Build command: `npm run build`
   - Publish directory: `.next`

See `netlify.toml` for detailed Netlify configuration.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Guidelines
- Follow TypeScript strict mode
- Use functional components with hooks
- Write meaningful commit messages
- Test your changes locally before pushing
- Ensure `npm run lint` and `npm run typecheck` pass

## Troubleshooting

**Development server won't start**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (should be 18+)

**Supabase connection issues**
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure network access to Supabase servers

**TypeScript errors**
- Run `npm run typecheck` to identify issues
- Check that all imports use correct paths

## Performance Optimizations

- Next.js Image optimization for property photos
- Lazy loading for property cards
- Database query optimization with Supabase
- CSS minification with Tailwind
- Code splitting with Next.js App Router

## Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) for data protection
- Type-safe database queries with TypeScript
- Form validation with Zod
- HTTPS enforced in production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact & Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Happy coding! 🚀** Build amazing properties with Kandalama.