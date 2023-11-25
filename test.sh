for i in {1..30}; do
  node test.js &
done

wait
echo "Finished"