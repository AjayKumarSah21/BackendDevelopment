# Preserve Changes Made Inside a Docker Container

This lab demonstrates how to:

1. Start an Ubuntu 22.04 container.
2. Install the Java compiler.
3. Create a Java application in `/home/app`.
4. Preserve the modified container using `docker commit`.
5. Reuse the new image.
6. Transfer an image using `docker save` / `docker load`.
7. Compare `docker export` with `docker save`.
8. Build the same application using a Dockerfile.

You do not need to install Ubuntu or Java on Windows. Docker provides the Ubuntu environment.

## Part 1 - Run Ubuntu

```powershell
docker run -it --name java_lab ubuntu:22.04 bash
```

You are now inside Ubuntu.

## Part 2 - Install Java

Inside the container:

```bash
apt update
apt install -y openjdk-17-jdk
javac --version
```

## Part 3 - Create `/home/app`

Inside the container:

```bash
mkdir -p /home/app
cd /home/app
```

The lecture uses `nano Hello.java`. You can use:

```bash
nano Hello.java
```

Enter:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Docker container!");
    }
}
```

Save the file, then compile and run:

```bash
javac Hello.java
java Hello
```

Expected output:

```text
Hello from Docker container!
```

### Easier alternative without nano

Inside the Ubuntu container:

```bash
cat > /home/app/Hello.java <<'EOF'
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Docker container!");
    }
}
EOF
```

Then:

```bash
cd /home/app
javac Hello.java
java Hello
```

## Part 4 - Exit

```bash
exit
```

The container stops, but its filesystem changes remain in the stopped container.

Check:

```powershell
docker ps -a
```

## Part 5 - Commit Container to Image

```powershell
docker commit java_lab myrepo/java-app:1.0
```

Verify:

```powershell
docker images
```

You should see:

```text
myrepo/java-app    1.0
```

## Part 6 - Reuse the Image

```powershell
docker run -it myrepo/java-app:1.0 bash
```

Inside:

```bash
cd /home/app
java Hello
```

Expected:

```text
Hello from Docker container!
```

Then:

```bash
exit
```

## Part 7 - Save Image to TAR

From PowerShell in this project folder:

```powershell
docker save -o java-app.tar myrepo/java-app:1.0
```

Check:

```powershell
dir
```

You should see `java-app.tar`.

This TAR file can be transferred offline.

## Part 8 - Load Image from TAR

Normally this step is done on another machine. To demonstrate the command:

```powershell
docker load -i java-app.tar
docker images
```

## Part 9 - Export Container Filesystem

The original `java_lab` container can also be exported:

```powershell
docker export -o container.tar java_lab
```

This exports the container filesystem only.

### Save vs Export

| Command | Purpose |
|---|---|
| `docker commit` | Modified container -> image |
| `docker save` | Docker image -> TAR file |
| `docker load` | TAR file -> Docker image |
| `docker export` | Container filesystem -> TAR |
| `docker import` | Filesystem TAR -> image |
| `docker push/pull` | Registry-based sharing |

`docker save` preserves image layers and metadata. `docker export` is a raw filesystem export and does not preserve normal image history/configuration in the same way.

## Part 10 - Optional Export/Import Demonstration

Export:

```powershell
docker export -o container.tar java_lab
```

Import:

```powershell
docker import container.tar java-imported:1.0
```

Check:

```powershell
docker images
```

Because export/import focuses on the filesystem, you may need to specify a command manually when running an imported image.

## Part 11 - Best-Practice Dockerfile Version

This ZIP already includes:

- `Dockerfile`
- `Hello.java`

Build:

```powershell
docker build -t java-app:2.0 .
```

Run:

```powershell
docker run --rm java-app:2.0
```

Expected:

```text
Hello from Docker container!
```

## Final Verification

```powershell
docker ps -a
docker images
```

You should be able to identify:

- `java_lab`
- `myrepo/java-app:1.0`
- `java-app:2.0` if you completed the Dockerfile task

The project folder can also contain:

- `java-app.tar`
- `container.tar`

after you run the save/export commands.

## Cleanup

Remove the lab container:

```powershell
docker rm -f java_lab
```

Remove images if you no longer need them:

```powershell
docker rmi myrepo/java-app:1.0
docker rmi java-app:2.0
```

Remove generated TAR files if desired:

```powershell
Remove-Item java-app.tar -ErrorAction SilentlyContinue
Remove-Item container.tar -ErrorAction SilentlyContinue
```

## One-Line Summary

- Modified container -> `docker commit`
- Reuse locally -> `docker run`
- Share offline -> `docker save` / `docker load`
- Share online -> `docker push` / `docker pull`
- Raw filesystem -> `docker export` / `docker import`
- Real projects -> prefer a `Dockerfile`
