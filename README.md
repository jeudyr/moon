# MVC + PostgreSQL (Sequelize) + React (Vite) Starter

## Requisitos
- Node 18+
- PostgreSQL 14+ (o Docker)

## Setup rápido
```bash
# 1) Instala dependencias raíz y de cada paquete
cd server && npm install && cd ..
cd client && npm install && cd ..
npm install

# 2) Configura variables en server/.env (o usa server/.env.example)
# 3) Crea DB y migra
npm --prefix server run db:migrate

# 4) Dev (cliente + servidor)
npm run dev
```

## Producción (simple)
- Genera build del cliente: `npm --prefix client run build`
- Sirve client estático desde Express (ver comentario en server/src/app.js) o despliega por separado.
