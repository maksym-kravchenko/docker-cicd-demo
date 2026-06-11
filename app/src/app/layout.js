import './globals.css';

export const metadata = {
  title: 'docker-cicd-demo - GitHub × Docker × Watchtower',
  description:
    'Live demo of a fully automated CI/CD pipeline: GitHub Actions builds and tests, GHCR stores the image, Watchtower deploys it.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
