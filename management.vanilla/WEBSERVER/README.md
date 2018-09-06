## Certbot commands:
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/datapenetration.de/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/datapenetration.de/privkey.pem
   Your cert will expire on 2018-07-23. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew all of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

## Cassandra Commands:
DROP KEYSPACE IF EXISTS user_keyspace;
SELECT * FROM user_keyspace.sessions;
SELECT * FROM user_keyspace.users;
SELECT * FROM user_keyspace.sessions WHERE user_id=d16fcc22-a473-4be6-a125-96455df5f7a8 ALLOW FILTERING;
SELECT * FROM user_keyspace.sessions WHERE user_id='d16fcc22-a473-4be6-a125-96455df5f7a8';
DESC TABLE user_keyspace.users;
DESC KEYSPACE user_keyspace;
DESC KEYSPACES;

cqlsh -u ianzndb -p Lov3toN8t
cqlsh -f /home/jansen/go/src/github.com/ianzn.com/data/db_setup.txt -u ianzndb -p Lov3toN8t


## Docker Commands:

for the first node:
`docker run --name name-of-cassandra-node cassandra`

for the second and third node:
`docker run --name name-of-new-cassandra-node --link name-of-cassandra-node:cassandra -d cassandra`

how to go to bash terminal of docker container:
`docker exec -it name-of-cassandra-node bash`

to see status of cluster
`nodetool status`

compile dockerfile and create image; must execute in folder where dockerfile is:
`docker build -t image-name .`

afterwards call docker run:
`docker run --rm -it image-name`

see all docker images:
`docker images`

see all docker containers:
`docker ps -a`

stop all running containers:
`sudo docker stop $(sudo docker ps -aq)`

remove all containers:
`sudo docker rm $(sudo docker ps -aq)`

remove all images:
`sudo docker rmi $(docker images -q)`

start docker ubuntu server:
`docker run -it --rm ubuntu:18.04`

### Docker Run Flags:
-d detached mode
-it jump into container on run
-p specify port
--rm cleans up container after run


## Linux Commands:

'su' 					-- switch to root
'su username'(jp39, postjansen)		-- switch to specific user
	+ requires pw of user
'sudo command' 				-- root privileges
	+ requires pw of user
'chmod 700 filename/dirname'		-- changes permissions
'mkdir dirname'				-- create directory
'touch filename'			-- create file
'ssh...with port etc'


## Go Testing:
'go test -v -cover' 		-- runs all test in package with coverage(-coverage) and verbose(-v) for more information
'' 

# go gets:
go get github.com/gocql/gocql
go get golang.org/x/net/http2

- setting up single cassandra node ubuntu:
	https://www.digitalocean.com/community/tutorials/how-to-install-cassandra-and-run-a-single-node-cluster-on-ubuntu-14-04)
- cassandra install directories:
	https://docs.datastax.com/en/cassandra/latest/cassandra/install/referenceInstallLocatePkg.html
- start cassandra:
	sudo service cassandra stop
- stop cassandra:
	sudo service cassandra start
- connect to cass:
	cqlsh -u cassandra -p cassandra

0. create cassandra user and password and set cassandra superuser=false
	follow: https://docs.datastax.com/en/cassandra/latest/cassandra/configuration/secureConfigNativeAuth.html

1. call db_setup.txt using cqlsh source command
	(https://docs.datastax.com/en/cql/3.1/cql/cql_reference/source_r.html?hl=source)
	to ecxecute cassandra table setup: `/usr/bin/cqlsh -f /home/jansen/go/src/github.com/ianzn-private/data/db_setup.txt`


java Version festlegen

export JAVA_HOME=`/usr/libexec/java_home -v 1.8`

## Testing Files:
- switch into directory and execute `go test`