# 🗺️ Implementation Plan: Small Mountain Studio

## 🛠️ Phase 1: Foundation & Backend Core
- [x] Refactoring base folders (sudah ada pondasi awal).
- [x] Backend: Setup Database Connection (Sequelize) dengan `sync({ force: true })`.
- [x] Backend: Setup Multer untuk `/uploads` lokal.
- [x] Backend: Base API Response handler & Error middleware.

## 🔐 Phase 2: Auth & Admin System
- [ ] Backend: Auth API (Login, Refresh Token via HttpOnly Cookie).
- [ ] Frontend: Setup Auth Store (Zustand) & Axios Interceptor.
- [ ] Frontend: Login Page (Premium aesthetic).
- [ ] Frontend: Protected Route logic.

## 📝 Phase 3: Content Modules (The "Meat")
- [ ] **Game Module**: API & Form Admin (Title, Desc, Progress Bars, Image).
- [ ] **Blog Module**: API & Form Admin (Title, Content Markdown, Thumbnail).
- [ ] **Feedback Module**: Public Form & Admin View list.
- [ ] **Merch Module**: Simple info manager (Link Shopee).

## 🎨 Phase 4: Frontend Landing & UI
- [ ] Home Page: Bento Grid layout, Hero section.
- [ ] Home Page: Integrating Game Showcase & Devlog list.
- [ ] Home Page: Integrating Merch & Feedback form.
- [ ] **Bilingual UI**: Setup i18n logic (EN/ID toggle).

## ✨ Phase 5: Polish & Visual Excellence
- [ ] Adding Framer Motion animations (Smooth transitions).
- [ ] Adding OG Tags logic for better social sharing.
- [ ] Final UI Review (Glassmorphism & Bento consistency).
