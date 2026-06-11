// GET /health — used by the compose healthcheck (wget) and by Docker
// to mark the container healthy/unhealthy.
export function GET() {
  return Response.json({ status: 'ok' });
}
