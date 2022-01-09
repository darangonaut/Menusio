# Menusio
Creates menu with anchors in article from H2 headings

``` html
<script src="https://cdn.jsdelivr.net/gh/darangonaut/Menusio@master/menusio.js"></script>
```

``` html

<script src="menusio.js"></script>
<script type="text/javascript">
    menusio.build(
        {
            article: "main", // name or id or class of the article element
            ordered: true,  // true or false
            selectors: "h2", // h2,h3,h4,h5,h6
            selectorBeforMenu: "h1", 
        }
    );
</script>
```
