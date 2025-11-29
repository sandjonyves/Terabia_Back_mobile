# Terabia - Agricultural Marketplace Implementation

## Overview

Terabia is a comprehensive mobile-first marketplace connecting farmers, buyers, delivery agencies, and administrators in the agricultural sector. Built with Expo/React Native and Supabase.

## Architecture

### Technology Stack

- **Frontend**: Expo SDK, React Native, Expo Router
- **Backend**: Supabase (PostgreSQL database, Authentication, Row Level Security)
- **State Management**: React Context API
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet with custom design system

## Design System

### Color Palette

**Primary Colors:**
- Green: `#2E7D32` (Primary brand color)
- Terracotta: `#D9884B` (Accent)
- Sand: `#F5E9D4` (Secondary accent)
- Yellow: `#F2C94C` (Highlights)

**Neutral Palette:**
- 900 to 50 scale for text and backgrounds

### Typography

- **Font Family**: Inter
- **Sizes**: xs (12px) to 4xl (32px)
- **Line Heights**: tight (1.2), normal (1.5), relaxed (1.75)

### Spacing

Base 8px system: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## Database Schema

### Tables

1. **users** - Extended user profiles with role-based attributes
2. **categories** - Product categorization (8 pre-seeded categories)
3. **products** - Seller product listings with pricing and inventory
4. **orders** - Purchase orders with items, delivery info, and status tracking
5. **deliveries** - Delivery tracking and agency assignment
6. **transactions** - Payment records for Mobile Money integration
7. **reviews** - Ratings and reviews for sellers and delivery agencies

### Security

- Row Level Security (RLS) enabled on all tables
- Role-based policies for data access
- Authentication via Supabase Auth (email/password)
- Automatic order number generation
- Rating aggregation triggers

## User Roles & Features

### 1. Buyer

**Screens:**
- Home: Categories and featured products
- Catalog: Browse/search products with filters
- Product Details: View product info, add to cart
- Cart: Manage quantities, checkout
- Orders: View order history and status
- Profile: Account settings and sign out

**Features:**
- Browse products by category or search
- Add items to cart with quantity selection
- Place orders with delivery information
- Track order status
- Review sellers (future enhancement)

### 2. Seller/Farmer

**Screens:**
- Dashboard: Sales overview with stats (products, orders, revenue)
- Products: Manage product listings
- Add Product: Create new product listings
- Profile: Seller info, rating, verification status

**Features:**
- View business metrics and statistics
- Add/edit/delete products
- Manage inventory and pricing
- View orders for their products
- Build seller reputation through ratings

### 3. Delivery Agency

**Screens:**
- Dashboard: Welcome screen
- Deliveries: Available delivery requests
- Profile: Agency information

**Features (Placeholder):**
- View available deliveries
- Accept delivery assignments
- Update delivery status
- Track delivery history

### 4. Admin

**Screens:**
- Dashboard: Platform overview
- Users: User management
- Profile: Admin settings

**Features (Placeholder):**
- View platform statistics
- Manage users (approve/suspend)
- Moderate content
- System configuration

## Key Components

### Reusable UI Components

1. **Button** - Primary, secondary, ghost variants with loading states
2. **Input** - Form input with label, error handling, validation
3. **ProductCard** - Product display with image, price, location, seller info
4. **StatusBadge** - Status indicators for orders, payments, deliveries
5. **LoadingSpinner** - Full-screen loading indicator
6. **EmptyState** - Empty states with icon, title, description, action

### Context Providers

1. **AuthContext** - Authentication state, sign up/in/out, user profile
2. **CartContext** - Shopping cart management with AsyncStorage persistence

## Navigation Structure

```
/
├── auth/
│   ├── role-selection (Choose user role)
│   ├── signup (Create account)
│   └── login (Sign in)
├── (buyer)/
│   ├── (tabs)/
│   │   ├── index (Home)
│   │   ├── catalog (Browse)
│   │   ├── cart (Shopping cart)
│   │   ├── orders (Order history)
│   │   └── profile (Account)
│   └── product/[id] (Product details)
├── (seller)/
│   ├── (tabs)/
│   │   ├── index (Dashboard)
│   │   ├── products (Manage products)
│   │   ├── add-product (Create listing)
│   │   └── profile (Seller profile)
├── (delivery)/ (tabs) - Placeholder
└── (admin)/ (tabs) - Placeholder
```

## Data Flow

### Authentication Flow

1. User selects role (buyer/seller/delivery/admin)
2. Signs up with email, password, and profile info
3. Profile created in users table linked to auth.users
4. User redirected to role-specific dashboard

### Shopping Flow (Buyer)

1. Browse products on home or catalog screen
2. View product details
3. Add items to cart (persisted in AsyncStorage)
4. Review cart and adjust quantities
5. Proceed to checkout (future: payment integration)
6. Order created with status: pending
7. Track order status in orders screen

### Selling Flow (Seller)

1. View dashboard statistics
2. Add new product with details
3. Product appears in catalog for buyers
4. Receive and manage orders
5. Build reputation through ratings

## Payment Integration (Planned)

Mobile Money providers supported:
- MTN Mobile Money
- Orange Money
- M-Pesa

**Flow:**
1. Buyer initiates payment
2. Redirect to provider
3. Webhook receives confirmation
4. Order status updated
5. Payment recorded in transactions table

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Running the Application

### Development

```bash
npm install
npm run dev
```

### Production Build (Web)

```bash
npm run build:web
```

## Future Enhancements

### MVP Features (Next Phase)

1. **Checkout & Payment Flow**
   - Mobile Money integration
   - Order confirmation screens
   - Payment status tracking

2. **Delivery Management**
   - Delivery agency dashboard
   - Accept/track deliveries
   - Route optimization

3. **Image Upload**
   - Product photos via camera/gallery
   - Cloudinary or S3 integration
   - Image optimization

4. **Search & Filters**
   - Advanced product search
   - Price range filters
   - Location-based filtering
   - Category refinement

5. **Reviews & Ratings**
   - Leave product reviews
   - Rate sellers and delivery agents
   - Review moderation

### Advanced Features

1. **Real-time Features**
   - Order status notifications
   - Live chat between buyers/sellers
   - Delivery tracking

2. **Analytics**
   - Seller analytics dashboard
   - Sales trends and insights
   - Inventory alerts

3. **Admin Tools**
   - User verification system
   - Content moderation
   - Platform statistics
   - Dispute resolution

4. **Social Features**
   - Favorite products/sellers
   - Share products
   - Buyer recommendations

## Technical Considerations

### Performance

- Pagination for product lists
- Image lazy loading
- Optimized queries with proper indexes
- Cached category data

### Security

- All database operations protected by RLS
- Input validation on forms
- Secure password storage (handled by Supabase Auth)
- API keys secured via environment variables

### Scalability

- Indexed database queries
- Modular component architecture
- Context-based state management
- File-based routing for code splitting

## Testing Strategy (Recommended)

1. **Unit Tests**: Component logic, utilities
2. **Integration Tests**: Auth flow, cart operations
3. **E2E Tests**: Complete user journeys
4. **Manual Testing**: UI/UX, cross-platform compatibility

## Deployment

### Web Platform

```bash
npm run build:web
```

Deploy `dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront

### Mobile Platforms

Use Expo EAS Build for iOS and Android native builds:

```bash
eas build --platform ios
eas build --platform android
```

## Support & Documentation

- Expo Documentation: https://docs.expo.dev
- Supabase Documentation: https://supabase.com/docs
- React Native Documentation: https://reactnative.dev

---

**Version:** 1.0.0
**Last Updated:** 2025-11-29
**Status:** MVP Core Complete
