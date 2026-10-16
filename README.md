# Pocket Garden — prototype 03

A browser game based on the Pocket Garden visual concept. The dark garden panel fills the browser viewport, with no surrounding landing page. Choose Plant, select a seed, and tap an empty patch. Water gives all three plants a drink. Select a plant and choose Inspect to see its stage, moisture, and estimated time to full size. Options holds Courtyard, Windowsill, and Moonlight themes, sound, the time preview, and browser fullscreen when supported. Help is the small question-mark button. Seed selection overlays the lower garden and does not push the artwork offscreen. The plant shelf moves underneath the artwork on portrait tablets and phones.

The garden saves in this browser's localStorage, on this device and origin. It does not sync across devices or preview/production URLs. No account data, cloud save, or backend is used. On return, growth is calculated from elapsed time; the page does not need to remain open. Clearing browser data clears the garden.

Basil grows in 12 hours, marigold 18, strawberry 20, lavender 24. Soil dries over 72 hours. Plants pause when dry and never die. “Try growth +6 hours” advances the saved garden's clock for exploration; it is not merely a visual animation. Two starter plants and one empty spot make the first session easy. This prototype has no plant removal, harvesting, or economy.

## Run locally

From this folder, run `npm run dev`, then open http://127.0.0.1:5173. No installation or build is needed. `npm test` verifies growth and persistence-related model behavior. `node --check dist/app.js` checks browser entry syntax.

`tests/browser.cjs` is the desktop-session browser verification script. It references the installed bundled Playwright runtime and Chrome. Adapt that runtime path on another computer. It checks six viewport sizes (desktop, laptop, iPad landscape and portrait, phone portrait and landscape), viewport fit, visible controls, seed overlay bounds, planting, watering, growth, themes, reload persistence, offline growth, inspection milestones and browser errors. Screenshots go to ignored `artifacts/`.

## How the artwork becomes a game

The reference is a flat visual mockup, not an implementation. Three separately generated scenery images and a transparent six-sprite atlas recreate its appearance. The scenery stays still while individual plant sprites are positioned over soil and selected with real HTML buttons. `dist/sprites.js` records measured visible bounds and stem tips in the original atlas. SVG view boxes isolate complete plants without row bleed; bottom anchors place every growth stage on the same soil baseline. Width and height limits preserve plant proportions and prevent clipping on wide or short screens. The source artwork remains unchanged. Theme scenery shares the same planter layout. CSS builds the stepped frame and controls; a locally bundled Press Start 2P font supplies pixel lettering. Generated assets are original variants and do not exactly reproduce every pixel of the concept.

All runtime assets are in `dist/assets/`; there are no remote font or image requests. The generated-image tool was used in built-in mode. See `ART_DIRECTION.md` for the asset prompt set. Press Start 2P is by CodeMan38, distributed under SIL Open Font License 1.1; its license is included beside the font.

## Design direction

The current loop is plant, water, inspect, enjoy. Species have different growth rates and mature plants remain in their pot. Harvesting is not implemented. A future repeat-harvest loop for basil and strawberries could let those plants regrow while flowers remain decorative. That is a design proposal, not current behavior. The saved-data schema and storage key are unchanged in prototype 02.

## Placement refinement

Prototype 03 replaces percentage translations and fixed atlas cells with measured per-sprite crops and root anchors. Sprouts, seedlings, and mature plants share planting points at 25%, 50%, and 75% across the scene, on a soil baseline 56% down. Labels sit below roots with clearance above the front rim. Sidebar and inspection thumbnails reflect the actual growth stage. Choosing seeds collapses the seed drawer so soil remains available. Escape cancels seed placement. The stylesheet has been consolidated to remove conflicting layout overrides. Existing `pocket-garden-v1` saves, species, growth, water, theme and clock offset are preserved.

`node tests/placement.cjs` uses the desktop bundled Playwright/Chrome runtime and checks 216 rendered placements across six viewport sizes, three themes and four growth stages. It checks stem-to-anchor alignment, roots inside soil, full plant visibility and label clearance. This is browser viewport validation, not physical iPad or Safari validation.
