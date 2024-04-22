# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install latest version of docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Add user to docker group
sudo usermod -aG docker $USER


# Activate the changes to groups
newgrp docker

# Install dependencies
sudo apt install -y make gcc python3 python3-pip python3-venv

# Clone the green-metrics-tool repository and cd into it
git clone --branch codespaces https://github.com/andreaswe/green-metrics-tool.git
cd ~/green-metrics-tool

# Run GMT install script
./install_linux.sh


# Activate the virtual environment
source venv/bin/activate

# Also add XGBoost, as we need it
python3 -m pip install -r metric_providers/psu/energy/ac/xgboost/machine/model/requirements.txt

python3 disable_metric_providers.py --categories RAPL Machine Sensors Debug --providers NetworkIoCgroupContainerProvider NetworkConnectionsProxyContainerProvider PsuEnergyAcSdiaMachineProvider

# generate ssh key - replace mail by your address
ssh-keygen -t ed25519 -C "GMT-on-AWS"
# show generated public key
cat /home/ubuntu/.ssh/id_ed25519.pub
# Go to https://gitlab.com/-/profile/keys and add the ssh key to gitlab

git clone git@gitlab.com:qaware/internal/gilden/gse-gilde/t-stack-comparison.git

export DB_HOST=k8s-postgres-postgres-5c27cd6d6c-6f6940a4b044e188.elb.eu-north-1.amazonaws.com
export SERVICE_MOCK_HOST_PORT=k8s-hoverfly-ingressh-03fdaf2702-114475029.eu-north-1.elb.amazonaws.com:80

cd t-stack-comparison/quarkus
envsubst < docker-compose-slim-template.yaml > docker-compose-slim.yaml
cd ../../

# Portforward to access the GMT frontend
ssh -i ".ssh/gmt-key.pem" -N -L 9142:localhost:9142 ubuntu@ec2-51-20-7-234.eu-north-1.compute.amazonaws.com

# Run the GMT
python3 runner.py --name quarkus_jvm --uri ~/green-metrics-tool/t-stack-comparison/quarkus/ --filename usage_scenario_app_only.yml --allow-unsafe --docker-prune
python3 runner.py --name rust --uri ~/green-metrics-tool/t-stack-comparison/rust/ --filename usage_scenario_app_only.yml --allow-unsafe --docker-prune
python3 runner.py --name go --uri ~/green-metrics-tool/t-stack-comparison/go/ --filename usage_scenario_app_only.yml --allow-unsafe --docker-prune

http://api.ec2-16-171-62-162.eu-north-1.compute.amazonaws.com:9142
http://metrics.ec2-16-171-62-162.eu-north-1.compute.amazonaws.com:9142