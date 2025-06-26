#!/bin/bash
# process file upload 

set -e


## get group and file name from $PATH_INFO ##

group_name="$(echo $PATH_INFO | cut -d "/" -f 2)"
file_name="$(echo $PATH_INFO | cut -d "/" -f 3)"


## get current day for timestemp ##
dt="$(date "+%s")"
day="$(($dt/86400))"


output_dir_path="../files/$group_name/$day"
output_file_path="../files/$group_name/$day/$file_name"
mkdir -p "$output_dir_path"
touch "$output_file_path"
dd of="$output_file_path"
sed -i -e "1,4d" "$output_file_path"
sed -i "$d" "$output_file_path"

rm -f ../files/.export.lock
printf "Content-Type: text/plain\nstatus: 200\ncontent-length: 100\r\n\r\n"
echo "file probably uploaded"

# name=$(echo $PATH_INFO | tr -d '/. ')
# dir_path="../files/$name"
# fl_path="$dir_path/$(date "+%s")"
# # write request to file matching name

# mkdir -p "$dir_path"
# dd of="$fl_path"
# # remove form data
# sed -i -e '1,4d' "$fl_path"
# sed -i '$d' "$fl_path"

# rm -f ../files/.export.lock

# printf "Content-Type: text/plain\r\n"
# printf "\r\n"
# echo "file probably uploaded"

