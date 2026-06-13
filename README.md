# Menusio

**v2.0.0** · Moderní JavaScriptová knihovna pro automatické generování obsahu (table of contents) z vybraných HTML elementů.

## 🚀 Hlavní funkce

- ✅ Podpora číslovaných i nečíslovaných seznamů
- ✅ **Hierarchické (vnořené) menu** podle úrovně nadpisů (h2 → h3 → …)
- ✅ Automatické generování ID z textu nadpisů (s ošetřením kolizí)
- ✅ Vyloučení vybraných elementů z menu pomocí CSS tříd
- ✅ Minimální počet položek pro zobrazení menu
- ✅ Přístupnost (`<nav>` wrapper + ARIA)
- ✅ Moderní ES6+ syntaxe
- ✅ Kompletní error handling
- ✅ Responzivní design
- ✅ Dark mode podpora

## 📦 Instalace

### Přímé vložení

```html
<script src="menusio.js"></script>
```

### CDN

```html
<!-- Doporučeno: připnout na verzi (stabilní) -->
<script src="https://cdn.jsdelivr.net/gh/darangonaut/Menusio@v2.0.0/menusio.js"></script>

<!-- Nebo vždy nejnovější z master (nevhodné pro produkci) -->
<script src="https://cdn.jsdelivr.net/gh/darangonaut/Menusio@master/menusio.js"></script>
```

## 🔧 Základní použití

```html
<script>
    menusio.build({
        article: "main",              // Kontejner s obsahem
        selectors: "h2",              // Selektory pro nadpisy
        ordered: true,                // Číslovaný seznam
        selectorBeforeMenu: "h1",     // Kam vložit menu
    });
</script>
```

## ⚙️ Konfigurace

### Všechny parametry

```javascript
menusio.build({
    // Povinné parametry
    article: "main",                    // CSS selektor kontejneru
    selectors: "h2, h3",                // Selektory nadpisů pro menu
    
    // Volitelné parametry
    ordered: false,                     // true = <ol>, false = <ul>
    selectorBeforeMenu: "h1",           // Místo pro vložení menu
    existingIds: false,                 // Použít existující ID
    selectorLink: true,                 // Převést nadpis na odkaz
    classesNotInMenu: ["skip"],         // Třídy k vyloučení
    minItems: 2,                        // Min. počet položek pro zobrazení
});
```

### Popis parametrů

| Parametr | Typ | Výchozí | Popis |
|----------|-----|---------|-------|
| `article` | string | - | **Povinný.** CSS selektor hlavního kontejneru |
| `selectors` | string | - | **Povinný.** CSS selektory pro nadpisy (např. "h2, h3") |
| `ordered` | boolean | false | Typ seznamu (true = číslovaný, false = odrážkový) |
| `selectorBeforeMenu` | string | "h1" | Selektor elementu, za který se vloží menu |
| `existingIds` | boolean | false | Použít existující ID místo generování nových |
| `selectorLink` | boolean | true | Převést nadpisy na odkazy |
| `classesNotInMenu` | array | [] | Pole CSS tříd, které se mají vyloučit z menu |
| `minItems` | number | 0 | Minimální počet položek pro zobrazení menu |

## 📝 Příklady použití

### Základní menu z H2 nadpisů

```javascript
menusio.build({
    article: "#content",
    selectors: "h2"
});
```

### Hierarchické menu (H2 a H3)

Když selektory zachytí nadpisy více úrovní, menu se automaticky **vnoří** — každý `h3` se vloží jako podseznam pod předcházející `h2` (a tak dál pro hlubší úrovně). Funguje jen pro skutečné nadpisy `h1`–`h6`; pro jiné selektory zůstává seznam plochý.

```javascript
menusio.build({
    article: "article",
    selectors: "h2, h3",   // h3 se vnoří pod h2
    ordered: true
});
```

### S vyloučením některých nadpisů

```javascript
menusio.build({
    article: "main",
    selectors: "h2",
    classesNotInMenu: ["no-toc", "skip-menu"]
});
```

```html
<h2>Tento nadpis bude v menu</h2>
<h2 class="no-toc">Tento ne</h2>
```

### Zobrazit jen při více než 3 položkách

```javascript
menusio.build({
    article: "article",
    selectors: "h2",
    minItems: 4
});
```

### Zachování existujících ID

```javascript
menusio.build({
    article: "main",
    selectors: "h2",
    existingIds: true
});
```

## 🎨 Styling

Menu má ID `js-menusio`, které můžete stylovat:

```css
#js-menusio {
    background-color: #f8f9fa;
    border-left: 3px solid #007bff;
    padding: 1.5rem;
    border-radius: 4px;
}

#js-menusio a {
    color: #333;
    text-decoration: none;
}

#js-menusio a:hover {
    color: #007bff;
}
```

## 🔨 API

### `menusio.build(config)`

Vytvoří menu podle konfigurace.

**Parametry:**
- `config` (Object) - Objekt s konfigurací

**Vrací:**
- `undefined`

**Výjimky:**
- Vyhodí chybu při chybějících povinných parametrech

### `menusio.destroy()`

Odstraní vygenerované menu ze stránky.

```javascript
// Odstranění menu
menusio.destroy();
```

## 🐛 Debugging

Knihovna loguje informace do konzole:

- ✅ **Info** - úspěšné vytvoření menu
- ⚠️ **Warning** - element nebyl nalezen, nedostatek položek
- ❌ **Error** - nevalidní konfigurace

## 🧪 Demo

`index.html` obsahuje ukázku. Soubor `menusio-p.js` je **pouze pomocník pro demo** — naplní prázdné `<p>` lorem ipsum textem. Spustí se jen na stránce s atributem `<body data-menusio-demo>`, takže ho omylem nezahrnete do produkce. **Není součástí knihovny**, do svých stránek ho nelinkujte.

## 🌐 Kompatibilita prohlížečů

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Opera 74+

Vyžaduje podporu:
- ES6+ (arrow funkce, const/let, template literals)
- Array.from(), Array.forEach()
- querySelector(), querySelectorAll()

## 📄 Licence

MIT License

## 🤝 Přispívání

Pull requesty jsou vítány! Pro větší změny prosím nejdříve otevřete issue.

## 📞 Podpora

Pokud najdete bug nebo máte nápad na vylepšení, vytvořte prosím issue na GitHubu.