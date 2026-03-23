# Sairen Atelier E-Shop

A simple e-commerce application built with Next.js frontend, Node.js backend, and PostgreSQL.

## Repository Layout
- `backend/`: Express API, database access, and product endpoints.
- `frontend/`: Next.js web application.
- `k8s/`: Kubernetes manifests for `dev` and `prod` environments.
- `.github/workflows/`: CI image build and push pipeline.

## Environment Model
- `dev` branch:
  - Builds and pushes immutable images tagged as `dev-<short-sha>`.
  - Deployed by ArgoCD app `eshop-dev` to namespace `eshop-dev`.
  - Public URL: `https://dev.sairen.lt`.
- `main` branch:
  - Builds and pushes immutable images tagged as `main-<short-sha>`.
  - Deployed by ArgoCD app `eshop-prod` to namespace `eshop-prod`.
  - Public URL: `https://sairen.lt`.

## Deployment Flow
1. Push changes to `dev`.
2. GitHub Actions workflow in `.github/workflows/build.yml` builds and pushes immutable images.
3. Workflow updates `k8s/dev/*deployment.yaml` with the new image tags and commits back to `dev`.
4. ArgoCD syncs `k8s/dev` and deploys to `dev.sairen.lt`.
4. After validation, merge `dev` into `main`.
5. GitHub Actions builds and pushes immutable images.
6. Workflow updates `k8s/prod/*deployment.yaml` with the new image tags and commits back to `main`.
7. ArgoCD syncs `k8s/prod` and deploys to `sairen.lt`.

## Secrets
- Current approach: plain Kubernetes Secret manifests in git.
- Secret files:
  - `k8s/dev/backend-secret.yaml`
  - `k8s/dev/postgres-secret.yaml`
  - `k8s/prod/backend-secret.yaml`
  - `k8s/prod/postgres-secret.yaml`
- Replace placeholder values before production usage.
- Rotate credentials if these files are exposed.

## Payment Setup (Stripe)
- Backend endpoint `POST /api/checkout/create-session` creates Stripe Checkout sessions.
- Required secret per environment:
  - `STRIPE_SECRET_KEY` in `k8s/dev/backend-secret.yaml`
  - `STRIPE_SECRET_KEY` in `k8s/prod/backend-secret.yaml`
- Required base URLs:
  - `CHECKOUT_BASE_URL=https://dev.sairen.lt` in `k8s/dev/backend-configmap.yaml`
  - `CHECKOUT_BASE_URL=https://sairen.lt` in `k8s/prod/backend-configmap.yaml`
- Frontend cart uses `/api/checkout/create-session` and redirects to Stripe.

## Quick Verification After Deploy
1. Confirm workflow success in GitHub Actions.
2. Confirm Argo app `Synced` and `Healthy`.
3. Open app URL and test API endpoint:
   - Dev: `https://dev.sairen.lt/api/products`
   - Prod: `https://sairen.lt/api/products`

## Future Improvements
- Move secrets to a secure solution (for example External Secrets, SOPS, or Sealed Secrets).
- Add authentication.
- Add product management UI and payment integration.