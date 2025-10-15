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
     * @returns {Array<Element>} - Pole elementů
     */
    const findMenuItems = (container, selectors, excludeClasses = []) => {
        const elements = container.querySelectorAll(selectors);
        
        return Array.from(elements).filter(el => 
            !excludeClasses.some(className => el.classList.contains(className))
        );
    };

    /**
     * Vytvoří položku menu
     * @param {Element} element - Element nadpisu
     * @param {boolean} useExistingId - Použít existující ID
     * @param {boolean} makeSelectorLink - Převést nadpis na odkaz
     * @returns {Element} - Li element s odkazem
     */
    const createMenuItem = (element, useExistingId, makeSelectorLink) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        
        // Nastavení ID elementu
        if (!element.id || !useExistingId) {
            element.id = createSlug(element.textContent);
        }
        
        // Nastavení odkazu
        link.href = `#${element.id}`;
        link.textContent = element.textContent;
        
        // Pokud má být nadpis odkaz
        if (makeSelectorLink) {
            element.innerHTML = "";
            element.appendChild(link);
        }
        
        li.appendChild(link.cloneNode(true));
        return li;
    };

    /**
     * Vytvoří a vloží menu do stránky
     * @param {Object} config - Konfigurace menu
     */
    const build = (config) => {
        try {
            // Validace
            validateConfig(config);

            // Destrukturalizace s výchozími hodnotami
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

            // Najít hlavní kontejner
            const container = document.querySelector(article);
            if (!container) {
                console.warn(`Menusio: Element "${article}" nebyl nalezen`);
                return;
            }

            // Najít elementy pro menu
            const items = findMenuItems(container, selectors, classesNotInMenu);
            
            // Kontrola minimálního počtu položek
            if (items.length < minItems) {
                console.info(`Menusio: Nalezeno pouze ${items.length} položek, minimum je ${minItems}`);
                return;
            }

            // Najít element před kterým se vloží menu
            const insertBeforeSelector = selectorBeforeMenu || selectorBeforMenu;
            const anchorElement = insertBeforeSelector 
                ? document.querySelector(insertBeforeSelector)
                : container.querySelector("h1");

            if (!anchorElement) {
                console.warn("Menusio: Element pro vložení menu nebyl nalezen");
                return;
            }

            // Vytvoření menu
            const menuList = document.createElement(ordered ? "ol" : "ul");
            menuList.id = "js-menusio";
            menuList.setAttribute("role", "navigation");
            menuList.setAttribute("aria-label", "Obsah stránky");

            // Vytvoření položek menu
            const fragment = document.createDocumentFragment();
            items.forEach(item => {
                const menuItem = createMenuItem(item, existingIds, selectorLink);
                fragment.appendChild(menuItem);
            });

            menuList.appendChild(fragment);

            // Vložení menu do stránky
            anchorElement.parentNode.insertBefore(menuList, anchorElement.nextSibling);

            console.info(`Menusio: Menu úspěšně vytvořeno s ${items.length} položkami`);

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