# A Little Windowsill — first game release

A small, personal shelf garden based on the user's plant arrangement and approved pixel-art concept. The artwork is the interface: three living plants, two small corner buttons, and little visitors at the window.

## Play

Tap a lower-shelf plant to water, gather new growth, rename it, or choose another plant. Swapped plants keep their growth and moisture in the nursery. If a chosen species is already on the shelf, the two plants exchange places. Plants never die; dry plants rest until watered. They continue growing between visits. Established foliage stays visible after gathering.

The **journal** button holds seven chapters, visitor discoveries, keepsakes and the plant catalogue. The **three-dot** button holds light, sound, motion, scene size, a separate browser window, and save export/import. There is no permanent toolbar or statistics sidebar. The little temple and green figurine also respond to taps.

The three initial plants loosely reflect the photo: peace lily, lime foliage and trailing green. The latter two are descriptive game names, not botanical identifications. Basil, lavender, strawberry and marigold remain available. The original user photograph is not included in the deployed application.

## Growth and progression

| Plant | First new growth | Further crop | Soil dries in | Keepsake |
| --- | --- | --- | --- | --- |
| Peace lily | 12h | 18h | 72h | Ivory bloom |
| Lime foliage | 8h | 10h | 60h | Leaf impression |
| Trailing green | 10h | 12h | 84h | Little cutting |
| Basil | 12h | 6h | 72h | Basil leaves |
| Lavender | 24h | 18h | 96h | Lavender sprig |
| Strawberry | 20h | 12h | 60h | Strawberries |
| Marigold | 18h | 12h | 72h | Golden bloom |

These are game timings. One keepsake is added per gathering action; double claims are blocked until a new crop matures. The trailing plant starts ready to gather. A care action counts when moisture is below 95%, so repeated taps on a freshly watered plant do not farm progression.

- **Moth:** available at dusk/night from the start. Tap to observe.
- **Ladybird:** appears after tending two different plant types.
- **Evening fox:** appears outside at dusk/night after observing the moth and making three meaningful care actions.
- Visitors return after a 20-minute cooldown. Discoveries persist; repeat visits do not claim new journal pages.
- Completing three journal chapters lights the small string of lights. Seven chapters cover care, gathering, all three visitors and collecting from three species.

All species are freely available for personal arrangements. No currency, buying, pressure timer or punishment is used. Window light is chosen in settings, not a live-weather feed. “Preview six hours passing” is tucked into the settings details and advances the saved game clock.

## Saved progress and backup

The new game uses `pocket-garden-shelf-v1` with a version-2 schema. On the first visit it reads the old `pocket-garden-v1` save without writing to or deleting it. Old plants enter the nursery with their growth and moisture preserved. The complete old save, including collections, is retained in the new journal's legacy section and in exported backups.

Saves are local to this browser, device and origin. They do not automatically sync across devices. **Save a copy** exports JSON; **Restore a saved copy** imports a validated shelf save. Invalid imports leave the current game unchanged. A separate same-origin window receives storage updates. This is browser hosting, not an installed always-on-top desktop app.

## Artwork

`art/approved-shelf-concept.png` preserves the approved concept with the corrected single-face creeper. The deployed game uses `dist/assets/shelf/room.png` for scenery and `dist/assets/shelf/foliage.png` for independently interactive foliage. Those layers were prepared with the built-in image-generation tool using the approved concept as a reference. Pixel visitors and the decorative flower are code-native SVG sprites. Existing herbs use the original plant atlas. `ART_DIRECTION.md` records the prompt set and asset paths.

The scene retains a 4:3 aspect ratio on every viewport. Its default width is at most 720 CSS pixels, with a larger view available. The app uses locally bundled Press Start 2P under SIL Open Font License 1.1; the license remains in `dist/assets/FONT-LICENSE.txt`.

## Develop and verify

`npm run dev` starts a buildless static preview on port 5173. No dependency installation is required for the app. `npm test` runs 14 model tests for both legacy and shelf mechanics. `npm run test:browser` uses the desktop-session Playwright package and installed Chrome; adapt the machine-specific runtime path on another computer.

The shelf browser test exercises watering, gathering, regrowth, all visitor discoveries, milestone lights, plant swaps, safe renaming, journal pages, export/import, invalid-import rejection, preferences, reload persistence, old-save migration and six viewport sizes. Screenshots and test downloads go into ignored `artifacts/`. Physical iPad and Safari testing have not been performed. Older browser/placement scripts cover the retired prototype and are retained as historical verification helpers; the active browser entrypoint is `tests/shelf-browser.cjs`.
