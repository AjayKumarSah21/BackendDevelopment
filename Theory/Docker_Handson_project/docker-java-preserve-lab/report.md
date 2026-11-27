# Preserving Changes Made Inside a Docker Container

## Overview

This hands-on report demonstrates how to preserve changes made inside a Docker container and reuse or share those changes.

The practical scenario is:

> Install the Java compiler inside an Ubuntu container, create a Java application in `/home/app`, convert the modified container into a reusable image, and transfer that image when required.

The main Docker workflows covered are:

1. **Container → Image** using `docker commit`
2. **Image → File** using `docker save`
3. **File → Image** using `docker load`
4. **Container filesystem → Archive** using `docker export`
5. Understanding the difference between **save/load** and **export/import**
6. Using a **Dockerfile** as the preferred approach for real projects

---

# 1. Scenario Overview

The lab follows this sequence:

```text
Ubuntu Image
    ↓
Create Container
    ↓
Install Java
    ↓
Create Java Application
    ↓
Compile Application
    ↓
Stop Container
    ↓
docker commit
    ↓
Reusable Docker Image
    ↓
Reuse / Save / Share
```

The resulting container contains:

- Ubuntu 22.04
- OpenJDK 17
- Java compiler (`javac`)
- Java runtime
- `Hello.java`
- Compiled `Hello.class`

---

# 2. Why Preserve Container Changes?

A container has its own writable filesystem layer.

Changes made inside a container can include:

- Installed packages
- Created files
- Configuration changes
- Compiled programs
- Application files

For example:

```text
Base Ubuntu Image
       ↓
Container
       ↓
Install Java
       ↓
Create /home/app/Hello.java
       ↓
Compile Hello.java
       ↓
Modified Container
```

When the container stops, these changes remain in that stopped container.

However, if you want to create new containers containing those changes, you need a reusable image.

For this lab, that is done with:

```bash
docker commit
```

---

# 3. Step 1 — Run the Base Ubuntu Container

Start an interactive Ubuntu 22.04 container:

```bash
docker run -it \
  --name java_lab \
  ubuntu:22.04 \
  bash
```

After this command, you are inside the container.

---

## Understanding the Command

```text
docker run
    ↓
Create and start a new container

-it
    ↓
Interactive terminal

--name java_lab
    ↓
Assign container name

ubuntu:22.04
    ↓
Base image

bash
    ↓
Start Bash shell
```

---

# 4. Verify the Container

From another terminal, you can inspect running containers with:

```bash
docker ps
```

You should see a container named:

```text
java_lab
```

---

# 5. Step 2 — Install the Java Compiler

Inside the Ubuntu container, update the package information:

```bash
apt update
```

Install OpenJDK 17:

```bash
apt install -y openjdk-17-jdk
```

This installs the Java Development Kit, including the Java compiler.

---

# 6. Verify Java Compiler Installation

Run:

```bash
javac --version
```

This verifies that the Java compiler is available inside the container.

You can also verify the Java runtime with:

```bash
java --version
```

---

# 7. Container State After Java Installation

At this point:

```text
Ubuntu Container
├── Ubuntu 22.04
├── OpenJDK 17
├── javac
└── java
```

These packages exist in the container's writable filesystem.

---

# 8. Step 3 — Create the Java Application

Create the application directory:

```bash
mkdir -p /home/app
```

Move into it:

```bash
cd /home/app
```

The application will be stored at:

```text
/home/app
```

---

# 9. Create `Hello.java`

Open:

```bash
nano Hello.java
```

Add:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println(
            "Hello from Docker container!"
        );
    }
}
```

Save the file.

---

# 10. Java Application Structure

The container now contains:

```text
/home/
└── app/
    └── Hello.java
```

---

# 11. Compile the Java Application

Run:

```bash
javac Hello.java
```

The compiler creates:

```text
Hello.class
```

The directory now contains:

```text
/home/app/
├── Hello.java
└── Hello.class
```

---

# 12. Run the Java Application

Execute:

```bash
java Hello
```

Expected output:

```text
Hello from Docker container!
```

---

# 13. Current Container State

The container now contains both the Java environment and application.

```text
java_lab
│
├── Ubuntu 22.04
│
├── OpenJDK 17
│
└── /home/app/
    ├── Hello.java
    └── Hello.class
