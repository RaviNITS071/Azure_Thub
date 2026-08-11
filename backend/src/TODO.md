# backend/src

TODO
- [ ] app.js — create Express app, apply helmet/cors/cookie-parser/json body parser, mount all route files,
      mount global error handler last
- [ ] server.js — load env, connect Mongo + Redis, start HTTP server, handle graceful shutdown (close DB/Redis
      on SIGTERM)
