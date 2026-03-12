# Project TODO — Ordered by Ease of Implementation

> Items ordered from quickest wins → most complex infrastructure work.
> Each item includes what already exists to build on.

---

## ✅ TIER 1 — Quick Wins (Few hours each)

### 1. AI "Generate Description" Button in ProductForm
- **What exists:** OpenAI connected on backend, `/api/v1/ai/generate-description` endpoint ready
- **What to do:** Add a "✨ Generate with AI" button next to the description field in `ProductForm.jsx` that calls the endpoint and fills the textarea
- **Files:** `frontend/src/pages/ProductForm.jsx`, `frontend/src/services/aiService.js`

---

### 2. WhatsApp Share + QR Code Modal for Catalogs
- **What exists:** `qrcode` npm package installed, `PublishModal.jsx` exists, catalog has a public URL
- **What to do:** Add a "Share" button → modal with QR image + a `wa.me/?text=` deep-link button
- **Files:** `frontend/src/pages/vendor/catalogues/PublishModal.jsx`, `Backend/src/controllers/catalogController.js`

---

### 3. Review & Star Rating UI on ProductDetail
- **What exists:** `Review` model, `reviewController.js`, `reviewRoutes.js` all built and wired
- **What to do:** Add a star-rating form + review list to `ProductDetail.jsx`, call existing endpoints
- **Files:** `frontend/src/pages/ProductDetail.jsx`, `frontend/src/services/` (add `reviewService.js`)

---

### 4. Twilio SMS on Order Status Changes
- **What exists:** `twilio` installed, `notificationService.js` exists, order status update endpoint exists
- **What to do:** Add a `sendSMS()` call inside `orderController.updateOrderStatus()` when status changes to `shipped` / `delivered`
- **Files:** `Backend/src/controllers/orderController.js`, `Backend/src/services/notificationService.js`

---

### 5. GDPR Cookie Consent Banner
- **What exists:** `CookiePolicyPage.jsx` exists, `globals.css` is in place
- **What to do:** Create a `CookieBanner.jsx` component, mount it in `App.jsx`, store preference in localStorage, gate analytics on consent
- **Files:** `frontend/src/App.jsx`, new `frontend/src/components/common/CookieBanner.jsx`

---

### 6. Catalog Password Protection & Expiry
- **What exists:** `Catalog` model, `catalogController.js`, `PublishModal.jsx`
- **What to do:** Add `password` + `expiresAt` fields to Catalog schema, add inputs in PublishModal, validate on `getCatalogPublic` endpoint
- **Files:** `Backend/src/models/Catalog.js`, `Backend/src/controllers/catalogController.js`, `frontend/src/pages/vendor/catalogues/PublishModal.jsx`

---

### 7. Customer Bulk Group Assignment UI
- **What exists:** `group` field on Customer model (regular/vip/wholesale/new), Customers.jsx rewritten
- **What to do:** Add a "Change group" option to the bulk-select action bar in `Customers.jsx`
- **Files:** `frontend/src/pages/Customers.jsx`, `Backend/src/controllers/customerController.js`

---

### 8. Audit Log Viewer (Super Admin)
- **What exists:** `AuditLog` model fully defined, logs being written throughout the app
- **What to do:** Create a simple table page `/admin/audit-logs` that GETs logs with filters (user, action, date)
- **Files:** New `frontend/src/pages/admin/AuditLogs.jsx`, `Backend/src/routes/` (add admin route)

---

## 🟠 TIER 2 — Medium Effort (1–2 days each)

### 9. Product Variants (Size / Color / Weight)
- **What exists:** `attributes: Map` on Product schema, ProductForm.jsx UI exists
- **What to do:** Add `variants: [{ name, options: [{value, price, stock, sku}] }]` to Product schema + dynamic variant table UI in ProductForm + variant selection on ProductDetail
- **Files:** `Backend/src/models/Product.js`, `frontend/src/pages/ProductForm.jsx`, `frontend/src/pages/ProductDetail.jsx`

---

### 10. CSV / Excel Bulk Product Import (UI completion)
- **What exists:** `csv-parser` installed, `BulkUploadModal.jsx` exists, backend may have a route stub
- **What to do:** Wire full flow: file upload → parse preview table → confirm → POST to `/api/v1/products/bulk` → show results. Add `xlsx` package for Excel support
- **Files:** `frontend/src/components/products/BulkUploadModal.jsx`, `Backend/src/controllers/productController.js`

---

### 11. AI Chatbot Widget (Customer-facing)
- **What exists:** OpenAI connected, `aiService.js` on backend has chat infrastructure
- **What to do:** Build a floating `<ChatWidget />` component for Store/ProductDetail/CatalogPublic pages. Send user messages to a `/api/v1/ai/chat` endpoint, stream responses
- **Files:** New `frontend/src/components/common/ChatWidget.jsx`, `Backend/src/controllers/aiController.js`, `Backend/src/routes/aiRoutes.js`

---

### 12. Loyalty Points System
- **What exists:** User model, Order model, checkout flow
- **What to do:** Add `loyaltyPoints: Number` to User schema. Award points (e.g. 1 pt per ₹10) on order delivery. Add "Redeem points" option at Checkout. Show balance in MyAccount
- **Files:** `Backend/src/models/User.js`, `Backend/src/controllers/orderController.js`, `frontend/src/pages/Checkout.jsx`, `frontend/src/pages/MyAccount.jsx`

---

### 13. Abandoned Cart Recovery
- **What exists:** `CartContext.jsx` (client-side), `nodemailer` configured, User model with email
- **What to do:** Persist cart to DB on item add (new `Cart` model or field on User). Add a cron job (`node-cron`) that emails users with items in cart older than 2 hours
- **Files:** New `Backend/src/models/Cart.js`, `Backend/src/services/notificationService.js`, new cron job file