```

This is now a modified container.

---

# 14. Step 4 — Exit the Container

Run:

```bash
exit
```

Because Bash is the foreground process, the container stops.

---

# 15. Verify the Stopped Container

Run:

```bash
docker ps -a
```

You should see:

```text
java_lab
```

with an `Exited` status.

---

# 16. Do Changes Disappear When the Container Stops?

No.

Stopping a container does not automatically delete its writable filesystem.

The stopped container still contains:

- OpenJDK 17
- `/home/app/Hello.java`
- `/home/app/Hello.class`

Conceptually:

```text
Running Container
      ↓
exit
      ↓
Stopped Container
      ↓
Filesystem Changes Still Present
```

The changes disappear only if the container is removed without first preserving anything you need.

---

# 17. Step 5 — Convert the Container into an Image

The key command is:

```bash
docker commit \
  java_lab \
  myrepo/java-app:1.0
```

This creates a new image from the modified container.

---

# 18. `docker commit` Concept

The transformation is:

```text
Modified Container
       ↓
docker commit
       ↓
Reusable Image
```

In this lab:

```text
java_lab
       ↓
docker commit
       ↓
myrepo/java-app:1.0
```

---

# 19. What `docker commit` Preserves

The commit creates a snapshot of the container filesystem.

The new image contains the modifications made inside the container, including:

```text
Java installation
+
Java source file
+
Compiled Java class
```

---

# 20. Image Name and Tag

The image name is:

```text
myrepo/java-app
```

The tag is:

```text
1.0
```

Together:

```text
myrepo/java-app:1.0
```

Tags are useful for identifying versions.

---

# 21. Verify the New Image

Run:

```bash
docker images
```

Look for:

```text
myrepo/java-app
```

with the tag:

```text
1.0
```

---

# 22. Step 6 — Reuse the Image Locally

Create a new container from the committed image:

```bash
docker run -it \
  myrepo/java-app:1.0 \
  bash
```

This is a **new container** created from the image.

---

# 23. Verify the Application

Inside the new container:

```bash
cd /home/app
```

List the files:

```bash
ls
```

You should find:

```text
Hello.java
Hello.class
```

Run:

```bash
java Hello
```

Expected output:

```text
Hello from Docker container!
```

---

# 24. Why This Works

The new image contains the filesystem state created in the original container.

Therefore:

```text
java_lab
  |
  | Java installed
  | Application created
  v
docker commit
  |
  v
myrepo/java-app:1.0
  |
  v
docker run
  |
  v
New Container
  |
  +-- Java already installed
  +-- Hello.java already exists
  +-- Hello.class already exists
```

---

# 25. Container vs Image

This lab demonstrates an important distinction.

## Container

A container is a running or stopped instance with a writable filesystem.

```text
java_lab
```

is a container.

## Image

An image is a reusable package used to create containers.

```text
myrepo/java-app:1.0
```

is an image.

---

# 26. Step 7 — Save the Image for Offline Transfer

To transfer the image without using a registry, save it to a tar archive.

Run:

```bash
docker save \
  -o java-app.tar \
  myrepo/java-app:1.0
```

This creates:

```text
java-app.tar
```

---

# 27. `docker save` Flow

```text
Docker Image
     ↓
docker save
     ↓
TAR Archive
```

For this lab:

```text
myrepo/java-app:1.0
        ↓
docker save
        ↓
java-app.tar
```

---

# 28. Transfer the Archive

The archive can be transferred through methods such as:

- USB
- SCP

The lecture uses the archive as an offline sharing mechanism.

---

# 29. Load the Image on Another Docker System

On the destination system:

```bash
docker load \
  -i java-app.tar
```

Then verify:

```bash
docker images
```

The image should become available locally again.

---

# 30. `docker load` Flow

```text
java-app.tar
     ↓
docker load
     ↓
Docker Image
```

After loading:

```text
myrepo/java-app:1.0
```

can be used with:

```bash
docker run
```

---

# 31. Complete Offline Transfer Workflow

```text
Computer A
──────────

myrepo/java-app:1.0
        ↓
