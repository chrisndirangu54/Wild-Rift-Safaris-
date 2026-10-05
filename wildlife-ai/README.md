# Wild Ryftlands Wildlife AI
Self-hosted inference for cameras Wild Ryftlands owns or is explicitly authorized to process.

Pipeline: HTTPS frame -> MegaDetector V6 -> confidence filter -> counts -> temporal event aggregation -> Firebase -> AI Ranger.

MegaDetector detects animal/person/vehicle; it is not a species classifier. Add a separately validated regional classifier as stage two.

Build and run:
docker build -t wild-ryftlands-wildlife-ai .
docker run -p 8080:8080 wild-ryftlands-wildlife-ai

Set Firebase secret WILDLIFE_VISION_ENDPOINT to https://YOUR_HOST/analyze. Optionally set WILDLIFE_VISION_API_KEY when your deployment expects bearer auth.

Default model: MDV6-apa-rtdetr-e. Verify the exact model-weight license you deploy. Validate accuracy on East African day/night imagery before production.

Never process a third-party stream without explicit automated-processing rights.
