const menusio = (() => {
    const build = (arg) => {
        const { article, existingIds = false, selectorLink = true, classesNotInMenu = [], selectors, ordered } = arg;

        console.log(classesNotInMenu);

        const main = document.querySelector(article);
        if (!main) return;

        const listType = ordered ? "ol" : "ul";

        let selectorBeforMenu = document.querySelector(arg.selectorBeforMenu) || main.querySelector("h1");

        const list = main.querySelectorAll(selectors);

        const menuList = document.createElement(listType);
        menuList.setAttribute("id", "js-menusio");
        selectorBeforMenu.parentNode.insertBefore(menuList, selectorBeforMenu.nextSibling);

        for (let i = 0; i < list.length; i++) {
            if (classesNotInMenu.some(className => list[i].classList.contains(className))) continue;

            const link = document.createElement("a");
            const li = document.createElement("li");

            if (!list[i].id || !existingIds) {
                list[i].id = i + 1;
            }

            link.setAttribute("href", `#${list[i].id}`);

            link.textContent = list[i].textContent;

            if (selectorLink) {
                list[i].innerHTML = link.outerHTML;
            }

            li.appendChild(link);
            menuList.appendChild(li);
        }
    }

    return { build };
})();

