# Deployment Environments, Containerization, and Docker

## Lecture Information

- **Lectures:** 37–39
- **Unit:** Unit 4 — Deployment and DevOps
- **Topic:** Deployment environments, containerization, Docker images, and containers
- **Course Outcomes:** CO4 — Apply security best practices and conduct testing; CO5 — Demonstrate effective team collaboration skills
- **Bloom's Knowledge Level:** Understand, Apply, Analyze
- **Skills Developed:** Comparing deployment environments, writing Dockerfiles, building images, running containers, API testing, debugging, and documentation
- **Applications:** Deploying APIs to local systems, VPS platforms, cloud services, and container-based infrastructure
- **PBL Activity:** Containerize and test the same Student API using FastAPI and Express
- **Assessment:** Practical coding task, Docker demonstration, API test, and viva

---

# Lecture Flow

The three lectures form a practical deployment sequence:

```text
Lecture 37
Where applications run
        ↓
Lecture 38
Why containerization helps
        ↓
Lecture 39
Build, run, test, and debug Docker containers
```

---

# Learning Objectives

By the end of these lectures, students should be able to:

1. Distinguish between local, staging, production, cloud, VPS, and container-based environments.
2. Explain the difference between a Dockerfile, Docker image, container, registry, and volume.
3. Create Dockerfiles for FastAPI and Express applications.
4. Build Docker images.
5. Run containers with port mapping.
6. Test containerized APIs using a browser, `curl`, or an API client.
7. Inspect running containers and logs.
8. Identify and fix common Docker problems.
9. Document the build, run, test, and troubleshooting process.

---

# Part A — Deployment Environments

## 1. What Is Deployment?

**Deployment** is the process of making an application available in an environment where it can be used by developers, testers, or end users.

A typical application may move through several environments:

```text
Developer Machine
       |
       | build
       v
Staging Environment
       |
       | test
       v
Production Environment
       |
       | serve
       v
End Users
```

The same application can run in multiple environments, but each environment may have different:

- Configuration
- Data
- Permissions
- Users
- Infrastructure

---

# 2. Common Deployment Environments

| Environment | Purpose | Typical Example |
|---|---|---|
| Local | Development and debugging | Laptop with Python, Node.js, or Docker |
| Staging | Production-like testing | Separate VPS or cloud service |
| Production | Live service for users | AWS, Azure, or production VPS |
| Container environment | Reproducible execution | Docker host or Kubernetes cluster |

---

## 2.1 Local Environment

A local environment is typically a developer's own computer.

Examples:

```text
Laptop
Desktop
Development VM
Local Docker installation
```

### Advantages

- Fast development cycle
- Easy debugging
- Direct access to source code
- Convenient experimentation

### Challenge

Different team members may have different:

- Operating systems
- Runtime versions
- Installed libraries
- System configuration

This can create the classic problem:

```text
"It works on my machine."
```

---

## 2.2 Staging Environment

A staging environment is designed to resemble production.

Its purpose is to test the application before exposing it to real users.

Typical uses include:

- Integration testing
- Deployment testing
- Configuration testing
- Pre-release verification

---

## 2.3 Production Environment

Production is the live environment used by real users.

Examples include:

- AWS
- Azure
- Production VPS
- Container infrastructure

Production systems generally require stronger controls for:

- Security
- Monitoring
- Backups
- Availability
- Configuration
- Access

---

## 2.4 Cloud Platforms

Cloud platforms provide managed infrastructure and services.

Examples from the lecture include:

```text
AWS
Azure
```

Cloud platforms may provide:

- Computing
- Networking
- Storage
- Deployment services

---

## 2.5 VPS

A **Virtual Private Server (VPS)** gives developers more control over the operating environment.

With this control comes responsibility for tasks such as:

- Updates
- Firewall rules
- Docker
- Monitoring
- Backups
- Security

---

## 2.6 Container Environments

Container-based environments provide reproducible execution.

Examples include:

```text
Docker Host
Kubernetes Cluster
```

Containerization helps reduce differences between development, staging, and production environments.

---

# 3. Configuration and Secrets

Environment-specific configuration should not normally be hard-coded into application source code.

Examples include:

```text
PORT=8000
DATABASE_URL=...
API_KEY=...
```

Environment variables allow the same application to run with different configuration.

---

## 3.1 Security Rule

Never commit sensitive values such as:

- Passwords
- API keys
- Private tokens
- Production database credentials