docker save
        ↓
java-app.tar
        ↓
USB / SCP
        ↓

Computer B
──────────

java-app.tar
        ↓
docker load
        ↓
myrepo/java-app:1.0
        ↓
docker run
        ↓
New Container
```

---

# 32. `docker export` vs `docker save`

This is an important Docker distinction.

They are not interchangeable.

---

# 33. `docker export`

Example:

```bash
docker export \
  java_lab \
  > container.tar
```

`docker export` operates on a **container**.

Conceptually:

```text
Container
    ↓
docker export
    ↓
Filesystem Archive
```

---

# 34. What `docker export` Contains

According to the lab, `docker export` exports the container filesystem.

It does not preserve the full image structure.

Information lost includes:

- Image name
- Image layers
- `CMD`
- `ENTRYPOINT`
- Image metadata

Therefore:

```text
docker export
```

is mainly a raw filesystem-oriented operation.

---

# 35. `docker save`

Example:

```bash
docker save \
  -o image.tar \
  myrepo/java-app:1.0
```

`docker save` operates on an **image**.

Conceptually:

```text
Docker Image
     ↓
docker save
     ↓
Image Archive
```

For sharing a Docker image offline, the lecture recommends:

```text
docker save
+
docker load
```

---

# 36. Save/Load Workflow

```text
Image
  ↓
docker save
  ↓
image.tar
  ↓
docker load
  ↓
Image
```

---

# 37. Export/Import Workflow

The corresponding raw filesystem workflow is:

```text
Container
   ↓
docker export
   ↓
container.tar
   ↓
docker import
   ↓
Image
```

This is different from preserving and transferring a normal Docker image.

---

# 38. Command Comparison

| Command | Transformation | Main Use |
|---|---|---|
| `docker commit` | Container → Image | Preserve a modified container as an image |
| `docker save` | Image → File | Transfer/share an image offline |
| `docker load` | File → Image | Restore a saved image |
| `docker push` | Local image → Registry | Share an image online |
| `docker pull` | Registry → Local image | Download a shared image |
| `docker export` | Container → Raw filesystem archive | Export container filesystem |
| `docker import` | Raw filesystem archive → Image | Create image from exported filesystem |

---

# 39. `docker commit` vs `docker save`

These commands solve different problems.

## `docker commit`

```text
Modified Container
        ↓
      Image
```

Use when you have made changes inside a container and want to preserve those changes as a reusable image.

## `docker save`

```text
Existing Image
      ↓
TAR Archive
```

Use when you already have an image and want to transfer or archive it.

---

# 40. `docker save` vs `docker export`

The easiest distinction is:

```text
docker save
=
Save an IMAGE

docker export
=
Export a CONTAINER filesystem
```

---

# 41. Sharing Through a Registry

The one-line summary also identifies online image sharing through:

```text
docker push
docker pull
```

Conceptually:

```text
Local Image
    ↓
docker push
    ↓
Registry
    ↓
docker pull
    ↓
Another Docker Host
```

---

# 42. Local Reuse vs Offline Sharing vs Online Sharing

| Goal | Recommended Command |
|---|---|
| Reuse image locally | `docker run` |
| Preserve modified container | `docker commit` |
| Share image offline | `docker save` / `docker load` |
| Share image online | `docker push` / `docker pull` |
| Export raw container filesystem | `docker export` / `docker import` |

---

# 43. Best Practice for Real Projects

For learning, labs, and debugging:

```bash
docker commit
```

is useful.

For real projects, the lecture recommends using a:

```text
Dockerfile
```

A Dockerfile records the build process as code.

---

# 44. Dockerfile Version of the Java Lab

Create:

```dockerfile
FROM ubuntu:22.04

RUN apt update \
    && apt install -y openjdk-17-jdk

WORKDIR /home/app

COPY Hello.java .

RUN javac Hello.java

CMD ["java", "Hello"]
```

---

# 45. Dockerfile Explanation

## Base Image

```dockerfile
FROM ubuntu:22.04
```

Starts from Ubuntu 22.04.

---

## Install Java

```dockerfile
RUN apt update \
    && apt install -y openjdk-17-jdk
