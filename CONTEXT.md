# CanvasEditor Sidebar Update Context

This update refactors the right sidebar (properties panel) of the `CanvasEditor.tsx` to accurately match the newly generated "Invitaciones PDF Dinámicas" designs from Stitch.

## Changes Included
- Replaced the previous 72px width (`w-72`) sidebar with a fixed width of `w-[380px]`.
- Reconstructed the typography section to include specific fields required by the design: Font Family selector, numerical Font Size input, numerical Line Height input, and a unified 5-color palette (reflecting the exact colors selected for the "Alexandria High-End Editorial" theme).
- Reconstructed the interactivity panel for 'groups' (acting as buttons) to display specific URL mapping sections based on the design tokens (Map, Calendar, Social, Link fields).
- Ensured proper wiring to existing state elements (`fontSize`, `textColor`, `linkUrl`).
- Added the "Review Changes" sticky action button.
- Resolved build / lint errors from development environment test scripts.
