/**
 * compress contents of /files/ into an archive that can be downloaded by a user.
 **/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FILES_PATH "./www/files/*"
#define DUMP_PATH "./www/dmp/"

int main() {
  printf("content-type: text/plain\n\n"); /* http header */

  char* cmd = malloc((strlen("tar -cvf ") * sizeof(char)) + (strlen(DUMP_PATH) * sizeof(char)) + (strlen(FILES_PATH) * sizeof(char)) + 8);
  sprintf(cmd, "tar -cvf %s/a.tar %s", DUMP_PATH, FILES_PATH);
  system(cmd);
}
