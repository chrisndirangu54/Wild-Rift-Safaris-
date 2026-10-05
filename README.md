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


## Phase 2 implemented
- Destination catalog extracted into structured data with season, mood, region, story and highlights.
- Dedicated immersive destination routes (`/destination/:id`).
- Traveller dashboard foundation at `/me`.
- Experience capability layer distinguishes curated content, prototypes, concepts and integrations that require partner data.
- Expanded responsive styling for experience detail and traveller interfaces.

## Recommended production sequence
1. Configure Firebase Auth/Firestore and verify rules in the Firebase Emulator Suite.
2. Move AI planning behind a server/Cloud Function; ground generation in a verified destination/inventory catalog.
3. Add booking/inventory provider adapters and payment processing with server-side webhooks and idempotency.
4. Add a CMS/admin workflow for guides, properties, conservation partners, media rights and cultural-content approval.
5. Build geospatial/3D experiences from licensed DEM, imagery or photogrammetry rather than presenting the conceptual globe as a digital twin.
6. Integrate weather, maps and wildlife data only from licensed/authorized sources; protect sensitive species coordinates.
7. Add observability, consent/privacy controls, accessibility testing, localization and security review before launch.


## MVP completion pass
The repository now includes Firebase-backed user profile creation, saved journey records, booking-request persistence, traveller and operations routes, Cloud Functions boundaries for future AI/payment providers, Storage rules, Firestore indexes, and Firebase deployment configuration.

### External configuration still required
A production deployment must supply the Firebase web configuration and enable Authentication, Firestore, Storage, Functions and App Check. The callable AI endpoint is deliberately a provider-neutral stub until a grounded model/provider is selected. The payment endpoint deliberately refuses transactions until a PCI-compliant provider (for example Stripe or an appropriate M-Pesa integration) is implemented server-side. Maps, weather, inventory, wildlife cameras/telemetry, AR, translation, species recognition and photogrammetric 3D require their respective licensed datasets/services and cannot truthfully be completed from source code alone.

### Admin provisioning
Create admin documents by UID at `admins/{uid}` from a trusted Admin SDK/server environment. Do not authorize administrators by hard-coded client email. Firestore rules protect the operations data even if a user manually navigates to `/admin`.
