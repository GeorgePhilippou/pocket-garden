# Built-in image-generation prompt set

Reference: the conversation's three-panel A Little Garden concept sheet, especially its middle Pocket Garden panel. Generated assets were copied into the project; originals remain in the Codex generated-images directory.

## Courtyard (`dist/assets/courtyard.png`)
Game-background recreation of the middle panel, scenery and empty planter only. Landscape 3:2. Rich chunky pixel art, terracotta planter, pale stone patio, ivy and tiny white flowers at outer edges, watering can upper left. Large central soil plane left empty for game sprites. No UI, typography, or plants in soil.

## Plants (`dist/assets/plants.png`)
Transparent 3-column, 2-row sprite atlas. Upper row: basil, marigold, lavender. Lower row: strawberry, young seedling, tiny sprout. Chunky green leaves and dark stepped outlines, golden light, cohesive retro console pixel art. No pots, ground, labels, or panels. SVG view boxes crop the measured opaque bounds in `dist/sprites.js`; each sprite uses its own stem tip as its root anchor. No source artwork was regenerated or modified during the placement refinement.

## Themes (`dist/assets/themes.png`)
Two equal full-bleed scenes stacked vertically, total 3:4 aspect ratio. Reference is the courtyard's empty planter. Preserve planter scale and position. Top: sunny cream windowsill, blue sky, distant town, wooden ledge. Bottom: indigo moonlit windowsill, lit town windows, lantern at far right. Both leave planter empty; no interface or text.

# Personal shelf game assets (approved photo-based direction)

Built-in image-generation mode, with the approved corrected shelf concept as the editing reference. Original photograph was used to establish the concept; it is not shipped in the game. The corrected concept is retained at `art/approved-shelf-concept.png`.

## Empty-pot scenery (`dist/assets/shelf/room.png`)

Precise asset-preparation edit: preserve the 4:3 composition, woodwork, window, curtains, upper display, upper white pot and upper trailing ivy. Remove only the foliage from the three lower living plants, leaving the existing woven pots and blue-white pot with dark soil openings. Reconstruct the window behind the removed leaves. Preserve the one-face creeper. Remove the baked-in moth and journal/menu icons so they can become interactive elements. The generated background also omitted the orange decorative flower foliage; a code-native pixel flower sprite restores that decorative role above the jade vase.

## Separate foliage (`dist/assets/shelf/foliage.png`)

Transparent 3:1 atlas with three square cells. Left: dark broad-leaf peace-lily foliage with ivory sails. Middle: lime-green pointed leaves with feathered pale stripes. Right: small oval-leaf bush with short trailing stems. No pots, shelves or text. Match the approved warm green/gold pixel style, isolated sprites and stems toward a common lower baseline. Display-time SVG crops in `shelf-art.js` keep plants independent and anchored at each pot opening.

## Interactive sprites

Moth, ladybird and fox are original code-native rectangle patterns in `shelf-art.js`. The temple light switch, decorative flower, subtle leaf motion, observation targets and two corner controls are implemented in code. The shelf image stays in proportion and visitors are layered appropriately around the foliage.

# Plant grounding and cute insect refinement

Built-in image-generation mode was used for both new raster assets, with the approved shelf concept as the style reference. The original plant photo was also used as the LEGO-flower reference.

## `dist/assets/shelf/lego-flower.png`

Prompt: recreate only the static LEGO orange flower arrangement between the lower peace lily and lime plant. Two curled-petal orange flower heads, black segmented stems and angular dark leaf pieces, jade vase and brown base. Preserve the approved scene's warm pixel style. Isolate on genuine transparency; no other objects or scenery. Runtime SVG displays only the flower-and-stem portion above the existing scene's jade vase; the vase is not duplicated.

## `dist/assets/shelf/insects.png`

Prompt: cohesive transparent 3-column, 2-row sprite atlas, upper row moth/bee/wasp, lower row ladybug/caterpillar/empty. A cream moth with patterned wings, eye spots and feathery antennae; a fluffy round golden bee with brown bands and pale wings; a slimmer yellow-brown wasp with narrow waist and longer wings; a coral-red spotted ladybug; a plump segmented green caterpillar. Friendly eye highlights, forest-green outlines, warm light and deliberate square pixel clusters. No plants, text, ground or panels. `INSECTS` in `shelf-art.js` uses measured display crops that include complete silhouettes and exclude neighbouring sprites.

Plant roots were corrected in code rather than regenerating foliage. Every measured stem is anchored inside the soil, and original front-rim pixels are composited over its base. The background and the three living pots retain their approved placement.