```

Installs OpenJDK 17 during the image build.

---

## Set Working Directory

```dockerfile
WORKDIR /home/app
```

Subsequent commands use:

```text
/home/app
```

as the working directory.

---

## Copy Java Source

```dockerfile
COPY Hello.java .
```

Copies the source file into:

```text
/home/app
```

inside the image.

---

## Compile Java

```dockerfile
RUN javac Hello.java
```

Creates:

```text
Hello.class
```

during the image build.

---

## Default Command

```dockerfile
CMD ["java", "Hello"]
```

When a container starts from this image, it runs:

```bash
java Hello
```

---

# 46. Build the Dockerfile Image

Run:

```bash
docker build \
  -t java-app:2.0 \
  .
```

This creates:

```text
java-app:2.0
```

---

# 47. Run the Dockerfile-Based Image

```bash
docker run \
  java-app:2.0
```

The image's `CMD` runs:

```text
java Hello
```

Expected output:

```text
Hello from Docker container!
```

---

# 48. Commit-Based vs Dockerfile-Based Workflow

## Commit Workflow

```text
Run Container
     ↓
Manually Install Java
     ↓
Manually Create App
     ↓
Compile App
     ↓
docker commit
     ↓
Image
```

## Dockerfile Workflow

```text
Write Dockerfile
      ↓
docker build
      ↓
Image
```

---

# 49. Why Dockerfiles Are Preferred for Real Projects

A Dockerfile records the steps required to build an image.

The build instructions are visible and repeatable.

For example:

```dockerfile
RUN apt update \
    && apt install -y openjdk-17-jdk
```

documents exactly how Java is installed.

Likewise:

```dockerfile
COPY Hello.java .
RUN javac Hello.java
```

documents how the application is added and compiled.

This makes the build process easier to reproduce than relying only on manual changes inside a container.

---

# 50. When `docker commit` Is Useful

The lecture specifically identifies `docker commit` as valid for:

- Learning
- Labs
- Debugging

It provides a simple way to understand:

```text
Container → Image
```

without first writing a Dockerfile.

---

# 51. Complete Lab Workflow

```text
1. Pull/use Ubuntu image
        ↓
2. Run java_lab container
        ↓
3. Install OpenJDK 17
        ↓
4. Create /home/app
        ↓
5. Create Hello.java
        ↓
6. Compile Hello.java
        ↓
7. Run java Hello
        ↓
8. Exit container
        ↓
9. docker commit
        ↓
10. myrepo/java-app:1.0
        ↓
11. docker run
        ↓
12. Verify Java application
        ↓
13. docker save
        ↓
14. java-app.tar
        ↓
15. Transfer archive
        ↓
16. docker load
        ↓
17. Reuse image elsewhere
```

---

# 52. Command Cheat Sheet

## Create Lab Container

```bash
docker run -it \
  --name java_lab \
  ubuntu:22.04 \
  bash
```

## Install Java

```bash
apt update

apt install -y \
  openjdk-17-jdk
```

## Verify Compiler

```bash
javac --version
```

## Create Application Directory

```bash
mkdir -p /home/app
cd /home/app
```

## Compile

```bash
javac Hello.java
```

## Run

```bash
java Hello
```

## Exit

```bash
exit
```

## Verify Stopped Container

```bash
docker ps -a
```

## Commit Container to Image

```bash
docker commit \
  java_lab \
  myrepo/java-app:1.0
```

## Verify Image

```bash
docker images
```

## Reuse Image

```bash
docker run -it \
  myrepo/java-app:1.0 \
  bash
```

## Save Image

```bash
docker save \
  -o java-app.tar \
  myrepo/java-app:1.0
```

## Load Image

```bash
docker load \
  -i java-app.tar
```

## Export Container Filesystem

```bash
docker export \
  java_lab \
  > container.tar
```

## Build Dockerfile Version

```bash
docker build \
  -t java-app:2.0 \
  .
