<h1 align="center"> Nerthus :  The Grocery App </h1>

<p align="center"> Revolutionizing the farm-to-table ecosystem by connecting local producers, grocers, and consumers through a unified, high-performance digital marketplace. </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-blue?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>
<!-- 
  **Note:** These are static placeholder badges. Replace them with your project's actual badges.
  You can generate your own at https://shields.io
-->

---

### 📑 Table of Contents
- [� Table of Contents](#-table-of-contents)
- [🔭 Overview](#-overview)
- [✨ Key Features](#-key-features)
  - [🛒 Seamless Consumer Experience](#-seamless-consumer-experience)
  - [👨‍🌾 Empowering Producers \& Grocers](#-empowering-producers--grocers)
  - [💳 Secure Financial Operations](#-secure-financial-operations)
  - [📱 Modern Interface \& Performance](#-modern-interface--performance)
- [🛠️ Tech Stack \& Architecture](#️-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🔐 Environment Variables](#-environment-variables)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Using Docker](#using-docker)
- [🔧 Usage](#-usage)
  - [User Roles \& Navigation](#user-roles--navigation)
  - [Managing Produce](#managing-produce)
  - [Checkout Process](#checkout-process)
- [🤝 Contributing](#-contributing)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [📝 License](#-license)
- [What this means:](#what-this-means)

---

### 🔭 Overview

**Nerthus** is a sophisticated, full-stack digital marketplace designed to bridge the gap between agricultural producers and the modern consumer. Built with a focus on local economy and supply chain transparency, it provides a robust platform where farmers can list produce, grocers can manage inventory, and buyers can access fresh, high-quality goods with the convenience of modern e-commerce.

> The agricultural supply chain is often plagued by fragmentation, where local farmers struggle to reach a wider audience and consumers lack direct access to fresh produce. Traditional systems are bogged down by intermediaries, leading to increased costs and decreased freshness. Nerthus solves this by providing a direct, transparent, and secure digital channel that empowers producers and simplifies the procurement process for everyone involved.

By leveraging a **Component-based Architecture** and **Micro-services-inspired API routing**, Nerthus ensures a scalable environment that can handle complex multi-user interactions. Whether it is a farmer updating their seasonal harvest or a buyer tracking a real-time order, the platform provides a seamless, high-integrity user experience.

---

### ✨ Key Features

Nerthus is built around four primary pillars: **Discovery, Transaction, Management, and Security**.

#### 🛒 Seamless Consumer Experience
*   **Dynamic Produce Discovery:** Utilize the `Explore` and `CategoryFilter` components to find exactly what you need, from seasonal vegetables to organic staples.
*   **Integrated Shopping Cart:** A persistent cart experience powered by `useCart` and `CartContext`, allowing users to manage selections effortlessly across sessions.
*   **Real-time Order Tracking:** Stay informed with a dedicated tracking system (`/api/payments/track-order`) that monitors the journey of your produce from the farm to your doorstep.

#### 👨‍🌾 Empowering Producers & Grocers
*   **Dedicated Professional Profiles:** Specific features for Farmers (`app/features/farmer`) and Grocers (`app/features/grocer`) to showcase their offerings and build brand trust.
*   **Inventory Control:** Sophisticated models (`produce.model.ts`) allow producers to manage stock levels, pricing, and produce details with granular control.
*   **Engagement Tools:** Built-in "Follow" functionality (`useFollow.ts`) enables buyers to stay connected with their favorite local producers for updates on new harvests.

#### 💳 Secure Financial Operations
*   **Razorpay Integration:** Professional-grade payment processing via `PaymentButton.tsx` and `razorpay` dependency, ensuring all transactions are encrypted and compliant.
*   **Automated Order Lifecycle:** From `create-order` to `verify` and even `return-order` or `cancel-order`, the API handles the entire financial lifecycle securely.
*   **JWT-Based Security:** Multi-layered authentication using JSON Web Tokens and `better-auth` to protect user data and transaction history.

#### 📱 Modern Interface & Performance
*   **Responsive Visuals:** A "Mobile-First" approach using Tailwind CSS and `framer-motion` for smooth, cinematic transitions and layouts.
*   **Optimized Data Fetching:** Utilizes `@tanstack/react-query` to ensure that produce listings and profile data are always fresh without unnecessary server load.

---

### 🛠️ Tech Stack & Architecture

Nerthus utilizes a modern, industry-standard stack selected for performance, type safety, and scalability.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **React 19 / Next.js 16** | Frontend Framework | Provides Server-Side Rendering (SSR) and efficient client-side navigation. |
| **TypeScript** | Programming Language | Ensures type safety and reduces runtime errors in complex data models. |
| **MongoDB / Mongoose** | Database & ODM | Flexible schema design for varied produce types and rapid iteration. |
| **Redux Toolkit** | State Management | Manages complex global states like cart contents, user auth, and follows. |
| **Razorpay** | Payment Gateway | Industry-leading payment infrastructure for secure, localized transactions. |
| **Cloudinary** | Image Management | High-performance CDN for serving optimized images of fresh produce. |
| **Tailwind CSS** | Styling | Utility-first CSS for rapid, consistent, and responsive UI development. |
| **Docker** | Containerization | Ensures consistent environment across development, staging, and production. |

---

### 📁 Project Structure

The project follows a modular, feature-based structure to separate concerns and improve maintainability.

```
Nerthus-App/
├── 📁 app/                         # Next.js App Router (Pages & API)
│   ├── 📁 api/                     # Serverless API endpoints
│   │   ├── 📁 auth/                # Login, Register, Logout, Refresh
│   │   ├── 📁 produce/             # Produce details and listings
│   │   ├── 📁 payments/            # Razorpay integration & Order tracking
│   │   └── 📁 buyer/farmer/grocer/ # Role-specific profile routes
│   ├── 📁 features/                # Domain-specific UI logic
│   │   ├── 📁 auth/                # Authentication screens
│   │   ├── 📁 checkout/            # Payment and shipping flows
│   │   └── 📁 orders/              # Order history and success pages
│   └── 📄 layout.tsx               # Main application wrapper
├── 📁 components/                  # Reusable UI building blocks
│   ├── 📄 Navbar.tsx               # Global navigation
│   ├── 📄 ProduceCard.tsx          # Individual product display
│   ├── 📄 CheckoutForm.tsx         # Payment input handling
│   └── 📄 ProtectedRoute.tsx       # Auth-guarded component wrapper
├── 📁 hooks/                       # Custom React hooks
│   ├── 📄 useCart.ts               # Cart logic and persistence
│   ├── 📄 useProduceList.ts        # Data fetching for produce
│   └── 📄 useAuthForm.ts           # Form handling for auth
├── 📁 model/                       # Mongoose Database Schemas
│   ├── 📄 user.model.ts            # Base user identity
│   ├── 📄 produce.model.ts         # Produce metadata and pricing
│   └── 📄 order.model.ts           # Transaction and shipping records
├── 📁 store/                       # Redux Toolkit slices and store config
├── 📁 lib/                         # Shared utilities (DB, Auth, API)
├── 📁 services/                    # External service integrations (Cloudinary)
├── 📄 docker-compose.yml           # Multi-container orchestration
├── 📄 Dockerfile                   # Environment containerization
├── 📄 next.config.ts               # Next.js framework configuration
└── 📄 package.json                 # Dependency and script definitions
```

---

### 🔐 Environment Variables

To run Nerthus locally or in production, the following environment variables are required. Refer to `.env.example` for the template.

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Current environment (development/production). |
| `PORT` | The port on which the server will run. |
| `MONGODB_URI` | Connection string for the MongoDB instance. |
| `JWT_ACC_SECRECT` | Secret key for generating Access Tokens. |
| `JWT_REF_SECRECT` | Secret key for generating Refresh Tokens. |
| `JWT_ACC_EXPIRES_IN` | Expiration time for Access Tokens. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier for media. |
| `CLOUDINARY_API_KEY` | API Key for authenticated media uploads. |
| `CLOUDINARY_API_SECRET` | Secret key for Cloudinary API. |

---

### 🚀 Getting Started

#### Prerequisites
*   **Node.js:** v20 or higher
*   **NPM:** v10 or higher
*   **MongoDB:** A running instance (Local or Atlas)
*   **Docker:** (Optional) For containerized deployment

#### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Bharatdwaj3/Nerthus-The-Grocery-App.git
    cd Nerthus-The-Grocery-App
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and populate it with the variables listed in the [Environment Variables](#-environment-variables) section.

4.  **Database Migration (Prisma)**
    ```bash
    npx prisma generate
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

6.  **Build for Production**
    ```bash
    npm run build
    npm run start
    ```

#### Using Docker
If you prefer containerization, use the provided Docker configuration:
```bash
docker-compose up --build
```

---

### 🔧 Usage

#### User Roles & Navigation
- **Buyers:** Can browse the `Explore` page, add items to the `Cart`, and proceed through the `Checkout` flow.
- **Farmers/Grocers:** Can access their specific dashboards to list new produce or manage existing inventory through the `profile` API endpoints.

#### Managing Produce
Individual produce items are displayed using the `ProduceGrid`. Clicking on a `ProduceCard` navigates to the dynamic route `app/features/produce/[id]/page.tsx`, where detailed information is fetched via `useProduceDetail`.

#### Checkout Process
1.  Add items to the cart using the `useCart` hook.
2.  Navigate to `/features/checkout`.
3.  The `PaymentButton` initiates the Razorpay checkout modal.
4.  Upon successful payment, the user is redirected to the `order-success` page.

---

### 🤝 Contributing

We welcome contributions to improve Nerthus! Your input helps make this project better for everyone in the agricultural community.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page.
2. **Create a feature branch** 
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Improve code, documentation, or design.
4. **Test thoroughly** - Ensure all functionality works as expected.
   ```bash
   npm run lint
   ```
5. **Commit your changes** - Write clear, descriptive commit messages.
   ```bash
   git commit -m 'Add: Amazing new feature that does X'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Submit your changes for review.

### Development Guidelines
- ✅ Follow the existing TypeScript conventions and ESLint rules.
- 📝 Document all new hooks and components in the `README.md` if necessary.
- 🧪 Ensure all API routes handle errors gracefully using the custom error components in `errors/`.
- 🎯 Keep components modular and reusable within the `components/` directory.

---

### 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:
- ✅ **Commercial use:** You can use this project commercially.
- ✅ **Modification:** You can modify the code for your own needs.
- ✅ **Distribution:** You can distribute this software freely.
- ✅ **Private use:** You can use this project privately.
- ⚠️ **Liability:** The software is provided "as is", without warranty of any kind.

---

<p align="center">Made with ❤️ for a Greener Future by the Nerthus Team</p>
<p align="center">
  <a href="#">⬆️ Back to Top</a>
</p>