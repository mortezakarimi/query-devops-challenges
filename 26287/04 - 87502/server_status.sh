#!/bin/bash

# NOTE:
# * Your script MUST read the input from a given file as follows:
#   $ ./count_names.sh input.txt
# * Your script MUST print the result to the stdout.
# * Your script MUST conform to the output format provided in the question.
#
# ATTENTION: DON'T change this file name!
file="$1"

#check if path is not empty string
if [ -z "$file" ]
then
  echo "path is empty string"
  exit
fi

healthy=50
while IFS=' ' read -r id cpu ram net
do
  if [[ "$cpu" -ge "$healthy" && "$ram" -ge  "$healthy" && "$net" -ge  "$healthy" ]]; then
    echo "$id: Pass"
  else
    echo "$id: Fail"
  fi
done < $file