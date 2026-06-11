# docker-cicd-demo

CI/CD pipeline: GitHub Actions builds and tests a Node/Next.js app (a landing
page that explains and animates this very pipeline), pushes the image to GitHub
Container Registry (GHCR), and Watchtower auto-deploys it to a Docker Compose
stack.

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
│   ├── Dockerfile              # multi-stage (deps → build → standalone runtime), non-root
│   ├── src/                    # next.js app (animated pipeline landing page)
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
```

Open <http://localhost:3000> — the page footer shows the running version
(git SHA). `curl localhost:3000/health` for the healthcheck endpoint.

## Demo flow (live)

1. Open <http://localhost:3000> → note the version in the footer (current git SHA).
2. Change something in `app/src/` (e.g. a text in `src/lib/pipeline.js`),
   commit, push to `main`.
3. Watch the Actions run: tests → build → push (~1 min).
4. Within 30 s Watchtower pulls the new image and restarts the container.
5. Reload the page → new SHA in the footer. Pipeline proven end-to-end.
