# Frontend — React 19 + Vite (plain JavaScript)

TODO
- [ ] `npm create vite@latest` with the react template (JS, not TS)
- [ ] Install: react-router-dom, axios, @tanstack/react-query, react-hook-form, yup,
      @hookform/resolvers, tailwindcss, recharts, lucide-react
- [ ] Set up Tailwind (tailwind.config.js, postcss.config.js, index.css with @tailwind directives)
- [ ] Set up an axios instance with baseURL + withCredentials:true (needed for the httpOnly refresh cookie)
      and a response interceptor that retries once on 401 via /auth/refresh
- [ ] Wrap the app in QueryClientProvider (React Query) and an AuthProvider (see src/context)
