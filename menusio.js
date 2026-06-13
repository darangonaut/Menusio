/**
 * Menusio - Knihovna pro automatické generování obsahu stránky
 * @version 2.0.0
 */
const menusio = (() => {
    /**
     * Vytvoří ID z textu (slug)
     * @param {string} text - Text k převodu
     * @returns {string} - Slug vhodný pro ID elementu
     */
    const createSlug = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "-")
            .toLowerCase()
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    /**
     * Validuje konfiguraci
     * @param {Object} config - Konfigurace pro sestavení menu
     * @throws {Error} - Pokud konfigurace není validní
     */
    const validateConfig = (config) => {
        if (!config.article) {
            throw new Error('Menusio: Parametr "article" je povinný');
        }
        if (!config.selectors) {
            throw new Error('Menusio: Parametr "selectors" je povinný');
        }

        // Kontrola zastaralého parametru
        if (config.selectorBeforMenu) {
            console.warn('Menusio: Parametr "selectorBeforMenu" je zastaralý. Použijte "selectorBeforeMenu"');
        }
    };

    /**
     * Najde elementy pro menu podle selektorů
     * @param {Element} container - Kontejnerový element
     * @param {string} selectors - CSS selektory
     * @param {Array<string>} excludeClasses - Třídy k vyloučení
     * @returns {Array<Element>} - Pole elementů v pořadí dokumentu
     */
    const findMenuItems = (container, selectors, excludeClasses = []) => {
        const elements = container.querySelectorAll(selectors);

        return Array.from(elements).filter(el =>
            !excludeClasses.some(className => el.classList.contains(className))
        );
    };

    /**
     * Zjistí úroveň nadpisu z názvu tagu (h2 -> 2). Pro ne-nadpisy vrací null.
     * @param {Element} el
     * @returns {number|null}
     */
    const headingLevel = (el) => {
        const match = el.tagName.match(/^H([1-6])$/);
        return match ? Number(match[1]) : null;
    };

    /**
     * Zajistí unikátní ID elementu (řeší kolize i prázdné slugy).
     * @param {Element} element
     * @param {boolean} useExistingId
     * @param {Set<string>} usedIds - Již použitá ID v rámci tohoto menu
     * @param {number} index - Pořadí položky (fallback pro prázdný slug)
     * @returns {string} - Přiřazené unikátní ID
     */
    const ensureUniqueId = (element, useExistingId, usedIds, index) => {
        const base = (useExistingId && element.id)
            ? element.id
            : createSlug(element.textContent) || `menusio-${index + 1}`;

        let unique = base;
        let counter = 2;
        // Vyhneme se kolizi jak v rámci menu, tak s existujícím ID na stránce
        while (usedIds.has(unique) || (unique !== element.id && document.getElementById(unique))) {
            unique = `${base}-${counter++}`;
        }

        usedIds.add(unique);
        element.id = unique;
        return unique;
    };

    /**
     * Vytvoří položku menu (<li> s odkazem)
     * @param {Element} element - Element nadpisu
     * @param {boolean} useExistingId - Použít existující ID
     * @param {boolean} makeSelectorLink - Převést nadpis na odkaz
     * @param {Set<string>} usedIds
     * @param {number} index
     * @returns {Element} - Li element s odkazem
     */
    const createMenuItem = (element, useExistingId, makeSelectorLink, usedIds, index) => {
        const li = document.createElement("li");
        const link = document.createElement("a");

        const id = ensureUniqueId(element, useExistingId, usedIds, index);
        link.href = `#${id}`;
        link.textContent = element.textContent;

        if (makeSelectorLink) {
            // Nadpis se stane odkazem na sebe sama; do menu jde kopie
            element.innerHTML = "";
            element.appendChild(link);
            li.appendChild(link.cloneNode(true));
        } else {
            li.appendChild(link);
        }

        return li;
    };

    /**
     * Sestaví seznam menu. Pokud jsou všechny položky nadpisy a mají různé
     * úrovně, vytvoří vnořený (hierarchický) seznam; jinak plochý.
     * @param {Array<Element>} items
     * @param {boolean} ordered
     * @param {boolean} useExistingId
     * @param {boolean} makeSelectorLink
     * @returns {Element} - Kořenový <ul>/<ol>
     */
    const buildList = (items, ordered, useExistingId, makeSelectorLink) => {
        const listTag = ordered ? "ol" : "ul";
        const usedIds = new Set();
        const levels = items.map(headingLevel);
        const useNesting = levels.every(l => l !== null) && new Set(levels).size > 1;

        const root = document.createElement(listTag);

        if (!useNesting) {
            items.forEach((el, i) => {
                root.appendChild(createMenuItem(el, useExistingId, makeSelectorLink, usedIds, i));
            });
            return root;
        }

        // Hierarchické vnořování podle úrovně nadpisu
        const baseLevel = Math.min(...levels);
        const stack = [{ level: baseLevel, list: root }];

        items.forEach((el, i) => {
            const level = levels[i];
            const li = createMenuItem(el, useExistingId, makeSelectorLink, usedIds, i);

            // Vynoříme se na mělčí úrovně
            while (stack.length > 1 && level < stack[stack.length - 1].level) {
                stack.pop();
            }

            let top = stack[stack.length - 1];

            // Zanoříme se hlouběji – nový podseznam do poslední položky
            if (level > top.level) {
                const sub = document.createElement(listTag);
                const parentLi = top.list.lastElementChild;
                (parentLi || top.list).appendChild(sub);
                stack.push({ level, list: sub });
                top = stack[stack.length - 1];
            }

            top.list.appendChild(li);
        });

        return root;
    };

    /**
     * Vytvoří a vloží menu do stránky
     * @param {Object} config - Konfigurace menu
     * @returns {Element|undefined} - Vytvořený <nav> nebo undefined
     */
    const build = (config) => {
        try {
            validateConfig(config);

            const {
                article,
                selectors,
                ordered = false,
                existingIds = false,
                selectorLink = true,
                classesNotInMenu = [],
                minItems = 0,
                selectorBeforeMenu,
                selectorBeforMenu // zastaralý parametr
            } = config;

            const container = document.querySelector(article);
            if (!container) {
                console.warn(`Menusio: Element "${article}" nebyl nalezen`);
                return;
            }

            const items = findMenuItems(container, selectors, classesNotInMenu);

            if (items.length < minItems) {
                console.info(`Menusio: Nalezeno pouze ${items.length} položek, minimum je ${minItems}`);
                return;
            }

            const insertBeforeSelector = selectorBeforeMenu || selectorBeforMenu;
            const anchorElement = insertBeforeSelector
                ? document.querySelector(insertBeforeSelector)
                : container.querySelector("h1");

            if (!anchorElement) {
                console.warn("Menusio: Element pro vložení menu nebyl nalezen");
                return;
            }

            const list = buildList(items, ordered, existingIds, selectorLink);

            // Sémantický wrapper <nav> kvůli přístupnosti
            const nav = document.createElement("nav");
            nav.id = "js-menusio";
            nav.setAttribute("aria-label", "Obsah stránky");
            nav.appendChild(list);

            anchorElement.parentNode.insertBefore(nav, anchorElement.nextSibling);

            console.info(`Menusio: Menu úspěšně vytvořeno s ${items.length} položkami`);
            return nav;

        } catch (error) {
            console.error("Menusio:", error.message);
        }
    };

    /**
     * Odstraní vygenerované menu
     */
    const destroy = () => {
        const menu = document.getElementById("js-menusio");
        if (menu) {
            menu.remove();
            console.info("Menusio: Menu bylo odstraněno");
        }
    };

    // Veřejné API
    return {
        build,
        destroy
    };
})();
