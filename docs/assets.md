# Face assets and attribution

The 12 SVG files are original illustrated demo reactions released under the repository's MIT license. They use dimensional lavender shading, detailed eyes, expressive brows and mouths, and small reaction details. They are not the intended realistic-face deliverable; the manifest and viewer keep that distinction visible.

Available reactions: neutral, smug, shocked, eye_roll, wink, confused, angry, happy, laughing, sad, sleepy, and love. The manifest is authoritative for IDs, descriptions, labels, and filenames. Regenerate the original vector assets with `node scripts/generate-expression-assets.mjs`; adding an ID requires an illustration renderer as well as its manifest entry.

To finish the workshop visuals:

1. Choose a front-facing portrait with permission for transformation and public redistribution. Record the creator, source, permission/license, and any required attribution here. Do not put a private portrait in a public commit without permission.
2. Prepare the reactions listed in the manifest using the same subject. Use matching crop, size, lighting and background to avoid a jump on switching.
3. Follow `preparation/README.md` for the optional LivePortrait approach. Visually review each expression before calling it final.
4. Put exported PNG/JPG/WebP images in `assets/expressions/`, update the corresponding manifest filenames and credit, and change `temporary` to false only after review.
5. Run `npm run verify`; inspect every image in the viewer at desktop and phone widths. Automated image decoding alone does not prove realism or humor.

No model weights, face datasets, third-party portraits, or LivePortrait code are included.
