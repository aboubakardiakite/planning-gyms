# Guide de Déploiement Kubernetes - Workout Planner API

## 1. Prérequis
- Kubectl installé et configuré
- Accès à un cluster Kubernetes
- Docker Hub configuré

## 2. Structure des Fichiers
```bash
kubernetes/
├── configmap.yml         # Variables d'environnement
├── deployment.yml        # Configuration du déploiement
├── service.yml          # Exposition des services
├── ingress.yml         # Routage externe
├── mongodb.yml         # Déploiement MongoDB
└── network-policy.yml  # Règles de sécurité réseau
```

## 3. Déploiement Initial

### Création du Namespace
```bash
# Créer un namespace dédié
kubectl create namespace workout-planner-api
```

### Déploiement des Composants
```bash
# 1. ConfigMaps
kubectl apply -f kubernetes/workout-planner-config.yml
kubectl apply -f kubernetes/configmap.yml

# 2. Volumes persistants
kubectl apply -f kubernetes/mongodb-pvc.yml
kubectl apply -f kubernetes/backup-pvc.yml

# 3. MongoDB
kubectl apply -f kubernetes/mongodb-deployment.yml
kubectl apply -f kubernetes/mongodb-service.yml

# 4. Application principale
kubectl apply -f kubernetes/deployment.yml
kubectl apply -f kubernetes/service.yml

# 5. Ingress
kubectl apply -f kubernetes/ingress.yml

# 6. Backup CronJob
kubectl apply -f kubernetes/mongodb-backup-cronjob.yml

# 7. Network Policy
kubectl apply -f kubernetes/network-policy.yml
```

## 4. Commandes de Gestion

### Vérification du Déploiement
```bash
# Vérifier les pods
kubectl get pods -n workout-planner-api

# Vérifier les services
kubectl get services -n workout-planner-api

# Vérifier l'ingress
kubectl get ingress -n workout-planner-api
```

### Logs et Debug
```bash
# Voir les logs d'un pod
kubectl logs -f <nom-du-pod> -n workout-planner-api

# Accéder à un pod
kubectl exec -it <nom-du-pod> -n workout-planner-api -- /bin/sh

# Voir les détails d'un pod
kubectl describe pod <nom-du-pod> -n workout-planner-api
```

### Mise à Jour de l'Application
```bash
# Mettre à jour l'image
kubectl set image deployment/workout-planner-api \
  workout-planner-api=aboubakar940/workout-planner:latest -n workout-planner-api

# Vérifier le déploiement
kubectl rollout status deployment/workout-planner-api -n workout-planner-api
```

### Port-Forward pour Test Local
```bash
# Accéder à l'API localement
kubectl port-forward -n workout-planner-api svc/api 3000:3000

```

## 5. Surveillance

### Monitoring
```bash
# Utilisation des ressources
kubectl top pods -n workout-planner-api

# Événements du namespace
kubectl get events -n workout-planner-api
```

### État des Services
```bash
# Vérifier les endpoints
kubectl get endpoints -n workout-planner-api

# Statut des services
kubectl get services -n workout-planner-api
```

## 6. Maintenance

### Scaling
```bash
# Ajuster le nombre de réplicas
kubectl scale deployment workout-planner-api --replicas=3 -n workout-planner-api
```

### Nettoyage
```bash
# Supprimer le déploiement
kubectl delete -f kubernetes/deployment.yml -n workout-planner-api

# Supprimer tout le namespace
kubectl delete namespace workout-planner-api
```

## 7. Bonnes Pratiques
- Toujours spécifier le namespace dans les commandes
- Vérifier les logs après chaque déploiement
- Utiliser des tags spécifiques pour les images
- Sauvegarder régulièrement la base de données
- Surveiller l'utilisation des ressources

## 8. Troubleshooting

### Problèmes Courants
1. Pod en CrashLoopBackOff :
```bash
kubectl describe pod <pod-name> -n workout-planner-api
kubectl logs <pod-name> -n workout-planner-api --previous
```

2. Service inaccessible :
```bash
kubectl get endpoints -n workout-planner-api
kubectl describe service api -n workout-planner-api
```

3. Problèmes de ressources :
```bash
kubectl top pods -n workout-planner-api
kubectl describe pod <pod-name> -n workout-planner-api
```


# commande test

```bash

curl -X POST http://localhost:30000/use
rs \                                            
  -H "Content-Type: application/json" \
  -d '{                             
    "username": "john1doe",
    "email": "john1.doe@example.com",
    "fitnessLevel": "INTERMEDIATE"
  }'

```

```bash
kubectl port-forward -n portainer svc/portainer 9000:9000
```