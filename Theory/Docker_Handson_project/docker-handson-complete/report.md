# Docker Commands & Flags — Hands-On Report

## Overview

This report provides a practical reference for commonly used Docker commands and flags. It covers Docker basics, image management, the container lifecycle, commands inside containers, networking, volumes, logs, resource monitoring, image builds, cleanup, Docker Compose, and a minimal Nginx lab.

---

# 1. Docker Basics

## Check Docker Version

```bash
docker version
```

This displays:

- Docker client version
- Docker server version

It can also help confirm that the Docker client can communicate with the Docker daemon.

---

## View Docker System Information

```bash
docker info
```

This provides system-wide Docker information such as:

- Storage driver
- Cgroups
- Images
- Containers
- Docker runtime information

---

# 2. Image Management

A Docker image acts as the blueprint used to create containers.

## List Local Images

```bash
docker images
```

### Useful Flags

| Flag | Meaning |
|---|---|
| `-a` | Show all images, including intermediate layers |
| `-q` | Show only image IDs |

Examples:

```bash
docker images -a
```

```bash
docker images -q
```

---

# 3. Pull an Image from a Registry

Pull the default Ubuntu image:

```bash
docker pull ubuntu
```

Pull a specific version:

```bash
docker pull ubuntu:22.04
```

Docker Hub is used as the default registry in these examples.

The syntax:

```text
image:tag
```

allows a specific image version to be selected.

Example:

```text
ubuntu:22.04
```

---

# 4. Remove an Image

```bash
docker rmi ubuntu
```

### Force Removal

```bash
docker rmi -f ubuntu
```

### Important Flags

| Flag | Meaning |
|---|---|
| `-f` | Force image removal |
| `-a` | Used with relevant cleanup operations to target unused images broadly |

Before removing an image, ensure that it is no longer required by containers unless forced removal is intended.

---

# 5. Container Lifecycle

A container is a running or stopped instance of a Docker image.

The typical lifecycle is:

```text
Image
  ↓
docker run
  ↓
Running Container
  ↓
docker stop
  ↓
Stopped Container
  ↓
docker start
  ↓
Running Container
  ↓
docker rm
  ↓
Removed Container
```

---

# 6. Run a Container

Basic command:

```bash
docker run ubuntu
```

## Common `docker run` Flags

| Flag | Meaning |
|---|---|
| `-it` | Interactive mode with terminal |
| `--name` | Assign a custom container name |
| `-d` | Run in detached/background mode |
| `--rm` | Automatically remove the container after it exits |

---

## Interactive Ubuntu Example

```bash
docker run -it \
  --name test \
  ubuntu \
  bash
```

This:

1. Creates a container from the Ubuntu image.
2. Names it `test`.
3. Opens an interactive terminal.
4. Starts `bash`.

---

# 7. List Containers

List currently running containers:

```bash
docker ps
```

### Show All Containers

```bash
docker ps -a
```

This includes:

- Running containers
- Stopped containers

### Show Only Container IDs

```bash
docker ps -q
```

### Flags

| Flag | Meaning |
|---|---|
| `-a` | Show all containers |
| `-q` | Show only container IDs |

---

# 8. Start, Stop, and Restart Containers

## Start

```bash
docker start container_name
```

## Stop

```bash
docker stop container_name
```

## Restart

```bash
docker restart container_name
```

Example:

```bash
docker stop web
```

```bash
docker start web
```

```bash
docker restart web
```

---

# 9. Remove a Container

```bash
docker rm container_name
```

Example:

```bash
docker rm web
```

### Force Removal

```bash
docker rm -f container_name
```

The `-f` flag can force-stop and remove a container.

---

# 10. Executing Commands Inside Containers

Docker provides multiple ways to interact with running containers.

---

## Attach to a Container

```bash
docker attach container_name
```

This attaches the terminal to the container's main process.

---

## Execute a Command in a Running Container

```bash
docker exec -it \
  container_name \
  bash
```

### Flags

| Flag | Meaning |
|---|---|
| `-i` | Interactive |
| `-t` | Allocate a terminal |

Example:

```bash
docker exec -it web bash
```

This opens a Bash shell inside the running `web` container when Bash is available.

---

# 11. Networking and Ports

Containers can expose network services.

Port mapping connects a host port to a port inside a container.

Example:

```bash
docker run -d \
  -p 8080:80 \
  nginx
```

The mapping is:

```text
Host
Port 8080
    |
    v
Container
Port 80
```

Open the service through:

```text
http://localhost:8080
```

---

## Port Mapping Syntax

```text
-p host_port:container_port
```

Example:

```bash
-p 8080:80
```

means:

```text
Host port:      8080
Container port: 80
```

---

## Random Host Ports

