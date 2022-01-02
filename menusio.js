var menusio = menusio || ((() => {
    let _args = {};
    return {
        init(Args) {
            _args = Args;
        },
        build() {
            const menuList = document.getElementById(_args[1]);
            const main = document.getElementById(_args[0]);
            const list = main.getElementsByTagName("h2");

            for (let i = 0; i < list.length; i++) {
                const link = document.createElement("a");
                const li = document.createElement("li");
                list[i].id = i + 1;
                link.setAttribute("href", `#${list[i].id}`);
                link.setAttribute("class", "js-anchor");
                link.innerHTML = list[i].textContent;
                li.appendChild(link);
                menuList.appendChild(li);
            }
        }
    };
})());
