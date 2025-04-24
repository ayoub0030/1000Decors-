# 1000Decors - Amazigh-Berber Carpentry Brand

1000Decors is a bilingual (French/Arabic) landing page and admin dashboard for an Amazigh-Berber carpentry brand. The project showcases exquisite carpentry products with rich cultural heritage, offering a responsive user experience in both languages with RTL support.

## Features

### Public Site
- Fully responsive design optimized for all devices
- Bilingual support (French and Arabic) with RTL layout for Arabic
- Product gallery with filtering capabilities
- Product detail pages with image galleries and specifications
- About page with company history and craftspeople profiles
- Contact form that stores inquiries in Supabase
- Floating WhatsApp inquiry button for direct communication

### Admin Dashboard
- Secure email link authentication via Supabase
- Complete CRUD operations for product management
- Bilingual content management with Arabic translations
- Image upload and management
- Inquiry management system
- Responsive admin interface

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **UI/Components:** TailwindCSS + Framer Motion
- **State Management:** @tanstack/react-query
- **i18n:** react-i18next
- **Auth & Database:** Supabase (PostgreSQL with Row-Level Security)
- **Image Storage:** Supabase Storage Buckets
- **Deployment:** Vercel (Frontend) and Supabase (Backend)

## Brand Guidelines

### Color Palette
- Walnut: #522E1C
- Sand: #D9C2A3
- Parchment: #F7F2EC  
- Amazigh-red: #A73A2F
- Turquoise: #2B8A84

### Typography
- Headings: Playfair Display
- Body: Inter

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/1000decors.git
cd 1000decors
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=+212XXXXXXXXX
```

4. Run the migration script to set up your Supabase database schema
(See the SQL migration file in `/supabase/migrations/init.sql`)

5. Start the development server
```bash
npm run dev
```

## Project Structure

```
/public/assets/brand/   - Brand assets and images
/src
  /components/          - React components
    /common/            - Shared components
    /home/              - Homepage components
    /admin/             - Admin dashboard components
  /pages/               - Page components
  /hooks/               - Custom React hooks
  /lib/                 - Utilities and configuration
  /i18n/                - Translation files
/supabase
  /migrations/          - SQL migration files
```

## Deployment

### Frontend
The frontend can be deployed to Vercel:
```bash
npx vercel
```

### Backend
The backend is managed via Supabase, which provides the database, authentication, and storage services.

## License
This project is licensed under the MIT License.
