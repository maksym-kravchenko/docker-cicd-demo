export const PIPELINE_STEPS = [
  {
    id: 'push',
    actor: 'Developer',
    title: 'git push',
    detail: 'A commit lands on main. That single push is the only manual step in the entire pipeline.',
    log: ['$ git push origin main', '→ main  e7e1ac3..a1b2c3d'],
  },
  {
    id: 'test',
    actor: 'GitHub Actions',
    title: 'Tests run',
    detail: 'The CI workflow checks out the code and runs the test suite. A red build stops here - nothing broken ever ships.',
    log: ['actions: job "test" started', '✓ all tests passed'],
  },
  {
    id: 'build',
    actor: 'GitHub Actions',
    title: 'Image build',
    detail: 'Docker Buildx builds a multi-stage image (deps → slim runtime, non-root user) with layer caching for fast rebuilds.',
    log: ['docker buildx build …', '✓ image built  sha-a1b2c3d'],
  },
  {
    id: 'publish',
    actor: 'GHCR',
    title: 'Push to registry',
    detail: 'The image is pushed to GitHub Container Registry, tagged with the immutable commit SHA plus a moving latest tag.',
    log: ['push ghcr.io/…:sha-a1b2c3d', 'push ghcr.io/…:latest  ✓'],
  },
  {
    id: 'detect',
    actor: 'Watchtower',
    title: 'New version detected',
    detail: 'Watchtower polls the registry every 30 seconds. The moment the latest digest changes, it knows a new version exists.',
    log: ['watchtower: polling registry…', '⟳ new digest found for demo-app'],
  },
  {
    id: 'deploy',
    actor: 'Docker Compose',
    title: 'Zero-touch deploy',
    detail: 'Watchtower pulls the new image, recreates the container with the same compose config and cleans up the old image. No human involved.',
    log: ['↻ recreating demo-app…', '● demo-app healthy - new version live'],
  },
];
