# Ahmad portfolio

React (Vite + TypeScript) client and Node (Express) server in one npm workspace.

- `npm install` once at the root.
- `npm run dev` runs the API on :4000 and the client on :5180 (Vite proxies `/api`).
- `npm run build && npm start` serves the built client from the Node server.

Services come from `server/data/services.json` (the same five groups as the Thirdcore site).
The UI in `client/src/App.tsx` is a placeholder until the real design is done.
