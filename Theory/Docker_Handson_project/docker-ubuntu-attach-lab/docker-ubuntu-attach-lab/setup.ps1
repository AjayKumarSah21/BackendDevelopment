Write-Host "Checking Docker..."
docker version

Write-Host "`nPulling Ubuntu image..."
docker pull ubuntu

Write-Host "`nUbuntu image is ready."
docker images ubuntu

Write-Host "`nNext command for the interactive lab:"
Write-Host "docker run -it --name ubuntu-lab ubuntu /bin/bash"
