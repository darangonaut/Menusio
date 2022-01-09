var menusio = menusio || ((() => {
    return {
        build(arg) {
            const main = document.getElementById(arg.idArticle);
            if (main !== null) {
                const list = main.querySelectorAll(arg.selectors);
                const menuList = document.getElementById(arg.idList);

                for (let i = 0; i < list.length; i++) {
                    const link = document.createElement("a");
                    const li = document.createElement("li");

                    list[i].id = i + 1;
                    link.setAttribute("href", `#${list[i].id}`);

                    link.innerHTML = list[i].innerHTML;
                    list[i].innerHTML = link.outerHTML;

                    link.innerHTML = list[i].textContent;
                    li.appendChild(link);
                    menuList.appendChild(li);
                }
            }
        }
    };
})());
