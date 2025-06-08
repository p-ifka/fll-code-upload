#!/bin/bash
# process file upload 

set -e

### get name from $PATH_INFO ###
# $PATH_INFO contains the url path of the request relative to '/upload/', when the file is
# uploaded in 'index.html', it sends a POST to /upload/{TEAMNAME}

#define variable 'name' as PATH_INFO without any slashes or spaces
name=$(echo $PATH_INFO | tr -d '/ ')
path="../files/$name"
# write request to file matching name
dd of="$path"
# remove form data
sed -i -e '1,4d' "$path"
sed -i '$d' "$path"

printf "Content-Type: text/plain\r\n"
printf "\r\n"
echo "file probably uploaded"

