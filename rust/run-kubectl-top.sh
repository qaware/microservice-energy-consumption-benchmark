#!/bin/sh

while true; do
  kubectl top pods --selector app=rust | tail -n1 >> stats.txt
done
