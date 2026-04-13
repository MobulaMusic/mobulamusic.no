# Mobula Music — logopakke

Komplett pakke i SVG, PNG og JPG. Originale farger fra logoen er bevart.

## Innhold

```
logo-package/
├── mobula-original.svg     ← Bare ikonet (vektor, kvadratisk)
├── mobula-stacked.svg      ← Ikon + "MOBULA MUSIC" under (vektor)
├── mobula-horisontal.svg   ← Ikon + "MOBULA MUSIC" til høyre (vektor)
├── png/                    ← Transparent bakgrunn
│   ├── mobula-icon-256.png
│   ├── mobula-icon-512.png
│   ├── mobula-icon-1024.png
│   ├── mobula-icon-2048.png
│   ├── mobula-stacked-256.png
│   ├── mobula-stacked-512.png
│   ├── mobula-stacked-1024.png
│   └── mobula-stacked-2048.png
└── jpg/                    ← Hvit bakgrunn
    ├── mobula-icon-256.jpg ... mobula-icon-2048.jpg
    └── mobula-stacked-256.jpg ... mobula-stacked-2048.jpg
```

## Hvilken fil til hva

| Bruk | Anbefalt fil |
|---|---|
| Web (nettside, html-mail-sig) | `mobula-horisontal.svg` eller `png/mobula-horisontal-800.png` |
| **E-post-signatur (Gmail/Outlook)** | `png/mobula-horisontal-800.png` — bredt format passer best |
| Brevhode topp | `png/mobula-stacked-1024.png` eller `mobula-stacked.svg` |
| Word / Pages / PowerPoint | `png/mobula-stacked-1024.png` |
| Brevhode (utskrift) | `mobula-stacked.svg` (best skarphet) |
| Sosiale medier-profil | `png/mobula-icon-1024.png` |
| Sosiale medier-banner | `png/mobula-stacked-2048.png` |
| Favicon | `png/mobula-icon-256.png` |
| Trykk høyoppløsning | `mobula-original.svg` (skalerer fritt) |

## Originale farger

| Hex | Bruk i logoen |
|---|---|
| `#33414e` | Mørk navy — vingespiss, tekst |
| `#80afca` | Mid-blå — hovedform |
| `#c6dbe8` | Lys blå — vannlinjen |

## Tips

- **PNG = transparent bakgrunn**, JPG = hvit bakgrunn. Velg PNG om du vil legge logoen på farget bakgrunn.
- **SVG er alltid best for skarphet** — PNG/JPG er for kontekster der SVG ikke støttes.
- **Trenger større oppløsning?** Åpne SVG i Preview → Fil → Eksporter → PNG, sett ønsket oppløsning.
- **Trenger en annen farge?** Si ifra, så genererer vi en ny variant.
