# Frontend

Next.js web client for Sairen Atelier.

## Responsibilities
- Render storefront UI.
- Call backend through ingress path `/api`.

## Run Locally
1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Open:
   - `http://localhost:3000`

## Build
- `npm run build`
- `npm run start`

## Notes
- Bootstrap styles are loaded in `pages/_app.js`.
- Production build runs during Docker image build in CI.
