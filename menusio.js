var menusio = menusio || ((() => {
    return {
        build(arg) {
            const main = document.querySelector(arg.article);
            const existingIds = typeof arg.existingIds === 'undefined' ? false : arg.existingIds;  // BC false
            const selectorLink = typeof arg.selectorLink === 'undefined' ? true : arg.selectorLink;  // BC true
            const classesNotInMenu = typeof arg.classesNotInMenu === 'undefined' ? [] : arg.classesNotInMenu;  // BC []

            console.log(classesNotInMenu);

            if (main !== null) {
                const listType = arg.ordered === true ? "ol" : "ul";

                if (arg.selectorBeforMenu === null || arg.selectorBeforMenu === "" || arg.selectorBeforMenu === undefined) {
                    arg.selectorBeforMenu = "h1";
                }

                let selectorBeforMenu = document.querySelector(arg.selectorBeforMenu);

                if (selectorBeforMenu === null) {
                    selectorBeforMenu = main.querySelector("h1");
                }

                const listMenu = document.createElement(listType);
                listMenu.setAttribute("id", "js-menusio");

                selectorBeforMenu.parentNode.insertBefore(listMenu, selectorBeforMenu.nextSibling);

                const list = main.querySelectorAll(arg.selectors);
                const menuList = document.getElementById("js-menusio");

                for (let i = 0; i < list.length; i++) {
                    //if list hase any class in classesNotInMenu, continue
                    if (classesNotInMenu.length > 0) {
                        let hasClass = false;
                        for (let j = 0; j < classesNotInMenu.length; j++) {
                            if (list[i].classList.contains(classesNotInMenu[j])) {
                                hasClass = true;
                                break;
                            }
                        }
                        if (hasClass) {
                            continue;
                        }
                    }

                    const link = document.createElement("a");
                    const li = document.createElement("li");

                    if (!list[i].id || !existingIds) {
                        list[i].id = i + 1;
                    }

                    link.setAttribute("href", `#${list[i].id}`);

                    link.innerHTML = list[i].innerHTML;

                    if (selectorLink) {
                        // Header as link
                        list[i].innerHTML = link.outerHTML;
                    }

                    link.innerHTML = list[i].textContent;
                    li.appendChild(link);
                    menuList.appendChild(li);
                }
            }
        }
    };
})());
