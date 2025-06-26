FROM httpd:2.4
COPY ./www/ /usr/local/apache2/htdocs/
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
RUN chmod -R 777 /usr/local/apache2/htdocs/
EXPOSE 80