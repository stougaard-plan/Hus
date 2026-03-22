# HusApp — claude.md

## Projekt
Husholdings- og vedligeholdelsesapp for Kløvervej 23, Roskilde.
Familie: Lasse + Julie + Sonja (6) + Lola (3).

## Stack
- Frontend: React + Vite PWA — /client/
- Backend: Node.js + Express — /server/index.js
- Database: PostgreSQL — Railway (DATABASE_URL sættes automatisk)
- Deploy: Railway koblet til GitHub repo "hus", branch main
- Domæne: hus.stpl.dk (CNAME → Railway)

## Auth
Simpel fælles PIN — APP_PIN env var på Railway.
Ingen brugeradministration — Lasse og Julie deler adgang.

## Database
Schema: /db/schema.sql
Seed (55 opgaver): /db/seed.sql
Auto-init ved deploy: /server/db-init.js

## Miljøvariable (Railway)
DATABASE_URL — auto fra Railway PostgreSQL
APP_PIN — fælles familiepin
NODE_ENV=production

## Opgavebibliotek
55 opgaver i 5 kategorier: hus, have, hvidevarer, rengoring, bil.
Hvidevarer: Bora X Pure PUXRA (aftræk, ikke recirkulation),
Asko OP8687A ovn, Asko DFI756MUXXL opvaskemaskine,
Asko R31831I køleskab, Bosch WGG2540ESN vaskemaskine,
Hisense FV358N4EWE fryser, gammel tørretumbler.
Bil: Tesla Model Y. Campingvogn.

## Næste features (backlog)
- Push-notifikationer (PWA)
- Julie kan logge hvem der udførte opgaven
- Tilføj egne opgaver via UI
- Årshjul-visning