---

### 14. Subscription Billing Flow (Frontend)
- **What exists:** `Subscription` model fully defined (plans, limits, billing cycle), `PricingPage.jsx` exists, Razorpay integrated
- **What to do:** Wire PricingPage "Get Started" → Razorpay checkout → activate plan in DB → enforce limits (product count, catalog count) via middleware
- **Files:** `frontend/src/pages/PricingPage.jsx`, `Backend/src/models/Subscription.js`, `Backend/src/middleware/` (add `checkPlanLimits.js`)

---

### 15. Public API Documentation (Swagger)
- **What exists:** All routes well-defined with JSDoc-style comments
- **What to do:** Add `swagger-jsdoc` + `swagger-ui-express` to backend, annotate key routes, serve docs at `/api/docs`
- **Files:** `Backend/src/app.js`, `Backend/package.json`

---

### 16. Multi-Location Inventory
- **What exists:** `Inventory` model, `inventoryController.js`
- **What to do:** Add `locations: [{ name: String, stock: Number }]` to Inventory schema. Update UI to show per-location stock, allow stock transfers between locations
- **Files:** `Backend/src/models/Inventory.js`, `frontend/src/pages/Inventory.jsx`

---

### 17. Batch / Expiry Tracking
- **What exists:** Inventory model, Inventory page
- **What to do:** Add `batchNumber`, `expiryDate`, `manufactureDate` to Inventory schema. Show expiry warnings (< 30 days) as badges in the inventory table
- **Files:** `Backend/src/models/Inventory.js`, `frontend/src/pages/Inventory.jsx`

---

## 🔴 TIER 3 — Significant Effort (Multiple days each)

### 18. Super Admin Panel
- **What exists:** `super_admin` role in RBAC, `Tenant` model, `AuditLog` model, `Subscription` model
- **What to do:** Build `/admin/*` route group with pages: Tenant List, Vendor Onboarding, Subscription Manager, Global Stats, Audit Log Viewer, Support Tickets
- **Files:** New `frontend/src/pages/admin/` folder, new backend admin routes

---

### 19. Stripe + PayPal Integration
- **What exists:** Razorpay fully integrated, payment controller structure ready
- **What to do:** Add `stripe` npm package + `/payments/stripe/create` + webhook endpoint. Add PayPal SDK. Add payment method selector in `Checkout.jsx`
- **Files:** `Backend/src/controllers/paymentController.js`, `frontend/src/pages/Checkout.jsx`

---

### 20. Multi-Language Product Support (i18n)
- **What exists:** Product model (descriptions in English only), no i18n library installed
- **What to do:** Add `translations: Map` to Product schema for name/description per locale. Install `i18next` + `react-i18next`. Add language selector in vendor settings and store front
- **Files:** `Backend/src/models/Product.js`, `frontend/package.json`, new `frontend/src/i18n/` folder

---

### 21. Multi-Currency Support
- **What exists:** `currency: String` on Subscription model only, prices all in INR
- **What to do:** Add currency field to Tenant settings. Integrate exchange rate API (e.g. `exchangerate-api.com`). Convert prices at display time using tenant's default currency
- **Files:** `Backend/src/models/Tenant.js`, `frontend/src/utils/formatters.js`, new currency context

---

### 22. Meta / Instagram Product Feed Sync
- **What exists:** Product model with images, category, price, stock
- **What to do:** Add `/api/v1/products/feed.json` endpoint that outputs Meta-compatible product catalog JSON. Add Facebook Pixel script to Store/ProductDetail pages
- **Files:** `Backend/src/controllers/productController.js`, `frontend/src/pages/Store.jsx`

---

### 23. Screenshot / Watermark Protection on Catalog
- **What exists:** `CatalogPublic.jsx`, product images served via Cloudinary
- **What to do:** Add a Cloudinary text-overlay watermark transformation on protected catalog images. Add CSS `user-select: none` + `pointer-events` overlay on the catalog view when password-protected
- **Files:** `frontend/src/pages/CatalogPublic.jsx`, `Backend/src/controllers/catalogController.js`

---

## ⚫ TIER 4 — Infrastructure / Long-term

### 24. Redis Caching
- **What exists:** Nothing — no Redis in dependencies
- **What to do:** Install `ioredis`, cache dashboard stats responses (5 min TTL), cache public catalog views (invalidate on update)
- **Files:** `Backend/package.json`, `Backend/src/config/` (new `redis.js`), analytics + catalog controllers

---

### 25. Background Job Queue (BullMQ)
- **What exists:** Long-running jobs (CSV import, email campaigns) run synchronously on request thread
- **What to do:** Install `bullmq` + Redis. Move CSV import, email campaigns, and invoice generation to background workers
- **Files:** `Backend/package.json`, new `Backend/src/jobs/` folder (workers), update relevant controllers

---

### 26. Elasticsearch Full-text Search
- **What exists:** MongoDB text index on Product (name, description, sku, brand)
- **What to do:** Install `@elastic/elasticsearch`, sync products to ES on create/update, replace MongoDB text search with ES queries for better relevance + filtering
- **Files:** `Backend/src/controllers/productController.js`, new `Backend/src/config/elasticsearch.js`

---

### 27. React Native Mobile App
- **What exists:** REST API fully built, auth system complete
- **What to do:** Initialize Expo project, build shared API layer, implement: Login, Store browse, Product detail, Cart, Orders, Vendor Dashboard (basic)
- **Files:** New `mobile/` folder at project root

---

*Last updated: March 2026*
