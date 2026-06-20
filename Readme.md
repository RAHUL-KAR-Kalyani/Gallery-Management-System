# Gallery App

Production-ready single-page application (React + Vite) with an Express + MongoDB backend for image & album management, user auth, admin analytics, and Cloudinary media storage.

## Tech stack
- Frontend: React, Vite, Redux
  - Key pages/hooks: [`Dashboard`](client/src/pages/Dashboard.jsx), [`AdminDashboard`](client/src/pages/AdminDashboard.jsx), [`useUserDashboard`](client/src/hooks/useUserDashboard.jsx), [`useAdminDashboard`](client/src/hooks/useAdminDashboard.jsx), [`useGetAllImages`](client/src/hooks/useGetAllImages.jsx), [`useGetAllAlbum`](client/src/hooks/useGetAllAlbum.jsx), [`useGetSharedAlbum`](client/src/hooks/useGetSharedAlbum.jsx)
- Backend: Node.js, Express, Mongoose
  - Entrypoint: [server/server.js](server/server.js)
  - Controllers: [`user.controller`](server/controllers/user.controller.js), [`album.controller`](server/controllers/album.controller.js), [`image.controller`](server/controllers/image.controller.js), [`admin.controller`](server/controllers/admin.controller.js)
  - Middleware & config: [`isAuth`](server/middleware/authMiddleware.js), [`upload`](server/middleware/multer.js), [`imagesizeMiddleware`](server/middleware/imagesizeMiddleware.js), [`validateMiddleware`](server/middleware/validateMiddleware.js), [`db config`](server/config/db.js), [`cloudinary config`](server/config/cloudinary.js)

## Repository layout
- client/ — React app (Vite)
  - src/pages, src/hooks, src/components, src/redux
  - [client/package.json](client/package.json)
- server/ — Express API
  - controllers/, services/, models/, middleware/, config/
  - [server/package.json](server/package.json)
- Root: project README and misc files

## Environment variables
- Server (.env)
  - PORT
  - FRONTEND_URL
  - MONGO_URI — MongoDB connection string
  - JWT_SECRET — JWT signing key
  - CLOUDINARY_CLOUD_NAME,
  - CLOUDINARY_API_KEY,
  - CLOUDINARY_API_SECRET — Cloudinary credentials
  - CLOUDINARY_URL

- Client (.env)
  - VITE_USER_ENDPOINT — e.g. http://api.example.com/user
  - VITE_ADMIN_ENDPOINT — e.g. http://api.example.com/admin
  - VITE_IMAGE_ENDPOINT — e.g. http://api.example.com/image
  - VITE_ALBUM_ENDPOINT — e.g. http://api.example.com/album



## Install (development)
1. Install root tooling (optional)
2. Server
   - cd server
   - npm install
3. Client
   - cd client
   - npm install

(See [server/package.json](server/package.json) and [client/package.json](client/package.json))

## Run (development)
- Start server (with nodemon/PM2 in dev):
  - cd server && npm run dev || node server.js
- Start client:
  - cd client && npm run dev

API runs at the configured PORT; front-end runs via Vite dev server.

## Build & Deploy (production)
1. Build client:
   - cd client && npm run build
2. Serve static files:
   - Option A: Deploy static output (client/dist) to CDN/Static host (Netlify, Vercel, S3+CloudFront).
   - Option B: Serve from Express: copy `client/dist` into server public folder and configure Express static middleware.
3. Server: run with a process manager (PM2/systemd) behind a reverse proxy (Nginx). Example:
   - NODE_ENV=production PORT=80 pm2 start server.js --name gallery-app
4. HTTPS & cookies:
   - Use TLS termination (Nginx or managed host). Set cookie `secure: true` in production and `sameSite` as needed.
   - Ensure CORS settings allow your client origin.

## Security & Production considerations
- JWT secrets & Cloudinary keys must be stored in environment variables (not in repo).
- Use HTTPS and set cookie flags: `httpOnly`, `secure: true`, `sameSite: "none"` for cross-site scenarios.
- Rate-limit endpoints and enable CORS with an allowlist.
- Validate and sanitize inputs (see [`validateMiddleware`](server/middleware/validateMiddleware.js)).
- Limit upload sizes (see [`multer` configuration](server/middleware/multer.js) and [`imagesizeMiddleware`](server/middleware/imagesizeMiddleware.js)).

## Logging & Monitoring
- Add structured logging (winston/pino).
- Add health endpoints and monitor DB connection timeouts ([server/config/db.js](server/config/db.js)).
- Capture errors and performance traces in production (Sentry, NewRelic).

## Testing
- Add unit tests for services and integration tests for controllers.
- Use Jest + Supertest for API tests; Cypress / Playwright for E2E.

## Important code references
- Server entry: [server/server.js](server/server.js)
- DB config: [server/config/db.js](server/config/db.js)
- Cloudinary: [server/config/cloudinary.js](server/config/cloudinary.js)
- Auth middleware: [`isAuth`](server/middleware/authMiddleware.js)
- File upload: [`upload`](server/middleware/multer.js), [`imagesizeMiddleware`](server/middleware/imagesizeMiddleware.js)
- User controller: [`registerController`, `loginController`, `profileController`, `getUserDashboardStats`](server/controllers/user.controller.js)
- Album controller: [`createAlbum`, `getSharedAlbum`](server/controllers/album.controller.js)
- Image controller: [`uploadImage`, `getAllImages`, `getImagesByUserId`](server/controllers/image.controller.js)
- Client main pages/hooks: [client/src/pages/Dashboard.jsx](client/src/pages/Dashboard.jsx), [client/src/pages/AdminDashboard.jsx](client/src/pages/AdminDashboard.jsx), [client/src/hooks/useGetAllImages.jsx](client/src/hooks/useGetAllImages.jsx)

## Contributing
- Follow branch-per-feature workflow.
- Write tests for new features.
- Validate env requirements in CI before deploy.

## License
- Add your project license here.
