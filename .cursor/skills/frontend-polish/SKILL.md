---
name: frontend-polish
description: Frontend quality workflow for Codex. Use for UI changes, layout adjustments, responsive fixes, design refinement, and interaction polish when Codex should inspect components in context, preserve the existing design system, verify desktop and mobile behavior, and avoid generic or low-intent interface changes.
---

# Frontend Polish

Use this skill for UI work that needs contextual judgment, not just mechanical edits.

## Standard

Inspect the component in context before editing.

Understand:

- surrounding layout
- hierarchy
- spacing
- overflow behavior
- responsiveness
- interaction state
- the existing visual system

## Design Rules

Preserve established product patterns when they exist.

If the interface is new or under-specified, avoid generic defaults. Make deliberate choices in:

- typography
- spacing
- visual hierarchy
- color usage
- motion

## Responsive Checks

Treat desktop and mobile as first-class surfaces.

For layout changes, verify:

- alignment
- wrapping
- overflow
- readable density
- tap targets when relevant

## Implementation Bias

Prefer simple structural fixes over layering on ad hoc spacing hacks.

If the change is visual, inspect the parent and sibling layout before changing the target element in isolation.

## Guardrails

Do not break the design system to make one screen look better.

Do not leave UI work unverified at relevant breakpoints when verification is practical.
