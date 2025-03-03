# Guide de déploiement Kubernetes

Ce document explique la configuration et le déploiement de l'application workout-planner-api sur Kubernetes.

## Structure des fichiers 

```bash
kubernetes/
├── deployment.yml     # Définit comment déployer l'application
├── service.yml       # Configure l'accès à l'application
├── ingress.yml      # Gère le routage externe
└── network-policy.yml # Définit les règles de sécurité réseau
```

## Ordre de déploiement recommandé

```bash
# Configure Portainer pour la gestion visuelle des conteneurs
kubectl apply -f kubernetes/portainer-config.yml

# Déploie l'application principale
kubectl apply -f kubernetes/deployment.yml

# Expose l'application via un service
kubectl apply -f kubernetes/service.yml

# Configure les règles de sécurité réseau
kubectl apply -f kubernetes/network-policy.yml

# Configure le routage externe
kubectl apply -f kubernetes/ingress.yml
```

## Configuration de MongoDB

```bash
# 1. Créer le volume persistant pour MongoDB
# Cela garantit que les données persistent même si le pod est redémarré
kubectl apply -f kubernetes/mongodb-pvc.yml

# 2. Créer le service MongoDB
# Permet aux autres pods de communiquer avec MongoDB
kubectl apply -f kubernetes/mongodb-service.yml

# 3. Déployer MongoDB
# Lance l'instance MongoDB avec la configuration spécifiée
kubectl apply -f kubernetes/mongodb-deployment.yml

# 4. Configurer l'application
# Met à jour les variables d'environnement de l'application
kubectl apply -f kubernetes/workout-planner-config.yml

# 5. Redéployer l'application
# Redémarre l'application avec la nouvelle configuration
kubectl apply -f kubernetes/deployment.yml

# Vérifications :

# Affiche tous les services dans le namespace
kubectl get svc -n workout-planner-api

# Liste les pods MongoDB spécifiquement
kubectl get pods -n workout-planner-api -l app=mongodb

# Vérifie l'état du stockage persistant
kubectl get pvc -n workout-planner-api

# Affiche la capacité de stockage utilisée
kubectl get pvc mongodb-pvc -n workout-planner-api -o jsonpath='{.status.capacity.storage}'
```

## Configuration des Sauvegardes

```bash
# Crée un volume persistant dédié aux sauvegardes
kubectl apply -f kubernetes/backup-pvc.yml

# Configure une tâche automatique de sauvegarde
kubectl apply -f kubernetes/mongodb-backup-cronjob.yml
```

## Mise en place du Monitoring

```bash
# Configure les règles de surveillance Prometheus
kubectl apply -f kubernetes/prometheus-configmap.yml

# Déploie Prometheus pour la collecte de métriques
kubectl apply -f kubernetes/prometheus-deployment.yml
```

## Commandes de Vérification

```bash
# Vérifie l'état du stockage persistant
kubectl get pvc -n workout-planner-api

# Affiche les tâches de sauvegarde programmées
kubectl get cronjobs -n workout-planner-api

# Liste les pods Prometheus pour le monitoring
kubectl get pods -l app=prometheus -n workout-planner-api
```

## Commandes de Debug

```bash
# Affiche les logs détaillés d'un pod
kubectl logs <nom-du-pod>

# Permet d'accéder à un shell dans le pod
kubectl exec -it <nom-du-pod> -- /bin/sh

# Supprime et recrée automatiquement un pod
kubectl delete pod <nom-du-pod>

# Affiche les détails et les événements d'un pod
kubectl describe pod <nom-du-pod>

# Surveille l'utilisation des ressources
kubectl top pods
```

## Commandes de Maintenance

```bash
# Met à jour l'image de l'application
kubectl set image deployment/workout-planner-api \
  workout-planner-api=aboubakar940/workout-planner:latest

# Vérifie le statut de la mise à jour
kubectl rollout status deployment/workout-planner-api

# Ajuste le nombre de réplicas
kubectl scale deployment workout-planner-api --replicas=3
```

## Notes Importantes

