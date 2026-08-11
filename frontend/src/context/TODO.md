# frontend/src/context — global client state

TODO
- [ ] AuthContext.jsx — holds current user + access token in memory (NOT localStorage), exposes
      login/logout/refresh functions, calls /auth/refresh silently on app load to restore session
- [ ] (Optional) UIContext.jsx if you need global UI state beyond what React Query covers — otherwise
      skip Zustand/Redux entirely at this scale, Context is enough
