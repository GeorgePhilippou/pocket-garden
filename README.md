# Pocket Garden — prototype 04

A small browser garden companion, based on the approved pixel-art Pocket Garden concept.

## Normal use

The garden opens in compact mode (up to 560 × 480 CSS pixels), with most space given to the artwork. Drag the green header to move the panel within the page. The arrow in the header expands the panel to show the plant shelf and larger controls; the same button returns to compact mode. Neither mode invokes browser fullscreen.

- **Plant:** choose seeds, then tap an empty patch. The seed tray closes to leave the soil visible.
- **Water:** give the whole pot a drink.
- **Inspect:** tap a plant directly, or select it and use Inspect. Check moisture, progress, and collecting availability.
- **Collect:** in the plant detail view, pick leaves, berries, flowers, or sprigs once mature. The plant stays in its pot and grows again.
- **Collection:** view your gathered items and totals.
- **Options (menu icon):** choose a theme, enable optional sounds, try +6 hours, or open a separate small browser window. Popup blocking and the browser's window/tab preferences apply. Dragging the native window uses its normal title bar. This is not an installed desktop app and does not provide always-on-top behavior.

## Growth and collections

| Plant | First crop | Repeat crop | Collected per crop |
| --- | --- | --- | --- |
| Basil | 12h | 6h | 3 leaves |
| Marigold | 18h | 12h | 1 flower |
| Lavender | 24h | 18h | 1 sprig |
| Strawberry | 20h | 12h | 3 berries |

Moist soil enables growth; soil dries over 72 hours. Dry plants pause and never die. Growth continues between visits. Collected plants remain visually established while regrowing; they do not become seedlings. The +6 hour option advances the saved clock rather than merely showing an animation. There is no plant removal, trading, currency, or cloud account.

## Saved data

The existing `pocket-garden-v1` localStorage key is retained. Old saves gain zeroed collection totals without changing their plants, growth, moisture, theme or clock offset. Expanded mode is not persisted: each visit starts compact. Collections and garden state persist on the same browser, device and origin. A separate window shares localStorage and receives storage updates from the main window. Data does not sync between devices, or between preview and production origins. Clearing site data clears the garden.

## Run and verify

No installation or build is needed. `npm run dev` serves http://127.0.0.1:5173. `npm test` checks first growth, paused growth, clock behavior, legacy collection initialization, collecting, repeat-harvest protection and species-specific regrowth. `node --check dist/app.js` checks entry syntax.

`node tests/browser.cjs` uses the desktop session's installed Playwright runtime and Chrome. It checks seven viewport sizes in both compact and expanded modes, bounded dragging, seed selection, direct plant inspection, collecting and persistence, regrowth visuals, themes and the user-triggered separate window. `node tests/placement.cjs` checks 432 rendered plant placements across six viewport sizes, two layouts, three themes and four stages. These scripts reference a machine-specific runtime path; adapt it on another computer. This is browser viewport testing, not physical iPad or Safari validation. Screenshots are in ignored `artifacts/`.

## Artwork and implementation

Original generated pixel-art backgrounds and the transparent plant atlas remain in `dist/assets/`. Measured per-sprite bounds and stem tips in `dist/sprites.js` isolate each plant with SVG view boxes and anchor roots to the same soil baseline. Species and growth stages retain their aspect ratio. The scene, sidebar, inspection and collection reuse the same sprite system. Theme backgrounds share the planter layout.

CSS builds the frame and controls; locally bundled Press Start 2P supplies pixel lettering. The font is by CodeMan38 under SIL Open Font License 1.1, included beside the font. No remote fonts or image requests are needed. The original asset prompt set and built-in image-generation provenance are in `ART_DIRECTION.md`.
