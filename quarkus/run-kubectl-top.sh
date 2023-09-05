#!/bin/sh

while true; do
  kubectl top pods --selector app=quarkus | tail -n1 >> stats.txt
done
