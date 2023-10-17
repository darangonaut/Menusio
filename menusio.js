const menusio = (() => {
    const build = (arg) => {
        const { article, existingIds = false, selectorLink = true, classesNotInMenu = [], selectors, ordered, minItems = 0 } = arg;

        // Typo fix
        if (!arg.selectorBeforeMenu && arg.selectorBeforMenu) {
            console.error('Menusio: Don\'t use selectorBeforMenu. Use selectorBeforeMenu instead');
        }

        const main = document.querySelector(article);
        if (!main) return;

        const listType = ordered ? "ol" : "ul";

        let selectorBeforeMenu = document.querySelector(arg.selectorBeforeMenu || arg.selectorBeforMenu) || main.querySelector("h1");

        const list = main.querySelectorAll(selectors);
        const items = [];
        for (let i = 0; i < list.length; i++) {
            if (classesNotInMenu.some(className => list[i].classList.contains(className))) continue;
            items.push(list[i]);
        }

        if (items.length < minItems) {
            return;
        }

        const menuList = document.createElement(listType);
        menuList.setAttribute("id", "js-menusio");
        selectorBeforeMenu.parentNode.insertBefore(menuList, selectorBeforeMenu.nextSibling);

        for (let i = 0; i < items.length; i++) {
            const link = document.createElement("a");
            const li = document.createElement("li");

            if (!items[i].id || !existingIds) {
                items[i].id = i + 1;
            }

            link.setAttribute("href", `#${items[i].id}`);

            link.textContent = items[i].textContent;

            if (selectorLink) {
                items[i].innerHTML = link.outerHTML;
            }

            li.appendChild(link);
            menuList.appendChild(li);
        }
    }

    return { build };
})();
