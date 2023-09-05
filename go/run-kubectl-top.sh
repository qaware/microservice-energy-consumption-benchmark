#!/bin/sh

while true; do
  kubectl top pods --selector app=go | tail -n1 >> stats.txt
done
