# Kubernetes Manifests

This folder contains environment-specific Kubernetes manifests.

## Structure
- `dev/`: resources for namespace `eshop-dev`
- `prod/`: resources for namespace `eshop-prod`

## What Each Environment Contains
- Backend deployment and service
- Frontend deployment and service
- Postgres deployment, service, PVC, and init ConfigMap
- Backend and Postgres secrets/config
- Ingress routing
- `kustomization.yaml`

## Routing
- Dev host: `dev.sairen.lt`
- Prod host: `sairen.lt`
- Path routing in each env:
  - `/` -> frontend service
  - `/api` -> backend service

## Apply Manually (if needed)
- Dev:
  - `kubectl apply -k k8s/dev`
- Prod:
  - `kubectl apply -k k8s/prod`

In normal flow, ArgoCD applies these manifests from git.
