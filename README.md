# Kunskapskontroll 1 — Filmsök (OMDB API)

En webbapp för att söka efter filmer, serier och avsnitt via [OMDB API](https://www.omdbapi.com). Stöder filtrering på typ och årtal. Två sidor: söklista och filmdetaljer.

## Live-demo

**Vercel:** [Lägg till länk här efter deploy]

## Teknikstack

- **Vanilla JavaScript** med ES-moduler
- **Vite** som bundler och dev-server
- **Vitest + jsdom** för unit- och integrationstester
- **Playwright** för E2E-tester
- **ESLint** för kodkvalitet
- **GitHub Actions** för CI/CD
- **Vercel** för deployment

## Projektstruktur (MVC)

```
src/
  api-service.js     — API-anrop mot OMDB
  search-model.js    — Sökdata, filter, årtalfiltrering
  search-view.js     — Rendera sökresultat i DOM
  detail-model.js    — Filmdetaljer (model)
  detail-view.js     — Rendera filmdetaljer i DOM
  main-search.js     — Controller för söksidan
  main-detail.js     — Controller för detaljsidan
```

## Tester

| Nivå         | Fil                                  | Antal |
|--------------|--------------------------------------|-------|
| Unit         | tests/unit/search-model.test.js      | 10    |
| Unit         | tests/unit/detail-model.test.js      | 3     |
| Integration  | tests/integration/search.test.js     | 7     |
| Integration  | tests/integration/detail.test.js     | 3     |
| E2E          | tests/e2e/search.spec.js             | 8     |
| **Totalt**   |                                      | **31**|

### Köra tester

```bash
npm test           # Unit + integration (Vitest)
npm run test:e2e   # E2E (Playwright)
npm run lint       # ESLint
```

## CI/CD-flöde

1. **Push** till GitHub
2. **GitHub Actions** kör automatiskt: lint → unit/integrationstester → build → E2E-tester
3. **Vercel** deployar automatiskt vid push till main

## AI-dokumentation (LR3)

### Vilka AI-verktyg användes?

- **Claude Code** (Anthropic CLI) — användes som huvudsakligt AI-verktyg genom hela utvecklingsprocessen.

### Var i processen användes AI?

1. **Projektstruktur** — AI scaffoldade MVC-strukturen med separata filer för söksidan och detaljsidan baserat på kursens mönster.
2. **Testskrivning** — AI genererade alla tre testnivåer. Identifierade edge cases som:
   - Tomt sökresultat (API returnerar `Response: "False"`)
   - Nätverksfel (non-ok HTTP-svar)
   - Filtrering med ogiltigt årtal (t.ex. "2015–2020" istället för "2015")
   - Film-ID saknas i URL på detaljsidan
3. **CI/CD** — AI skapade GitHub Actions workflow med steg för lint, test, build och E2E.
4. **Felhantering** — AI föreslog `res.ok`-kontroller i API-service som inte fanns i startkoden.

### Vad föreslog AI?

- AI föreslog att dela upp söksidans model i fler granulära getters/setters (t.ex. `setYearFrom`/`setYearTo`) för att göra varje funktion enkel att testa isolerat.
- AI föreslog en `filterByYearRange`-funktion i modellen som filtrerar klientsidigt, eftersom OMDB API bara stöder sökning på ett enskilt år.
- AI föreslog att visa "Inga resultat hittades" som placeholder istället för tom yta vid noll träffar.

### Vad justerades manuellt och varför?

- **API-nyckel** — Verifierade att API-nyckeln fungerar och att URL-strukturen matchar OMDB:s dokumentation. AI genererade korrekt URL-format men nyckeln behövde kontrolleras.
- **Årtalsfiltrering** — OMDB stöder bara `&y=YEAR` (ett enskilt år), men vi ville ha ett intervall. Justerade så att filtreringen sker klientsidigt efter att resultaten hämtats.
- **Testdata** — Anpassade mock-data i testerna så att den matchar OMDB:s faktiska responsformat (med `Response`, `Search`, `totalResults` som strängar).
- **Playwright-selektorer** — Justerade selektorer och timeouts baserat på att E2E-testerna körs mot riktigt OMDB API med riktiga nätverksanrop.

### Reflektion

AI var effektiv för att snabbt skapa en testbar struktur, men krävde granskning på varje nivå. Framförallt behövde testerna anpassas till OMDB:s specifika API-format (t.ex. att `Response` är en sträng "True"/"False", inte en boolean). AI:s förslag om klientsidigt årtalsfilter var bra — det löste problemet att OMDB bara stöder enskilt år — men implementationen behövde testas mot edge cases som filmer med årtalsintervall ("2015–2020") i `Year`-fältet.
