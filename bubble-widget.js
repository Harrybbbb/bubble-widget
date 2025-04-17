class BubbleWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  static get observedAttributes() {
    return [
      "position",
      "theme",
      "icon",
      "button-size",
      "button-radius",
      "tooltip-width",
      "spacing",
      "button-color",
      "tooltip-color",
      "text-color",
      "shadow-color",
      "animation",
      "src",
      "iframe-height",
      "allow",
      "sandbox",
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.querySelector(".bubble-container")) {
      this.render();
    }
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._adjustTooltipPosition);
    document.removeEventListener("click", this._handleOutsideClick);
  }

  render() {
    const position = this.getAttribute("position") || "bottom-right";
    const theme = this.getAttribute("theme") || "light";
    const icon = this.getAttribute("icon") || "";
    const buttonSize = this.getAttribute("button-size") || "50px";
    const buttonRadius = this.getAttribute("button-radius") || "50%";
    const tooltipWidth = this.getAttribute("tooltip-width") || "200px";
    const spacing = this.getAttribute("spacing") || "20px";
    const buttonColor =
      this.getAttribute("button-color") || (theme === "dark" ? "#333" : "#fff");
    const tooltipColor =
      this.getAttribute("tooltip-color") ||
      (theme === "dark" ? "#444" : "#fff");
    const textColor =
      this.getAttribute("text-color") || (theme === "dark" ? "#fff" : "#000");
    const shadowColor =
      this.getAttribute("shadow-color") ||
      (theme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)");
    const animation = this.getAttribute("animation") || "scale";
    const src = this.getAttribute("src") || "";
    const iframeHeight = this.getAttribute("iframe-height") || "300px";
    const allow = this.getAttribute("allow") || "";
    const sandbox =
      this.getAttribute("sandbox") ||
      "allow-scripts allow-same-origin allow-forms";

    const positions = {
      "top-left": "top: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "bottom-right": "bottom: 20px; right: 20px;",
      top: "top: 20px; left: 50%; transform: translateX(-50%);",
      bottom: "bottom: 20px; left: 50%; transform: translateX(-50%);",
    };

    const getTooltipPosition = () => {
      if (position === "bottom")
        return "bottom: calc(100% + 20px); left: 50%; transform: translateX(-50%);";
      if (position === "top")
        return "top: calc(100% + 20px); left: 50%; transform: translateX(-50%);";
      if (position.includes("bottom"))
        return "bottom: calc(100% + 20px); left: 0;";
      if (position.includes("top")) return "top: calc(100% + 20px); left: 0;";
      return position.includes("left")
        ? "right: calc(100% + 20px); top: 0;"
        : "left: calc(100% + 20px); top: 0;";
    };

    const getPointerPosition = () => {
      if (position === "bottom")
        return "bottom: -9px; left: 50%; margin-left: -9px;";
      if (position === "bottom-right") return "bottom: -9px; right: 20px;";
      if (position === "bottom-left") return "bottom: -9px; left: 20px;";
      if (position === "top") return "top: -9px; left: 50%; margin-left: -9px;";
      if (position === "top-right") return "top: -9px; right: 20px;";
      if (position === "top-left") return "top: -9px; left: 20px;";
      if (position.includes("left")) return "left: -9px; top: 20px;";
      return "right: -9px; top: 20px;";
    };

    const getAnimationStyle = () => {
      switch (animation) {
        case "scale":
          return "transform: scale(1.1);";
        case "rotate":
          return "transform: rotate(180deg);";
        case "bounce":
          return "transform: translateY(-5px);";
        case "none":
          return "transform: none;";
        default:
          return "transform: scale(1.1);";
      }
    };

    const html = `
      <style>
        :host { position: fixed; z-index: 1000; ${
          positions[position] || positions["bottom-right"]
        } }
        .bubble-container { position: relative; }
        .bubble-container.active .tooltip { display: block; }
        .bubble-btn {
          width: ${buttonSize}; height: ${buttonSize}; border-radius: ${buttonRadius};
          background-color: ${buttonColor}; box-shadow: 0 2px 5px ${shadowColor};
          border: none; cursor: pointer; transition: all 0.3s ease;
          display: flex; align-items: center; justify-content: center;
          font-size: calc(${buttonSize} * 0.5);
        }
        .bubble-btn:hover { ${getAnimationStyle()} }
        .tooltip {
          display: none; position: absolute; border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 80vw;
          background-color: ${tooltipColor}; color: ${textColor}; 
          padding: ${spacing}; width: ${tooltipWidth}; z-index: 1001;
          ${getTooltipPosition()}
        }
        .tooltip::after {
          content: ""; position: absolute; width: 18px; height: 18px;
          transform: rotate(45deg); z-index: 1000; background-color: ${tooltipColor};
          ${getPointerPosition()}
        }
        .content-iframe { width: 100%; height: ${iframeHeight}; border: none; overflow: hidden; }
      </style>
      <div class="bubble-container">
        <button class="bubble-btn" aria-label="Toggle widget">
          <slot name="icon">${icon}</slot>
        </button>
        <div class="tooltip">
          ${
            src
              ? `<iframe src="${src}" class="content-iframe" frameborder="0" allow="${allow}" sandbox="${sandbox}" loading="lazy"></iframe>`
              : `<slot name="content">Default content goes here</slot>`
          }
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = html;
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector(".bubble-btn");
    const container = this.shadowRoot.querySelector(".bubble-container");

    this._adjustTooltipPosition = () => {
      const tooltip = this.shadowRoot.querySelector(".tooltip");
      if (!tooltip || !container.classList.contains("active")) return;

      const rect = tooltip.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        tooltip.style.left = "auto";
        tooltip.style.right = "0";
        tooltip.style.transform = "none";
      }
      if (rect.left < 0) {
        tooltip.style.left = "0";
        tooltip.style.right = "auto";
        tooltip.style.transform = "none";
      }
      if (rect.bottom > window.innerHeight) {
        tooltip.style.top = "auto";
        tooltip.style.bottom = "60px";
      }
      if (rect.top < 0) {
        tooltip.style.top = "60px";
        tooltip.style.bottom = "auto";
      }
    };

    this._handleOutsideClick = (e) => {
      if (!this.contains(e.target)) {
        container.classList.remove("active");
      }
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = container.classList.toggle("active");
      if (isActive) setTimeout(this._adjustTooltipPosition, 0);
      this.dispatchEvent(
        new CustomEvent("bubbleToggle", {
          detail: { isOpen: isActive },
          bubbles: true,
          composed: true,
        })
      );
    });

    window.addEventListener("resize", this._adjustTooltipPosition);
    document.addEventListener("click", this._handleOutsideClick);
  }
}

customElements.define("bubble-widget", BubbleWidget);

if (typeof module !== "undefined" && module.exports) {
  module.exports = BubbleWidget;
}
