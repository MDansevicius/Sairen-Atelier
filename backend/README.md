# Backend

Node.js + Express API for Sairen Atelier.

## Responsibilities
- Serve product APIs under `/api`.
- Connect to PostgreSQL using environment variables.

## Run Locally
1. Install dependencies:
   - `npm install`
2. Create `.env` (example values):
   - `PORT=3001`
   - `DB_HOST=localhost`
   - `DB_PORT=5432`
   - `DB_NAME=eshop`
   - `DB_USER=eshop_user`
   - `DB_PASS=your_password`
3. Start server:
   - `npm run dev`

## Main Endpoints
- `GET /api/products`
- `POST /api/products`

## Notes
- In Kubernetes, backend environment is injected from ConfigMap and Secret manifests.
