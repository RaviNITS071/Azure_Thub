# backend/src/middleware

TODO
- [ ] auth.middleware.js — verify JWT access token, attach req.user + req.organizationId
- [ ] rbac.middleware.js — requireRole('admin'|'owner'|'member') factory
- [ ] tenantScope.middleware.js — helper to inject organizationId filter into queries, or at least
      assert req.params/body org matches req.organizationId
- [ ] rateLimiter.middleware.js — express-rate-limit configured with a Redis store; stricter limits on
      /auth/login and /auth/register
- [ ] errorHandler.middleware.js — final error-handling middleware, consistent JSON error shape, logs via pino
- [ ] validate.middleware.js — generic Joi/Yup validation wrapper used by every route that takes a body
