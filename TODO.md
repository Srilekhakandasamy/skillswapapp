# TODO - Skill Swap Platform (MERN)

## Step 1 — Backend contract fixes (critical)
- Align Booking model + routes controller payload with required fields:
  - receiverId, skillOfferedId, skillRequestedId, sessionGoal, senderId from JWT
- Fix Booking schema so it stores both offered/requested skills (as refs) consistently.
- Update booking creation endpoint + accept/reject/complete endpoints accordingly.

## Step 2 — Rating & Review refactor (critical)
- Refactor Review model + controller + routes to store rating between users (from/to) after a completed booking.
- Enforce:
  - Only participants of booking can review
  - Only after booking.completed=true
  - Only once per booking per reviewer
- Recompute User average rating from stored reviews.

## Step 3 — Frontend booking request + completion flow (critical)
- Update `frontend/src/pages/Skills.js` request form to send correct booking payload.
- Add “Complete session” action in `frontend/src/pages/Bookings.js`.

## Step 4 — Frontend rating flow (critical)
- Update `frontend/src/pages/Reviews.js` to rate the other user for a completed booking (instead of choosing arbitrary skill).
- Add UI to select completed accepted booking and submit 1–5 stars + comment.

## Step 5 — Optional: matching and dashboards improvements
- Upgrade match display and add “matched users” + reasoning.
- Expand dashboard to show accepted sessions clearly.

## Step 6 — Tailwind UI polish
- Convert inline styles to Tailwind utility classes across pages/components.
- Add simple star-rating component and tag input UI.

## Step 7 — Testing
- End-to-end verification of:
  - Signup/Login
  - Post offer/request with tags/level
  - Mutual match
  - Send request with sessionGoal
  - Accept/Reject
  - Complete session
  - Rate each other and view updated averages

