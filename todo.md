# 🗺️ Implementation Plan: Small Mountain Studio

## 🛠️ Phase 1: Foundation & Backend Core
- [x] Refactoring base folders (sudah ada pondasi awal).
- [x] Backend: Setup Database Connection (Sequelize) dengan `sync({ force: true })`.
- [x] Backend: Setup Multer dengan **Smart Deduplication (SHA-256 Hashing)** untuk `/uploads`.
- [x] Backend: Base API Response handler & Error middleware.

## 🔐 Phase 2: Auth & Admin System
- [x] Backend: Auth API (Login, Refresh Token via HttpOnly Cookie).
- [x] Frontend: Setup Auth Store (Zustand) & Axios Interceptor.
- [x] Frontend: Login Page (Premium aesthetic).
- [x] Frontend: Protected Route logic.

## 📝 Phase 3: Content Modules (The "Meat")
- [x] **Game Module**: API & Form Admin (Title, Desc, Progress Bars, Image).
- [x] **Blog Module**: API & Form Admin (Title, Content Markdown, Thumbnail).
- [x] **Feedback Module**: Public Form & Admin View list.
- [x] **Merch Module**: Simple info manager (Link Shopee).

## 🎨 Phase 4: Frontend Landing & UI
- [x] Home Page: Bento Grid layout, Hero section.
- [x] Home Page: Integrating Game Showcase & Devlog list.
- [x] Home Page: Integrating Merch & Feedback form.
- [x] **Bilingual UI**: Setup i18n logic (EN/ID toggle).

## ✨ Phase 5: Polish & Visual Excellence
- [x] Adding Framer Motion animations (Smooth transitions).
- [x] Adding OG Tags logic for better social sharing.
- [x] Final UI Review (Glassmorphism & Bento consistency).
- [x] Frontend: Global Toast Notification (Zustand) untuk visual feedback Admin.
