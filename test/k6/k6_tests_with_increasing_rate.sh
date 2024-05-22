#echo "Warmup"
#k6 run script.js
#sleep 30

# Loop to run the k6 script with different RATE values
for number in {1..5}
do
  echo "Running k6 script with RATE=$number"
  k6 run -e RATE=$number -e DURATION='600s' script.js

  # Check if this is not the last iteration
  if [ $number -ne 5 ]; then
    echo "Pausing for 30 seconds..."
    sleep 30
  fi
done

echo "Completed all runs."