The lecture also identifies:

```text
-P
```

as the option for random host-port publishing.

---

# 12. List Docker Networks

```bash
docker network ls
```

This displays available Docker networks.

---

# 13. Create a Docker Network

```bash
docker network create mynet
```

Run a container on that network:

```bash
docker run -d \
  --network=mynet \
  nginx
```

A custom network can be used to organize communication between containers.

---

# 14. Volumes and Data Persistence

Containers can be temporary, so persistent data can be managed separately using Docker volumes.

Conceptually:

```text
Container
    |
    v
Volume
    |
    v
Persistent Data
```

---

# 15. Create a Volume

```bash
docker volume create mydata
```

---

# 16. Mount a Named Volume

```bash
docker run \
  -v mydata:/data \
  ubuntu
```

The mapping is:

```text
Docker Volume
mydata
   |
   v
Container Path
/data
```

---

# 17. Bind Mount

A host directory can be mounted into a container:

```bash
docker run \
  -v /host/path:/container/path \
  ubuntu
```

Conceptually:

```text
Host Path
    |
    v
Container Path
```

---

# 18. Read-Only Volume

```bash
docker run \
  -v mydata:/data:ro \
  ubuntu
```

The suffix:

```text
:ro
```

makes the mount read-only inside the container.

---

# 19. Logs and Monitoring

Container logs are useful for understanding application behavior and diagnosing problems.

View logs:

```bash
docker logs container_name
```

Example:

```bash
docker logs web
```

---

# 20. Follow Logs Live

```bash
docker logs -f container_name
```

The `-f` flag follows new log output.

---

# 21. Show the Last 50 Log Lines

```bash
docker logs \
  --tail 50 \
  container_name
```

---

# 22. Show Recent Logs

```bash
docker logs \
  --since 10m \
  container_name
```

This displays logs from the last 10 minutes.

---

## Log Flags

| Flag | Meaning |
|---|---|
| `-f` | Follow live logs |
| `--tail 50` | Show the last 50 lines |
| `--since 10m` | Show logs from the last 10 minutes |

---

# 23. Resource Usage

Use:

```bash
docker stats
```

to monitor running containers.

The command displays information such as:

- CPU usage
- Memory usage
- Network I/O
- Disk I/O

---

# 24. Inspect and Metadata

Inspect a Docker object:

```bash
docker inspect container_name
```

The command returns detailed metadata in JSON format.

Information can include:

- IP address
- Mounts
- Environment variables
- Network configuration

Example:

```bash
docker inspect web
```

---

# 25. Docker Build

A Dockerfile contains instructions for creating an image.

Build an image:

```bash
docker build -t myapp .
```

---

## Important Build Flags

| Flag | Meaning |
|---|---|
| `-t` | Tag the image |
| `-f Dockerfile.dev` | Use an alternate Dockerfile |
| `--no-cache` | Build without using cached layers |

---

## Tag an Image

```bash
docker build \
  -t myapp \
  .
```

A versioned tag can also be used:

```bash
docker build \
  -t myapp:1.0 \
  .
```

---

## Use an Alternate Dockerfile

```bash
docker build \
  -f Dockerfile.dev \
  -t myapp \
  .
```

---

## Build Without Cache

```bash
docker build \
  --no-cache \
  -t myapp \
  .
```

---

# 26. Example Dockerfile

```dockerfile
FROM ubuntu:22.04

RUN apt update \
    && apt install -y nginx

CMD [
    "nginx",
    "-g",
    "daemon off;"
]
```

---

## Dockerfile Explanation

### Base Image

```dockerfile
FROM ubuntu:22.04
```

Uses Ubuntu 22.04 as the base image.

### Install Nginx

```dockerfile
RUN apt update \
    && apt install -y nginx
```

Updates package information and installs Nginx during the image build.

### Start Nginx

```dockerfile
CMD [
    "nginx",
    "-g",
    "daemon off;"
]
```

Runs Nginx as the container's main process.

---

# 27. Cleanup Commands

Docker resources can accumulate during development.

Docker provides prune commands for cleanup.

---

## Remove Unused Containers

```bash
docker container prune
```

---

## Remove Unused Images

```bash
docker image prune
```

---

## Remove Unused Docker Resources

```bash
docker system prune
```

---

## Cleanup Flags

The lecture highlights:

```text
-a
--volumes
```

for broader cleanup operations.

Cleanup commands should be used carefully because they can remove unused Docker resources.

---

# 28. Docker Compose Overview

Docker Compose is used to manage multiple services together.

Start services:

```bash
docker compose up
```

---

## Detached Mode

```bash
docker compose up -d
```

---

## Build Before Starting

```bash
docker compose up --build
```

---

## Stop Services

```bash
docker compose down
```

