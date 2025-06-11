#!/bin/bash
# process file upload 

set -e

### get name from $PATH_INFO ###
# $PATH_INFO contains the url path of the request relative to '/upload/', when the file is
# uploaded in 'index.html', it sends a POST to /upload/{TEAMNAME}

#define variable 'name' as PATH_INFO without any slashes, dots, or spaces
name=$(echo $PATH_INFO | tr -d '/. ')
dir_path="../files/$name"
fl_path="$dir_path/$(date "+%s")"
# write request to file matching name

mkdir -p "$dir_path"
dd of="$fl_path"
# remove form data
sed -i -e '1,4d' "$fl_path"
sed -i '$d' "$fl_path"

rm -f ../files/.export.lock

printf "Content-Type: text/plain\r\n"
printf "\r\n"
echo "file probably uploaded"

