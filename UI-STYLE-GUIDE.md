# UI Style Guide — Course Landing Page

## Tailwind Color Palette Convention

- **Text colors**: use `stone-` series (e.g. `text-stone-900`, `text-stone-700`)
- **Background colors**: use `neutral-` series (e.g. `bg-neutral-200`, `bg-neutral-50`)
- **Border colors**: use `neutral-` series (e.g. `border-neutral-200`)
- **Accent / brand colors**: use `yellow-` series (e.g. `yellow-500`, `yellow-600`)
- **Do NOT use** `gray-` for any new UI work

---

## Color System

### Background Colors
| Usage | Class | Hex |
|-------|-------|-----|
| Primary (default page bg) | `bg-white` | #FFFFFF |
| Secondary (alternating sections) | `bg-neutral-50` | #FAFAFA |
| Accent sections (Hero, Free Content, FAQ cards) | `bg-neutral-200` | #E5E5E5 |
| Footer | `bg-neutral-900` | #171717 |

### Text Colors
| Usage | Class | Hex |
|-------|-------|-----|
| Section titles | `text-stone-900` | #1C1917 |
| Hero title | `text-stone-800` | #292524 |
| Body text | `text-stone-600` | #57534E |
| Hero body / FAQ text | `text-stone-700` | #44403C |
| Subtitles / secondary text | `text-stone-500` | #78716C |
| Footer body text | `text-stone-400` | #A8A29E |
| Footer small text | `text-stone-500` | #78716C |
| Highlight / accent text | `text-yellow-500` | #EAB308 |
| Check marks | `text-green-600` | #16A34A |

### Accent / Brand Colors
| Usage | Class | Hex |
|-------|-------|-----|
| Primary accent (buttons, icons, highlights) | `yellow-500` | #EAB308 |
| Hover state | `yellow-600` | #CA8A04 |
| Icon background (Why Our Courses) | `bg-yellow-50` | #FEFCE8 |
| Star ratings | `text-yellow-400` | #FACC15 |
| Carousel active dot | `bg-yellow-500` | #EAB308 |
| Carousel inactive dot | `bg-neutral-300` | #D4D4D4 |

### Border Colors
| Usage | Class | Hex |
|-------|-------|-----|
| Cards / dividers | `border-neutral-200` | #E5E5E5 |
| Footer divider | `border-neutral-800` | #262626 |

---

## Typography

### Font Family
`ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`

### Font Sizes & Weights
| Element | Size | Weight |
|---------|------|--------|
| H1 (Hero) | `text-4xl md:text-6xl` | `font-bold` |
| H2 (Section titles) | `text-3xl md:text-4xl` | `font-bold` |
| H3 (Card titles) | `text-xl` | `font-semibold` |
| Body text | `text-base` (default) | normal (400) |
| Description / large body | `text-lg` | normal |
| Small text | `text-sm` | normal |
| Extra small (labels) | `text-xs` | normal |
| Buttons | `text-base` or `text-sm` | `font-semibold` |
| Navbar links | `text-base` | `font-medium` |
| Footer headings | `text-lg` | `font-bold` |

---

## Buttons

### Primary Button (CTA)
```
bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold
hover:bg-yellow-600 transition-colors
```

### Secondary Button (Outline — Hero)
```
border-2 border-stone-700 text-stone-700 px-8 py-3 rounded-lg font-semibold
hover:bg-stone-700 hover:text-white transition-colors
```

### Small Button (Social CTAs)
```
bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-semibold
hover:bg-yellow-600 transition-colors
```

### Navbar CTA
```
bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold
hover:bg-yellow-600 transition-colors
```

---

## Cards

### Course Card
```
bg-white rounded-lg shadow-md border border-neutral-200
hover:shadow-lg hover:-translate-y-1 transition-all duration-300
```

### Feature Card (Why Our Courses)
```
bg-neutral-50 rounded-lg border border-neutral-200 p-6
hover:shadow-md transition-all duration-300
```

### FAQ Accordion Item
```
border border-neutral-200 rounded-lg overflow-hidden
Button: bg-neutral-200 hover:bg-neutral-400
Text: text-stone-700
```

---

## Section Layout

### Container
- Max width: `max-w-7xl` (Navbar), `max-w-6xl` (content), `max-w-3xl` (FAQ, Testimonials)
- Padding: `px-4 sm:px-6 lg:px-8`

### Section Padding
- Standard: `py-20`
- Compact: `py-16`

### Section Background Pattern
| Section | Background |
|---------|-----------|
| Navbar | `bg-white` |
| Hero | `bg-neutral-200` |
| About | `bg-white` |
| Stats | `bg-neutral-50` |
| Online Courses | `bg-neutral-50` |
| Testimonials | `bg-white` |
| Student Videos | `bg-neutral-50` |
| Why Our Courses | `bg-white` |
| Free Content | `bg-neutral-200` |
| FAQ | `bg-white` (cards `bg-neutral-200`) |
| Footer | `bg-neutral-900` |

---

## Shadows
| Usage | Class |
|-------|-------|
| Cards (default) | `shadow-md` |
| Cards (hover) | `shadow-lg` |
| Video / hero badge | `shadow-lg` |

## Border Radius
| Usage | Class |
|-------|-------|
| Cards / buttons / videos | `rounded-lg` (8px) |
| Small buttons | `rounded-md` (6px) |
| Avatars / logos | `rounded-full` |

## Transitions
- Color transitions: `transition-colors`
- Card hover: `transition-all duration-300`
- Carousel slide: `transition-transform duration-500 ease-in-out`
- FAQ accordion: `transition-all duration-300`

---

## Icons
- Library: Font Awesome 6.5 (`@fortawesome/fontawesome-free`)
- Icon color on white bg: `text-yellow-500`
- Icon color in footer: inherits white
- Stats icon: `text-yellow-500`
- Check icons: `text-green-600`

## Video Placeholders
- Hero: `aspect-video` (16:9)
- Vertical videos: `aspect-[9/16] max-h-[400px] object-cover`
- Placeholder color scheme: `#404040` bg / `#A3A3A3` text (neutral-700/neutral-400)
