const menuList = document.getElementById("js-menu-list");

if (menuList) {
    var main = document.getElementById("js-main-content");
    var list = main.getElementsByTagName("h2");

    for (var i = 0; i < list.length; i++) {
        var link = document.createElement("a");
        var li = document.createElement("li");
        list[i].id = i + 1;
        link.setAttribute("href", "#" + list[i].id);
        link.setAttribute("class", "js-anchor");
        link.innerHTML = list[i].textContent;
        li.appendChild(link);
        menuList.appendChild(li);
    }
}