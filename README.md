# Menusio

A JavaScript library for creating a menu from selected elements on a web page. 

## Features
- Supports both ordered and unordered lists as menus
- Can create menu links either before or after the selected elements
- Option to use existing elements' IDs or generate new ones
- Option to either replace the selected element's content with the link or have the link appear next to the element

## Usage

Include the script in your HTML file and initialize menusio with the following code:

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
            selectorLink: false, // selector as link, default true
            existingIds: true, // use existing id, default false
            classesNotInMenu: ["not-in-menu"] // classes not to be included in menu
        }
    );
</script>
```

The `build` method takes an argument object with the following properties:
- `article`: the main element to search for selected elements in (defaults to `document`)
- `selectors`: the CSS selector(s) for the elements to be used in the menu
- `ordered`: whether to use ordered (`true`) or unordered (`false`) lists for the menu (defaults to `false`)
- `selectorBeforMenu`: the CSS selector for an element to insert the menu before (defaults to `"h1"`)
- `existingIds`: whether to use existing elements' IDs (`true`) or generate new ones (`false`) (defaults to `false`)
- `selectorLink`: whether to replace the selected element's content with the link (`true`) or have the link appear next to the element (`false`) (defaults to `true`)
