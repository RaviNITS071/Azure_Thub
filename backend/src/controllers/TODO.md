# backend/src/controllers

TODO
- [ ] auth.controller.js — register/login/refresh/logout logic (delegates hashing/token work to utils)
- [ ] organization.controller.js
- [ ] tender.controller.js — list/get/analyze/questions/updates
- [ ] bid.controller.js — CRUD + requirements + tasks
- [ ] document.controller.js — presign/confirm flow
- [ ] notification.controller.js, admin.controller.js, analytics.controller.js
- [ ] Keep controllers thin: validate input (already done in middleware), call a service, shape the response.
      No Mongoose queries directly in controllers if a service layer exists — but at this scale it's OK to
      query directly for simple CRUD and reserve services/ for anything with real logic (matching, AI, sync)
