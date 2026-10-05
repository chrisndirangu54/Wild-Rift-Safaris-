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


## Expedia + super-admin integration
Wild Ryftlands now contains a server-side Expedia Rapid Lodging availability adapter. It generates Rapid signature authentication inside Cloud Functions and defaults to Expedia's test environment. Set `EXPEDIA_ENV=production` only after Expedia approves the partner implementation for production.

The owner bootstrap identity is `chrisndirangu54@gmail.com`. The callable bootstrap function verifies the authenticated token email before assigning `admin` and `superAdmin` custom claims and recording the UID under `admins/{uid}`. Sign in with that exact verified Google/Firebase account, visit `/admin/integrations`, and run the bootstrap action once.

Secrets required for lodging:
- `EXPEDIA_API_KEY`
- `EXPEDIA_SHARED_SECRET`

Activities integration scaffolding recognizes:
- `EXPEDIA_OAUTH_CLIENT_ID`
- `EXPEDIA_OAUTH_CLIENT_SECRET`

Do not place these values in Vite environment variables, React source, GitHub, or Firestore. The integration console intentionally reports configured/not-configured status without returning secret values to the browser.

Expedia Rapid Activities is partner/early-access dependent as of October 2026. Wild Ryftlands must therefore support local/other tour inventory as a fallback until Expedia enables the account. Lodging production use also requires Expedia partner approval/site review.


## Code-complete integration boundary
The application now includes UI and backend boundaries for lodging inventory, maps/AR, weather, translation, speech/audio guides, species recognition, payments and licensed 3D assets; a working Expedia Rapid Lodging callable; traveller profiles and saved journeys; booking requests; biodiversity observations with deliberately obscured location precision; an offline-first field companion; and the super-admin integration/status console.

Provider-neutral functions fail closed until credentials and a concrete endpoint/response mapper are supplied. This is intentional: source code cannot determine a future vendor contract, licensed dataset schema or partner inventory identifier. Production adapters should be completed by setting the provider URL/schema and secret names, not by moving secrets into React.

### Remaining non-code inputs
- Firebase project IDs/configuration, deployment and App Check setup.
- Expedia Rapid production approval, credentials and property IDs; Activities partner access if granted.
- Chosen weather/maps/translation/TTS/vision providers and their credentials/endpoints.
- M-Pesa/Stripe merchant credentials, webhook URLs and commercial settings.
- Licensed DEM/3D Tiles/glTF/photogrammetry, destination imagery and media rights.
- Authorized wildlife camera/telemetry feeds and conservation rules for sensitive species.
- Verified destination, guide, lodge, tour, price, cancellation, tax and availability data.
- Legal/privacy/terms/refund content and operational contact information.
- Human QA of routes, accessibility, security, payments, booking reconciliation and partner obligations before launch.


## Free/open provider defaults + Strapi editorial system
The codebase now prefers free/open components where they are appropriate:
- Maps: OpenStreetMap data with a MapLibre-compatible renderer. Respect OSM attribution and tile-service policies; OSM data is free/open but the OSM Foundation does not provide unlimited free production tiles.
- Weather: Open-Meteo is implemented as a zero-key development/non-commercial option. Its free hosted tier is not the production commercial entitlement for a travel business, so keep the provider adapter and choose a commercial plan/self-hosting/alternative before launch.
- Translation: self-hosted LibreTranslate (no vendor API key required on your own instance).
- Speech: self-hosted Piper TTS; review each voice model's license before distribution.
- Biodiversity: iNaturalist API for public reference/observation discovery, subject to API recommended practices and rate limits.
- CMS: self-hosted Strapi Community.

### Strapi blog
A Strapi 5 project lives under `/strapi`. It includes `Article` and `Content Goal` content types. Articles support draft/publish, category, media, SEO metadata, keywords, AI-origin labeling, trend/season signals, business goal and editor notes. The React routes are `/blog` and `/blog/:slug`. Configure `VITE_STRAPI_URL`.

### AI editorial engine
The super-admin route `/admin/content` loads seasonal context and active Strapi business goals and creates reviewable content-generation jobs. Cloud Functions expose `contentSignals`, `generateBlogDraft` and `pushDraftToStrapi`. Required server secrets are `STRAPI_API_TOKEN` and `CONTENT_LLM_API_KEY`; `STRAPI_URL` is a server environment value. The LLM provider endpoint/model mapper remains provider-neutral so a free/self-hosted model or paid API can be selected without changing the CMS/front end.

Generated content must remain draft-first. Do not automatically publish factual claims about wildlife sightings, conservation partners, prices, availability, safety, visas, health, communities or cultural practices without verification.
