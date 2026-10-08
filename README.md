# Vlootschouw prototype (React + HeroUI Pro)

Klikbaar prototype van de Welder vlootschouw als 3×3 grid met benchmark per vak, los van de platform-codebase. Demo-data, geen backend.

## Starten

```bash
npm install
npx heroui-pro@latest login     # eenmalig, GitHub-login (Pro is een betaald pakket)
npx heroui-pro@latest install   # eenmalig, haalt @heroui-pro/react + peers op
npm run dev
```

Deep links voor demo en screenshots: `?role=manager`, `?view=table`, `?open=ster` (of een andere vaknaam / `low`).

## Wat er in zit

| Scherm | Waar | Componenten |
| --- | --- | --- |
| Admin (HR) grid | `VlootschouwPage` role=admin | `GridTile` (TrendChip, Tooltip, AvatarGroup + HoverCard), `BenchmarkCard` (Switch), `Filters` (DateRangePicker, Select) |
| Admin (HR) tabel | Segment "Tabel" | `VlootschouwTable` (DataGrid, Pagination, Chip) |
| Vak-detail | klik op vak of rij | `MemberSheet` (Sheet rechts, SearchField, ListView) |
| Leidinggevende | role=manager | zelfde pagina, eigen team, geen filters, kaart "Hoe goed doet mijn team het?" |

## Domeinregels (uit de Welder-backend)

- Vak = prestatieband × potentieel. Banden zijn derden van de mc-schaal 5–10 (laag ≤ 6,67, middel ≤ 8,33, hoog), potentieel 2/3/4 zijn de rijen.
- Potentieel 1 valt buiten het grid ("Plaatsing heroverwegen") en telt niet mee in de benchmark-totalen.
- Negen vaknamen: starter, talent, ster / instabiele presteerder, professional, topper / onderpresteerder, generieke medewerker, specialist.
- Benchmark = percentage per vak over alle Welder-klanten (`buckets_performance_potential`), maandelijks ververst.

Bron: FigJam-briefing en het Figma-design "Vlootschouw 9-grid (HeroUI Pro)".

## Screenshots met device-emulatie

```bash
npx vite build --base ./ --outDir dist-shot
python3 -m http.server 4173 --directory dist-shot &
node scripts/shot.mjs "http://127.0.0.1:4173/index.html?role=admin&bm=1" out.png 390 844 1
```

Extra deep link: `?bm=1` opent de benchmark-sheet (alleen onder 1024px).
