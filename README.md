# docker-cicd-demo

CI/CD pipeline: GitHub Actions builds and tests a Node/Express app, pushes the
image to GitHub Container Registry (GHCR), and Watchtower auto-deploys it to a
Docker Compose stack.

```
push to main ──> GitHub Actions ──> test ──> build image ──> push to GHCR
                                                                  │
        Compose stack: Watchtower polls GHCR ──> pulls new image ─┘
                       └──> restarts app container
```

## Project structure

```
.
├── .github/workflows/ci.yml   # test + build + push pipeline
├── app/
│   ├── Dockerfile              # multi-stage, non-root
│   ├── src/                    # express app
│   └── test/                   # node:test, runs in CI
├── compose.yml                 # "production": GHCR image + watchtower
├── compose.dev.yml             # local build, offline fallback
└── .env.example
```

## Setup (one-time)

1. Create a GitHub repo named `docker-cicd-demo` and push this project.
2. The first successful workflow run on `main` pushes the image to
   `ghcr.io/<your-user>/docker-cicd-demo`.
3. Make the package public so Watchtower can pull without credentials:
   GitHub → your profile → Packages → docker-cicd-demo → Package settings →
   Change visibility → Public.
   (Alternative for private images: mount a docker config with a PAT into the
   watchtower container.)
4. `cp .env.example .env` and set `APP_IMAGE` to your image path.

## Run

```bash
docker compose up -d
curl localhost:3000/        # shows the running version (git SHA)
```

## Demo flow (live)

1. `curl localhost:3000/` → note the `version` field (current git SHA).
2. Change something in `app/src/app.js`, commit, push to `main`.
3. Watch the Actions run: tests → build → push (~1 min).
4. Within 30 s Watchtower pulls the new image and restarts the container.
5. `curl localhost:3000/` → new SHA. Pipeline proven end-to-end.

## Offline fallback (if Wi-Fi/GitHub dies during the presentation)

```bash
docker compose -f compose.dev.yml up --build
```

## Local development

```bash
cd app
npm ci
npm test
npm start
```

## Docker concepts demonstrated

- Multi-stage build (deps stage → slim runtime stage)
- Non-root container user
- `.dockerignore` to minimize build context
- Healthcheck (used by Docker to mark the container healthy/unhealthy)
- Compose with env-based configuration (`.env`, `${VAR:-default}`)
- Image tagging strategy: immutable `sha-<commit>` tags + moving `latest`
- Registry auth in CI via the built-in `GITHUB_TOKEN` (no manual secrets)
- Buildx layer caching in CI (`cache-from/to: gha`)
- Docker socket mount tradeoff (Watchtower) — controlled via label opt-in
