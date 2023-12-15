#!/bin/sh

# install the Kubernetes metrics server for collecting CPU and memory metrics
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# register Helm charts of required tools
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add kubeshop https://kubeshop.github.io/helm-charts
helm repo add kepler https://sustainable-computing-io.github.io/kepler-helm-chart
# TODO helm repo add grafana https://grafana.github.io/helm-charts

# update to the newest versions
helm repo update

# install required tools
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
helm install testkube kubeshop/testkube --namespace testkube --create-namespace
helm install kepler kepler/kepler --namespace kepler --create-namespace
# TODO helm install k6-operator grafana/k6-operator

# install the AWS cost explorer for diagnostics
helm upgrade -i kubecost oci://public.ecr.aws/kubecost/cost-analyzer --version 1.96.0 \
    --namespace kubecost --create-namespace \
    -f https://raw.githubusercontent.com/kubecost/cost-analyzer-helm-chart/develop/cost-analyzer/values-eks-cost-monitoring.yaml
