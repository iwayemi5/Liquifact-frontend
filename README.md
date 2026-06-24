# LiquiFact Frontend

Web app for **LiquiFact** — the global invoice liquidity network on Stellar. Next.js dashboard for SMEs (upload invoices, get liquidity) and investors (fund tokenized invoices, earn yield). Stellar wallet integration is planned.

Part of the LiquiFact stack: **frontend** (this repo) | **backend** (Express API) | **contracts** (Soroban).

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+

---

## Setup

1. **Clone the repo**

   ```bash
   git clone <this-repo-url>
   cd liquifact-frontend
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Configure environment** (optional)

   ```bash
   cp .env.local.example .env.local
   # Set NEXT_PUBLIC_API_URL if the API is not at http://localhost:3001
   ```

---

## Development

| Command         | Description                |
|-----------------|----------------------------|
| `npm run dev`   | Start dev server (Turbopack) |
| `npm run build` | Production build           |
| `npm run start` | Start production server   |
| `npm run lint`  | Run ESLint                 |
| `npm run test:e2e` | Run Playwright smoke tests |

Default: [http://localhost:3000](http://localhost:3000). The home page can check API health at `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).

---

## Project structure

```
liquifact-frontend/
├── app/
│   ├── layout.js      # Root layout, LiquiFact metadata
│   ├── page.js        # Home (wallet CTA, API health check)
│   ├── invoices/      # Invoices placeholder page
│   └── invest/       # Invest placeholder page
├── public/
├── .env.local.example
├── eslint.config.mjs
└── package.json
```

Tech: **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**.

---

## CI/CD

GitHub Actions runs on every push and pull request to `main`:

- **Lint** — `npm run lint`
- **Build** — `npm run build`

Keep both passing before opening a PR.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor workflow, branch naming convention, local checks, and accessibility expectations.


1. **Fork** the repo and clone your fork.
2. **Create a branch** from `main`: `git checkout -b feature/your-feature` or `fix/your-fix`.
3. **Setup**: `npm ci`, optionally `cp .env.local.example .env.local`.
4. **Make changes**:
   - Follow existing patterns under `app/`.
   - Run `npm run lint` and `npm run build` locally.
5. **Commit** with clear messages (e.g. `feat: add X`, `fix: Y`).
6. **Push** to your fork and open a **Pull Request** to `main`.
7. Wait for CI and address review feedback.

We welcome UI improvements, new pages (e.g. invoice upload, marketplace), and Stellar wallet integration aligned with the LiquiFact product.
## UI Components

See [COMPONENTS.md](COMPONENTS.md) for the full component library reference — props, accessibility notes, and usage examples for every shared component (`ErrorBanner`, `Footer`, `InvoiceListSkeleton`, `ToastProvider`, `UploadZone`, `WalletStatus`).

## Design Tokens

- **Colors**
  - `--color-bg`: `#0f0f0f` (slate‑950)
  - `--color-primary`: `#06b6d4` (cyan‑400)

- **Typography**
  - Font family: **Geist** – imported via `@fontsource/geist`.
  - Headings use `font‑bold`, body uses `font‑regular`.

## Testing

See [TESTING.md](TESTING.md) for the full guide covering Jest unit/accessibility tests and Playwright end-to-end setup.

---

## Marketplace Pagination

The **Invest** marketplace (`app/invest/page.js`) renders invoices PAGE_SIZE at a time to keep the DOM bounded as the dataset grows.

| Constant | Value | Description |
|---|---|---|
| `PAGE_SIZE` | `10` | Maximum invoices shown per page (exported for tests) |

### Behaviour

- **Initial render** — only the first `PAGE_SIZE` invoices are rendered.
- **Load more** — clicking "Load more" appends the next `PAGE_SIZE` items.  The button disappears once all invoices are visible.
- **Status region** — a screen-reader live region announces "Showing N of M investable invoices" after each load so assistive-technology users always know their position.
- **Paging reset** — `visibleCount` resets to `PAGE_SIZE` whenever a new invoice array arrives (e.g. after a filter change), ensuring a consistent first-page experience.
- **Edge cases** — fewer items than a page, exactly one page, and the final partial page all work correctly; no "Load more" button is shown when all items already fit.

### Accessibility

- The "Load more" button has `aria-label="Load more invoices"`.
- Focus returns to the button after each click so keyboard users keep their navigation position (validate with Playwright; jsdom focus handling is limited in unit tests).

## Contracts

- [WALLET_INTEGRATION_CONTRACT.md](WALLET_INTEGRATION_CONTRACT.md)
- [FILTER_CONTRACTS.md](FILTER_CONTRACTS.md)

---

## License

MIT (see root LiquiFact project for full license).