to Git.

Also avoid copying secrets directly into Docker images.

A Docker image may be stored, shared, or published, so embedded secrets can become exposed.

---

# Part B — Containerization Basics

# 4. What Is Containerization?

**Containerization** packages an application together with its runtime, libraries, dependencies, and configuration into a portable execution unit called a **container**.

The overall Docker workflow is:

```text
Dockerfile
    |
    | build instructions
    v
Docker Image
    |
    | run
    v
Container
    |
    | serves
    v
HTTP API
```

---

# 5. Dockerfile, Image, and Container

A useful distinction is:

```text
Dockerfile = Instructions

Image = Package

Container = Running Instance
```

### Dockerfile

A text file containing instructions used to build an image.

### Image

A reusable, read-only package containing application files and dependencies.

### Container

A running instance of an image.

---

# 6. Core Docker Concepts

| Concept | Meaning |
|---|---|
| Dockerfile | Instructions used to build an image |
| Image | Read-only package containing application files and dependencies |
| Container | Running instance of an image |
| Registry | Service for storing and distributing images |
| Port mapping | Maps a host port to a container port |
| Volume | Persistent storage managed separately from the container |
| `.dockerignore` | Excludes files from the image build context |

---

# 7. Docker Registry

A registry stores and distributes Docker images.

The lecture gives **Docker Hub** as an example.

Conceptually:

```text
Developer
   |
   | docker push
   v
Registry
   |
   | docker pull
   v
Server
```

---

# 8. Port Mapping

Applications inside containers listen on container ports.

Users access them through host ports.

Example:

```bash
docker run -p 8000:8000 image-name
```

The syntax is:

```text
-p HOST_PORT:CONTAINER_PORT
```

Therefore:

```text
-p 8000:8000
```

means:

```text
Host port 8000
        ↓
Container port 8000
```

---

# 9. Docker Volumes

A volume provides persistent storage that is managed separately from the container.

This is important because containers may be deleted and recreated.

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

# 10. `.dockerignore`

`.dockerignore` excludes unnecessary or sensitive files from the Docker build context.

Examples include:

```text
.git/
.env
node_modules/
__pycache__/
.venv/
```

Benefits include:

- Smaller build context
- Faster builds
- Cleaner images
- Reduced risk of copying unwanted files

---

# 11. Containers vs Virtual Machines

| Container | Virtual Machine |
|---|---|
| Shares the host OS kernel | Includes a complete guest operating system |
| Usually starts quickly | Usually takes longer to start |
| Usually uses fewer resources | Usually uses more resources |
| Packages application and dependencies | Virtualizes an entire machine |

Containers are lightweight compared with full virtual machines, but they still require security management.

---

## 11.1 Container Security

Containers still require:

- Secure base images
- Patching
- Secret management
- Restricted access
- Appropriate users
- Appropriate permissions

Containerization does not automatically make an application secure.

---

# 12. Install and Verify Docker

Install:

- Docker Desktop on Windows or macOS
- Docker Engine on Linux

Verify the installation:

```bash
docker --version
```

Run a test image:

```bash
docker run hello-world
```

Inspect running containers:

```bash
docker ps
```

List images:

```bash
docker images
```

The `hello-world` container may not appear in `docker ps` after completion because it exits after printing its success message.

---

# Part C — Working with Docker

# 13. Dockerfile Instructions

Important Dockerfile instructions include:

```dockerfile
FROM
WORKDIR
COPY
RUN
EXPOSE
CMD
```

---

## 13.1 `FROM`

Selects the base image.

Example:

```dockerfile
FROM python:3.12-slim
```

or:

```dockerfile
FROM node:22-alpine
```

---

## 13.2 `WORKDIR`

Sets the working directory inside the image/container.

```dockerfile
WORKDIR /app
```

---

## 13.3 `COPY`

Copies files into the image.

```dockerfile
COPY main.py .
```

---

## 13.4 `RUN`

Executes a command during image creation.

Example:

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt
```

---

## 13.5 `EXPOSE`

Documents the application port.

```dockerfile
EXPOSE 8000
```

Important:

> `EXPOSE` does **not** publish the port to the host.

Port publishing is performed using:

```bash
docker run -p
```

---

## 13.6 `CMD`

Defines the default command executed when the container starts.

Example:

```dockerfile
CMD [
    "uvicorn",
    "main:app",
    "--host",
    "0.0.0.0",
    "--port",
    "8000"
]
```

---

# 14. Build–Run–Test Workflow

A common Docker workflow is:

```text
Write Application
       ↓
