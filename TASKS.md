# Tasks

This file collects follow-up comments and improvement ideas to revisit in the next few days.

## Upcoming Improvements

### 1. Mobile UI/UX Improvements

- Review the current login and chat screens after the MVP flow is stable.
- Improve spacing, typography, colors, input states, buttons, and message layout.
- Improve message sender titles: current user's messages should show `You`, and messages from other users should show the sender's username.
- Introduce or extend shared UI tokens/theme values before repeating hardcoded UI values.
- Keep this as a polish pass: do not add new app features while improving UI.

### 2. Device Identity Preparation

- Plan how each installed app instance should identify itself to the backend.
- Add a stable device/client identifier so the backend can distinguish different devices using the same demo account.
- Keep the identifier separate from user authentication; it should help identify the client/device, not replace JWT auth.
- Define how the mobile app stores and sends this identifier, and how the backend validates or records it.

## Notes

- These tasks should become separate scaffolds or small follow-up scaffolds before implementation.
- Keep each task scoped with clear `Done when`, `Minimal testing`, and `Do not` sections before coding.
