'use client';

import { useEffect, useState } from 'react';
import { PIPELINE_STEPS } from '../lib/pipeline';
import {
  GitHubIcon,
  ActionsIcon,
  DockerIcon,
  RegistryIcon,
  WatchtowerIcon,
  ComposeIcon,
} from './icons';

const STEP_ICONS = {
  push: GitHubIcon,
  test: ActionsIcon,
  build: DockerIcon,
  publish: RegistryIcon,
  detect: WatchtowerIcon,
  deploy: ComposeIcon,
};

const STEP_MS = 3200;

export default function Pipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((i) => (i + 1) % PIPELINE_STEPS.length),
      STEP_MS,
    );
    return () => clearInterval(t);
  }, []);

  const step = PIPELINE_STEPS[active];
  const logLines = PIPELINE_STEPS.slice(0, active + 1).flatMap((s) =>
    s.log.map((line, i) => ({ key: `${s.id}-${i}`, line })),
  );

  return (
    <div className="pipeline">
      <ol className="stepper">
        {PIPELINE_STEPS.map((s, i) => {
          const Icon = STEP_ICONS[s.id];
          const state = i < active ? 'done' : i === active ? 'active' : 'idle';
          return (
            <li key={s.id} className={`step ${state}`}>
              <button
                type="button"
                className="node"
                onClick={() => setActive(i)}
                aria-label={`${s.actor}: ${s.title}`}
                aria-current={i === active ? 'step' : undefined}
              >
                <Icon className="node-icon" />
              </button>
              <span className="step-label">{s.title}</span>
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="connector" aria-hidden="true">
                  <span className="connector-fill" />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="step-detail" key={step.id}>
        <span className="step-actor">{step.actor}</span>
        <h3>{step.title}</h3>
        <p>{step.detail}</p>
      </div>

      <div className="terminal" aria-hidden="true">
        <div className="terminal-bar">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="terminal-title">pipeline — live</span>
        </div>
        <div className="terminal-body">
          {logLines.map(({ key, line }) => (
            <div className="terminal-line" key={key}>
              {line}
            </div>
          ))}
          <div className="terminal-line caret">▍</div>
        </div>
      </div>
    </div>
  );
}
