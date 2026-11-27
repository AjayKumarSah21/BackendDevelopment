# Docker: Attaching to Stopped Containers and Debugging Ubuntu Containers

## Overview

This report explains why a basic Ubuntu Docker container may exit immediately and shows the main ways to start, attach to, and interact with containers.

The key Docker principle is:

> **A container stays alive only while its foreground process is running.**

---

# 1. Why an Ubuntu Container Exits Immediately

Consider:

```bash
docker run ubuntu
```

Docker creates and starts a container from the Ubuntu image.

The container runs its default command, which is effectively a shell such as:

```bash
/bin/bash
```

However, the command was started without:

- An interactive session
- A terminal/TTY

As a result, the shell has nothing to interact with and exits.

The container then enters the:

```text
Exited
```

state.

---

## Container Lifecycle

Conceptually:

```text
docker run ubuntu
        ↓
Container Starts
        ↓
/bin/bash Starts
        ↓
No Interactive Input / TTY
        ↓
bash Exits
        ↓
Container Stops
        ↓
Exited State
```

Docker containers remain alive only while their main foreground process remains alive.

---

# 2. Check Container Status

List all containers:

```bash
docker ps -a
```

Unlike:

```bash
docker ps
```

which normally shows running containers, the `-a` option also shows stopped containers.

Example:

```text
CONTAINER ID   IMAGE    STATUS
abc123         ubuntu   Exited (0)
```

This indicates that the Ubuntu container has stopped.

---

# 3. Useful Container States

A container may appear in states such as:

```text
Created
Running
Exited
```

For this exercise, the important distinction is:

```text
Running
   ↓
Foreground process is active

Exited
   ↓
Foreground process has stopped
```

---

# 4. Option 1 — Start an Existing Stopped Container

If the container already exists, start it with:

```bash
docker start <container_id_or_name>
```

Example:

```bash
docker start abc123
```

You can use either:

- Container ID
- Container name

---

# 5. Attach to the Container

After starting it:

```bash
docker attach <container_id_or_name>
```

Example:

```bash
docker attach abc123
```

This attaches your terminal to the container's main process.

---

## Important Limitation

If the original container was not created with an interactive shell, starting and attaching may not solve the problem.

The main process can immediately exit again.

Therefore:

```bash
docker start abc123
docker attach abc123
```

may result in:

```text
Container starts
      ↓
Shell has no useful interactive session
      ↓
Shell exits again
      ↓
Container stops
```

---

# 6. Option 2 — Start and Attach in One Command

A more convenient command for an existing stopped container is:

```bash
docker start -ai <container_id_or_name>
```

Example:

```bash
docker start -ai abc123
```

---

## Flags

| Flag | Meaning |
|---|---|
| `-a` | Attach to the container |
| `-i` | Keep standard input interactive |

Therefore:

```bash
docker start -ai abc123
```

means:

```text
Start Container
      +
Attach Terminal
      +
Keep Input Interactive
```

---

# 7. Option 3 — Create a New Interactive Ubuntu Container

The most common way to create an Ubuntu container for shell interaction is:

```bash
docker run -it ubuntu /bin/bash
```

This creates a new container with an interactive Bash shell.

---

## Understanding the Command

```bash
docker run -it ubuntu /bin/bash
```

can be broken down as:

```text
docker run
    ↓
Create and start container

-it
    ↓
Interactive terminal

ubuntu
    ↓
Image

/bin/bash
    ↓
Command executed inside container
```

---

# 8. Understanding `-i`

The:

```text
-i
```

flag means:

```text
interactive
```

It keeps standard input available for interaction.

---

# 9. Understanding `-t`

The:

```text
-t
```

flag allocates a pseudo-terminal.

Together:

```text
-it
```

provides an interactive terminal session.

---

# 10. Interactive Ubuntu Example

Run:

```bash
docker run -it ubuntu /bin/bash
```

You should enter the Ubuntu container and see a prompt similar to:

```text
root@container_id:/#
```

You can now execute Linux commands inside the container.

Examples:

```bash
pwd
```

```bash
ls
```

```bash
whoami
```

---

