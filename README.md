# @nanotiny/json-expression — Web Tester

An interactive browser-based playground for testing [`@nanotiny/json-expression`](https://www.npmjs.com/package/@nanotiny/json-expression) queries.

**[Live Demo](https://joehom0416.github.io/nanotiny-json-expression-webtester/)**

## Features

- **Two-panel layout** — JSON editor and expression tester side by side
- **Load Sample JSON** — one click to populate a rich dataset for trying expressions
- **Mode toggle** — switch between `query()`, `queryAsArray()`, and `evaluate()` modes
- **Shortcut dropdowns** — six categories (Path, Filter, String, Number, Array, Date) that insert snippets into the expression input
- **Ctrl+Enter** — run the expression from the keyboard
- **📖 Docs modal** — popup with full expression guide, dismiss with Escape or click outside

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Running Tests

```bash
npm test
```

## Production Build

```bash
npm run build
npm run preview
```

## Expression Guide

Click the **📖 Docs** button in the header to open the full [`EXPRESSION_GUIDE.md`](./EXPRESSION_GUIDE.md) — a reference for all supported path syntax, filter operators, and transforms.

Quick examples using the sample data:

| Expression | Result |
|---|---|
| `version` | `"2.0"` |
| `companies.name \| id == "company1"` | `"Acme Corporation"` |
| `companies.name \| id == "company1" \\ toUpper()` | `"ACME CORPORATION"` |
| `statistics.quarterlyData.profit \\ sum()` | `5700000` |
| `employees \\ sort("salary", "desc")` | Employees sorted by salary desc |

## License

MIT
