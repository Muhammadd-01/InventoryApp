# Business Inventory & Sales Management Tool (SaaS Dashboard)

Welcome to the **Business Inventory & Sales Management Dashboard**! This is a premium, fully-responsive SaaS application built with **React**, **Vite**, **Firebase**, **Supabase**, and modern animation libraries (**Three.js** and **Anime.js**). 

The app features a gorgeous **Glassmorphism** aesthetic, a customizable manual dark mode, real-time-like toast alerts, complete user authentication, image uploads, and interactive mock billing.

---

## 🚀 Key Features

### 1. Modern Glassmorphic Design
- Elegant frosted-glass cards, dialog panels, inputs, and sidebars featuring semi-transparent backgrounds, subtle borders, and smooth backdrop filters (`backdrop-filter: blur(16px)`).
- Harmonious gradients and responsive, high-contrast typography.

### 2. Collapsible Sidebar Navigation
- A collapsible navigation drawer with smooth transitions.
- Supports expanding to show full names and navigation links, or collapsing into an icon-only mode to maximize workspace layout space.
- Persists collapse state automatically to `localStorage`.

### 3. Manual Dark Mode Toggle
- Fully controlled dark mode toggled manually inside the **Settings** panel.
- Driven by a custom `ThemeContext` and persisted locally.
- Overrides `@media (prefers-color-scheme)` via a global `body.dark` class, correcting dark mode text readability and high-contrast inputs.

### 4. Custom Notification System
- A custom, reusable `NotificationContext` that serves glassmorphic notifications.
- Replaces annoying browser `alert()` boxes with toast notifications that slide in from the top-right and fade out after 3 seconds.

### 5. Staggered Animations & 3D Loader
- **3D Splash Screen**: A spinning wireframe canvas loader using Three.js that runs on initial page load.
- **Staggered Animations**: Staggered slide-up animations using Anime.js across list items, cards, and tables. 
- *Vite Cache Fix*: Fixed module cache loading bugs by mapping strictly to the ES build (`animejs/lib/anime.es.js`).

### 6. Firebase & Supabase Backend Integration
- **Authentication**: Email signup with **Confirm Password** validation, redirecting to the login screen upon completion.
- **Firestore User Mapping**: Maps authenticated user `UID`s to a custom `users` database collection storing display names, subscription tiers, and setup dates.
- **Supabase Storage**: Integrated to store product and profile avatar photos across separate, public buckets.
- **Environment Isolation**: All configuration values are secured in a `.env` file and excluded from Git tracking.

### 7. SaaS Billing & Subscriptions
- Subscriptions split into three tiers: *Basic*, *Pro*, and *Enterprise*.
- Features a secure checkout modal with credit card details input validation.
- Upgrading tiers dynamically updates the Firestore document data.

### 8. Logging Out Animation Screen
- Initiates a smooth, 1.5-second glassmorphism overlay transition blocking screen inputs when logging out.
- Displays a spinning loading ring and "Securing Session..." text status to provide a high-end, secure UX sensation.

### 9. System Telemetry & Local Backups
- **Live Sync Telemetry Widget**: Displays real-time database connection logs, fluctuating network latency, verification status, and memory metrics on the Dashboard.
- **Client-Side JSON Exports**: Added downloadable backups of your Products and Sales Ledger directly to local files, complete with glassmorphic toast notification feedback.

---

## 📁 Project Architecture & Structure

```
├── public/                  # Static assets
├── src/
│   ├── assets/              # App assets (CSS backgrounds, logo, etc.)
│   ├── components/
│   │   ├── Layout.jsx       # App container (collapsible state, Outlet layout)
│   │   ├── Sidebar.jsx      # Navigation sidebar with toggle button and legal footer
│   │   ├── PrivateRoute.jsx # Route guard verifying authenticated users
│   │   └── SplashScreen.jsx # 3D Three.js wireframe spinning loader
│   ├── context/
│   │   ├── AuthContext.jsx  # Firebase Auth methods & session observer
│   │   ├── ThemeContext.jsx # Light/Dark mode state and localStorage sync
│   │   └── NotificationContext.jsx # Global custom glassmorphism toast context
│   ├── pages/
│   │   ├── Dashboard.jsx    # Business metrics and recent activities
│   │   ├── Products.jsx     # CRUD operations for inventory items (Supabase images)
│   │   ├── Sales.jsx        # Records sales transactions, updating item stock quantities
│   │   ├── History.jsx      # List of all completed inventory/sales transactions
│   │   ├── Profile.jsx      # Avatar uploading and displayName settings
│   │   ├── Billing.jsx      # Subscription selection and mock credit card form
│   │   ├── Settings.jsx     # manual Dark Mode toggle and notification preferences
│   │   ├── Privacy.jsx      # Privacy policy legal statement
│   │   └── Terms.jsx        # Terms of Service legal statement
│   ├── services/            # Custom Firebase/Supabase database integrations
│   ├── utils/
│   │   └── animations.js    # AnimeJS staggered slide-up animation wrappers
│   ├── App.jsx              # Main routing definition and provider wrapper nesting
│   ├── index.css            # Root design system styles, tokens, and dark selectors
│   ├── main.jsx             # React entry point
│   ├── firebase.js          # Firebase SDK client initialization
│   └── supabase.js          # Supabase Client SDK configuration
├── .env                     # App keys (Excluded from Git)
├── .gitignore               # Git rules
├── package.json             # App dependencies (includes animejs@3.2.2)
└── vite.config.js           # Vite server settings
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the project and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables (`.env`)
Create a `.env` file at the root of the project and insert your Firebase and Supabase credentials:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

VITE_SUPABASE_URL=https://your_supabase_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key
```

### 3. Create Storage Buckets in Supabase
Avatar uploads and product images require two public storage buckets.
1. Log into your **Supabase Dashboard** and go to **Storage**.
2. Create two new buckets:
   - Name: `avatars` (Set to **Public**)
   - Name: `product-images` (Set to **Public**)
3. Set your bucket Policies to allow public read and write operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) for testing.

---

## 🏃 Running the App

Start the development server with the `--force` flag (highly recommended to clear any residual module caches):
```bash
npm run dev -- --force
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application!

---

## 🛡️ Firestore Security Rules
Ensure your Cloud Firestore database rules in the Firebase console allow read/write access to authenticated users:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
