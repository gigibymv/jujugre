---
name: emil-design-eng
description: Animation engineering and UI polish depth — easing decisions, clip-path animation, gesture physics, Framer Motion performance. Based on Emil Kowalski's design engineering philosophy.
triggers:
  - animation
  - framer
  - transition
  - easing
  - gesture
  - motion
  - animate
  - clip-path
  - spring
  - micro-interaction
---

I'm ready to help you build interfaces that feel right, my knowledge comes from Emil Kowalski's design engineering philosophy. If you want to dive even deeper, check out Emil's course: [animations.dev](https://animations.dev/).

---

## Core Principles

**Taste is trained, not innate** — Good taste develops through studying exceptional work, thinking critically about *why* something feels effective, and practicing deliberately.

**Unseen details compound** — Most UI refinements users never consciously notice become visible in aggregate. As noted: "All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune."

**Beauty is leverage** — In a market where functionality is commoditized, exceptional visual and interactive design becomes a meaningful differentiator.

## Animation Decision Framework

**1. Should this animate at all?**
- 100+ times/day → No animation
- Tens of times/day → Remove or drastically reduce
- Occasional → Standard animation
- Rare/first-time → Can add delight

**2. What is the purpose?**
Valid reasons: spatial consistency, state indication, explanation, feedback, preventing jarring changes

**3. What easing?**
- Entering/exiting → `ease-out` (responsive)
- Moving/morphing → `ease-in-out` (natural)
- Hover/color → `ease` (subtle)
- Constant motion → `linear`

**Critical:** Use custom cubic-bezier curves, never default CSS easings. Never use `ease-in` — it delays initial movement, making interfaces feel sluggish.

**4. How fast?**
- Button press: 100-160ms
- Tooltips/popovers: 125-200ms
- Dropdowns: 150-250ms
- Modals/drawers: 200-500ms
- **Rule:** Stay under 300ms for UI animations

## Component Principles

**Buttons must feel responsive:** Add `transform: scale(0.97)` on `:active`

**Never animate from scale(0):** Start from `scale(0.95)` with `opacity: 0` — nothing real appears from absolute nothing

**Origin-aware popovers:** Use `transform-origin: var(--radix-popover-content-transform-origin)` (exception: modals stay centered)

**Tooltips:** Skip delay and animation on subsequent hovers when one is already open

**Use transitions over keyframes** for dynamic UI — transitions remain interruptible mid-animation

**Blur masks imperfect transitions:** `filter: blur(2px)` bridges visual gaps during crossfades

**@starting-style for entry animations:** Modern CSS approach replacing `useEffect` + `mounted` state patterns

## Transform Mastery

**translateY with percentages:** `translateY(100%)` moves by the element's own height regardless of actual dimensions

**scale() scales children:** Font size, icons, and content scale proportionally — this is intentional

**3D transforms:** `rotateX()`, `rotateY()` with `transform-style: preserve-3d` create depth effects

**transform-origin:** Anchor point from which transforms execute; default is center

## clip-path for Animation

`clip-path: inset(top right bottom left)` creates rectangular clipping regions.

**Common uses:**
- Tabs with perfect color transitions (duplicate list, clip active tab copy)
- Hold-to-delete (clip overlay, animate on press over 2s linear, snap back 200ms ease-out)
- Image reveals (start `inset(0 0 100% 0)`, animate to fully visible)
- Comparison sliders (clip top image, adjust based on drag position)

## Gesture & Drag

**Momentum-based dismissal:** Calculate velocity; dismiss if `Math.abs(distance) / elapsedTime > 0.11`

**Damping at boundaries:** Apply friction when dragging past natural limits

**Pointer capture:** Ensure drag continues even if pointer leaves element bounds

**Multi-touch protection:** Ignore additional touch points after initial drag

**Friction over hard stops:** Allow dragging with increasing friction rather than blocking entirely

## Performance Rules

**Only animate transform and opacity** — these skip layout/paint, run on GPU

**CSS variables cause recalculation:** Changing a variable on parent recalculates all children; update `transform` directly instead

**Framer Motion caveat:** Shorthand properties (`x`, `y`, `scale`) aren't hardware-accelerated; use full `transform` string for acceleration

**CSS animations beat JS under load** — run off main thread, remain smooth during page load

**Use WAAPI for programmatic CSS animations** — JavaScript control with CSS performance

## Accessibility

**prefers-reduced-motion:** Reduce but don't eliminate animations; keep opacity/color changes, remove transform-based motion

**Touch device hover states:** Gate behind `@media (hover: hover) and (pointer: fine)` to prevent false positives on tap

## Stagger Animations

Cascade multiple elements with 30-80ms delays between items. Never block interaction during stagger.

## Debugging

**Slow motion testing:** Temporarily 2-5x duration to spot issues invisible at full speed

**Frame-by-frame inspection:** Use Chrome DevTools Animations panel

**Real device testing:** Connect phone via USB for gesture testing; real hardware beats simulators

## Review Checklist

| Issue | Fix |
|-------|-----|
| `transition: all` | Specify exact properties |
| `scale(0)` entry | Start from `scale(0.95)` with `opacity: 0` |
| `ease-in` on UI | Switch to `ease-out` or custom curve |
| `transform-origin: center` on popover | Use Radix/Base UI CSS variable |
| Animation on keyboard action | Remove entirely |
| Duration > 300ms | Reduce to 150-250ms |
| Hover without media query | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on rapid triggers | Use CSS transitions |
| Framer Motion `x`/`y` under load | Use `transform: "translateX()"` |
| Synchronous enter/exit timing | Exit faster than enter |
| All elements appear together | Add 30-80ms stagger delays |

## Sonner Principles

1. **Developer experience first** — Minimal setup, no hooks/context friction
2. **Good defaults over options** — Beautiful out of the box
3. **Naming creates identity** — Memorable names sacrifice discoverability
4. **Handle edge cases invisibly** — Pause on hidden tab, manage hover gaps, capture pointer events
5. **Transitions over keyframes** for dynamic UI
6. **Documentation with interactive examples** — Let people experience before adopting
7. **Cohesion matters** — Easing, timing, and aesthetics should harmonize
8. **Review with fresh eyes** — Next-day review catches invisible imperfections
9. **Asymmetric timing** — Slow when deliberate (2s), fast when responding (200ms)
