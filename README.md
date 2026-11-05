# Cogniverse

A local HCI research prototype that turns an LLM conversation into a persistent, interactive knowledge graph. Built with React 18, TypeScript (strict), Vite, Tailwind CSS, React Flow v12, Lucide, and the official OpenAI SDK.

## Run locally

1. Install Node.js 20.19+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and set `VITE_OPENAI_API_KEY`.
3. Run `npm run dev` and open the printed local address.

**Never deploy this publicly with a real key.** Vite exposes the API key to the browser. This architecture is only suitable for a local prototype. No key is included in the repository. A missing key produces a persistent banner and disables sending.

`npm run build` checks TypeScript and creates a production build. `npm test` exercises parsing, sanitization, merge stability, duplicate removal, and layout.

## Explore

Ask an HCI question or choose a suggested prompt. Replies introduce concepts and labeled relationships. Click a concept card or a chip below a reply to focus the graph and inspect its summary, source quote, and connected concepts. Navigate to a neighbor or return to the originating chat message. Drag cards, pan, zoom, use the minimap, or export the graph as JSON. Reset confirms before clearing the session and cancels any pending request.

Conversation and graph data remain in memory and disappear on refresh. The last 20 user/assistant messages and existing concept IDs/labels are sent to `gpt-4o-mini`. Error bubbles are excluded. Requests use JSON mode, a 45-second timeout, and no automatic SDK retries; Retry resends the failed context without duplicating the user message.

## Design and limitations

Validation strips optional JSON fences, rejects missing chat text, normalizes IDs, sanitizes categories and relationships, and drops invalid/dangling/duplicate graph elements. Graph merges preserve original concept details and dragged positions. New concepts use a deterministic three-column grid below the existing bounds. A short highlight identifies newly added concepts; reduced-motion preferences disable animations.

If a model reuses an existing ID for a different meaning, the original concept is retained. IDs normalize to ASCII slugs; labels that produce empty IDs are dropped. Model-provided quotes are prompted to be verbatim, but are displayed as returned after length sanitization. No authentication, server, database, streaming, or automatic semantic deduplication is included.