The basic workflow is:

```text
compose.yaml
     |
     v
docker compose up
     |
     v
Multiple Services
     |
     v
docker compose down
```

---

# 29. Important `docker run` Flags

| Flag | Meaning |
|---|---|
| `-it` | Interactive terminal |
| `-d` | Detached mode |
| `--rm` | Automatically remove after exit |
| `--name` | Assign container name |
| `-p` | Port mapping |
| `-v` | Volume or bind mount |
| `-e` | Environment variable |
| `--network` | Attach to a custom network |
| `--restart=always` | Automatically restart the container |

---

# 30. Environment Variables

The quick-reference section includes:

```text
-e
```

for environment variables.

General form:

```bash
docker run \
  -e KEY=value \
  image_name
```

This allows configuration to be passed to a container at runtime.

---

# 31. Restart Policy

The lecture lists:

```text
--restart=always
```

as a useful `docker run` flag.

Example:

```bash
docker run -d \
  --restart=always \
  nginx
```

This configures Docker to restart the container according to the selected restart policy.

---

# 32. Minimal Lab — Ubuntu + Nginx

The lecture provides a short practical sequence using the official Nginx image.

---

## Step 1 — Pull Nginx

```bash
docker pull nginx
```

---

## Step 2 — Run Nginx

```bash
docker run -d \
  --name web \
  -p 8080:80 \
  nginx
```

This:

- Runs the container in detached mode
- Names it `web`
- Maps host port `8080` to container port `80`

---

## Step 3 — Verify the Container

```bash
docker ps
```

The `web` container should appear as running.

---

## Step 4 — View Logs

```bash
docker logs web
```

---

## Step 5 — Access Nginx

Open:

```text
http://localhost:8080
```

The request flow is:

```text
Browser
   |
   | localhost:8080
   v
Host Port 8080
   |
   | Docker port mapping
   v
Container Port 80
   |
   v
Nginx
```

---

## Step 6 — Stop Nginx

```bash
docker stop web
```

---

## Step 7 — Remove the Container

```bash
docker rm web
```

---

# 33. Complete Nginx Lab Commands

```bash
docker pull nginx

docker run -d \
  --name web \
  -p 8080:80 \
  nginx

docker ps

docker logs web

docker stop web

docker rm web
```

---

# 34. Key Concept Summary

The lecture summarizes the main Docker concepts as:

```text
Image
  ↓
Blueprint

Container
  ↓
Running Instance

Volume
  ↓
Persistent Data

Network
  ↓
Container Communication

Dockerfile
  ↓
Image Build Instructions
```

---

# 35. Docker Command Cheat Sheet

## System Information

```bash
docker version
docker info
```

## Images

```bash
docker images
docker images -a
docker images -q
docker pull ubuntu
docker pull ubuntu:22.04
docker rmi ubuntu
```

## Containers

```bash
docker run ubuntu
docker ps
docker ps -a
docker ps -q
docker start container_name
docker stop container_name
docker restart container_name
docker rm container_name
```

## Interactive Containers

```bash
docker run -it \
  --name test \
  ubuntu \
  bash
```

## Execute Commands

```bash
docker attach container_name

docker exec -it \
  container_name \
  bash
```

## Ports

```bash
docker run -d \
  -p 8080:80 \
  nginx
```

## Networks

```bash
docker network ls

docker network create mynet

docker run -d \
  --network=mynet \
  nginx
```

## Volumes

```bash
docker volume create mydata

docker run \
  -v mydata:/data \
  ubuntu

docker run \
  -v /host/path:/container/path \
  ubuntu

docker run \
  -v mydata:/data:ro \
  ubuntu
```

## Logs

```bash
docker logs container_name

docker logs -f container_name

docker logs \
  --tail 50 \
  container_name

docker logs \
  --since 10m \
  container_name
```

## Monitoring

```bash
docker stats
```

## Inspect

```bash
docker inspect container_name
```

## Build

```bash
docker build -t myapp .

docker build \
  -f Dockerfile.dev \
  -t myapp \
  .

docker build \
  --no-cache \
  -t myapp \
  .
```

## Cleanup

```bash
docker container prune
docker image prune
docker system prune
```

## Compose

```bash
docker compose up
docker compose up -d
docker compose up --build
docker compose down
```

---

# 36. Practical Workflow

A useful Docker workflow based on the lecture is:

```text
Check Docker
     ↓
Pull / Build Image
     ↓
Run Container
     ↓
Inspect with docker ps
     ↓
Test Port / Service
     ↓
View Logs
     ↓
Inspect Metadata
     ↓
Monitor Resources
     ↓
Stop Container
     ↓
Remove Container
     ↓
Clean Unused Resources
```

---

# 37. Hands-On Practice Checklist

