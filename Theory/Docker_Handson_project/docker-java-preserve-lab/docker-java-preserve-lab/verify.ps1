Write-Host "=== Containers ==="
docker ps -a

Write-Host "`n=== Images ==="
docker images

Write-Host "`n=== Test committed image ==="
docker run --rm myrepo/java-app:1.0 bash -c "cd /home/app && java Hello"

Write-Host "`n=== Test Dockerfile image (if built) ==="
docker image inspect java-app:2.0 *> $null
if ($LASTEXITCODE -eq 0) {
    docker run --rm java-app:2.0
} else {
    Write-Host "java-app:2.0 has not been built yet."
}
