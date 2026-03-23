# Sairen Atelier E-Shop

A simple e-commerce application with Next.js frontend, Node.js backend, and PostgreSQL database.

## Structure
- `backend/`: Express.js API server
- `frontend/`: Next.js web app
- `k8s/`: Kubernetes manifests

## Development
1. Build and push Docker images:
   - `dev` branch publishes `:dev` images
    - `main` branch publishes `:latest` images
    - Backend image: `ghcr.io/<owner>/sairen-atelier/backend:<tag>`
    - Frontend image: `ghcr.io/<owner>/sairen-atelier/frontend:<tag>`
   - Push to registry

2. Deploy via ArgoCD from infra repo.

## Kubernetes Environments
- `k8s/dev` deploys to namespace `eshop-dev` and uses `dev.sairen.lt`.
- `k8s/prod` deploys to namespace `eshop-prod` and uses `sairen.lt`.
- Both environments expose:
   - `/` -> frontend service
   - `/api` -> backend service

## Secrets
- Environment-specific credentials are defined in:
   - `k8s/dev/backend-secret.yaml`
   - `k8s/dev/postgres-secret.yaml`
   - `k8s/prod/backend-secret.yaml`
   - `k8s/prod/postgres-secret.yaml`
- Replace placeholder values before deploying to production.
- For now, secrets are managed as regular Kubernetes `Secret` manifests in this repo.
- Rotate credentials immediately if these files are ever exposed.

## Branch to Environment Mapping
- `dev` branch builds and pushes `:dev` images.
- `main` branch builds and pushes `:latest` images.
- Infra Argo apps should track:
   - `eshop-dev` -> `dev`
   - `eshop-prod` -> `main`

## TODO
- Add authentication
- Product management
- Payment integration