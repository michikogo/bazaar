# Design System

Components live in `src/ds/`. Import from the barrel:

```ts
import { Button, Card, Flex, Text } from "./ds"
```

Run Ladle to browse and interact with all components:

```bash
npm run ladle     # opens at http://localhost:61001
```

---

### Button

```tsx
<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>
```

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | `primary` | `primary` `secondary` `ghost` `warning` `destructive` |
| `size` | string | `md` | `sm` `md` `lg` |
| `disabled` | boolean | `false` | |
| `type` | string | `button` | `button` `submit` `reset` |
| `onClick` | function | — | |
| `className` | string | — | |

---

### Text

```tsx
<Text size="lg" weight="semibold" color="muted" as="h2">
  Hello
</Text>
```

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `size` | string | `base` | `xs` `sm` `base` `lg` `xl` `2xl` |
| `weight` | string | `normal` | `normal` `medium` `semibold` `bold` |
| `color` | string | `default` | `default` `muted` `warning` `destructive` |
| `as` | string | `p` | `p` `span` `h1` `h2` `h3` `h4` |
| `className` | string | — | |

---

### Flex

```tsx
<Flex direction="row" gap="4" align="center" justify="between">
  <div>Left</div>
  <div>Right</div>
</Flex>
```

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `direction` | string | `row` | `row` `col` |
| `gap` | string | `0` | `0` `1` `2` `4` `6` `8` |
| `align` | string | `start` | `start` `center` `end` `stretch` |
| `justify` | string | `start` | `start` `center` `end` `between` |
| `wrap` | boolean | `false` | |
| `className` | string | — | |

---

### Card

```tsx
<Card onClick={() => navigate("/product/1")} className="p-4">
  <Text weight="semibold">Product name</Text>
</Card>
```

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `onClick` | function | — | adds hover shadow when provided |
| `className` | string | — | |

---

## Color tokens

Defined in `src/index.css` under `@theme`. Change the hex values there to retheme the whole app.

| Token | Usage |
|-------|-------|
| `primary` / `primary-foreground` | Main actions, links |
| `secondary` / `secondary-foreground` | Subtle backgrounds, secondary actions |
| `warning` / `warning-foreground` | Warnings |
| `destructive` / `destructive-foreground` | Errors, delete actions |
| `muted` | De-emphasised text |

---

## Why Ladle over Storybook

**Storybook** is the industry standard but comes with significant overhead — a separate build pipeline, dozens of dependencies, and a complex config surface that often breaks on major Vite upgrades.

**Ladle** gives us the same core feature (an isolated component browser with `.stories.tsx` files in the same Storybook format) but is built on top of Vite directly. That means:

- Instant startup — same speed as `npm run dev`
- No separate build pipeline or config needed
- Stories are plain React exports — no boilerplate
- `.stories.tsx` files are Storybook-compatible if we ever want to migrate

The tradeoff: Ladle has fewer addons (no actions panel, no a11y plugin out of the box). For a project at this stage that's a fine trade.