## Docker Basics

- [ ] Run `docker version`.
- [ ] Run `docker info`.

## Images

- [ ] List local images.
- [ ] Pull `ubuntu`.
- [ ] Pull `ubuntu:22.04`.
- [ ] Inspect image IDs.
- [ ] Remove an unused image.

## Containers

- [ ] Start an interactive Ubuntu container.
- [ ] Give it a custom name.
- [ ] List running containers.
- [ ] List all containers.
- [ ] Stop a container.
- [ ] Restart a container.
- [ ] Remove a container.

## Commands Inside Containers

- [ ] Use `docker attach`.
- [ ] Use `docker exec -it`.

## Networking

- [ ] Run Nginx with `-p 8080:80`.
- [ ] List networks.
- [ ] Create a custom network.
- [ ] Start a container on the custom network.

## Volumes

- [ ] Create a named volume.
- [ ] Mount the volume.
- [ ] Try a bind mount.
- [ ] Try a read-only mount.

## Logs and Monitoring

- [ ] View logs.
- [ ] Follow logs.
- [ ] Show the last 50 lines.
- [ ] Show recent logs.
- [ ] Run `docker stats`.

## Build

- [ ] Create a Dockerfile.
- [ ] Build an image.
- [ ] Tag the image.
- [ ] Try an alternate Dockerfile.
- [ ] Try `--no-cache`.

## Cleanup

- [ ] Remove stopped containers.
- [ ] Remove unused images.
- [ ] Review `docker system prune`.

## Compose

- [ ] Run `docker compose up`.
- [ ] Try detached mode.
- [ ] Stop with `docker compose down`.

---

# 38. Important Distinctions

## Image vs Container

```text
Image
=
Reusable Blueprint

Container
=
Running Instance
```

---

## Volume vs Container Filesystem

```text
Container Filesystem
=
Tied to container lifecycle

Volume
=
Persistent data managed separately
```

---

## `attach` vs `exec`

```text
docker attach
=
Attach to main container process

docker exec
=
Start another command inside a running container
```

---

## `EXPOSE` vs `-p`

Although `EXPOSE` is a Dockerfile concept and `-p` is a runtime option, the important practical distinction is:

```text
EXPOSE
=
Documents container port

-p
=
Publishes/maps host port to container port
```

---

## Named Volume vs Bind Mount

```text
Named Volume
mydata:/data

Bind Mount
/host/path:/container/path
```

A named volume is managed by Docker, while a bind mount maps a specific host path.

---

# 39. Key Takeaways

1. `docker version` displays Docker client and server version information.
2. `docker info` provides system-wide Docker information.
3. `docker images` lists local images.
4. `docker pull` downloads an image from a registry.
5. Tags such as `ubuntu:22.04` identify image versions.
6. `docker rmi` removes images.
7. `docker run` creates and starts a container.
8. `-it` provides an interactive terminal.
9. `-d` runs a container in the background.
10. `--name` assigns a custom name.
11. `--rm` removes a container automatically after exit.
12. `docker ps` lists running containers.
13. `docker ps -a` includes stopped containers.
14. `docker start`, `stop`, and `restart` manage container state.
15. `docker rm` removes containers.
16. `docker exec` runs commands inside a running container.
17. `-p` maps host ports to container ports.
18. Docker networks support container communication.
19. Volumes provide persistent storage.
20. Bind mounts connect host paths to container paths.
21. `docker logs` displays container logs.
22. `docker stats` displays resource usage.
23. `docker inspect` displays detailed metadata.
24. `docker build` creates images from Dockerfiles.
25. `-t` tags a built image.
26. `--no-cache` disables cached build layers.
27. Prune commands remove unused resources.
28. Docker Compose manages multiple services.
29. `.dockerignore` can be used to keep unwanted files out of image build contexts.
30. The Nginx lab demonstrates the complete pull → run → inspect → log → stop → remove lifecycle.

---

# Conclusion

Docker provides a command-line workflow for managing images, containers, networking, persistent storage, logs, builds, and multi-service applications.

The core relationship is:

```text
Dockerfile
    ↓
Image
    ↓
Container
```

Around that lifecycle, Docker provides additional capabilities:

```text
Networks
   → Container communication

Volumes
   → Persistent data

Port Mapping
   → Host access to container services

Logs
   → Application diagnostics

Stats
   → Resource monitoring

Inspect
   → Detailed metadata
```

The minimal Nginx exercise demonstrates the essential practical workflow:

```text
docker pull
    ↓
docker run
    ↓
docker ps
    ↓
docker logs
    ↓
docker stop
    ↓
docker rm
```

Mastering these commands and flags provides the foundation needed to build, run, inspect, debug, and manage containerized backend applications.
