Write-Host "Creating a long-running Ubuntu container..."
docker run -d --name ubuntu-running ubuntu sleep infinity

Write-Host "`nRunning containers:"
docker ps

Write-Host "`nEnter it with:"
Write-Host "docker exec -it ubuntu-running /bin/bash"
