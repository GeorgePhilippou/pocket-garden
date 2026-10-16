# Pocket Garden — prototype 01

A small browser game based on the Pocket Garden visual concept. Open the published private Site, choose Seeds, select a plant, and click an empty patch in the pot. Water gives all three plants a drink. Select a plant and choose Info to see its progress. Courtyard, Windowsill, and Moonlight are selectable decorative themes.

The garden saves in this browser's localStorage, on this device and origin. It does not sync across devices or preview/production URLs. No account data, cloud save, or backend is used. On return, growth is calculated from elapsed time; the page does not need to remain open. Clearing browser data clears the garden.

Basil grows in 12 hours, marigold 18, strawberry 20, lavender 24. Soil dries over 72 hours. Plants pause when dry and never die. “Try growth +6 hours” advances the saved garden's clock for exploration; it is not merely a visual animation. Two starter plants and one empty spot make the first session easy. This prototype has no plant removal, harvesting, or economy.

## Run locally

From this folder, run `npm run dev`, then open http://127.0.0.1:5173. No installation or build is needed. `npm test` verifies growth and persistence-related model behavior. `node --check dist/app.js` checks browser entry syntax.

`tests/browser.cjs` is the desktop-session browser verification script. It references the installed bundled Playwright runtime and Chrome. Adapt that runtime path on another computer. It checks planting, watering, growth, themes, reload persistence, offline growth, mobile overflow, information dialogs and browser errors. Screenshots go to ignored `artifacts/`.

## How the artwork becomes a game

The reference is a flat visual mockup, not an implementation. Three separately generated scenery images and a transparent six-sprite atlas recreate its appearance. The scenery stays still while individual plant sprites are positioned over soil, scaled by growth stage, and selected with real HTML buttons. Theme scenery shares the same planter layout. CSS builds the stepped frame and controls; a locally bundled Press Start 2P font supplies pixel lettering. Generated assets are original variants and do not exactly reproduce every pixel of the concept.

All runtime assets are in `dist/assets/`; there are no remote font or image requests. The generated-image tool was used in built-in mode. See `ART_DIRECTION.md` for the asset prompt set. Press Start 2P is by CodeMan38, distributed under SIL Open Font License 1.1; its license is included beside the font.
