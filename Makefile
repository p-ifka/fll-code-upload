.PHONY: container run start test cgi rmcontainer


container:
	docker build --no-cache-filter www -t fllc --no-cache-filter COPY .

rmcontainer:
	docker rm fllc-cont

run:
	sudo docker run --name fllc-cont -p 80:80 fllc
start:
	docker start fllc-cont

test:	container run rmcontainer

cgi:
	cc src/get.c -o ./www/cgi-bin/get.cgi
	cc src/dump.c -o ./www/cgi-bin/dump.cgi
	cp src/upload.sh www/cgi-bin/upload.cgi
