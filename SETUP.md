# HusApp - Kløvervej 23 Setup

## Hvad er gjort
- Full-stack app med React (Vite PWA) + Express + PostgreSQL
- 55 vedligeholdelsesopgaver som seed-data
- PIN-baseret login (standard PIN: `2023`)
- Mobil-first design, installérbar som app

## Hvad du selv skal gøre (5 trin)

### 1. Tilføj PostgreSQL på Railway
- Gå til dit Railway-projekt
- Klik **"+ New"** → **"Database"** → **"PostgreSQL"**
- Railway sætter automatisk `DATABASE_URL` som environment variable

### 2. Sæt miljøvariable
I Railway-projektets **Variables**-sektion:
```
NODE_ENV=production
APP_PIN=<vælg din egen PIN>
```

### 3. Deploy
Push til GitHub — Railway deployer automatisk:
```bash
git push origin main
```
Første deploy kører automatisk `db:init` som opretter tabeller og indsætter 55 opgaver.

### 4. Sæt custom domæne op på Railway
- Gå til dit service → **Settings** → **Networking** → **Custom Domain**
- Tilføj `hus.stpl.dk`
- Railway giver dig et CNAME-target (f.eks. `xxx.up.railway.app`)

### 5. DNS hos Simply.com
Log ind på Simply.com og tilføj dette DNS-record:

| Type  | Navn | Værdi                      | TTL  |
|-------|------|----------------------------|------|
| CNAME | hus  | `<railway-domæne>.up.railway.app` | 3600 |

Vent op til 30 minutter på DNS-propagation.

## Færdig!
Åbn `hus.stpl.dk` på din telefon og tilføj til hjemmeskærm for app-oplevelsen.

## Lokal udvikling
```bash
# Start database (kræver lokal PostgreSQL eller Docker)
export DATABASE_URL=postgres://localhost:5432/husapp

# Init database
npm run db:init

# Start server + client
npm run dev:server   # terminal 1
npm run dev:client   # terminal 2
```
