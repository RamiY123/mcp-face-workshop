# Face assets and attribution

The six SVG files are original, deliberately simple development placeholders released under the repository's MIT license. They are not the intended realistic-face deliverable. Both the manifest and viewer label them as placeholders.

To finish the workshop visuals:

1. Choose a front-facing portrait with permission for transformation and public redistribution. Record the creator, source, permission/license, and any required attribution here. Do not put a private portrait in a public commit without permission.
2. Prepare neutral, smug, shocked, eye_roll, wink, and confused versions of the same subject. Use matching crop, size, lighting and background to avoid a jump on switching.
3. Follow `preparation/README.md` for the optional LivePortrait approach. Visually review each expression before calling it final.
4. Put exported PNG/JPG/WebP images in `assets/expressions/`, update the corresponding manifest filenames and credit, and change `temporary` to false only after review.
5. Run `npm run verify`; inspect all six images in the viewer at desktop and phone widths. Automated image decoding alone does not prove realism or humor.

No model weights, face datasets, third-party portraits, or LivePortrait code are included.
