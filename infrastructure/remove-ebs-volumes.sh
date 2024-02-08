# Define your prefix here
prefix="green-eks-k8s-"
aws_region="eu-north-1"

# List all volumes that have a Name tag with the specified prefix and are in 'available' state
# Adjust the query and filters as necessary for your use case
aws ec2 describe-volumes --query "Volumes[].{ID:VolumeId,Tags:Tags[?Key=='Name'].Value|[0]}" --output text --region $aws_region | while read volume_id name
do
    if [[ $name == $prefix* ]]; then
        echo "Deleting volume: $volume_id ($name)"
        aws ec2 delete-volume --volume-id $volume_id --region $aws_region
    fi
done