/**
 * compress contents of /files/ into an archive that can be downloaded by a user.
 * if FILES_PATH/.export.lock exists, do not modify anything, if archive is created, create file .export.lock
 * to indicate the current archive is up to date
 **/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>


#define FILES_PATH "/usr/local/apache2/htdocs/files/"
#define DUMP_PATH "/usr/local/apache2/htdocs/export/"


int fileExists(const char *path) {
  /**
   * given path @param path, return 0 if file does not exist, return 1 if it does
   **/
  return !access(path, F_OK);
}

int main() {
  printf("content-type: text/plain\n"); /* http header */

  /* check if export.lock exists in FILES_PATH, if it does, do not generate new archive */
  char *exportLockPath = malloc(sizeof(FILES_PATH) + sizeof(".export.lock") + 2); /* allocate string with appropriate size */
  sprintf(exportLockPath, "%s.export.lock", FILES_PATH); /* create path string */

  
  if(fileExists(exportLockPath)) { /* check if exportLockPath exists, if it does return early */
    printf("status: 304\n\n"); /* if .export.lock exists, return code 304: not modified, and do not generate a new archive */
    printf("archive is up-to-date: %sexport.lock exists, no new archive created\n", FILES_PATH);
    free(exportLockPath);	/* free allocated memory */
    return 0;
  }
  free(exportLockPath);		/* free allocated memory, export.lock does not exist, continue */


  /* define command to create archive */
  char cmdTemp[] = "$( tar -cf  %sa.tar *) > /dev/null"; /* define command template */
  char *cmd = malloc(sizeof(cmdTemp) + sizeof(DUMP_PATH) + 2);
  sprintf(cmd, cmdTemp, DUMP_PATH);

  /* change working director to FILES_PATH, run command */
  chdir(FILES_PATH);
  int rc = system(cmd);

  if(rc == -1) {		/* process could not be created */
    printf("status: 503\n\n"); /* if system() failed to create process, return code 503: service unavaliable*/
    printf("failed to start process %s", cmd);
    free(cmd);			
    return 0;
  }
  if(rc != 0) {			/* process returned non-zero*/
    printf("status: 500\n\n"); /* if cmd failed to run (returned non-zero), return code 500: internal server error */
    printf("process %s exited with code %d", cmd, rc);
    free(cmd);
    return 0;
  }

  free(cmd);			/* command run successfully, free allocated memory*/

  /* create .export.lock file to indicate that the export archive is up-to-date */
  char *elockPath = malloc(sizeof(FILES_PATH) + sizeof(".export.lock"));
  sprintf(elockPath, "%s.export.lock", FILES_PATH);
  FILE *elockPtr;
  elockPtr = fopen(elockPath, "w");
  if(elockPtr == NULL) {	
    printf("status: 500\n\n");	/* failed to write export.lock, return internal server error */
    printf("archive creation successful, failed to write export.lock");
    free(elockPath);
    return 0;
  }

  fclose(elockPtr);		/* close file */
  free(elockPath);

  printf("status: 200\n\n"); 	/* no errors occured, return success */
  printf("archive created"); 

  return 0;

}