# 11. Exit the Interactive Container

Inside the container, run:

```bash
exit
```

Because Bash is the container's main foreground process, exiting Bash causes the container to stop.

Flow:

```text
Interactive Container
        ↓
/bin/bash Running
        ↓
User types exit
        ↓
/bin/bash Stops
        ↓
Container Stops
```

This behavior is expected.

---

# 12. Verify That the Container Stopped

After exiting, run:

```bash
docker ps -a
```

The container should appear with an `Exited` status.

---

# 13. Restart the Interactive Container

If the container was originally created interactively, you can start and attach to it again:

```bash
docker start -ai <container_id_or_name>
```

Example:

```bash
docker start -ai abc123
```

This reuses the existing container instead of creating another one.

---

# 14. Option 4 — Enter an Already Running Container

If a container is already running, use:

```bash
docker exec -it \
  <container_id_or_name> \
  /bin/bash
```

Example:

```bash
docker exec -it abc123 /bin/bash
```

This starts another Bash process inside the running container.

---

# 15. Why `docker exec` Is Useful

For a running container:

```text
Container Main Process
        |
        | remains running
        |
        +---- docker exec
                  ↓
             New Shell
```

This allows you to inspect or debug the container without replacing its main process.

---

# 16. `docker attach` vs `docker exec`

These commands are related but serve different purposes.

| Command | Purpose |
|---|---|
| `docker attach` | Attach to the container's existing main process |
| `docker exec` | Start a new command inside an already running container |

---

## `docker attach`

```bash
docker attach container_name
```

Conceptually:

```text
Terminal
   ↓
Existing Main Process
```

---

## `docker exec`

```bash
docker exec -it \
  container_name \
  /bin/bash
```

Conceptually:

```text
Running Container
      |
      +---- Main Process
      |
      +---- New Bash Process
```

For a running container, `docker exec -it` is the common approach for opening a shell.

---

# 17. Stopped vs Running Containers

Choose the command based on the container's current state.

## Container Is Stopped

Check:

```bash
docker ps -a
```

Then try:

```bash
docker start -ai <id>
```

---

## Container Is Running

Check:

```bash
docker ps
```

Then use:

```bash
docker exec -it <id> /bin/bash
```

---

# 18. New Container vs Existing Container

Another important distinction is whether you want to reuse a container or create a new one.

### Create a New Container

```bash
docker run -it ubuntu /bin/bash
```

### Reuse an Existing Stopped Container

```bash
docker start -ai <id>
```

### Enter an Existing Running Container

```bash
docker exec -it <id> /bin/bash
```

---

# 19. `docker run` vs `docker start`

## `docker run`

```bash
docker run ...
```

creates a **new container** from an image and starts it.

```text
Image
  ↓
docker run
  ↓
New Container
```

---

## `docker start`

```bash
docker start ...
```

starts a container that already exists.

```text
Stopped Existing Container
          ↓
      docker start
          ↓
Running Existing Container
```

This distinction is important because repeatedly using `docker run` creates additional containers.

---

# 20. Troubleshooting Workflow

If an Ubuntu container appears to disappear after:

```bash
docker run ubuntu
```

use the following workflow.

### Step 1 — List All Containers

```bash
docker ps -a
```

### Step 2 — Find the Ubuntu Container

Look for:

```text
IMAGE    STATUS
ubuntu   Exited (...)
```

### Step 3 — Decide What You Need

If you want to reuse the existing container:

```bash
docker start -ai <id>
```

If you want a fresh interactive Ubuntu container:

```bash
docker run -it ubuntu /bin/bash
```

If the container is already running:

```bash
docker exec -it <id> /bin/bash
```

---

# 21. Quick Decision Guide

```text
Do you already have a container?
          |
      +---+---+
      |       |
     No      Yes
      |       |
      v       v
docker run   Is it running?
-it ubuntu      |
/bin/bash    +--+--+
             |     |
            No    Yes
             |     |
             v     v
       docker     docker
       start -ai  exec -it
       <id>       <id> /bin/bash
```

---

# 22. Common Commands

## List Running Containers

```bash
docker ps
```

## List All Containers

