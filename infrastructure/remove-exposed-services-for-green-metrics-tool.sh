# Uninstall Hoverfly using Kustomize

kubectl delete -k infrastructure/exposed-services-for-green-metrics-tool/hoverfly

# Uninstall PostgreSQL Helm-Chart

helm uninstall postgres -n postgres
