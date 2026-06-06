Netlify deploy fix (ENOENT missing root package.json)

Problem: Netlify is running build from repo root but frontend lives in ./frontend.

Fix (recommended):
1) In Netlify UI → Site settings → Build & deploy → Build settings:
   - Base directory: frontend
   - Build command: npm run build
   - Publish directory: frontend/build
2) Trigger a new deploy (not just cache clear).

Alternative build command (if you cannot set Base directory):
- Build command: cd frontend && npm install && npm run build
- Publish directory: frontend/build

SPA routing:
- Ensure redirect file is correct.
- This repo has:
  - frontend/public/_redirects containing: /*    /index.html   200
  - netlify.toml (repo root) containing: from="/*" to="/index.html"

After redeploy, test:
- https://skillswapsapp.netlify.app/
- https://skillswapsapp.netlify.app/signup

