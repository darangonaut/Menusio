/**
 * Menusio Paragraph Filler — DEMO ONLY
 * ⚠️  Pomocný skript POUZE pro demo stránku. NEPOUŽÍVEJTE v produkci:
 *     přepisuje obsah všech prázdných <p> lorem ipsum textem.
 *
 * Auto-spustí se jen tehdy, když je na <body> atribut data-menusio-demo.
 * Jinak nedělá nic; ručně lze zavolat window.menusioP.fillParagraphs().
 */
(() => {
    const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        Proin in tellus sit amet nibh dignissim sagittis. Itaque earum rerum hic
        tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias
        consequatur aut perferendis doloribus asperiores repellat. Proin pede metus,
        vulputate nec, fermentum fringilla, vehicula vitae, justo. In enim a arcu
        imperdiet malesuada. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Aenean vel massa quis
        mauris vehicula lacinia. Mauris dictum facilisis augue. Etiam ligula pede,
        sagittis quis, interdum ultricies, scelerisque eu. Proin mattis lacinia justo.
        Donec quis nibh at felis congue commodo. Etiam quis quam. Fusce aliquam
        vestibulum ipsum. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos hymenaeos. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`.replace(/\s+/g, ' ');

    /**
     * Naplní prázdné paragrafy demo textem
     * @param {string} selector - CSS selektor pro výběr paragrafů
     * @param {string} text - Text k vložení (výchozí lorem ipsum)
     */
    const fillParagraphs = (selector = 'p', text = LOREM_TEXT) => {
        const paragraphs = document.querySelectorAll(selector);

        if (paragraphs.length === 0) {
            console.warn('Menusio-P: Nebyly nalezeny žádné paragrafy');
            return;
        }

        let filled = 0;
        paragraphs.forEach(p => {
            // Naplnit pouze prázdné paragrafy
            if (!p.textContent.trim()) {
                p.textContent = text;
                filled++;
            }
        });

        console.info(`Menusio-P: Naplněno ${filled} prázdných paragrafů`);
    };

    // Auto-spuštění POUZE na opt-in demo stránce (<body data-menusio-demo>)
    const autoRun = () => {
        if (document.body && document.body.hasAttribute('data-menusio-demo')) {
            fillParagraphs();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoRun);
    } else {
        autoRun();
    }

    // Export pro použití z konzole nebo jiných skriptů
    window.menusioP = { fillParagraphs };
})();
