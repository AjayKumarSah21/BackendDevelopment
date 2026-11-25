# Docker Ubuntu Attach & Debug Lab

You do **not** need to install Ubuntu on Windows. Docker downloads the Ubuntu image and runs Ubuntu inside a container.

## 1. Verify Docker

Make sure Docker Desktop is running.

```powershell
docker version
docker info
```

## 2. Pull Ubuntu Image

```powershell
docker pull ubuntu
docker images
```

## 3. Demonstrate Why `docker run ubuntu` Exits

```powershell
docker run ubuntu
docker ps -a
```

The Ubuntu container normally goes to `Exited (0)` because there is no interactive terminal keeping Bash active.

## 4. Create an Interactive Ubuntu Container

```powershell
docker run -it --name ubuntu-lab ubuntu /bin/bash
```

You should enter a prompt similar to:

```text
root@container_id:/#
```

Try:

```bash
pwd
ls
cat /etc/os-release
```

Exit:

```bash
exit
```

The container stops. This is expected.

## 5. Start and Attach Again

```powershell
docker start -ai ubuntu-lab
```

`-a` attaches to the container and `-i` keeps standard input interactive.

Exit again with:

```bash
exit
```

## 6. Start + Attach Using Container ID

Find the ID:

```powershell
docker ps -a
```

Then:

```powershell
docker start -ai <container_id>
```

Replace `<container_id>` with the actual ID shown by Docker.

## 7. Demonstrate `docker exec`

Create a long-running Ubuntu container:

```powershell
docker run -d --name ubuntu-running ubuntu sleep infinity
```

Verify:

```powershell
docker ps
```

Enter it:

```powershell
docker exec -it ubuntu-running /bin/bash
```

Inside Ubuntu:

```bash
pwd
ls
cat /etc/os-release
```

Exit the shell:

```bash
exit
```

The container remains running because `sleep infinity` is still the foreground process.

## 8. Attach vs Exec

For a running container:

```powershell
docker exec -it ubuntu-running /bin/bash
```

`docker exec` is generally safer for opening an additional shell in an already-running container.

## 9. Final Verification

```powershell
docker ps
docker ps -a
docker images
```

## 10. Cleanup

```powershell
docker rm -f ubuntu-lab ubuntu-running
```

Optional image removal:

```powershell
docker rmi ubuntu
```

## Quick Cheat Sheet

```powershell
docker ps -a
docker start -ai ubuntu-lab
docker run -it ubuntu /bin/bash
docker exec -it ubuntu-running /bin/bash
```

## Key Concept

A Docker container stays alive only while its main foreground process is running. An Ubuntu container started without an interactive terminal can exit immediately when its default shell has nothing to do.