```

---

# 53. Practical Verification Checklist

## Base Container

- [ ] Start Ubuntu 22.04.
- [ ] Name the container `java_lab`.
- [ ] Open an interactive Bash shell.

## Java

- [ ] Run `apt update`.
- [ ] Install `openjdk-17-jdk`.
- [ ] Verify `javac --version`.

## Application

- [ ] Create `/home/app`.
- [ ] Create `Hello.java`.
- [ ] Compile with `javac Hello.java`.
- [ ] Run with `java Hello`.
- [ ] Verify the expected output.

## Preserve Changes

- [ ] Exit the container.
- [ ] Confirm the container appears in `docker ps -a`.
- [ ] Commit it as `myrepo/java-app:1.0`.
- [ ] Verify it with `docker images`.

## Reuse

- [ ] Create a new container from the committed image.
- [ ] Open `/home/app`.
- [ ] Verify `Hello.java`.
- [ ] Verify `Hello.class`.
- [ ] Run `java Hello`.

## Offline Transfer

- [ ] Save the image to `java-app.tar`.
- [ ] Load it with `docker load`.
- [ ] Verify the restored image.

---

# 54. Common Concept Questions

## What happens to changes when a container stops?

They remain in the stopped container.

Stopping is not the same as removing.

---

## How do I turn a modified container into an image?

Use:

```bash
docker commit
```

---

## How do I create another container from the saved image?

Use:

```bash
docker run
```

---

## How do I transfer the image offline?

Use:

```bash
docker save
```

and:

```bash
docker load
```

---

## How do I share an image using a registry?

Use:

```bash
docker push
```

and:

```bash
docker pull
```

---

## What does `docker export` save?

It exports the container filesystem rather than the full Docker image structure.

---

## What is preferred for real projects?

A Dockerfile.

---

# 55. One-Line Summary

The lecture summarizes the workflow as:

```text
Modified container
    → docker commit

Reuse locally
    → docker run

Share online
    → docker push / docker pull

Share offline
    → docker save / docker load
```

---

# 56. Key Takeaways

1. Changes made inside a stopped container remain in that container.
2. `docker commit` converts a modified container into a reusable image.
3. The Java lab begins with `ubuntu:22.04`.
4. OpenJDK 17 is installed with `apt install -y openjdk-17-jdk`.
5. The Java application is stored in `/home/app`.
6. `javac Hello.java` compiles the Java source.
7. `java Hello` executes the compiled program.
8. `docker commit java_lab myrepo/java-app:1.0` creates the reusable image.
9. `docker run` can create new containers from the committed image.
10. `docker save` writes an image to an archive file.
11. `docker load` restores an image from a saved archive.
12. `docker export` exports a container filesystem.
13. Exported container archives do not preserve the full image metadata/layer structure.
14. `docker save` and `docker export` solve different problems.
15. `docker push/pull` support registry-based image sharing.
16. `docker save/load` support offline image transfer.
17. Dockerfiles are preferred for reproducible real-project builds.
18. `docker commit` remains useful for learning, labs, and debugging.

---

# 57. Summary

The main learning objective is understanding how Docker changes move between containers, images, archives, and other systems.

The most important transformation is:

```text
Modified Container
       ↓
docker commit
       ↓
Reusable Image
```

For offline sharing:

```text
Image
  ↓
docker save
  ↓
TAR File
  ↓
docker load
  ↓
Image
```

For raw filesystem export:

```text
Container
   ↓
docker export
   ↓
Filesystem TAR
```

For real projects, the preferred reproducible workflow is:

```text
Dockerfile
    ↓
docker build
    ↓
Image
    ↓
docker run
    ↓
Container
```

---

# Conclusion

This lab demonstrates how changes made interactively inside a Docker container can be preserved and reused.

The workflow starts with an Ubuntu container, installs OpenJDK 17, creates and compiles a Java application in `/home/app`, and then converts the modified container into:

```text
myrepo/java-app:1.0
```

using:

```bash
docker commit
```

The image can then be reused locally with `docker run`, transferred offline with `docker save` and `docker load`, or shared through a registry using `docker push` and `docker pull`.

The most important conceptual distinction is:

```text
docker commit
Container → Image

docker save
Image → Archive

docker load
Archive → Image

docker export
Container → Raw Filesystem Archive
```

For learning and debugging, `docker commit` provides a useful hands-on way to understand container filesystem changes. For real projects, a Dockerfile provides a clearer and reproducible description of how the image should be built.
