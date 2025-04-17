# Bubble Widget

A lightweight, customizable bubble widget component for web applications.

![Bubble Widget](https://i.ibb.co/N6dQ764V/Screenshot-2025-04-18-at-12-12-01-AM.png)

## Installation

```bash
npm install bubble-widget
```

## Usage

### CDN Usage

```html
<!-- Import from unpkg CDN -->
<script src="https://unpkg.com/bubble-widget"></script>

<!-- Use the component -->
<bubble-widget position="bottom-right" theme="light" icon="💬">
  <div slot="content">
    <h3>Hello, World!</h3>
    <p>This is a customizable bubble widget.</p>
  </div>
</bubble-widget>
```

### Import in JavaScript

```js
// Import the component
import "bubble-widget";

// Or if you need to access the class definition
import BubbleWidget from "bubble-widget";
```

### React Usage

```jsx
import React from "react";
import BubbleWidget from "bubble-widget/react-wrapper";

function App() {
  return (
    <BubbleWidget
      position="bottom-right"
      theme="light"
      icon="💬"
      onToggle={(isOpen) => console.log("Widget is open:", isOpen)}
    >
      <h3>Hello, World!</h3>
      <p>This is a customizable bubble widget in React.</p>
    </BubbleWidget>
  );
}
```

### Vue Usage

```vue
<template>
  <BubbleWidget
    position="bottom-right"
    theme="light"
    icon="💬"
    @toggle="handleToggle"
  >
    <h3>Hello, World!</h3>
    <p>This is a customizable bubble widget in Vue.</p>
  </BubbleWidget>
</template>

<script>
import BubbleWidget from "bubble-widget/vue-wrapper";

export default {
  components: {
    BubbleWidget,
  },
  methods: {
    handleToggle(isOpen) {
      console.log("Widget is open:", isOpen);
    },
  },
};
</script>
```

## Configuration Options

| Attribute       | Description                     | Default                                         | Options                                                                             |
| --------------- | ------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `position`      | Position of the bubble          | `"bottom-right"`                                | `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`, `"top"`, `"bottom"` |
| `theme`         | Color theme                     | `"light"`                                       | `"light"`, `"dark"`                                                                 |
| `icon`          | Icon inside the button          | `""`                                            | Any text/emoji                                                                      |
| `button-size`   | Size of the button              | `"50px"`                                        | Any valid CSS size                                                                  |
| `button-radius` | Border radius of the button     | `"50%"`                                         | Any valid CSS radius                                                                |
| `tooltip-width` | Width of the tooltip            | `"200px"`                                       | Any valid CSS width                                                                 |
| `spacing`       | Padding inside the tooltip      | `"20px"`                                        | Any valid CSS padding                                                               |
| `button-color`  | Background color of the button  | Theme dependent                                 | Any valid CSS color                                                                 |
| `tooltip-color` | Background color of the tooltip | Theme dependent                                 | Any valid CSS color                                                                 |
| `text-color`    | Text color                      | Theme dependent                                 | Any valid CSS color                                                                 |
| `shadow-color`  | Color of the shadow             | Theme dependent                                 | Any valid CSS color                                                                 |
| `animation`     | Hover animation of the button   | `"scale"`                                       | `"scale"`, `"rotate"`, `"bounce"`, `"none"`                                         |
| `src`           | URL to load in an iframe        | `""`                                            | Any valid URL                                                                       |
| `iframe-height` | Height of the iframe            | `"300px"`                                       | Any valid CSS height                                                                |
| `allow`         | Features to allow in the iframe | `""`                                            | Standard iframe allow attribute                                                     |
| `sandbox`       | Sandbox options for the iframe  | `"allow-scripts allow-same-origin allow-forms"` | Standard iframe sandbox attribute                                                   |

## Events

The component dispatches a `bubbleToggle` event when the bubble is toggled:

```js
document
  .querySelector("bubble-widget")
  .addEventListener("bubbleToggle", (e) => {
    console.log("Bubble is open:", e.detail.isOpen);
  });
```

## Slots

- `icon`: Custom content for the button (overrides the `icon` attribute)
- `content`: Content to display in the tooltip

## License

MIT
