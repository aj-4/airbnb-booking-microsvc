==================
SET UP VIEW WORKER
==================

//set var = private ip
ip a s eth0 | awk '/inet / {print$2}'

//doesnt work //
//docker network create -d bridge mynet//

docker run --name cass1 --net=host -d cassandra:3.11.1d
&&
docker run --name view1 --net=host apietsch4/view_worker:latest

==================
INSTALL DOCKER EC2
==================
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

//ssh out, back in

==================
SETUP CASSANDRA SEED
===================
docker run --name cass11 --net=host -d -e HEAP_NEWSIZE=1M -e MAX_HEAP_SIZE=512M -e CASSANDRA_BROADCAST_ADDRESS=172.31.18.41 -p 7000:7000 cassandra:3.11.1

==================
SETUP CASSANDRA NODE
===================
docker run --name cass11 --net=host -d -e HEAP_NEWSIZE=1M -e MAX_HEAP_SIZE=512M -e CASSANDRA_BROADCAST_ADDRESS=172.31.28.150 -p 7000:7000 -e CASSANDRA_SEEDS=172.31.18.41 cassandra:3.11.1

===
RUN
===
docker run --name view12 --net=host apietsch4/view_worker:latest

======================
RESTART ALL CONTAINERS
======================
docker restart $(docker ps -a -q)

statsDClient.increment('.q.all.throughput', dbreqs.length, 0.25);