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

### For VS Code

- Install [Prisma extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- `F1` -> `Tasks: Run Build Task` to run `tsc --watch` in the background and show all errors in the VS Code `Problems` panel

### Formatting

- Always format `schema.prisma` with `npx prisma format`