- Toujours vérifier les logs après un déploiement
- Faire des sauvegardes avant les mises à jour majeures
- Surveiller régulièrement l'utilisation des ressources
- Tester les mises à jour dans un environnement de staging

## 2. Commandes Essentielles

### Vérification du Déploiement

```bash
# Vérifier les pods
kubectl get pods
# Résultat attendu :
# NAME                                   READY   STATUS    RESTARTS   AGE
# workout-planner-api-xxxxxx-yyyy        1/1     Running   0          1m

# Vérifier le service
kubectl get services
# Résultat attendu :
# NAME                 TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
# workout-planner-api  NodePort   10.xx.xx.xx    <none>        80:30000/TCP   1m
```

### Gestion des Pods

```bash
# Voir les logs d'un pod
kubectl logs <nom-du-pod>

# Entrer dans un pod
kubectl exec -it <nom-du-pod> -- /bin/sh

# Supprimer un pod (il sera recréé automatiquement)
kubectl delete pod <nom-du-pod>

kubectl get pods --all-namespaces
```

### Mise à Jour de l'Application

```bash
# Mettre à jour l'image
kubectl set image deployment/workout-planner-api \
  workout-planner-api=aboubakar940/workout-planner:nouvelle-version

# Vérifier le statut du déploiement
kubectl rollout status deployment/workout-planner-api
```

### Scaling

```bash
# Augmenter le nombre de réplicas
kubectl scale deployment workout-planner-api --replicas=3

# Vérifier le nouveau nombre de pods
kubectl get pods
```

## 3. Surveillance et Debug

### Surveillance des Ressources
```bash
# Voir l'utilisation des ressources
kubectl top pods

# Voir les événements
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Debug
```bash
# Décrire un pod pour le diagnostic
kubectl describe pod <nom-du-pod>

# Voir les logs en temps réel
kubectl logs -f <nom-du-pod>
```

## 4. Nettoyage

```bash
# Supprimer le déploiement
kubectl delete -f kubernetes/deployment.yml

# Supprimer le service
kubectl delete -f kubernetes/service.yml
```

## 5. Bonnes Pratiques

1. **Gestion des Images**
   - Toujours utiliser des tags spécifiques en production
   - Éviter le tag `latest`

2. **Haute Disponibilité**
   - Maintenir au moins 2 réplicas
   - Utiliser des anti-affinités pour répartir les pods

3. **Monitoring**
   - Configurer des liveness et readiness probes
   - Mettre en place des limites de ressources

4. **Sécurité**
   - Utiliser des secrets pour les données sensibles
   - Limiter les permissions des conteneurs

## 6. Troubleshooting Commun

1. **Pod en état CrashLoopBackOff**
   ```bash
   kubectl describe pod <nom-du-pod>
   kubectl logs <nom-du-pod> --previous
   ```

2. **Service inaccessible**
   ```bash
   kubectl get endpoints workout-planner-api
   kubectl describe service workout-planner-api
   ```

3. **Problèmes de mémoire**
   ```bash
   kubectl top pods
   kubectl describe pod <nom-du-pod>
   ```

## 7. Accès à l'Application

L'application sera accessible à :
- En local : `http://localhost:30000`
- Sur le cluster : `http://<node-ip>:30000`

## 8. Notes Importantes

- Sauvegardez régulièrement vos fichiers de configuration
- Documentez les changements de configuration
- Testez les mises à jour dans un environnement de staging
- Surveillez l'utilisation des ressources

## Pour faire un port-forward d'un service spécifique

```bash
kubectl get services --all-namespaces

# Syntaxe générale
kubectl port-forward -n <namespace> svc/<nom-du-service> <port-local>:<port-service>

kubectl port-forward service/api 3000:3000 -n workout-planner-api

# Exemples courants :
# Pour Prometheus
kubectl port-forward -n monitoring svc/prometheus-service 9090:9090

# Pour Portainer
kubectl port-forward -n portainer svc/portainer 9000:9000

# Pour voir les port-forwards actifs
ps aux | grep "kubectl port-forward"

```