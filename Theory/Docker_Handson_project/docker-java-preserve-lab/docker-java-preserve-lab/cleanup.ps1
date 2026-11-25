docker rm -f java_lab 2>$null
docker rmi myrepo/java-app:1.0 2>$null
docker rmi java-app:2.0 2>$null
docker rmi java-imported:1.0 2>$null
Remove-Item java-app.tar -ErrorAction SilentlyContinue
Remove-Item container.tar -ErrorAction SilentlyContinue
Write-Host "Lab cleanup complete."
