## Requirements
 - <b>docker (~17.03.1-ce-mac5)
 	- https://docs.docker.com/docker-for-mac/install/
 - <b>aws cli (~1.4.62)
 	- http://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html#awscli-install-osx-homebrew
 - <b>kubectl (~v1.5.5)
 	- https://kubernetes.io/docs/tasks/kubectl/install/
 - <b>kube-aws (>=v0.9.5 - please use proper version of kube-aws since this version had major config changes)</br>
 	- https://github.com/kubernetes-incubator/kube-aws/blob/master/Documentation/kubernetes-on-aws.md#download-kube-aws

## Start Kubernetes cluster on AWS
We will use AWS cli and tool called aws-kube for generating CloudFormation for cluster.
##### AWS credentials
Write your credentials into the file ~/.aws/credentials using the following template:
```
[default]
aws_access_key_id = AKID1234567890
aws_secret_access_key = MY-SECRET-KEY
```
##### EC2 Key pair
Create a unique key-pair for region in AWS console.
##### AWS KMS
```
aws kms --region=<your-region> create-key --description="kube-aws assets"
```
##### Create S3 bucket
```
aws s3api create-bucket --bucket bucket-name --region <your-region> --create-bucket-configuration LocationConstraint=<your-region>
```
##### Init kube-aws assets
Please generate cluster settings in kube-aws-assets folder.
```
cd kube-aws-assets
```
Generate config.yaml
```
kube-aws init \
--cluster-name=kube-dev \
--external-dns-name=kube.mydomain.com \
--region=<your-region> \
--availability-zone=eu-west-2a \
--key-name=id_aws \
--kms-key-arn="arn:aws:kms:eu-west-2:123456789:key/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Render files templates
```
kube-aws render credentials --generate-ca
kube-aws render stack
```
##### Launch Kubernetes cluster
Validate that everything is ok
```
kube-aws validate --s3-uri s3://<your-bucket-name>/<prefix>
```
Launch Kubernetes cluster
```
kube-aws up --s3-uri s3://<your-bucket-name>/<prefix>
```

#### Note:
Note: If you don't have external DNS you can just change host file on your machine to public IPs of your
controller ELB load balancer.

Run to reveal DNS of load balancer:
```
kube-aws status
```
Then copy DNS and resolve to public IP:
```
dig <your-dns>.elb.amazonaws.com
```
Finally update host file: (for example: <ip> kube.mydomain.com)
```
sudo vim /etc/hosts
```
This is just work around kube-aws which requires external-dns-name in it's init phase.
