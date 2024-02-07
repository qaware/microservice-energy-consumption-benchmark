# install the Kubernetes metrics server for collecting CPU and memory metrics
#kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# register Helm charts of required tools
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
#helm repo add kepler https://sustainable-computing-io.github.io/kepler-helm-chart
# TODO helm repo add kubeshop https://kubeshop.github.io/helm-charts
# TODO helm repo add grafana https://grafana.github.io/helm-charts

# update to the newest versions
helm repo update

# install required tools
helm upgrade kube-prometheus-stack prometheus-community/kube-prometheus-stack \
    --install \
    --namespace monitoring --create-namespace \
    --wait \
    --set prometheus.prometheusSpec.scrapeInterval="10s"
#helm upgrade kepler kepler/kepler --install --namespace kepler --create-namespace --wait
# TODO helm install testkube kubeshop/testkube --namespace testkube --create-namespace
# TODO helm install k6-operator grafana/k6-operator

# install the AWS cost explorer for diagnostics
#helm upgrade -i kubecost oci://public.ecr.aws/kubecost/cost-analyzer --version 1.96.0 \
#    --namespace kubecost --create-namespace \
#    -f https://raw.githubusercontent.com/kubecost/cost-analyzer-helm-chart/develop/cost-analyzer/values-eks-cost-monitoring.yaml

# install Kepler tools (we have to do it twice, because in the first run the CRDs will not be installed when kubectl tries to create the resources)
kubectl apply -k infrastructure/kepler --wait
kubectl apply -k infrastructure/kepler --wait

# open Grafana in the default browser
open localhost:3000

# port-forward to Grafana
kubectl port-forward "$(kubectl get pod -n monitoring -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=kube-prometheus-stack" -o jsonpath='{.items[0].metadata.name}')" \
   -n monitoring \
   3000:3000
