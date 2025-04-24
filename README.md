# 1000Decor - Amazigh-Berber Carpentry Website

1000Decor is a bilingual (French/Arabic) web application showcasing Amazigh-Berber carpentry products, with a responsive public-facing website and a secure admin dashboard for product and inquiry management.

![1000Decor Logo](./public/1000Decors-logo.png)

## Features

- **Bilingual Support**: Full French and Arabic language support with RTL implementation
- **Responsive Design**: Mobile-first approach for optimal viewing on all devices
- **Product Showcase**: Masonry grid gallery with filtering options
- **Direct Inquiries**: WhatsApp integration for immediate customer communication
- **Admin Dashboard**: Secure product and inquiry management interface
- **Image Management**: Drag-and-drop image uploads with cloud storage

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: TailwindCSS, Framer Motion for animations
- **State Management**: @tanstack/react-query
- **Internationalization**: react-i18next with RTL support
- **Backend**: Supabase (PostgreSQL database with Row-Level Security)
- **Authentication**: Supabase Auth with magic link emails
- **Storage**: Supabase Storage for product images

## Project Structure

```
1000Decor/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/         # Admin-specific components
│   │   └── common/        # Shared components (Navbar, Footer, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # Internationalization configuration and translations
│   ├── lib/               # Utility functions and configurations
│   ├── pages/             # Page components
│   │   └── admin/         # Admin pages
│   └── assets/            # Images and other assets
└── supabase/
    └── migrations/        # SQL migrations for database setup
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/1000decor.git
   cd 1000decor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_WHATSAPP_NUMBER=+212XXXXXXXXX
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Setting Up Supabase

1. Create a new Supabase project
2. Run the migration script from `supabase/migrations/init.sql`
3. Set up storage buckets for product images
4. Configure Row-Level Security (RLS) policies as defined in the migration

## Mobile Optimization

The application has been optimized for mobile users with:

- Responsive layouts adapting to different screen sizes
- Touch-friendly buttons and interactive elements
- Optimized image loading for faster mobile performance
- WhatsApp integration for easy mobile inquiries

## Deployment

The site can be deployed to any static hosting provider:

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider of choice (Vercel, Netlify, etc.)

## Admin Access

To access the admin dashboard:

1. Navigate to `/admin/login`
2. Enter your admin email to receive a magic link
3. Click the link in your email to authenticate
4. Manage products and inquiries through the dashboard

## Internationalization

The site supports both French and Arabic languages:

- Language detection based on browser settings
- Manual language switching via the navbar
- RTL support for Arabic content
- Translations stored in JSON files in the `src/i18n` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For inquiries about this project, please contact [your contact information].

---

Developed with ❤️ for 1000Decor
