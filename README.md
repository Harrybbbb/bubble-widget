# Bubble Widget

A customizable floating bubble widget implemented as a web component.

![Bubble Widget Demo](https://via.placeholder.com/600x400?text=Bubble+Widget+Demo)

## Features

- 📱 Fully responsive
- 🎨 Customizable themes and colors
- 📍 Multiple position options
- ⚡ Lightweight with no dependencies
- 🧩 Works with any framework or vanilla JS
- 📝 Custom content or iframe support
- 🔌 Simple API with events

## Installation

### NPM

```bash
npm install bubble-widget
```

### CDN

```html
<script src="https://unpkg.com/bubble-widget@latest/bubble-widget.js"></script>
```

## Usage

### Vanilla JS

```html
<script type="module">
  import "bubble-widget";
</script>

<bubble-widget position="bottom-right" theme="light" icon="💬">
  <div slot="content">
    <h3>Hello World!</h3>
    <p>This is my custom content</p>
  </div>
</bubble-widget>
```

### React

```jsx
import React from "react";
import BubbleWidget from "bubble-widget/react-wrapper";

function App() {
  const handleToggle = (isOpen) => {
    console.log("Widget toggled:", isOpen);
  };

  return (
    <BubbleWidget
      position="bottom-right"
      theme="dark"
      icon="💬"
      buttonColor="#4a86e8"
      onToggle={handleToggle}
    >
      <h3>Hello from React!</h3>
      <p>This is a React-wrapped bubble widget.</p>
      <button onClick={() => alert("Button clicked")}>Click me</button>
    </BubbleWidget>
  );
}

export default App;
```

### Vue

```vue
<template>
  <div>
    <BubbleWidget
      position="bottom-right"
      theme="light"
      icon="💬"
      button-size="60px"
      @toggle="handleToggle"
    >
      <h3>Hello from Vue!</h3>
      <p>This is a Vue-wrapped bubble widget.</p>
      <button @click="showAlert">Click me</button>
    </BubbleWidget>
  </div>
</template>

<script>
import BubbleWidget from "bubble-widget/vue-wrapper";

export default {
  components: {
    BubbleWidget,
  },
  methods: {
    handleToggle(isOpen) {
      console.log("Widget toggled:", isOpen);
    },
    showAlert() {
      alert("Button clicked");
    },
  },
};
</script>
```

### With External Content (iframe)

```html
<bubble-widget
  position="bottom-right"
  theme="dark"
  icon="🌐"
  src="https://example.com"
  iframe-height="400px"
>
</bubble-widget>
```

## Configuration

The widget can be customized with the following attributes:

| Attribute       | Description             | Default                                       |
| --------------- | ----------------------- | --------------------------------------------- |
| `position`      | Position on the screen  | `bottom-right`                                |
| `theme`         | Color theme             | `light`                                       |
| `icon`          | Icon inside the button  | (empty)                                       |
| `button-size`   | Size of the button      | `50px`                                        |
| `button-radius` | Border radius of button | `50%`                                         |
| `tooltip-width` | Width of the tooltip    | `200px`                                       |
| `spacing`       | Padding inside tooltip  | `20px`                                        |
| `button-color`  | Custom button color     | (from theme)                                  |
| `tooltip-color` | Custom tooltip color    | (from theme)                                  |
| `text-color`    | Custom text color       | (from theme)                                  |
| `shadow-color`  | Custom shadow color     | (from theme)                                  |
| `animation`     | Button hover animation  | `scale`                                       |
| `src`           | URL for iframe content  | (empty)                                       |
| `iframe-height` | Height of iframe        | `300px`                                       |
| `allow`         | iframe permissions      | (empty)                                       |
| `sandbox`       | iframe sandbox options  | `allow-scripts allow-same-origin allow-forms` |

### Position Options

- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`
- `top`
- `bottom`

### Theme Options

- `light` - White background with dark text
- `dark` - Dark background with light text

### Animation Options

- `scale` - Grows slightly on hover
- `rotate` - Rotates on hover
- `bounce` - Bounces up on hover
- `none` - No animation

## Events

### Vanilla JS

The widget dispatches a custom event when toggled:

```javascript
document
  .querySelector("bubble-widget")
  .addEventListener("bubbleToggle", (e) => {
    console.log("Widget toggled:", e.detail.isOpen);
  });
```

### React

```jsx
<BubbleWidget
  position="bottom-right"
  onToggle={(isOpen) => console.log("Widget toggled:", isOpen)}
>
  Content here
</BubbleWidget>
```

### Vue

```vue
<BubbleWidget position="bottom-right" @toggle="handleToggle">
  Content here
</BubbleWidget>
```

## Custom Styling

You can further customize the widget using CSS variables or by targeting elements within the shadow DOM using the `::part()` selectors.

## TypeScript Support

The package includes TypeScript definitions for better development experience when using TypeScript, React, or Vue.

## Browser Support

Works in all modern browsers that support Web Components:

- Chrome, Firefox, Safari, Edge (latest versions)
- IE11 requires polyfills

## License

MIT
