# Board Games Shop — Angular 21

Full-stack frontend for the Board Games Shop API (ASP.NET Core).

## Quick start

```bash
npm install
ng serve
# → http://localhost:4200
```

## Set your API URL

`src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'   // ← your port
};
```

## CORS — add to ASP.NET Core

```csharp
builder.Services.AddCors(o => o.AddPolicy("Angular", p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyHeader().AllowAnyMethod()));

app.UseCors("Angular");
```

## Project structure

```
src/app/
├── core/
│   ├── models/          index.ts          — all interfaces
│   ├── services/        auth / cart / games / reviews / toast
│   ├── interceptors/    jwt.interceptor.ts
│   └── guards/          auth.guard.ts (authGuard, adminGuard)
├── features/
│   ├── auth/            login/ register/
│   ├── games/           game-list/ game-detail/
│   ├── cart/
│   ├── admin/
│   └── layout/          navbar/ footer/
└── shared/
    └── components/      toast-container/
```

## Angular 21 conventions used

| Topic              | Convention                            |
|--------------------|---------------------------------------|
| File naming        | `app.ts`, `navbar.ts` (no `.component`) |
| Templates          | Separate `.html` files                |
| Styles             | Separate `.scss` files                |
| Builder            | `@angular/build:application`          |
| Test runner        | vitest                                |
| tsconfig module    | `"preserve"`                          |
| Error listener     | `provideBrowserGlobalErrorListeners()`|
| No zone.js         | Not in dependencies                   |

## Responsive breakpoints

| Breakpoint | Width      | Layout change                         |
|------------|------------|---------------------------------------|
| xl         | ≥ 1280px  | 4-col game grid, admin side-by-side   |
| lg         | 1024–1279  | 3-col grid, admin collapses           |
| md         | 768–1023   | 2-col grid, detail stacks             |
| sm         | 480–767    | 2-col grid, navbar hamburger          |
| xs         | < 480px    | 1-col grid, all stacked               |
