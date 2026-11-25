# Student Docker API

A small Docker practical project implementing the same Student API using:

- FastAPI (Python) on port `8000`
- Express (Node.js) on port `3000`

## Project Structure

```text
student-docker-api/
├── README.md
├── fastapi-app/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
└── express-app/
    ├── server.js
    ├── package.json
    ├── Dockerfile
    └── .dockerignore
```

## Requirements

Install Docker Desktop on Windows/macOS or Docker Engine on Linux.

Verify Docker:

```bash
docker --version
docker run hello-world
```

## API Contract

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Application name/framework/status |
| GET | `/health` | Health status |
| GET | `/students` | Student list |

## 1. Build FastAPI Image

From the project root:

```bash
cd fastapi-app
docker build -t student-api-fastapi:1.0 .
```

Run it:

```bash
docker run -d --name student-fastapi -p 8000:8000 student-api-fastapi:1.0
```

Test it:

```bash
curl http://localhost:8000/
curl http://localhost:8000/health
curl http://localhost:8000/students
```

Browser URLs:

- http://localhost:8000/
- http://localhost:8000/health
- http://localhost:8000/students
- http://localhost:8000/docs

Expected health response:

```json
{"status":"healthy"}
```

## 2. Build Express Image

Return to the project root, then:

```bash
cd express-app
docker build -t student-api-express:1.0 .
```

Run it:

```bash
docker run -d --name student-express -p 3000:3000 student-api-express:1.0
```

Test it:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/students
```

Browser URLs:

- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/students

Expected health response:

```json
{"status":"healthy"}
```

## 3. Run Both Together

After both images have been built:

```bash
docker run -d --name student-fastapi -p 8000:8000 student-api-fastapi:1.0
docker run -d --name student-express -p 3000:3000 student-api-express:1.0
```

If you already created containers with these names, remove the old containers first or simply start them:

```bash
docker start student-fastapi student-express
```

Verify:

```bash
docker ps
curl http://localhost:8000/health
curl http://localhost:3000/health
curl http://localhost:8000/students
curl http://localhost:3000/students
```

## Logs and Debugging

View logs:

```bash
docker logs student-fastapi
docker logs student-express
```

If a container exits immediately:

```bash
docker ps -a
docker logs student-fastapi
# or
docker logs student-express
```

If a host port is already in use, change only the host side of the mapping. Example:

```bash
docker run -d --name student-fastapi-alt -p 8001:8000 student-api-fastapi:1.0
```

Then open `http://localhost:8001/health`.

Both applications bind to `0.0.0.0` inside their containers so Docker can forward traffic from the host into the application.

## Stop and Remove Containers

```bash
docker stop student-fastapi student-express
docker rm student-fastapi student-express
```

List images:

```bash
docker images
```

## Rebuild After Code Changes

Docker images do not automatically update when source files change. Rebuild the appropriate image:

```bash
cd fastapi-app
docker build -t student-api-fastapi:1.0 .
```

or:

```bash
cd express-app
docker build -t student-api-express:1.0 .
```

Then remove/recreate the old container.

## Security Notes

Do not put passwords, API keys, private tokens, `.env` files, or production database credentials inside source control or Docker images. Use environment variables or an appropriate secrets-management system.

## Example Successful Output

Health endpoint:

```json
{"status":"healthy"}
```

Students endpoint:

```json
[
  {"id":1,"name":"Aarav","course":"Backend Development"},
  {"id":2,"name":"Diya","course":"Backend Development"}
]
```

## Common Problem and Solution

**Problem:** The API cannot be reached even though the container starts.

**Cause:** The application may be listening only on `127.0.0.1` inside the container.

**Solution:** Bind the application to `0.0.0.0`. This project is already configured correctly for both FastAPI and Express.
