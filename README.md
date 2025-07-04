# FLL Code Upload Site

# installation/building container
## cgi scripts
ensure `get.cgi` `dump.cgi` and `upload.cgi` are all present in `www/cgi-bin/`, cgi files can be build with

`make cgi`

## user files
any previously uploaded files should be placed in `www/files/` with the directory structure:

`www/files/{group}/{day}/{file_name}.llsp3`

`{day}` should be a unix timestamp in days

## docker
`docker build -t {tag_name} .`

`docker run -p 80:80 {tag_name}`