```bash
docker ps -a
```

## Start a Container

```bash
docker start <id>
```

## Start and Attach

```bash
docker start -ai <id>
```

## Attach to Running Main Process

```bash
docker attach <id>
```

## Create Interactive Ubuntu Container

```bash
docker run -it ubuntu /bin/bash
```

## Open Bash in Running Container

```bash
docker exec -it <id> /bin/bash
```

---

# 23. Quick Cheat Sheet

```bash
# List all containers
docker ps -a

# List only running containers
docker ps

# Start existing container
docker start <id>

# Start + attach interactively
docker start -ai <id>

# Attach to existing main process
docker attach <id>

# Create a new interactive Ubuntu container
docker run -it ubuntu /bin/bash

# Enter an already running container
docker exec -it <id> /bin/bash
```

---

# 24. Practical Exercise

## Step 1

Run Ubuntu without interactive flags:

```bash
docker run ubuntu
```

---

## Step 2

Inspect all containers:

```bash
docker ps -a
```

Observe that the Ubuntu container is in an `Exited` state.

---

## Step 3

Try to restart and attach:

```bash
docker start -ai <container_id>
```

Observe the behavior.

---

## Step 4

Create a new interactive Ubuntu container:

```bash
docker run -it ubuntu /bin/bash
```

---

## Step 5

Inside the container, run:

```bash
whoami
```

```bash
pwd
```

```bash
ls
```

---

## Step 6

Exit:

```bash
exit
```

---

## Step 7

Check the state again:

```bash
docker ps -a
```

---

## Step 8

Restart the interactive container:

```bash
docker start -ai <container_id>
```

---

# 25. Key Concepts

## Containers Depend on Their Main Process

```text
Main Process Running
        =
Container Running
```

```text
Main Process Exits
        =
Container Stops
```

---

## Interactive Ubuntu

For an interactive shell:

```bash
docker run -it ubuntu /bin/bash
```

---

## Reusing a Stopped Container

Use:

```bash
docker start -ai <id>
```

---

## Entering a Running Container

Use:

```bash
docker exec -it <id> /bin/bash
```

---

# 26. Key Takeaways

1. `docker run ubuntu` can exit immediately because its foreground shell has no interactive terminal/session.
2. Docker containers stay alive while their foreground process is running.
3. `docker ps -a` displays both running and stopped containers.
4. A stopped container can be started with `docker start`.
5. `docker start -ai` starts and attaches interactively in one command.
6. `-a` means attach.
7. `-i` keeps standard input interactive.
8. `docker run -it ubuntu /bin/bash` is the common way to create an interactive Ubuntu shell.
9. `-t` allocates a pseudo-terminal.
10. Typing `exit` stops an interactive Ubuntu container when Bash is its main process.
11. `docker attach` connects to the container's existing main process.
12. `docker exec` starts a new command inside a running container.
13. `docker exec -it <id> /bin/bash` is commonly used to open a shell in a running container.
14. `docker run` creates a new container.
15. `docker start` reuses an existing container.
16. The correct command depends on whether the container is new, stopped, or already running.

---

# 27. Summary

The central idea is simple:

```text
Container Lifetime
       =
Foreground Process Lifetime
```

Running:

```bash
docker run ubuntu
```

may produce:

```text
Ubuntu Container
      ↓
Bash Starts
      ↓
No Interactive TTY
      ↓
Bash Exits
      ↓
Container Exits
```

For a new interactive Ubuntu shell, use:

```bash
docker run -it ubuntu /bin/bash
```

For an existing stopped interactive container, use:

```bash
docker start -ai <id>
```

For an already running container, use:

```bash
docker exec -it <id> /bin/bash
```

---

# Conclusion

Understanding the relationship between a Docker container and its foreground process explains why a basic Ubuntu container may stop immediately.

The most useful commands from this exercise are:

```bash
docker ps -a
```

```bash
docker start -ai <id>
```

```bash
docker run -it ubuntu /bin/bash
```

```bash
docker exec -it <id> /bin/bash
```

Together, these commands cover the most common situations when creating, restarting, attaching to, and debugging interactive Ubuntu containers.
