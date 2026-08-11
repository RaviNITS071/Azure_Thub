# backend/src/routes

TODO (thin files — just wire path + middleware + controller, no logic here)
- [ ] auth.routes.js — /register, /login, /refresh, /logout
- [ ] organization.routes.js — /organizations, /company-profile
- [ ] tender.routes.js — GET /tenders, GET /tenders/:id, POST /tenders/:id/analyze,
      POST /tenders/:id/questions, GET /tenders/:id/updates
- [ ] bid.routes.js — GET/POST /bids, GET /bids/:id/requirements, POST /bids/:id/documents,
      PATCH /bids/:id/tasks
- [ ] notification.routes.js, admin.routes.js, analytics.routes.js
- [ ] documents.routes.js — /documents/presign, /documents/confirm
- [ ] Mount all of these under /api/v1 in app.js
- [ ] Apply auth middleware + tenant-scope middleware on every route except auth + public tender listing
