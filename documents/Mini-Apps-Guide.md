# https://docs.base.org/mini-apps/llms-full.txt

## Mini Apps â€” Deep Guide for LLMs

> Mini Apps are socialâ€‘native, instantâ€‘launch web apps that run inside Base App. This guide orients an LLM to MiniKit fundamentals, product capabilities, UX best practices, growth mechanics, and troubleshooting.

### What you can do here
- Scaffold new Mini Apps with MiniKit and integrate existing Next.js apps
- Configure manifests for discovery and client capabilities
- Build socialâ€‘native UX using OnchainKit components
- Plan growth loops (sharing, search, notifications) and optimize onboarding
- Diagnose issues specific to Base App vs. other Farcaster clients

## Minimal Critical Code (MiniKit + OnchainKit wiring)
```tsx
// MiniKit and OnchainKit often coâ€‘exist in Mini Apps. Keep providers minimal.
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { base } from 'wagmi/chains'

export function Providers(props: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
      {props.children}
    </OnchainKitProvider>
  )
}
```

## Navigation (with brief descriptions)

### Introduction
- [Overview](https://docs.base.org/mini-apps/overview.md) â€” Why Mini Apps

### Quickstart
- [New Apps: Install](https://docs.base.org/mini-apps/quickstart/new-apps/install.md) â€” Scaffold
- [Existing Apps: Integrate](https://docs.base.org/mini-apps/quickstart/existing-apps/install.md) â€” Integrate
- [Launch Checklist](https://docs.base.org/mini-apps/quickstart/launch-checklist.md) â€” Readiness

### Design Guidelines
- [Best Practices](https://docs.base.org/mini-apps/design-ux/best-practices.md) â€” UX patterns
- [OnchainKit](https://docs.base.org/mini-apps/design-ux/onchainkit.md) â€” Components

### Growth Playbook
- [Optimize Onboarding](https://docs.base.org/mini-apps/growth/optimize-onboarding.md) â€” Onboarding
- [Build Viral Mini Apps](https://docs.base.org/mini-apps/growth/build-viral-mini-apps.md) â€” Viral growth

### Features
- [Overview](https://docs.base.org/mini-apps/features/overview.md) â€” Feature index
- [Manifest](https://docs.base.org/mini-apps/features/manifest.md) â€” Manifest
- [Authentication](https://docs.base.org/mini-apps/features/Authentication.md) â€” Auth
- [Embeds & Previews](https://docs.base.org/mini-apps/features/embeds-and-previews.md) â€” Embeds
- [Search & Discovery](https://docs.base.org/mini-apps/technical-guides/search-discovery.md) â€” Discovery
- [Sharing & Social Graph](https://docs.base.org/mini-apps/features/sharing-and-social-graph.md) â€” Sharing
- [Notifications](https://docs.base.org/mini-apps/features/notifications.md) â€” Notifications
- [Links](https://docs.base.org/mini-apps/features/links.md) â€” Links

### Troubleshooting
- [Common Issues](https://docs.base.org/mini-apps/troubleshooting/common-issues.md) â€” Issues
- [Base App Compatibility](https://docs.base.org/mini-apps/troubleshooting/base-app-compatibility.md) â€” Client behavior

### Technical Reference
- [MiniKit Overview](https://docs.base.org/onchainkit/latest/components/minikit/overview.md) â€” Overview
- [Provider & Initialization](https://docs.base.org/onchainkit/latest/components/minikit/provider-and-initialization.md) â€” Provider
- [Hooks](https://docs.base.org/onchainkit/latest/components/minikit/hooks/useMiniKit.md) â€” Hooks


## Quickstart (excerpts)

Source: `https://docs.base.org/mini-apps/quickstart/new-apps/install.md`

Create a new Mini App with MiniKit:

```bash
npm create minikit@latest my-mini-app
cd my-mini-app && npm i && npm run dev
```

Source: `https://docs.base.org/mini-apps/quickstart/existing-apps/install.md`

Add MiniKit to an existing Next.js app:

```bash
npm install @coinbase/minikit @coinbase/onchainkit
```


## Key Concepts (excerpts)

Source: `https://docs.base.org/mini-apps/overview.md`

- Socialâ€‘native UX: Apps run inside Base App with identity, smart wallet, and sharing builtâ€‘in.
- Manifest: Declare capabilities, intents, and metadata to enable discovery and client features.
  - Source: `https://docs.base.org/mini-apps/features/manifest.md`
- Onboarding: Reduce steps; defer heavy auth until value is shown; prefill from client context.
  - Source: `https://docs.base.org/mini-apps/growth/optimize-onboarding.md`
- Discovery: Optimize for search and featuring by following guidelines.
  - Source: `https://docs.base.org/mini-apps/technical-guides/search-discovery.md`


## Authentication Best Practices (excerpts)

Sources:
- `https://docs.base.org/mini-apps/features/Authentication.md`
- `https://docs.base.org/mini-apps/growth/optimize-onboarding.md`

- Defer authentication: Let users explore and reach first value before prompting to connect or sign. Gate only when action requires identity, balance, or write access.
- Progressive disclosure: Ask for the minimum capability first (e.g., identity only). Request additional permissions justâ€‘inâ€‘time when a feature needs them.
- Use client context: Prefill known fields (handle, pfp, address) from the client to reduce typing and confusion. Avoid duplicate prompts the client already satisfied.
- Least privilege: Prefer scoped, revocable permissions (e.g., perâ€‘action transaction trays) instead of broad, persistent approvals.
- Clear intent: When prompting to authenticate, state why itâ€™s needed, what will happen, and the benefit. Keep copy short and actionâ€‘oriented.
- Resilience & UX: Provide guest mode where possible; handle declined auth gracefully with alternate paths or readâ€‘only modes.
- Server verification: Verify any signed payloads or tokens serverâ€‘side. Enforce replay protection, expiration, and domain binding.
- Secure webhooks: If using webhooks (e.g., for frame updates), require signature verification and rate limiting; log and alert on failures.

Modes summary (from Authentication):

- SIWF / Quick Auth â€” Social identity with low friction, session via JWT when needed.
  - Create Account users: See a Login Request tray; sign SIWF inâ€‘app with passkey.
  - Connect Account users: Oneâ€‘time deeplink to Farcaster to register an auth address, then seamless inâ€‘app signâ€‘in thereafter.
  - Source: `https://docs.base.org/mini-apps/features/Authentication.md`
- Wallet Auth â€” Uses the inâ€‘app smart wallet. Prefer for persisted sessions only when necessary; do not gate initial exploration behind connect.
  - Pair with transaction trays for clear intent and safe approvals.
  - Source: `https://docs.base.org/mini-apps/features/Authentication.md`
- Context Data â€” Provided by hosts and useful for personalization/analytics, but not cryptographic proof of identity.
  - Treat as hints only; never primary auth. It can be spoofed by nonâ€‘official hosts.
  - Source: `https://docs.base.org/mini-apps/features/Authentication.md`

Hook reference:

- useAuthenticate â€” Returns verified user from SIWF or wallet auth. Use alongside `useMiniKit` context.
  - Source: `https://docs.base.org/onchainkit/latest/components/minikit/hooks/useAuthenticate.md`

Example (hook usage):

```tsx
import { useMiniKit } from '@coinbase/minikit'
import { useAuthenticate } from '@coinbase/onchainkit/minikit'

export function AuthGate(props: { children: React.ReactNode }) {
  const { context } = useMiniKit()
  const { user } = useAuthenticate()

  // Use context for UI hints only
  const displayName = context?.user?.displayName ?? 'Friend'

  // Use verified user for secure ops
  if (!user) return <button>Sign in</button>
  return <div aria-live="polite">Welcome, {displayName}!{props.children}</div>
}
```

Conceptual serverâ€‘side verification (pseudocode):

```ts
// Verify a signed payload from the client (conceptual)
function verifyAuth({ address, message, signature }): boolean {
  const recovered = recoverAddress({ message, signature })
  if (!timingSafeEqual(recovered, address)) return false
  if (isExpired(message)) return false
  if (!isExpectedDomain(message.domain)) return false
  return true
}
```

Prompt timing guidelines:
- On first open: no auth prompt; show value and CTA.
- On action requiring identity or write: show a single, focused auth step.
- After success: persist session, avoid reâ€‘prompting; provide visible account state.


## API and Schemas (pruned)

- MiniKit Provider and initialization props
  - Source: `https://docs.base.org/onchainkit/latest/components/minikit/provider-and-initialization.md`
- `useMiniKit` hook: access frame context, user, and client capabilities
  - Source: `https://docs.base.org/onchainkit/latest/components/minikit/hooks/useMiniKit.md`

Example manifest fields (conceptual):

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
    "payload": "eyJkb21haW4iOiJhcHAuZXhhbXBsZS5jb20ifQ",
    "signature": "MHgxMGQwZGU4ZGYwZDUwZTdmMGIxN2YxMTU2NDI1MjRmZTY0MTUyZGU4ZGU1MWU0MThiYjU4ZjVmZmQxYjRjNDBiNGVlZTRhNDcwNmVmNjhlMzQ0ZGQ5MDBkYmQyMmNlMmVlZGY5ZGQ0N2JlNWRmNzMwYzUxNjE4OWVjZDJjY2Y0MDFj"
  },
  "baseBuilder": {
    "allowedAddresses": ["0x..."]
  },
  "frame": {
    "version": "1",
    "name": "Example Mini App",
    "homeUrl": "https://ex.co",
    "iconUrl": "https://ex.co/i.png",
    "splashImageUrl": "https://ex.co/l.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://ex.co/api/webhook",
    "subtitle": "Fast, fun, social",
    "description": "A fast, fun way to challenge friends in real time.",
    "screenshotUrls": [
      "https://ex.co/s1.png",
      "https://ex.co/s2.png",
      "https://ex.co/s3.png"
    ],
    "primaryCategory": "social",
    "tags": ["example", "miniapp", "baseapp"],
    "heroImageUrl": "https://ex.co/og.png",
    "tagline": "Play instantly",
    "ogTitle": "Example Mini App",
    "ogDescription": "Challenge friends in real time.",
    "ogImageUrl": "https://ex.co/og.png",
    "noindex": true
  }
}
```


## Examples (common flows)

Example: Wire providers for OnchainKit + MiniKit

Sources:
- `https://docs.base.org/mini-apps/design-ux/onchainkit.md`
- `https://docs.base.org/onchainkit/latest/components/minikit/provider-and-initialization.md`

```tsx
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { base } from 'wagmi/chains'

export function Providers(props: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
      {props.children}
    </OnchainKitProvider>
  )
}
```

Example: Use `useMiniKit` to access client context

Source: `https://docs.base.org/onchainkit/latest/components/minikit/hooks/useMiniKit.md`

```tsx
import { useMiniKit } from '@coinbase/minikit'

export function Screen() {
  const { user, client } = useMiniKit()
  return <pre>{JSON.stringify({ user, client }, null, 2)}</pre>
}
```
