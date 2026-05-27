# AfixZ Store — Product Requirements Document (PRD)

## Project Overview

AfixZ Store is a dedicated ecommerce platform under the AfixZ ecosystem focused on selling:

* Vermicompost / Organic Khad
* Plants
* Pots & Planters

The store will operate as a separate frontend application deployed on a subdomain while sharing the same backend infrastructure as the main AfixZ services platform.

---

# Core Architecture Decision

## Final Architecture

### Services Platform

```txt
afixz.com
```

### Ecommerce Store

```txt
store.afixz.com
```

---

# Repository Structure

## Final Decision

Two separate projects.

Two separate Git repositories.

### Repository 1

Main services platform:

* booking services
* admin dashboard
* CMS
* provider dashboard

### Repository 2

Dedicated ecommerce storefront:

* products
* cart
* checkout
* orders

---

# Critical Product Decision

## The Store Will NOT Have Its Own Admin Dashboard

This is intentional.

The ecommerce store project will be:

* frontend-only
* read-focused
* optimized for performance

All product management functionality will exist inside the existing AfixZ admin dashboard.

---

# Final System Architecture

```txt
AfixZ Ecosystem

Frontend Applications
├── afixz.com
│   ├── Services Marketplace
│   ├── Admin Dashboard
│   └── CMS
│
└── store.afixz.com
    ├── Product Storefront
    ├── Cart
    ├── Checkout
    └── Orders

Shared Backend Infrastructure
├── Firebase Auth
├── Firestore
├── Cloudinary
├── Vercel APIs
└── Resend
```

---

# Why This Architecture?

## Benefits

### Clean Separation

Services and ecommerce remain isolated.

### Better Performance

Storefront stays lightweight and optimized.

### Easier Maintenance

No duplicate admin systems.

### Shared Ecosystem

Users, auth, and database remain unified.

### Faster Development

No need to rebuild admin CMS functionality.

---

# Shared Backend Strategy

Both projects will use:

* same Firebase project
* same Firestore database
* same Firebase Authentication
* same Cloudinary account
* same Resend integration

---

# Authentication Architecture

## Shared Login System

Both apps use the same Firebase configuration.

Example:

```ts
initializeApp(firebaseConfig)
```

using the same:

* apiKey
* authDomain
* projectId

---

# Result

If user logs into:

```txt
afixz.com
```

they remain authenticated on:

```txt
store.afixz.com
```

---

# Supported Authentication Methods

* Google Sign-In
* Email/Password

Future optional:

* OTP login

---

# Shared User System

## Single Users Collection

```txt
users/{uid}
```

Shared across:

* services platform
* ecommerce store
* admin dashboard

---

# Firestore Collections

## Existing Collections

```txt
users
services
categories
bookings
subscriptions
blogs
```

---

# New Ecommerce Collections

```txt
products
productCategories
productOrders
inventory
wishlists
```

---

# Product Categories

## Initial Categories

### Vermicompost

* Organic Khad
* Premium Compost
* Nutrient Mix

### Plants

* Indoor Plants
* Outdoor Plants
* Decorative Plants

### Pots & Planters

* Ceramic Pots
* Hanging Pots
* Premium Planters

---

# Product Schema

```ts
products/{productId}

{
  id: string,
  name: string,
  slug: string,

  categoryId: string,

  shortDescription: string,
  description: string,

  images: string[],

  price: number,
  compareAtPrice?: number,

  stock: number,
  inStock: boolean,

  featured: boolean,
  bestseller: boolean,

  seo: {
    title: string,
    description: string,
    canonical?: string
  },

  createdAt,
  updatedAt
}
```

---

# Product Order Schema

```ts
productOrders/{orderId}

{
  userId: string,

  items: [
    {
      productId,
      name,
      quantity,
      price,
      image
    }
  ],

  subtotal: number,
  shippingCost: number,
  total: number,

  paymentMethod: "COD",

  status:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled",

  shippingAddress: {},

  createdAt,
  updatedAt
}
```

---

# Admin Dashboard Expansion

## Existing AfixZ Admin Dashboard Will Be Expanded

Add a new section:

```txt
Commerce
├── Products
├── Product Categories
├── Orders
└── Inventory
```

---

# Admin Features

## Product Management

* create products
* edit products
* delete products
* upload product images
* manage stock
* manage SEO

---

## Product Categories Management

* create categories
* upload category banners
* manage slugs

---

## Product Orders Management

