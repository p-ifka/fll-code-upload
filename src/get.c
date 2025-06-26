/**
 * cgi script to return a list of files present on the webserver

 * respond to GET request with type text/plain
 * data for each folder seperated by newlines
 * formatted "{GROUP_NAME},{LAST_UPDATED}"
 **/

#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <string.h>
#include <time.h>

#include "const.h"
/* #define FILES_PATH "../files/SEC */



int main() {
  printf("content-type: text/plain\n\n"); /* http header */

  DIR *filesdir;		/* pointer to files dir */
  struct dirent *diren;		/* struct to store information from readdir()*/

  filesdir = opendir(FILES_PATH);

  if(filesdir) {
    while((diren = readdir(filesdir)) != NULL) {
      if(diren->d_name[0] == '.') { /* dont include . or ..*/
	continue;
      }
      printf("%s", diren->d_name);
      DIR *groupdir;
      char *groupdirPath = malloc((sizeof(char) * strlen(FILES_PATH)) + (sizeof(char) * strlen(diren->d_name)) + 3);
      sprintf(groupdirPath, "%s/%s", FILES_PATH, diren->d_name);
      groupdir = opendir(groupdirPath);
      free(groupdirPath);
      if(groupdir) {
	/* iterate through files in folder-all files will be named
	 the # of seconds since epoch in UTC- find the most recent (highest #) one
	 and store it as time_t latestFile
	*/

	time_t latestFile = 0;
	while((diren = readdir(groupdir)) != NULL) {
	  if(diren->d_name[0]== '.') { continue; } /* ignore . and .. */
	  long ftime = atol(diren->d_name);	   /* convert file name to long*/
	  if(ftime > latestFile) {		   /* compare to current latestFile*/
	    latestFile = ftime;			   /* if file is more recent than current latestFile, set it as the new latestFile */
	  }
	}
	/* create formatted string for the date and time the file was uploaded */
	struct tm *mostRecentTime;
	time_t latestFileTime = latestFile*SEC_TO_DAY; /* convert from days back to seconds */
	mostRecentTime = gmtime(&latestFileTime);
	char* mostRecentTimeStr = malloc(256 * sizeof(char));
	strftime(mostRecentTimeStr, 255, "%Y-%m-%d", mostRecentTime);

	/* output */
	printf(",%s", mostRecentTimeStr); /* return formatted datetime */
	printf(",%d\n", latestFile);	  /* return name of most recent file */

	closedir(groupdir);
      }
    }

    closedir(filesdir);
  }





}
