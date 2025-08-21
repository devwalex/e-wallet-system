#!/bin/sh

apt update

apt install docker.io

docker run -d -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -u root  -p 8080:8080 -p 50000:50000 --restart=on-failure jenkins/jenkins:lts


#install docker on aws

sudo yum update

sudo yum install docker

sudo service docker start

sudo usermod -aG docker $USER