* view orders
* update status
* cancel orders
* manage fulfillment

---

## Inventory Management

* update stock
* manage availability
* low stock monitoring

---

# Storefront Scope

# Public Pages

```txt
/
├── Home
├── Shop
├── Category Page
├── Product Detail Page
├── Cart
├── Checkout
├── Orders
├── Wishlist
└── Profile
```

---

# Homepage Structure

## Sections

### Hero Banner

* premium gardening visuals
* compost highlights

### Shop By Category

* plants
* compost
* pots

### Featured Products

* bestselling products

### Organic Gardening Section

### Cross-Sell CTA

Promote AfixZ services.

---

# Product Listing Features

* filtering
* sorting
* pagination
* search

---

# Product Detail Features

* image gallery
* pricing
* stock information
* quantity selector
* related products

---

# Cart Features

Separate product cart.

Not shared with services cart.

---

# Checkout Features

## MVP Checkout

* Cash on Delivery only
* shipping address
* phone number
* order notes

---

# Payment Strategy

## Phase 1

COD only.

## Future

* Razorpay
* UPI
* Cards

---

# Inventory Strategy

## Initial Approach

Use:

```txt
stock field inside products collection
```

---

# Inventory Logic

## On Order Placement

```txt
stock -= quantity
```

## On Order Cancellation

```txt
stock += quantity
```

---

# Image Management

Continue using:

* Cloudinary

Used for:

* product images
* category banners
* homepage visuals

---

# Email Notifications

Continue using:

* Resend

Notifications:

* order confirmation
* order shipped
* order delivered
* admin order alerts

---

# APIs

## New APIs Required

```txt
/api/create-product-order
/api/update-product-order
/api/manage-product
/api/manage-inventory
```

---

# Firestore Security Rules

## Public

* read products

## Authenticated Users

* place orders
* view own orders

## Admin

* manage products
* manage inventory
* manage orders

---

# SEO Strategy

Critical for ecommerce growth.

## Product Pages Must Include

* dynamic metadata
* Open Graph tags
* schema markup
* canonical URLs

---

# Frontend Tech Stack

## Framework

Next.js

## Styling

TailwindCSS

## Backend

Firebase

## Deployment

Vercel

---

# Recommended Store Repository Structure

```txt
store-web/
├── app/
├── components/
├── lib/
│   ├── firebase/
│   ├── auth/
│   ├── firestore/
│   └── utils/
├── hooks/
├── types/
├── styles/
├── public/
└── api/
```

---

# Performance Strategy

## Important Goals

* lightweight storefront
* optimized bundles
* fast hydration
* mobile-first performance

---

# Optimization Techniques

* Next.js Server Components
* image optimization
* lazy loading
* route-level splitting
* CDN caching

---

# Cross-Selling Strategy

## Services → Store

Example:

```txt
Need premium compost for your garden?
Shop now on AfixZ Store.
```

---

## Store → Services

Example:

```txt
Need professional garden maintenance?
Book AfixZ Services.
```

---

# Development Phases

# Phase 1 — Store Foundation

## Tasks

* create new Next.js repository
* setup Firebase
* setup authentication
* configure Firestore

---

# Phase 2 — Admin Commerce Integration

## Tasks

* add products module to existing admin
* add categories module
* add inventory management
* add orders management

---

# Phase 3 — Storefront MVP

## Tasks

* homepage
* shop pages
* product detail pages
* cart
* checkout

---

# Phase 4 — Orders System

## Tasks

* order creation
* order tracking
* order status management
* email notifications

---

# Phase 5 — Optimization

## Tasks

* SEO
* analytics
* performance optimization
* caching

---

# Timeline

## Week 1

* store repo setup
* Firebase integration
* database structure

## Week 2

* admin commerce module
* products CRUD

## Week 3

* storefront UI
* product pages
* cart system

## Week 4

* checkout
* orders
* deployment
* optimization

---

# Final Recommended Architecture

```txt
afixz.com
→ Services Platform

store.afixz.com
→ Ecommerce Storefront

Shared:
→ Firebase Auth
→ Firestore
→ Cloudinary
→ Resend
→ Users Collection
→ Existing Admin Dashboard
```

---

# Final Engineering Recommendation

This architecture is preferred because it provides:

* clean domain separation
* lightweight storefront performance
* shared backend infrastructure
* unified authentication
* centralized management
* scalable ecommerce foundation
* minimal operational duplication
