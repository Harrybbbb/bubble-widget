// Import the web component
import "./bubble-widget.js";

export default {
  name: "BubbleWidget",

  props: {
    // Position props
    position: {
      type: String,
      default: "bottom-right",
    },

    // Theme props
    theme: {
      type: String,
      default: "light",
    },
    buttonColor: String,
    tooltipColor: String,
    textColor: String,
    shadowColor: String,

    // Size and spacing props
    buttonSize: String,
    buttonRadius: String,
    tooltipWidth: String,
    spacing: String,

    // Content props
    icon: String,
    src: String,
    iframeHeight: String,
    allow: String,
    sandbox: String,

    // Animation props
    animation: {
      type: String,
      default: "scale",
    },
  },

  emits: ["toggle"],

  mounted() {
    this.$el.addEventListener("bubbleToggle", this.handleToggle);
  },

  beforeUnmount() {
    this.$el.removeEventListener("bubbleToggle", this.handleToggle);
  },

  methods: {
    handleToggle(event) {
      this.$emit("toggle", event.detail.isOpen);
    },
  },

  render() {
    return this.$slots.default ? this.$slots.default() : null;
  },

  template: `
    <bubble-widget
      :position="position"
      :theme="theme"
      :button-color="buttonColor"
      :tooltip-color="tooltipColor"
      :text-color="textColor"
      :shadow-color="shadowColor"
      :button-size="buttonSize"
      :button-radius="buttonRadius"
      :tooltip-width="tooltipWidth"
      :spacing="spacing"
      :icon="icon"
      :src="src"
      :iframe-height="iframeHeight"
      :allow="allow"
      :sandbox="sandbox"
      :animation="animation"
    >
      <template v-if="$slots.default">
        <div slot="content">
          <slot></slot>
        </div>
      </template>
    </bubble-widget>
  `,
};
