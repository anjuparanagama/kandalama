# Software Requirements Specification (SRS)

**Project:** Kandalama Property Selling Website

**Date:** 2026-02-14

**Version:** 1.0

---

## 1. Purpose

This document describes the features and requirements for a web application that lets people post, browse, search, and manage property ads (houses, land, apartments). It is written in simple English for developers, testers, and business stakeholders.

## 2. Scope

- A public website to list property ads for sale or rent.
- Users can register, login, post ads with images, edit or delete their ads.
- Visitors can search, filter, and view property details.
- Admins can moderate and remove bad listings.

## 3. Overview and Goals

- Make it easy for sellers to create attractive listings with images.
- Make it easy for buyers to find properties using search and filters.
- Keep the site fast, secure, and mobile-friendly.

## 4. User Types

- Guest: can view listings, search and filter, view details.
- Registered User (Buyer/Seller): can post, edit, delete their own ads, and contact sellers.
- Admin: can manage or remove ads, manage categories, and view reports.

## 5. Main Features (Functional Requirements)

Each feature includes a short description, inputs, and expected result.

- User Registration
  - Description: Create account with email and password.
  - Inputs: Email, password, display name, optional phone.
  - Result: New user account; user can log in.

- User Login and Authentication
  - Description: Secure login to access private pages.
  - Inputs: Email and password (or third-party sign-in).
  - Result: User gets access to protected actions like posting an ad.

- Post Property Ad
  - Description: Create a new property listing.
  - Inputs: Title, description, price, property type, district, address, images, contact info.
  - Result: Ad saved in database and shown in listings.

- Edit / Delete Ad
  - Description: Owners can change or remove their ads.
  - Inputs: Updated ad fields or delete command.
  - Result: Ad updated or removed; only owner can do this.

- Browse Listings
  - Description: View list of ads with paging.
  - Inputs: Page number, sort option.
  - Result: List of property cards with summary info.

- Property Detail Page
  - Description: Show full info for a property.
  - Inputs: Click on ad or go to direct link.
  - Result: Full page with images, details, and contact option.

- Search & Filter
  - Description: Find properties by keyword and filters.
  - Inputs: Keyword, district, type, price range.
  - Result: Filtered list of matching ads.

- My Ads Dashboard
  - Description: Seller dashboard to manage their ads.
  - Inputs: Authenticated request.
  - Result: List of the user's ads with edit/delete actions.

- Image Upload
  - Description: Upload multiple images with preview; use Cloudinary for storage.
  - Inputs: Image files.
  - Result: Cloudinary URLs stored and shown in the ad.

- Messages / Contact Seller
  - Description: Send messages or inquiries to sellers.
  - Inputs: Message text, contact details.
  - Result: Message sent or saved and seller notified.

- Admin Moderation
  - Description: Admin can remove or flag ads.
  - Inputs: Moderation actions.
  - Result: Ad removed or flagged; action logged.

- Localization (i18n)
  - Description: Support for English, Sinhala, and Tamil.
  - Inputs: Language selection.
  - Result: UI text changes to chosen language.

## 6. Non-Functional Requirements

- Performance: Listing pages should load quickly; aim <2s on decent connections.
- Scalability: Support thousands of ads; use pagination and efficient DB queries.
- Availability: Aim for 99% uptime using hosted services.
- Security: HTTPS, secure auth, server-side validation, and file checks.
- Privacy: Do not publish user emails; keep minimal personal data.
- Usability: Mobile-first design, simple forms, previews before posting.
- Accessibility: Provide alt text for images, keyboard navigation, readable contrast.

## 7. Technology Stack (Suggested)

- Frontend: Next.js (React) with TypeScript.
- Styling: Tailwind CSS.
- Backend / DB: Supabase (Postgres + Auth) or similar.
- Image Service: Cloudinary for uploads and transformations.
- Hosting: Vercel or Netlify for the frontend; Supabase managed services for DB.
- Testing: Jest, React Testing Library, and Playwright/Cypress for E2E.

## 8. Data Model (Main Entities)

- User
  - id, email, name, phone, role, created_at

- Property (Ad)
  - id, title, description, price, property_type, district, address, images[], owner_id, status, created_at

- Image
  - id, property_id, url, public_id (Cloudinary), order

- Message
  - id, from_user_id, to_user_id, property_id, body, created_at

- Category / Property Type
  - id, name

## 9. API Examples

These are example endpoints; actual implementation may use Supabase RPC or serverless routes.

- GET /api/properties?page=&limit=&filters=  — list properties
- GET /api/properties/:id  — property details
- POST /api/properties  — create property (authenticated)
- PUT /api/properties/:id  — update property (owner only)
- DELETE /api/properties/:id  — delete property (owner only)
- POST /api/uploads  — Cloudinary upload helper or signature
- POST /api/messages  — send message to seller

## 10. Security & Validation

- Authentication: Use Supabase Auth or JWT sessions.
- Authorization: Only owners or admins can edit/delete a listing.
- Input Validation: Validate all fields on server and client.
- File Validation: Limit file types (jpg, png), max size (e.g., 5 MB per image), and image count per ad.
- Rate Limiting: Protect forms from spam and abuse.

## 11. User Interface Notes

- Main pages: Home, Listings, Property Detail, Post Ad, My Ads, Login/Register, Admin Panel.
- Forms: Show clear error messages and a preview before posting.
- Navigation: Top navbar with language selector, login/register, and Post Ad button.

## 12. Typical User Flows

- Guest searches and views a property: use search → open property → contact seller or register.
- Seller posts an ad: login → Post Ad → fill form → upload images → preview → submit.
- Seller edits an ad: login → My Ads → edit → save.
- Admin moderates: login as admin → review reported ad → remove or restore.

## 13. Testing Strategy

- Unit tests for UI components and helpers.
- Integration tests for API endpoints with a test DB.
- End-to-end tests for main user flows.
- Performance checks for listing pages and image load times.

## 14. Deployment & Maintenance

- Use GitHub for source control and CI to run tests.
- Deploy frontend to Vercel or Netlify; set environment variables for Supabase and Cloudinary.
- Rely on Supabase backups and keep DB migrations in `supabase/migrations`.

## 15. Appendix — Project Files of Interest

- `components/` — UI components (cards, navbar, forms).
- `components/ui/` — shared UI primitives.
- `lib/cloudinary.ts` — Cloudinary helper.
- `hooks/useCloudinaryUpload.ts` — image upload hook.
- `lib/supabase.ts` — Supabase helper.
- `app/post-ad/`, `app/my-ads/`, `app/properties/` — main pages.
- `supabase/migrations/20260209150838_create_properties_schema.sql` — DB schema migration.

## 16. How to use this document

- Developers: Use this SRS to guide implementation, tests, and deployment.
- Reviewers: Check the features and acceptance criteria before release.
- Stakeholders: Confirm priorities and required features.

---

If you want, I can also:
- Add a more detailed API spec (request/response examples).
- Create a database schema SQL file or ER diagram.
- Add sample UI wireframes or component lists.
