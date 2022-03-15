## Development Guide

- Install dependencies:

```
npm install
npm install --target_arch=x64 # For Apple M1 machines
```

- Create `.env` with secrets for Database connections
- Run dev mode:

```
npm run dev
npx prisma generate # if you encounter errors with Prisma client
```