Write Dockerfile
       ↓
Write .dockerignore
       ↓
docker build
       ↓
Docker Image
       ↓
docker run -p
       ↓
Running Container
       ↓
curl / Browser / API Client
       ↓
docker logs
       ↓
Debug if necessary
```

---

# 15. Common Docker Commands

## Build an Image

```bash
docker build -t image-name:1.0 .
```

## Run a Container

```bash
docker run \
  --name container-name \
  -p 8000:8000 \
  image-name:1.0
```

## List Running Containers

```bash
docker ps
```

## View Logs

```bash
docker logs container-name
```

## Stop a Container

```bash
docker stop container-name
```

## Remove a Container

```bash
docker rm container-name
```

## List Images

```bash
docker images
```

---

# Part D — Required Hands-On

# 16. Problem Statement

Create the same small Student API using:

1. FastAPI
2. Express

Then:

- Build a separate Docker image for each implementation.
- Run both containers.
- Verify that both applications provide the same API contract.

---

# 17. Required API Contract

| Method | Endpoint | Expected Result |
|---|---|---|
| GET | `/` | Application name and status |
| GET | `/health` | Health status |
| GET | `/students` | List of students |

---

# 18. Recommended Repository Structure

```text
docker-student-api/
├── fastapi-app/
└── express-app/
```

---

# 19. FastAPI Application

Create:

```text
fastapi-app/main.py
```

Add:

```python
from fastapi import FastAPI


app = FastAPI(
    title="Student API - FastAPI"
)


students = [
    {
        "id": 1,
        "name": "Aarav",
        "course": "Backend Development",
    },
    {
        "id": 2,
        "name": "Diya",
        "course": "Backend Development",
    },
]


