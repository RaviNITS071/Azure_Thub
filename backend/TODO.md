# Backend — Express + MongoDB + Redis (plain JavaScript)

TODO
- [ ] `npm init`, install: express, mongoose, ioredis, bullmq, jsonwebtoken, bcryptjs, joi, helmet,
      express-rate-limit, cors, cookie-parser, pino (or morgan), multer, dotenv, nodemon (dev)
- [ ] Set `"type": "module"` in package.json (ESM) or standardize on CommonJS — pick one, stay consistent
- [ ] Create src/app.js (Express app setup: middleware, routes mount) and src/server.js (http server start,
      DB connect, Redis connect)
- [ ] Add package.json scripts: `dev`, `start`, `worker` (runs the BullMQ worker process separately)
- [ ] Wire up PM2 ecosystem file (ecosystem.config.js) for prod: cluster mode for the API, single instance
      for the worker
