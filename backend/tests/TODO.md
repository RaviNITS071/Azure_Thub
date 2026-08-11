# backend/tests

TODO
- [ ] Pick a test runner (Jest or Vitest) + supertest for route testing
- [ ] auth.test.js — register/login/refresh/logout happy paths + failure cases (wrong password, expired
      token, revoked refresh token)
- [ ] tenantScope.test.js — verify a user from org A can never read/write org B's bids/documents/tasks
- [ ] matching.service.test.js — unit test the scoring formula against known inputs
- [ ] Set up a test MongoDB (in-memory via mongodb-memory-server) so tests don't hit real data
