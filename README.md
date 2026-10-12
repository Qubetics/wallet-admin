# Qubetics Admin

Admin dashboard for the Qubetics wallet platform. Built with React 18 (Create React App / `react-scripts` 5.0.1), Redux Toolkit, Ant Design, and Solana / EVM wallet libraries for token management.

## Prerequisites

- Node.js 18 (the provided `Dockerfile` uses `node:18.20.8`; the project also builds on Node 22)
- npm

## Installation

```bash
npm install --force
```

`--force` is required because some dependencies have conflicting peer ranges. The `postinstall` step runs `patch-package` and applies `patches/react-scripts+5.0.1.patch`, so keep the `patches/` folder in place.

## Environment variables

Copy the template and fill in the values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `REACT_APP_API_URL` | Base URL of the Qubetics backend API |
| `REACT_APP_PUBLIC_BASE_URL` | Public base URL of the application |
| `REACT_APP_IP_TRACK_URL` | Endpoint used to look up the visitor's IP |
| `REACT_APP_DATA_ENCRYPTION_KEY` | Key used to encrypt and decrypt data stored in the browser |
| `REACT_APP_DOMAIN_KEY` | Router base path. Leave empty to serve from `/`, or use e.g. `/admin` |
| `REACT_APP_RPC_URL` | Solana RPC endpoint |
| `REACT_APP_TATUM_URL` | Tatum Solana node URL, including its API key |
| `REACT_APP_PROGRAM_ID` | Solana program address |
| `REACT_APP_REFERRAL_ACC_ID` | Solana referral account address |
| `REACT_APP_JUPITER_ID` | Jupiter program ID |

All `REACT_APP_*` values are embedded in the browser bundle at build time, so anyone who opens the app can read them. Never commit real values; `.env*` files are git-ignored except `.env.example`.

## Running

The npm scripts load their variables from named env files through `env-cmd`, so create the file that matches the script you run:

| Command | Reads |
|---|---|
| `npm run start:dev` | `.env.development` |
| `npm run start:stage` | `.env.stage` |
| `npm start` | `.env.production` |

For example, for local development: `cp .env.example .env.development`, fill it in, then `npm run start:dev`. The app opens at http://localhost:3000.

## Build

```bash
npm run build          # reads .env.production, output in build/
npm run build:local    # reads .env.development
```

Source maps are disabled in builds. Serve the `build/` folder with any static file server.

## Docker

```bash
docker build -t qubetics-admin .
docker run -p 80:80 qubetics-admin
```

Provide `.env.production` in the project root before building, since the image runs `npm run build`.