@app.get("/")
def root():
    return {
        "application": "Student API",
        "framework": "FastAPI",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/students")
def list_students():
    return students
```

FastAPI automatically serializes returned Python dictionaries and lists as JSON.

---

# 20. FastAPI Requirements

Create:

```text
fastapi-app/requirements.txt
```

Add:

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
```

---

# 21. FastAPI Dockerfile

Create:

```text
fastapi-app/Dockerfile
```

Add:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install \
    --no-cache-dir \
    -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD [
    "uvicorn",
    "main:app",
    "--host",
    "0.0.0.0",
    "--port",
    "8000"
]
```

---

# 22. Why Copy Dependencies First?

The Dockerfile copies:

```dockerfile
COPY requirements.txt .
```

before:

```dockerfile
COPY main.py .
```

This allows Docker to reuse the dependency installation layer when only application code changes.

Conceptually:

```text
requirements.txt unchanged
        ↓
Reuse dependency layer
        ↓
Only rebuild application-code layer
```

---

# 23. Why Use `0.0.0.0`?

Inside a container, the application must listen on:

```text
0.0.0.0
```

so it can be reached through Docker's port mapping.

Using only:

```text
127.0.0.1
```

inside the container can make the API unreachable from outside the container.

---

# 24. FastAPI `.dockerignore`

Create:

```text
fastapi-app/.dockerignore
```

Add:

```dockerignore
__pycache__/
*.pyc
.venv/
.git/
```

---

# 25. Build the FastAPI Image

Move into the FastAPI directory:

```bash
cd fastapi-app
```

Build:

```bash
docker build \
  -t student-api-fastapi:1.0 \
  .
```

---

# 26. Run the FastAPI Container

```bash
docker run \
  --name student-fastapi \
  -p 8000:8000 \
  student-api-fastapi:1.0
```

The mapping means:

```text
localhost:8000
      ↓
container:8000
```

---

# 27. Test FastAPI

Test the root endpoint:

```bash
curl http://localhost:8000/
```

Test health:

```bash
curl http://localhost:8000/health
```

Test students:

```bash
curl http://localhost:8000/students
```

FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

Expected health response:

```json
{"status":"healthy"}
```

---

# 28. Express Application

Create:

```text
express-app/package.json
```

Add:

```json
{
  "name": "student-api-express",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

---

# 29. Express Server

Create:

```text
express-app/server.js
```

Add:

```js
const express = require("express");

const app = express();

const port =
  process.env.PORT || 3000;


const students = [
  {
    id: 1,
    name: "Aarav",
    course: "Backend Development"
  },
  {
    id: 2,
    name: "Diya",
    course: "Backend Development"
  }
];


app.get("/", (req, res) => {
  res.json({
    application: "Student API",
    framework: "Express",
    status: "running"
  });
});


app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});


app.get("/students", (req, res) => {
  res.json(students);
});


app.listen(
  port,
  "0.0.0.0",
  () => {
    console.log(
      "Express API listening on port "
      + port
    );
  }
);
```

---

# 30. Environment-Based Port Configuration

The Express application uses:

```js
process.env.PORT || 3000
```

This allows the port to be configured without modifying source code.

Conceptually:

```text
PORT environment variable exists?
        |
   +----+----+
   |         |
  Yes        No
   |         |
Use PORT   Use 3000
```

---

# 31. Express Dockerfile

Create:

```text
express-app/Dockerfile
```

Add:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# 32. Docker Layer Caching for Express

The Dockerfile copies:

```dockerfile
COPY package*.json ./
```

before:

```dockerfile
COPY server.js .
```

This allows the dependency layer to remain cached when application code changes but dependency files remain unchanged.

---

# 33. Express `.dockerignore`

Create:

```text
express-app/.dockerignore
```

Add:

```dockerignore
node_modules/
npm-debug.log
.git/
.env
```

The `.env` file is excluded because it may contain configuration or secrets.

---

# 34. Build the Express Image

```bash
cd express-app
```

Build:

```bash
docker build \
  -t student-api-express:1.0 \
  .
```

---

# 35. Run the Express Container

```bash
docker run \
  --name student-express \
  -p 3000:3000 \
  student-api-express:1.0
```

---

# 36. Test Express

Root:

```bash
curl http://localhost:3000/
```

Health:

```bash
curl http://localhost:3000/health
```

Students:

```bash
curl http://localhost:3000/students
```

Expected health response:

```json
{"status":"healthy"}
```

---

# 37. Run Both Containers Together

The two applications can run simultaneously because they use different host ports.

FastAPI:

```bash
docker run -d \
  --name student-fastapi \
  -p 8000:8000 \
  student-api-fastapi:1.0
```

Express:

```bash
docker run -d \
  --name student-express \
  -p 3000:3000 \
  student-api-express:1.0
```

---

# 38. Test Both Applications

FastAPI health:

```bash
curl http://localhost:8000/health
```

Express health:

```bash
curl http://localhost:3000/health
```

FastAPI students:

```bash
curl http://localhost:8000/students
```

Express students:

```bash
curl http://localhost:3000/students
```

Both applications implement the same API contract even though they use different programming languages and frameworks.

---

# 39. API Contract Comparison

| Feature | FastAPI | Express |
|---|---|---|
| Language | Python | JavaScript |
| Root endpoint | `/` | `/` |
| Health endpoint | `/health` | `/health` |
| Student endpoint | `/students` | `/students` |
| Health response | `{"status":"healthy"}` | `{"status":"healthy"}` |
| Container port | 8000 | 3000 |
| Host port | 8000 | 3000 |

The implementation differs, but the client-facing contract remains consistent.

---

# 40. Inspect the Containers

List running containers:

```bash
docker ps
```

FastAPI logs:

```bash
docker logs student-fastapi
```

Express logs:

```bash
docker logs student-express
```

---

# 41. Stop Both Containers

```bash
docker stop \
  student-fastapi \
  student-express
```

---

# 42. Remove Both Containers

```bash
docker rm \
  student-fastapi \
  student-express
```

---

# Part E — Testing and Troubleshooting

# 43. Verification Checklist

| Check | Evidence |
|---|---|
| Docker installed | `docker --version` |
| Images built | `docker images` |
| Containers running | `docker ps` |
| FastAPI endpoints work | `curl http://localhost:8000/...` |
| Express endpoints work | `curl http://localhost:3000/...` |
| Logs are understandable | `docker logs <container-name>` |
| Documentation complete | README containing commands and outputs |

---

# 44. Common Docker Problems

| Problem | Likely Cause | Fix |
|---|---|---|
| Cannot connect to Docker daemon | Docker is not running | Start Docker Desktop or Docker Engine |
| Port already in use | Another process uses the host port | Use another host port |
| Container exits immediately | Command or dependency failed | Inspect `docker logs` |
| API is unreachable | Server listens on `127.0.0.1` | Bind application to `0.0.0.0` |
| Dependency file not found | Wrong build context or filename | Build from the correct app directory |
| Code changes are missing | Image was not rebuilt | Rebuild image and recreate container |

---

# 45. Port Already in Use

Suppose port `8000` is already occupied.

Instead of:

```bash
docker run \
  -p 8000:8000 \
  student-api-fastapi:1.0
```

use another host port:

```bash
docker run \
  -p 8001:8000 \
  student-api-fastapi:1.0
```

Now:

```text
Host 8001
    ↓
Container 8000
```

The application is accessed at:

```text
http://localhost:8001/
```

---

# 46. Container Exits Immediately

If a container stops immediately, inspect its logs:

```bash
docker logs <container-name>
```

Possible causes include:

- Missing dependency
- Invalid startup command
- Application crash
- Missing file
- Configuration problem

---

# 47. API Is Unreachable

A common cause is binding the server to:

```text
127.0.0.1
```

inside the container.

For Docker, use:

```text
0.0.0.0
```

FastAPI:

```text
--host 0.0.0.0
```

Express:

```js
app.listen(
  port,
  "0.0.0.0"
);
```

---

# 48. Dependency File Not Found

If Docker cannot find:

```text
requirements.txt
```

or:

```text
package.json
```

the build context may be wrong.

Build from the application directory:

```bash
cd fastapi-app
docker build -t student-api-fastapi:1.0 .
```

or:

```bash
cd express-app
docker build -t student-api-express:1.0 .
```

---

# 49. Code Changes Are Missing

Docker images do not automatically update when source code changes.

If code changes are not visible:

1. Stop/remove the old container.
2. Rebuild the image.
3. Create a new container.

Example:

```bash
docker build \
  -t student-api-fastapi:1.0 \
  .
```

Then run the new image again.

---

# 50. Recommended Debugging Order

The lecture recommends inspecting errors in this order:

```text
1. Container Status
        ↓
2. Container Logs
        ↓
3. Image Build Output
        ↓
4. Port Mapping
        ↓
5. Application Configuration
```

Commands include:

```bash
docker ps
```

```bash
docker logs <container-name>
```

```bash
docker images
```

---

# Part F — PBL Activity and Assessment

# 51. PBL Activity: Portable Student API

## Scenario

A team has created the same Student API using:

- FastAPI
- Express

Team members use different:

- Operating systems
- Runtime versions
- Development environments

The goal is to create reproducible Docker images that can later be deployed to a VPS or cloud platform.

---

# 52. Student Tasks

Students must:

1. Create both applications using the required API contract.
2. Write a Dockerfile for each application.
3. Write a `.dockerignore` for each application.
4. Build both images using meaningful tags.
5. Run both containers on separate host ports.
6. Test `/`.
7. Test `/health`.
8. Test `/students`.
9. Record commands and outputs in `README.md`.
10. Work in pairs.
11. Review each other's Dockerfiles.

---

# 53. Team Collaboration

The lecture suggests:

```text
Student A
   ↓
FastAPI implementation

Student B
   ↓
Express implementation

Then
   ↓
Review each other's Dockerfiles
```

This supports the collaboration-focused course outcome.

---

# 54. Submission Structure

Required structure:

```text
student-docker-api/
├── README.md
│
├── fastapi-app/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
└── express-app/
    ├── server.js
    ├── package.json
    ├── Dockerfile
    └── .dockerignore
```

---

# 55. README Requirements

The README should include:

- Installation requirements
- Build commands
- Run commands
- API test commands
- Successful output
- At least one problem encountered
- The solution to that problem

A useful README structure is:

```text
# Student Docker API

## Requirements

## Project Structure

## FastAPI
### Build
### Run
### Test

## Express
### Build
### Run
### Test

## Running Both

## Expected Output

## Troubleshooting

## Cleanup
```

---

# 56. Exit Questions

## 1. What is the difference between an image and a container?

An **image** is the reusable package used to create containers.

A **container** is a running instance of an image.

```text
Image
  ↓
docker run
  ↓
Container
```

---

## 2. Why do both applications bind to `0.0.0.0`?

Binding to:

```text
0.0.0.0
```

allows the application to be reachable through Docker's port mapping.

---

## 3. What does `-p 8000:8000` mean?

It maps:

```text
Host port 8000
      ↓
Container port 8000
```

---

## 4. Why is `.dockerignore` useful?

It prevents unwanted files from entering the Docker build context.

Examples include:

- Git metadata
- Virtual environments
- `node_modules`
- Cache files
- `.env`

---

## 5. How would you debug a container that exits immediately?

Start with:

```bash
docker ps
```

and then inspect:

```bash
docker logs <container-name>
```

The logs may reveal startup-command, dependency, or application errors.

---

## 6. Why should secrets not be copied into a Docker image?

Images can be stored, transferred, and shared.

Embedding passwords, API keys, or production credentials can expose those secrets.

---

# 57. Security Checklist

- [ ] Do not commit passwords to Git.
- [ ] Do not commit API keys to Git.
- [ ] Do not commit private tokens to Git.
- [ ] Do not commit production database credentials.
- [ ] Do not copy secrets into Docker images.
- [ ] Exclude `.env` where appropriate.
- [ ] Use secure base images.
- [ ] Patch dependencies and images.
- [ ] Restrict access.
- [ ] Use appropriate users and permissions.

---

# 58. Complete Build–Run–Test Example

## FastAPI

```bash
cd fastapi-app

docker build \
  -t student-api-fastapi:1.0 \
  .

docker run -d \
  --name student-fastapi \
  -p 8000:8000 \
  student-api-fastapi:1.0

curl http://localhost:8000/
curl http://localhost:8000/health
curl http://localhost:8000/students
```

---

## Express

```bash
cd express-app

docker build \
  -t student-api-express:1.0 \
  .

docker run -d \
  --name student-express \
  -p 3000:3000 \
  student-api-express:1.0

curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/students
```

---

## Inspect

```bash
docker ps

docker logs student-fastapi
docker logs student-express
```

---

## Clean Up

```bash
docker stop \
  student-fastapi \
  student-express

docker rm \
  student-fastapi \
  student-express
```

---

# 59. Key Takeaways

1. Deployment makes an application available in a target environment.
2. Applications may run in local, staging, production, VPS, cloud, or container environments.
3. Environment variables should be used for environment-specific configuration.
4. Secrets should not be committed to Git or embedded in Docker images.
5. Containerization packages an application with its runtime and dependencies.
6. A Dockerfile contains image-build instructions.
7. A Docker image is a reusable package.
8. A Docker container is a running image instance.
9. A registry stores and distributes images.
10. Port mapping connects host ports to container ports.
11. Volumes provide storage separate from a container.
12. `.dockerignore` excludes files from the build context.
13. Containers share the host OS kernel, while virtual machines include a guest OS.
14. `EXPOSE` documents a port but does not publish it.
15. `docker run -p` publishes container ports.
16. Applications inside Docker should bind to `0.0.0.0`.
17. Docker layer ordering can improve build caching.
18. FastAPI and Express can expose the same API contract.
19. `docker logs` is an important debugging command.
20. Images must be rebuilt when source changes need to be included.
21. README documentation should record build, run, test, output, and troubleshooting information.
22. Containerization helps create reproducible environments across team members and deployment targets.

---

# 60. Summary

The lecture sequence connects deployment concepts with practical Docker usage.

The overall progression is:

```text
Deployment Environments
        ↓
Containerization
        ↓
Dockerfile
        ↓
Docker Image
        ↓
Docker Container
        ↓
Port Mapping
        ↓
HTTP API
        ↓
Testing
        ↓
Logs and Debugging
```

The practical activity implements the same Student API contract using two frameworks:

```text
FastAPI
  |
  +-- /
  +-- /health
  +-- /students

Express
  |
  +-- /
  +-- /health
  +-- /students
```

Each implementation is containerized independently and run on a different host port.

---

# Conclusion

Deployment environments determine where applications execute, while containerization helps make that execution reproducible across development machines, staging systems, VPS platforms, and cloud infrastructure.

Docker separates the process into three important concepts:

```text
Dockerfile
    ↓
Image
    ↓
Container
```

In the practical exercise, FastAPI and Express implement the same Student API contract but use separate runtimes and Docker images. The FastAPI container publishes port `8000`, while the Express container publishes port `3000`. Both applications bind to `0.0.0.0` so they can be reached through Docker's port mapping.

A reliable Docker workflow is:

```text
Write
  ↓
Build
  ↓
Run
  ↓
Test
  ↓
Inspect
  ↓
Debug
  ↓
Document
```

Following this workflow, using environment-based configuration, keeping secrets out of images, testing endpoints, and documenting commands provides a strong foundation for deploying backend applications using container-based infrastructure.
