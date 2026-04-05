# Deer Drone MVP Implementation Notes

This note resolves the main conflicts across the original markdown files so the source scaffold can stay consistent.

## Canonical Decisions

1. Payment scope:
QPay is the active MVP integration path. Bank transfer is scaffolded as a simple fallback contract. SocialPay is deferred to a later phase.

2. Checkout API:
The canonical endpoint is `POST /api/v1/checkout`. Older references like `/api/orders/create` should be treated as outdated.

3. Address handling:
Checkout accepts a full shipping address snapshot in the request body. This avoids forcing an `addresses` table into the MVP before account-address management is built.

4. Chatbot scope:
The chatbot MVP uses one default OpenAI model (`gpt-4o-mini`) with a streaming-friendly response contract. Multi-model routing is kept as an extension point, not an MVP requirement.

5. Role model:
`profiles.role` remains the runtime source for authorization while the `roles` table exists as a seedable permissions catalog.

## What This Scaffold Optimizes For

- Fast implementation from the docs
- Clear seams for real integrations
- Mongolian-first UI copy
- Minimal rework when moving from mock data to Supabase

## Planned Next Wiring Steps

- Replace mock catalog/order data with Supabase queries
- Connect checkout to real QPay invoice creation
- Swap heuristic chatbot responses with live OpenAI Responses API calls
- Add auth and role-aware protected routes
