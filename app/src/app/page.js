import Pipeline from '../components/Pipeline';
import {
  GitHubIcon,
  ActionsIcon,
  DockerIcon,
  ComposeIcon,
  WatchtowerIcon,
} from '../components/icons';

// Read APP_VERSION (and uptime) per request, not at build time.
export const dynamic = 'force-dynamic';

const STACK = [
  {
    icon: GitHubIcon,
    name: 'GitHub',
    role: 'Source of truth',
    text: 'Every change starts as a commit on main. The repository triggers the whole chain.',
  },
  {
    icon: ActionsIcon,
    name: 'GitHub Actions',
    role: 'CI - test & build',
    text: 'Runs the test suite, builds the multi-stage Docker image with Buildx caching and pushes it to GHCR.',
  },
  {
    icon: DockerIcon,
    name: 'Docker',
    role: 'Packaging',
    text: 'The app ships as a slim, non-root container image - identical in CI, on this server, anywhere.',
  },
  {
    icon: ComposeIcon,
    name: 'Docker Compose',
    role: 'Runtime',
    text: 'Declares the production stack: the app container, its healthcheck, ports and environment.',
  },
  {
    icon: WatchtowerIcon,
    name: 'Watchtower',
    role: 'CD - auto-deploy',
    text: 'Polls the registry every 30 s. New image? It pulls, recreates the container and cleans up - zero downtime for humans.',
  },
];

export default function Home() {
  const version = process.env.APP_VERSION || 'dev';

  return (
    <main>
      <section className="hero">
        <span className="badge">
          <span className="badge-pulse" /> live demo - this page deployed itself
        </span>
        <h1>
          Push code.
          <br />
          <span className="accent">Everything else is automatic.</span>
        </h1>
        <p className="tagline">
          A complete CI/CD pipeline with <strong>GitHub Actions</strong>,{' '}
          <strong>Docker</strong> and <strong>Watchtower</strong>: one{' '}
          <code>git push</code> and the new version is tested, containerized
          and running here - with nobody touching a server.
        </p>
        <div className="hero-icons" aria-hidden="true">
          <GitHubIcon />
          <span className="flow-arrow">→</span>
          <ActionsIcon />
          <span className="flow-arrow">→</span>
          <DockerIcon />
          <span className="flow-arrow">→</span>
          <WatchtowerIcon />
          <span className="flow-arrow">→</span>
          <ComposeIcon />
        </div>
      </section>

      <section className="section">
        <h2>From commit to container - live</h2>
        <p className="section-sub">
          What happens after <code>git push</code>, in the order it happens.
        </p>
        <Pipeline />
      </section>

      <section className="section">
        <h2>The stack</h2>
        <div className="stack-grid">
          {STACK.map(({ icon: Icon, name, role, text }) => (
            <article className="card" key={name}>
              <Icon className="card-icon" />
              <h3>{name}</h3>
              <span className="card-role">{role}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>
          running version <code className="version">{version}</code>
        </span>
        <span className="footer-sep">·</span>
        <span>node {process.version}</span>
        <span className="footer-sep">·</span>
        <span>
          push a commit and watch this footer change in ~90&nbsp;seconds
        </span>
        <span className="footer-sep">·</span>
        <a href="http://localhost:10000" target="_blank" rel="noreferrer">
          README
        </a>
      </footer>
    </main>
  );
}
