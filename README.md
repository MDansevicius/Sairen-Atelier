# Sairen Atelier E-Shop

A simple e-commerce application with Next.js frontend, Node.js backend, and PostgreSQL database.

## Structure
- `backend/`: Express.js API server
- `frontend/`: Next.js web app
- `k8s/`: Kubernetes manifests

## Development
1. Build and push Docker images:
   - Backend: `docker build -t mdansevicius/sairen-atelier-backend:latest backend/`
   - Frontend: `docker build -t mdansevicius/sairen-atelier-frontend:latest frontend/`
   - Push to registry

2. Deploy via ArgoCD from infra repo.

## TODO
- Add authentication
- Product management
- Payment integration