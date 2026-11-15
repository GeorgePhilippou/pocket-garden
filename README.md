# A Little Windowsill — a living scene

Live at **https://georgephilippou.github.io/pocket-garden/**. Every push to `main` runs `npm test` and deploys `dist/` to GitHub Pages (`.github/workflows/pages.yml`).

A quiet pixel-art interpretation of the user's own plant shelf. The approved personal arrangement is drawn as a single scene: leaves, stems, soil, pots and the static orange LEGO flower are integrated. There are no separate live foliage overlays, root transforms or pot-rim masks in the current renderer.

## Normal use

Open the page and enjoy the window. Hover a plant (or focus it with the keyboard) for a small name label: peace lily, English ivy, trailing plant, prayer plant or yucca. Plant clicks do not open panels, display information, change growth, or request watering. There are no plant statistics, harvesting controls, readiness sparkles, care requirements or chapter rewards in the active interface. Previously saved plants, growth and keepsakes are retained in the saved data.

Visitors make small encounters rather than floating at random:

- Moths enter from a window edge, circle near the warm temple display, fold their wings and rest, then leave. With the temple dimmed, subsequent moth visits choose the window frame.
- Bees approach the peace lily's real flowers, inspect and rest, then fly outside. They never treat the static LEGO flower as a living bloom.
- Wasps explore the upper ivy, settle, and leave.
- Ladybugs walk a short leaf route and pause. Caterpillars inch along the prayer plant, rest, and turn back; they stay on the same leaf.
- This is a first-floor window: there are no fox visits. Moths visit at dusk/night; bees and wasps in day/dusk.
- One flying insect at a time, with at most two insects. Return gaps leave quiet space between encounters.
- Flying visitors can be gently nudged into their departure route. There is no information popup and no need to interact.
- Sightings are recorded only after the visitor spends time in its activity. The optional journal keeps one observation per kind per local calendar day; no points, streaks, chores or penalties. Nothing is simulated or recorded while the page is closed.

The journal is optional: Visitors, Notebook and Earlier garden. Click the LEGO display to switch its LEDs on or off. The off state is aligned generated artwork clipped to the display and its nearby shelf glow, not a flat tint. Its preference is saved, synchronized between same-origin windows and included in backups; older saves default to lights on.

The corner menu holds window light, sound, visitor movement, scene size, a separate small browser window, and save export/import. No watering or harvesting is needed to attract any visitor. Reduced motion keeps visits at varied arrival sites while disabling their travel and flutter animations, including when the system preference changes while open. Pointer controls fade into the corner when idle; touch and keyboard controls remain visible, with 44px targets.

## Reference and artwork

`art/approved-shelf-concept.png` retains the approved concept. `dist/assets/shelf/whole-room.png` is a built-in image-generation edit of that concept: only the baked-in moth and two painted UI icons were removed. All illustrated plants, pots, toy display, one-face creeper and orange LEGO flower remain integrated. The original photograph is not shipped.

`visitor-art.js` draws the live insects as small articulated pixel sprites: wings, antennae, walking feet and the inching body are independent parts. The five current visitors are moth, bee, wasp, ladybug and caterpillar; old fox metadata remains only for save compatibility and is excluded from the live scene, album and daily count. The earlier detailed insect atlas remains archived in `dist/assets/shelf/insects.png`, but is not used for live insects or journal specimens. `visitor-life.js` handles arrival sites, routes, bounded leaf crawling, lifetimes, departures and return delays. `ambient-app.js` handles the display, optional journal/settings and saved data. Scene travel follows continuous approach/activity/departure curves; animation stops on a hidden page, and reduced motion shows the visitors at their destinations with limb motion disabled. Runtime assets and fonts are local; there are no external image/font requests. Press Start 2P's SIL OFL license is included in `dist/assets/FONT-LICENSE.txt`. Prompt provenance is in `ART_DIRECTION.md`.

## Saves

The existing `pocket-garden-shelf-v1` version-2 save is retained. Plants, slots, growth, moisture, collections, previous observations and legacy save contents are preserved. The ambient renderer does not advance, harvest or reset old plants. New daily visitor observations are added to the journal; existing first sightings, events and keepsakes are retained. The earlier `pocket-garden-v1` key is read for first-time migration and left unchanged.

Data stays in this browser/device/origin, without automatic cross-device sync. Save a copy exports JSON. Restore accepts a validated saved garden and leaves the current save unchanged on invalid input. A separate same-origin window receives storage updates. This is a browser scene, not an installed always-on-top application.

## Development and verification

`npm run dev` serves the buildless app on port 5173. No app dependency installation is needed. `npm test` runs 20 tests, including retained earlier game mechanics and current visitor-life tests. `npm run test:browser` runs `tests/light-browser.cjs` and `tests/ambient-browser.cjs` with this desktop's bundled Playwright and installed Chrome; adapt the machine-specific runtime path elsewhere.

Current tests verify unified scenery, absence of plant click panels and controls, continuous arrival/activity/departure transitions, meaningful landing destinations, leaf-bound walking/resting, daily observations without care, a maximum of one flyer and two simultaneous insects, preferences, reduced motion, saved progress, exports/imports and six viewport sizes. Screenshots were visually inspected. Physical iPad and Safari testing have not been performed. Earlier browser/root-placement scripts remain historical helpers and are not the active renderer's verification entrypoint.
