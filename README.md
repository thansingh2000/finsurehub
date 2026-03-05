# CarMarket - Modern Car Marketplace

A modern, feature-rich car marketplace web application built with Angular 19, featuring a beautiful UI with dark/light theme support.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS and Angular Material
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Layout**: Mobile-first design that works on all devices
- **Standalone Components**: Built with Angular 19 standalone components architecture
- **Lazy Loading**: Optimized performance with lazy-loaded routes
- **Type-Safe**: Full TypeScript implementation with strict typing

## 📦 Tech Stack

- **Angular 19** - Latest Angular framework with standalone components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Angular Material** - Material Design components
- **RxJS** - Reactive programming
- **SCSS** - Enhanced styling capabilities

## 📁 Project Structure

```
src/app/
├── core/               # Core functionality
│   ├── guards/        # Route guards
│   └── interceptors/  # HTTP interceptors
├── shared/            # Shared utilities
├── layout/            # Layout components
│   ├── header/       # Header with navigation
│   ├── footer/       # Footer component
│   └── main-layout/  # Main layout wrapper
├── pages/             # Page components
│   ├── home/         # Home page
│   ├── car-listing/  # Car listing with filters
│   ├── car-details/  # Detailed car view
│   ├── compare-cars/ # Car comparison
│   ├── wishlist/     # User wishlist
│   ├── auth/         # Login & Register
│   ├── dealer-dashboard/  # Dealer dashboard
│   └── admin-dashboard/   # Admin dashboard
├── components/        # Reusable components
│   ├── car-card/     # Car card component
│   └── loading/      # Loading component
├── services/          # Business logic services
│   ├── car.service.ts
│   ├── auth.service.ts
│   ├── wishlist.service.ts
│   └── theme.service.ts
├── models/            # TypeScript interfaces
│   ├── car.model.ts
│   ├── user.model.ts
│   ├── dealer.model.ts
│   └── wishlist.model.ts
└── mock-data/         # Mock data for development
    └── cars.data.ts
```

## 🎯 Key Features by Page

### Home Page
- Hero section with search functionality
- Featured cars showcase
- Quick stats
- Popular brands section
- Why choose us section

### Car Listing
- Advanced filtering (price, fuel type, transmission, body type)
- Sorting options
- Responsive grid layout
- Active filter chips

### Car Details
- Image gallery with thumbnails
- Comprehensive specifications
- Feature list
- Dealer information
- Wishlist & compare actions

### Wishlist
- Saved cars management
- Quick view and actions
- Bulk operations

### Compare Cars
- Side-by-side comparison (ready for implementation)
- Specification comparison

### Authentication
- Login page
- Registration page
- Role-based access (Customer, Dealer, Admin)

### Dashboards
- **Dealer Dashboard**: Manage listings, view analytics
- **Admin Dashboard**: Platform management, user verification

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Navigate to the project directory:
```bash
cd car-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
ng serve
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## 📝 Available Scripts

- `ng serve` - Run development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng lint` - Lint the code
- `ng e2e` - Run end-to-end tests

## 🎨 Theming

The application supports both light and dark themes:

- **Automatic Detection**: Detects system theme preference
- **Manual Toggle**: Theme toggle button in header
- **Persistent**: Theme choice saved in localStorage
- **Custom Colors**: Customizable color palette in Tailwind config

## 🔑 Key Services

### ThemeService
Manages light/dark theme switching with localStorage persistence.

### AuthService
Handles user authentication, registration, and session management.

### CarService
Manages car data, filtering, searching, and retrieval.

### WishlistService
Handles wishlist operations with localStorage persistence.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time chat with dealers
- [ ] Advanced search with AI
- [ ] Payment gateway integration
- [ ] User reviews and ratings
- [ ] Car loan calculator
- [ ] Virtual car tours
- [ ] Push notifications
- [ ] Social media integration
- [ ] Multi-language support

## 📄 License

This project is created for demonstration purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🤝 Support

For support, email support@carmarket.com or open an issue in the repository.

---

Built with ❤️ using Angular 19
