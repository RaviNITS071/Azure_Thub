# Tender Intelligence Platform — Root

Overall TODO
- [ ] Init git repo, add .gitignore (node_modules, .env, dist, build)
- [ ] Create .env.example at root listing every required env var (see backend/src/config/TODO.md)
- [ ] Add root README.md with setup instructions (clone -> install -> env -> run)
- [ ] Decide on monorepo tooling: plain two-folder repo is fine at this scale, no need for Nx/Turborepo
- [ ] Set up docker-compose.yml for local dev: mongo + redis only (app runs natively via `npm run dev`)
- [ ] Set up CI (GitHub Actions): lint + test on PR for both backend and frontend
- [ ] Decide deployment target (Render/Railway/DigitalOcean/EC2) and document it in README
