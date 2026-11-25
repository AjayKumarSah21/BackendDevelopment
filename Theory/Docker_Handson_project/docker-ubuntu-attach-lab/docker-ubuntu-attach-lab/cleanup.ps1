Write-Host "Removing lab containers..."
docker rm -f ubuntu-lab ubuntu-running

Write-Host "`nRemaining containers:"
docker ps -a
