# Docker Commands & Flags - HandsOn

This package covers all sections of the supplied Docker HandsOn lecture.

## 1. Docker Basics
```powershell
docker version
docker info
```

## 2. Image Management
```powershell
docker images
docker images -a
docker images -q
docker pull ubuntu
docker pull ubuntu:22.04
docker rmi ubuntu
```
Use `docker rmi -f ubuntu` only when force removal is appropriate.

## 3. Container Lifecycle
```powershell
docker run -it --name test ubuntu:22.04 bash
```
Type `exit`, then:
```powershell
docker ps
docker ps -a
docker start test
docker stop test
docker restart test
docker rm test
docker run --rm ubuntu:22.04 echo "Temporary container completed"
```

## 4. Executing Commands Inside Containers
```powershell
docker run -d --name exec-demo ubuntu:22.04 sleep infinity
docker exec -it exec-demo bash
```
Inside Bash:
```bash
pwd
ls
cat /etc/os-release
exit
```
Lecture command:
```powershell
docker attach exec-demo
```

## 5. Networking & Ports
```powershell
docker run -d --name web -p 8080:80 nginx
docker network ls
docker network create mynet
docker run -d --name network-web --network=mynet nginx
docker run -d --name network-client --network=mynet ubuntu:22.04 sleep infinity
docker network inspect mynet
```
Open `http://localhost:8080`.

## 6. Volumes & Data Persistence
```powershell
docker volume create mydata
docker volume ls
docker run --rm -v mydata:/data ubuntu:22.04 bash -c "echo Docker-volume-data > /data/message.txt"
docker run --rm -v mydata:/data ubuntu:22.04 cat /data/message.txt
docker run --rm -v mydata:/data:ro ubuntu:22.04 cat /data/message.txt
docker run --rm -v "${PWD}:/data" ubuntu:22.04 ls /data
```

## 7. Logs & Monitoring
```powershell
docker logs web
docker logs --tail 50 web
docker logs --since 10m web
docker logs -f web
docker stats
```
Use Ctrl+C to leave live logs/stats.

## 8. Inspect & Metadata
```powershell
docker inspect web
docker inspect mydata
docker network inspect mynet
```

## 9. Docker Build
A working Dockerfile is in `custom-nginx`.

```powershell
cd custom-nginx
docker build -t myapp .
docker run -d --name myapp-container -p 8081:80 myapp
```
Open `http://localhost:8081`.

Other lecture flags:
```powershell
docker build --no-cache -t myapp:nocache .
docker build -f Dockerfile -t myapp:1.0 .
```
Return:
```powershell
cd ..
```

## 10. Cleanup Commands
Remove lab containers first if needed:
```powershell
docker rm -f web exec-demo network-web network-client myapp-container
```
Lecture cleanup commands:
```powershell
docker container prune
docker image prune
docker system prune
docker system prune -a
docker system prune -a --volumes
```
Read Docker's confirmation carefully before approving prune commands.

## 11. Docker Compose
This package includes `compose.yaml`.
```powershell
docker compose up -d --build
docker compose ps
docker compose logs
```
Open `http://localhost:8082`.

Stop:
```powershell
docker compose down
```

## 12. Important Run Flags

| Flag | Meaning |
|---|---|
| `-it` | Interactive terminal |
| `-d` | Detached mode |
| `--rm` | Auto-remove |
| `--name` | Container name |
| `-p` | Port mapping |
| `-v` | Volume mount |
| `-e` | Environment variable |
| `--network` | Custom network |
| `--restart=always` | Auto restart |

Example:
```powershell
docker run -d --name flag-demo -p 8083:80 -e LAB=DOCKER --restart=always nginx
docker rm -f flag-demo
```

## 13. Minimal Lab Example - Nginx
```powershell
docker pull nginx
docker run -d --name web -p 8080:80 nginx
docker ps
docker logs web
docker stop web
docker rm web
```

## 14. Key Concept Summary
- Image -> blueprint/package
- Container -> running instance
- Volume -> persistent data
- Network -> container communication
- Dockerfile -> image build instructions

## Practical Evidence Checklist
Show/capture `docker version`, `docker images`, `docker ps`, Nginx on port 8080, `docker network ls`, `docker volume ls`, `docker logs`, `docker inspect`, the custom image build, and `docker compose ps`.
