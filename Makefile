build:
	sudo docker build -t fllc .
run:
	sudo docker run --name fllc-cont -p 8080:80 fllc
	sudo docker rm fllc-cont

test:
	sudo docker build -t fllc .
	sudo docker run --name fllc-cont -p 8080:80 fllc
	sudo docker rm fllc-cont

cgi:
	cc src/get.c -o ./www/cgi-bin/get.cgi
