# PixBooth prototype v4

Run locally with `node server-v2.cjs` on port 4174. The launcher is one folder above. Local media and JSON data live in `../../work/pixbooth-runtime`; credentials are in the separate private access file. Never commit credentials, customer media, or runtime data.

## Temporary public demo on Render

This is a prototype, with simulated payments. No public deployment has been made. A Render account and a source repository controlled by the owner are needed. Docker support has been prepared but has not been built or benchmarked on Render.

1. Push only this source directory, excluding `.git`, `.openai`, local credentials, runtime data, and old `app.js`. Do not upload the parent outputs folder.
2. Create a Render **Web Service**, Docker runtime, Free instance, using this directory as the service root. `render.yaml` is a starting blueprint.
3. Set `PIXBOOTH_OWNER_PASSWORD` to a unique secret of at least 16 characters using Render's secret environment settings. Sign in at `/admin` with `owner@pixbooth.local` and that secret. Do not put it in source, URLs, or client JavaScript.
4. Create an account for each event in the owner portal. Each partner account is assigned exactly one event. New credentials are displayed once. The automatically generated local prototype passwords are not cloud credentials.
5. Enable Cloudflare TURN for reliable LDR across mobile networks by setting `PIXBOOTH_CF_TURN_ID` and `PIXBOOTH_CF_TURN_TOKEN`. The backend obtains temporary one-hour credentials only for active room participants. Alternatively set `PIXBOOTH_TURN_URL` and `PIXBOOTH_TURN_SECRET` for your own coturn REST authentication. Do not use both providers at once. Without these, only public STUN is configured, so some networks cannot connect.
6. Use the HTTPS `.onrender.com` URL. Open it in Chrome Android / Safari iPhone for camera permissions, rather than inside Instagram's embedded browser. Test camera switching, microphone permissions, recording stop, save/share, and an LDR call between two different networks.
7. Benchmark a 60-second render with 3–5 actual phone clips. Outputs are selectable 15/30/60-second H.264/AAC 1080 × 1920, 24 fps, with capped video bitrate. Source duration must be at least half the selected film duration; short footage is still revisited across 12 chapters. This is an authored template engine, not AI scene recognition or music beat detection.

Render Free sleeps after 15 idle minutes. Its local filesystem is ephemeral: uploads, JSON records, account changes, and results disappear after sleep/restart/redeploy. Sessions and LDR rooms still disappear on restart. Render tasks and their source files now persist on the configured data volume; they recover on restart only while that volume survives. This architecture is appropriate only for a disposable, low-volume demonstration. For real events, move records and media to durable storage, use a persistent render worker, and configure backups, payment webhooks, and operational limits. Free instance resource and usage limits still apply; a 60-second film is not guaranteed to render reliably on that instance until benchmarked.

## Event and portal addresses

Default portable addresses are `/e/senjasound`, `/e/hutanpinus`, `/e/nadia-raka`, `/e/stride-5k`, `/e/afterhours`, `/mitra?event=EVENT_ID`, `/admin`, `/keuangan`.

For owned-domain subdomains, add the domains to hosting, configure DNS and TLS, then set `PIXBOOTH_ROOT_DOMAIN` to the bare domain. The root request on `EVENT_ID.your-domain` resolves to that event; `mitra`, `admin`, and `keuangan` resolve to their separate portals. Event pages include event name, visual logo, organizer, location, date, plan, retention and example contact. No real custom domain has been configured. Hostname isolation is presentation; permissions are enforced by the server.

## Payments and music

Checkout QRIS/VA/e-wallet are explicit simulations. Success is user-selected, with no gateway, bank confirmation, or money movement. Orders are tied to visitor, event, format and amount, and may be consumed once. A failed render refunds only the simulated order status. Partner and finance dashboards show simulation transactions separately from manually recorded contract invoices. Real payment integration requires a payment provider account and authenticated webhooks; do not simply relabel the simulation as production.

`music.wav` is an original synthesized 60-second sample composition. The concert page has a user-opened official YouTube reference for Perunggu's “33x”, restricted in the player to a 60-second window. It is not extracted or included in exported files. Replace the original soundtrack only with appropriately licensed or owner-supplied audio. Logo marks are custom prototype vectors and do not imply endorsement by Perunggu or any real sponsor.

## Verification limits

Verified locally: per-event access isolation, unauthorized API rejection, payment outcomes and single consumption, private result keys, 60-second MP4 rendering, GIF + MP4 motion, CSV, and mobile-width browser checkout through completed photo. No physical Android/iPhone or cross-network live LDR call has been verified. Cloudflare credentials and a public hosting account have not been supplied. The Docker deployment still needs a real build and test.


## Revision 24 October 2026

- Guided guest flow: capture, design, review/save. Pose/timer controls are available before capture.
- Camera preview uses inline muted playback, waits for decoded dimensions, offers tap-to-resume and explicit recording without a microphone. Permission denial is not retried automatically. These code checks do not prove compatibility with physical iPhones.
- Operator/owner event settings: metadata, logo on event page, per-format prices and quotas, allowed template selections, start/end schedule, retention. Logo is not automatically composed into exported photo/video templates.
- Owner-only estimated partner commission; finance cost ledger and per-event contribution. Received cash is based on manually paid invoices; simulated customer payments stay separate. This is not a complete accounting ledger.
- Anonymous per-device/day metrics for page opens, camera starts, download requests and share intent. Metrics do not prove that someone posted on Instagram.
- Job idempotency, durable local render tasks, restart recovery, private retry (up to three attempts), upload progress/timeouts and deletion by the creating visitor. Retention requires the server to be running; local JSON/media and its backup still require durable production storage and off-site backup before commercial use.
- Inquiry/partner request statuses and a dashboard badge refresh in-app. No external email/WhatsApp notification has been configured.
- Sample files are bundled under samples/; they are synthetic development examples, not customer testimonials.

QA used isolated data. Backend checks cover event isolation, config atomicity, prices/quotas, simulated checkout, logo, finance and analytics. Real media tests cover GIF/MP4, restart recovery, private retry after deliberate engine failure, and 15/60-second film rendering. Browser checks cover photo upload through result, template change, and saving event settings. Physical Android/iPhone, peak concurrent events, actual bank payments, public HTTPS deployment, cross-network LDR and automatic music beat/scene selection remain unverified or unconfigured. Do not claim commercial readiness from these checks.


## Jakarta Running Fest photo collection

Twelve dedicated running photo layouts replace the three generic running photo frames. Six use one photo, two use two photos, two use three photos, and two use four photos. The original running event id and account stay `stride-5k`; its display identity changes to Jakarta Running Fest 2026 using the supplied logo reference. The event date is intentionally blank because no event date was supplied. Other event categories keep their layouts.

The collection uses the same running-frames.js Canvas renderer for picker previews and the 1080 x 1920 PNG export. Slots are masked with arches, ellipses, capsules, diagonals or organic paths, with overlapping raised logo layers. The reference photos are development examples and are repeated only in empty-media demo previews; users must supply enough distinct media slots for their chosen multi-photo frame. The gallery can be opened before capture to choose a design and set the number of poses. Photo reordering is available in the design step.

Standalone gallery: /running-preview/index.html. Files include example PNGs and transparent frame overlays. These are photo templates; the film/motion template collections have not been redesigned in this change.
