import { server } from '../dist/src/index.js';

export default async (req, res) => {
  await server.ready();
  server.server.emit('request', req, res);
};
