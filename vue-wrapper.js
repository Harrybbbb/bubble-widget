import "./bubble-widget.js";
import { handleToggleEvent } from "./utils.js";

export default {
  name: "BubbleWidget",

  props: {
    position: {
      type: String,
      default: "bottom-right",
    },
    theme: {
      type: String,
      default: "light",
    },
    buttonColor: String,
    tooltipColor: String,
    textColor: String,
    shadowColor: String,
    buttonSize: String,
    buttonRadius: String,
    tooltipWidth: String,
    spacing: String,
    icon: String,
    src: String,
    iframeHeight: String,
    allow: String,
    sandbox: String,
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
      handleToggleEvent(event, (isOpen) => {
        this.$emit("toggle", isOpen);
      });
    },
  },

  computed: {
    widgetProps() {
      return {
        position: this.position,
        theme: this.theme,
        animation: this.animation,
        "button-color": this.buttonColor,
        "tooltip-color": this.tooltipColor,
        "text-color": this.textColor,
        "shadow-color": this.shadowColor,
        "button-size": this.buttonSize,
        "button-radius": this.buttonRadius,
        "tooltip-width": this.tooltipWidth,
        spacing: this.spacing,
        icon: this.icon,
        src: this.src,
        "iframe-height": this.iframeHeight,
        allow: this.allow,
        sandbox: this.sandbox,
      };
    },
  },

  render() {
    return this.$slots.default ? this.$slots.default() : null;
  },

  template: `
    <bubble-widget
      v-bind="widgetProps"
    >
      <template v-if="$slots.default">
        <div slot="content">
          <slot></slot>
        </div>
      </template>
    </bubble-widget>
  `,
};
