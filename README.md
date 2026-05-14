# Rangsit Social
### Modern Campus Social Media Platform

A production-style university social media web app built with Next.js 15, React 19, MySQL, Tailwind CSS, and JWT auth.

## Stack
- Next.js 15 (App Router)
- React 19
- MySQL + mysql2
- Tailwind CSS
- JWT auth + bcryptjs

## Features
- Auth + onboarding flow
- Feed, posts, comments, likes, follows
- Cloudinary media uploads for profile photos and post media

## Local Setup
1. Install dependencies
2. Create `.env.local` based on `.env.local.example`
3. Create database and run `schema.sql`, then `seed.sql`
4. Start the dev server

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`

## Notes
- Profile onboarding is required before creating posts or interacting.
- Media uploads use multipart/form-data and store Cloudinary URLs in MySQL.
