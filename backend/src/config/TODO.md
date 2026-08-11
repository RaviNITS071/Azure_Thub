# backend/src/config

TODO
- [ ] db.js — Mongoose connection setup (connect, handle reconnection/error events)
- [ ] redis.js — ioredis client instance, exported singleton (used by cache, rate-limit, BullMQ)
- [ ] env.js — central place that reads and validates process.env (fail fast if a required var is missing)
- [ ] List every required env var here as you add features:
      MONGO_URI, REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TTL, JWT_REFRESH_TTL,
      OPENAI_API_KEY, S3_BUCKET / UPLOAD_DIR, CORS_ORIGIN, NODE_ENV, PORT
