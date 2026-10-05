# Wild Ryftlands

An immersive, conservation-oriented travel website starter built with React, Vite, Three.js and Firebase. Brand: **Wild Ryftlands — Journey into Origins**.

## Included
- Responsive editorial homepage and destination discovery
- Interactive **conceptual** 3D globe (not real geographic terrain)
- Wildlife, geological origins, river/coast, forest/wellness and desert experience categories
- Rule-based sample itinerary builder with duration and interests
- Firebase Google sign-in and Firestore-protected trip inquiries
- Firestore rules with ownership checks and server-provisioned admin read access
- Firebase Hosting SPA configuration

## Run
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in Firebase **web app** configuration.
3. Enable Google sign-in in Firebase Authentication; add your hosting domain to authorized domains.
4. Create a Cloud Firestore database and deploy `firebase deploy --only firestore:rules`.
5. `npm run dev` for development; `npm run build` then `firebase deploy --only hosting` for deployment.

The Firebase web configuration is public by design; **never** put service-account keys, payment secrets or model API keys in Vite variables. Provision admin UID documents using a trusted server/admin SDK only. Do not grant administrator privileges based on email or client-side checks.

## Next phases (NOT implemented)
Production AI itinerary and copilot (server-side LLM with grounded travel catalog and budget validation); georeferenced 3D destination twins and photogrammetry; verified live wildlife feeds/telemetry; hotel and tour inventory, payments and reservations; location-aware audio guides, AR navigation, translation and historical reconstructions; image-based species recognition with uncertainty labels; verified weather and conservation datasets; gamified biodiversity passport; customer and partner dashboards; privacy/consent, accessibility and localization.

All photos currently use remote illustrative stock images; replace with licensed, accurately labeled destination media. The generated itinerary is illustrative and does not validate route feasibility, prices, weather or availability. Do not represent proposed conservation partnerships as established.
