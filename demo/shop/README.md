# Demo: a made-up shop

A tiny online shop split across 11 languages, so you can see how Code Atlas handles a mixed codebase.

| Folder | Language | What it pretends to do |
|---|---|---|
| `api/` | Go | A web server that lists orders |
| `billing/` | Java | Adds tax to an invoice |
| `engine/` | Rust | Applies a discount to a price |
| `lib/` | PHP | A shopping cart |
| `worker/` | Ruby | Sends a receipt email |
| `scripts/` | Python, shell | A sales report and a deploy script |
| `web/` | Vue, JavaScript, CSS | A cart badge in the page header |
| `Makefile` | Make | Build and report commands |

None of it is meant to run as a real shop. The code exists only to be mapped.

The brand colour in `web/src/styles.css` (`--brand-primary`) is what Code Atlas picks up as the default colours.
