# Deployment Issues Fix - Google OAuth

## Issues Identified
- Cross-Origin-Opener-Policy blocking window.postMessage (from Vercel's COOP headers)
- ERR_CONNECTION_REFUSED on localhost:5000/api/google-login (frontend pointing to localhost)
- 404 error on auth:1 (Google OAuth redirect handling)

## Fixes Applied
- [x] Created AuthCallback.jsx component to handle Google OAuth redirect flow
- [x] Updated AuthLayout.jsx to use redirect mode instead of popup mode for Google Sign-In
- [x] Added /auth/callback route to App.jsx
- [x] Added AuthCallback import to App.jsx
- [x] Updated backend CORS configuration to allow deployed URLs
- [x] Updated frontend API_URL to point to deployed backend (https://pathwise-j2t6.onrender.com/api)

## Next Steps
- [ ] Deploy backend changes to Render
- [ ] Deploy frontend changes to Vercel
- [ ] Test Google OAuth login on deployed site
- [ ] Verify CORS is working properly
