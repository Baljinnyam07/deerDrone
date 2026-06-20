import { server } from '../src/index.js';

export default async (req: any, res: any) => {
  await server.ready();
  server.server.emit('request', req, res);
};
