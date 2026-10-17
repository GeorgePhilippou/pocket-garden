# A Little Windowsill — a living scene

A quiet pixel-art interpretation of the user's own plant shelf. The approved personal arrangement is drawn as a single scene: leaves, stems, soil, pots and the static orange LEGO flower are integrated. There are no separate live foliage overlays, root transforms or pot-rim masks in the current renderer.

## Normal use

Open the page and enjoy the window. Hover a plant (or focus it with the keyboard) for a small name label: peace lily, English ivy, trailing plant, prayer plant or yucca. Plant clicks do not open panels, display information, change growth, or request watering. There are no plant statistics, harvesting controls, readiness sparkles, care requirements or chapter rewards in the active interface. Previously saved plants, growth and keepsakes are retained in the saved data.

Visitors arrive and leave on their own:

- Moths fly at dusk/night; bees and wasps visit in day/dusk.
- Flying insects use short connected arcs with a gentle flutter, exploring different parts of the scene. Each subsequent arrival chooses a different starting location for that visitor type. At most two flyers share the scene.
- Caterpillars and ladybugs start at selected painted-leaf locations and move only slightly along the foliage. They do not follow flight routes.
- The fox occasionally passes through the window area at dusk/night.
- Clicking a visitor sends it away without an information popup. Sightings are recorded automatically after a short visible visit.

The journal is optional: Visitors, Notebook and Earlier garden. The corner menu holds light, sound, visitor movement, scene size, a separate small browser window, and save export/import. No watering or harvesting is needed to attract any visitor. Reduced motion keeps visits at varied arrival sites while disabling their travel and flutter animations, including when the system preference changes while open. Pointer controls fade into the corner when idle; touch and keyboard controls remain visible, with 44px targets.

## Reference and artwork

`art/approved-shelf-concept.png` retains the approved concept. `dist/assets/shelf/whole-room.png` is a built-in image-generation edit of that concept: only the baked-in moth and two painted UI icons were removed. All illustrated plants, pots, toy display, one-face creeper and orange LEGO flower remain integrated. The original photograph is not shipped.

The detailed insects remain in `dist/assets/shelf/insects.png`; the fox is a code-native sprite. `visitor-life.js` handles arrival sites, routes, bounded leaf crawling, lifetimes, departures and return delays. `ambient-app.js` handles the display, optional journal/settings and saved data. Runtime assets and fonts are local; there are no external image/font requests. Press Start 2P's SIL OFL license is included in `dist/assets/FONT-LICENSE.txt`. Prompt provenance is in `ART_DIRECTION.md`.

## Saves

The existing `pocket-garden-shelf-v1` version-2 save is retained. Plants, slots, growth, moisture, collections, previous observations and legacy save contents are preserved. The ambient renderer does not advance, harvest or reset old plants. New visitor observations are added to the journal. The earlier `pocket-garden-v1` key is read for first-time migration and left unchanged.

Data stays in this browser/device/origin, without automatic cross-device sync. Save a copy exports JSON. Restore accepts a validated saved garden and leaves the current save unchanged on invalid input. A separate same-origin window receives storage updates. This is a browser scene, not an installed always-on-top application.

## Development and verification

`npm run dev` serves the buildless app on port 5173. No app dependency installation is needed. `npm test` runs 19 tests, including retained earlier game mechanics and current visitor-life tests. `npm run test:browser` runs `tests/ambient-browser.cjs` with this desktop's bundled Playwright and installed Chrome; adapt the machine-specific runtime path elsewhere.

Current tests verify unified scenery, absence of plant click panels and controls, flight routes with multiple positions, varied return locations, leaf-bound crawling, automatic sightings without care, a maximum of two simultaneous flyers, preferences, reduced motion, saved progress, exports/imports and six viewport sizes. Screenshots were visually inspected. Physical iPad and Safari testing have not been performed. Earlier browser/root-placement scripts remain historical helpers and are not the active renderer's verification entrypoint.
