#include <stdio.h>
#include <stdlib.h>

#define TEST "AMONG"

int main() {
  char bcmd[] = "test%s";
  char *cmd = malloc(sizeof(cmd) + sizeof(TEST) + 2);
  sprintf(cmd, bcmd, TEST);
  printf("%s\n", cmd);
  


}

