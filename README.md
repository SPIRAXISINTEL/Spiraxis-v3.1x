# Secure Deployment Hub — SPIRAXIS Financial Dashboard

React + TypeScript financial risk dashboard with crash detection, orbital spiral placement model, and MASI historical data analysis.

## Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Express.js (Node 20)
- **Build**: Vite 7, esbuild

## Features
- Binomial crash probability model (SPIRAXIS)
- 4-placement orbital spiral (Épargne, OPCVM, MASI, Crypto)
- Best days deposit/withdrawal analysis
- Historical MASI data (2017–2022)

## Development
\`\`\`bash
npm install
npm run dev        # starts on port 5000
\`\`\`

## Build
\`\`\`bash
npm run build      # outputs to dist/public/
\`\`\`

## Deploy to Bunny.net (Static CDN)
Upload contents of \`dist/public/\` to your Bunny Storage Zone.
Configure Pull Zone with origin pointing to your storage zone.
Enable "Single Page Application" routing in Pull Zone settings.

## Deploy Backend (optional)
The Express server in \`dist/index.cjs\` can run on Railway, Render, or Fly.io.
Currently only serves static files in production — no database required.
