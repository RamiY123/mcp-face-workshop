# Xperience Face Lab visual direction

Reference: the owner's Xperience Visual Brand Guide, consolidated 16 August 2026, read from Google Drive for this implementation. The viewer applies its deep-purple/charcoal backgrounds, violet emphasis, restrained orange accents, clean sans-serif typography, subtle translucent panels, and readable hierarchy. Exact CSS values are implementation choices, not purported official brand color specifications.

The original logo is served locally from `web/public/branding/xperience-logo.png`. It is reused unchanged from the owner's existing Xperience Knowledge app, with its aspect ratio preserved and a light backing for wordmark contrast. No logo is generated, redrawn, or recolored. See the asset's adjacent README for attribution.

The expression remains the primary visual. Presets have a visible selected state, keyboard focus, and comfortable touch targets. Status and activity remain readable independently of color. Layout adapts from two columns to a stacked phone view; the interface does not depend on external fonts or image hosts.

The temporary expression SVGs use a lavender palette to fit the interface. They remain explicitly labeled development placeholders; this styling does not replace the outstanding realistic portrait work.

Each new expression command triggers a 1.05–1.25 second pop-out: anticipation, zoom and tilt beyond the card, a violet/orange spark burst, then a bounce home. Angry, shocked, laughing, and love use a stronger zoom. A new command for the same expression replays the effect; initial page load and reconnecting to the same command do not. Rapid commands replace the active effect. The decorative overlay never intercepts controls or changes the page layout. Reduced-motion preferences disable the effect, including immediately cancelling an effect already in progress.

The viewer acknowledges the loaded expression after a paint opportunity; it does not wait for the animation to finish. Display confirmation therefore means the expression has appeared, not that its animation has completed.
