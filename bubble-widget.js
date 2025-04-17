class BubbleWidget extends HTMLElement {
  static POSITIONS = {
    "top-left": "top: 20px; left: 20px;",
    "top-right": "top: 20px; right: 20px;",
    "bottom-left": "bottom: 20px; left: 20px;",
    "bottom-right": "bottom: 20px; right: 20px;",
    top: "top: 20px; left: 50%; transform: translateX(-50%);",
    bottom: "bottom: 20px; left: 50%; transform: translateX(-50%);",
  };

  static THEMES = {
    light: {
      button: "#fff",
      tooltip: "#fff",
      text: "#000",
      shadow: "rgba(0,0,0,0.2)",
    },
    dark: {
      button: "#333",
      tooltip: "#444",
      text: "#fff",
      shadow: "rgba(0,0,0,0.4)",
    },
  };

  static get baseStyles() {
    return `
      /* Host element styles */
      :host {
        position: fixed;
        z-index: 1000;
      }
      
      /* Container styles */
      .bubble-container {
        position: relative;
      }
      
      .bubble-container.active .tooltip {
        display: block;
      }
      
      /* Button styles */
      .bubble-btn {
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Tooltip styles */
      .tooltip {
        display: none;
        position: absolute;
        border-radius: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        max-width: 80vw;
        width: auto;
        z-index: 1001;
      }
      
      .tooltip::after {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        transform: rotate(45deg);
        z-index: 1000;
      }
      
      /* Iframe styles */
      .content-iframe {
        width: 100%;
        border: none;
        overflow: hidden;
      }
    `;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    this.loadStylesheet();
    this.initializeProperties();
    this.render();
    this.applyDynamicStyles();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.initializeProperties();
      this.render();
      this.applyDynamicStyles();
    }
  }

  disconnectedCallback() {
    this.cleanupEventListeners();
  }

  loadStylesheet() {
    // Instead of loading an external CSS file, use the embedded styles
    const styleElement = document.createElement("style");
    styleElement.textContent = BubbleWidget.baseStyles;
    this.shadowRoot.appendChild(styleElement);
  }

  initializeProperties() {
    this.position = this.validatePosition(this.getAttribute("position"));
    this.theme = this.validateTheme(this.getAttribute("theme"));
    this.icon = this.getAttribute("icon") || "";

    this.buttonSize = this.getAttribute("button-size") || "50px";
    this.buttonRadius = this.getAttribute("button-radius") || "50%";
    this.tooltipWidth = this.getAttribute("tooltip-width") || "200px";
    this.spacing = this.getAttribute("spacing") || "20px";

    this.customColors = {
      button: this.getAttribute("button-color"),
      tooltip: this.getAttribute("tooltip-color"),
      text: this.getAttribute("text-color"),
      shadow: this.getAttribute("shadow-color"),
    };

    this.animation = this.getAttribute("animation") || "scale";

    this.src = this.getAttribute("src") || "";
    this.iframeHeight = this.getAttribute("iframe-height") || "300px";
    this.allow = this.getAttribute("allow") || "";
    this.sandbox =
      this.getAttribute("sandbox") ||
      "allow-scripts allow-same-origin allow-forms";
  }

  validatePosition(position) {
    return BubbleWidget.POSITIONS.hasOwnProperty(position)
      ? position
      : "bottom-right";
  }

  validateTheme(theme) {
    return BubbleWidget.THEMES.hasOwnProperty(theme) ? theme : "light";
  }

  getThemeColors() {
    const baseTheme = BubbleWidget.THEMES[this.theme];
    return {
      button: this.customColors.button || baseTheme.button,
      tooltip: this.customColors.tooltip || baseTheme.tooltip,
      text: this.customColors.text || baseTheme.text,
      shadow: this.customColors.shadow || baseTheme.shadow,
    };
  }

  render() {
    // Create container div if not already present
    if (!this.shadowRoot.querySelector(".bubble-container")) {
      const template = document.createElement("div");
      template.innerHTML = `
        <div class="bubble-container">
          <button class="bubble-btn" aria-label="Toggle widget">
            <slot name="icon">${this.icon}</slot>
          </button>
          <div class="tooltip">
            ${this.renderContent()}
          </div>
        </div>
      `;
      this.shadowRoot.appendChild(template.firstElementChild);
    } else {
      // Update existing content
      const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
      if (iconSlot) {
        iconSlot.innerHTML = this.icon;
      }

      const tooltip = this.shadowRoot.querySelector(".tooltip");
      if (tooltip) {
        tooltip.innerHTML = this.renderContent();
      }
    }
  }

  renderContent() {
    if (this.src) {
      return `<iframe 
        src="${this.src}" 
        class="content-iframe" 
        frameborder="0" 
        allow="${this.allow}" 
        sandbox="${this.sandbox}"
        loading="lazy"></iframe>`;
    }

    return `<slot name="content">Default content goes here</slot>`;
  }

  applyDynamicStyles() {
    const themeColors = this.getThemeColors();
    const styleElement = document.createElement("style");

    styleElement.textContent = `
      :host {
        ${BubbleWidget.POSITIONS[this.position]}
      }
      
      .bubble-btn {
        width: ${this.buttonSize};
        height: ${this.buttonSize};
        border-radius: ${this.buttonRadius};
        background-color: ${themeColors.button};
        box-shadow: 0 2px 5px ${themeColors.shadow};
        font-size: calc(${this.buttonSize} * 0.5);
      }
      
      .bubble-btn:hover {
        ${this.getAnimationStyle()}
      }
      
      .tooltip {
        background-color: ${themeColors.tooltip};
        color: ${themeColors.text};
        padding: ${this.spacing};
        min-width: ${this.tooltipWidth};
        ${this.calculateTooltipPosition()}
      }
      
      .tooltip::after {
        background-color: ${themeColors.tooltip};
        ${this.calculatePointerPosition()}
      }
      
      .content-iframe {
        height: ${this.iframeHeight};
      }
    `;

    // Remove old dynamic styles if exist
    const oldStyle = this.shadowRoot.querySelector(
      "style[data-dynamic='true']"
    );
    if (oldStyle) {
      this.shadowRoot.removeChild(oldStyle);
    }

    // Mark this style as dynamic so we can find it later
    styleElement.setAttribute("data-dynamic", "true");
    this.shadowRoot.appendChild(styleElement);
  }

  getAnimationStyle() {
    switch (this.animation) {
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
  }

  calculateTooltipPosition() {
    const positions = {
      topCentered: `bottom: calc(100% + 20px); left: 50%; transform: translateX(-50%); width: ${this.tooltipWidth};`,
      bottomCentered: `top: calc(100% + 20px); left: 50%; transform: translateX(-50%); width: ${this.tooltipWidth};`,
      topCorner: `bottom: calc(100% + 20px); left: 0;`,
      bottomCorner: `top: calc(100% + 20px); left: 0;`,
      left: `right: calc(100% + 20px); top: 0;`,
      right: `left: calc(100% + 20px); top: 0;`,
    };

    if (this.position === "bottom") {
      return positions.topCentered;
    } else if (this.position === "top") {
      return positions.bottomCentered;
    } else if (this.position.includes("bottom")) {
      return positions.topCorner;
    } else if (this.position.includes("top")) {
      return positions.bottomCorner;
    } else {
      return positions.left;
    }
  }

  calculatePointerPosition() {
    const positions = {
      bottom: "bottom: -9px; left: 50%; margin-left: -9px;",
      bottomRight: "bottom: -9px; right: 20px;",
      bottomLeft: "bottom: -9px; left: 20px;",
      top: "top: -9px; left: 50%; margin-left: -9px;",
      topRight: "top: -9px; right: 20px;",
      topLeft: "top: -9px; left: 20px;",
      left: "left: -9px; top: 20px;",
      right: "right: -9px; top: 20px;",
    };

    if (this.position === "bottom") {
      return positions.bottom;
    } else if (this.position === "bottom-right") {
      return positions.bottomRight;
    } else if (this.position === "bottom-left") {
      return positions.bottomLeft;
    } else if (this.position === "top") {
      return positions.top;
    } else if (this.position === "top-right") {
      return positions.topRight;
    } else if (this.position === "top-left") {
      return positions.topLeft;
    } else if (this.position.includes("left")) {
      return positions.left;
    } else {
      return positions.right;
    }
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector(".bubble-btn");
    const container = this.shadowRoot.querySelector(".bubble-container");

    const adjustTooltipPosition = () => {
      const tooltip = this.shadowRoot.querySelector(".tooltip");
      if (!tooltip || !container.classList.contains("active")) return;

      const rect = tooltip.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (rect.right > windowWidth) {
        tooltip.style.left = "auto";
        tooltip.style.right = "0";
        tooltip.style.transform = "none";
      }

      if (rect.left < 0) {
        tooltip.style.left = "0";
        tooltip.style.right = "auto";
        tooltip.style.transform = "none";
      }

      if (rect.bottom > windowHeight) {
        tooltip.style.top = "auto";
        tooltip.style.bottom = "60px";
      }

      if (rect.top < 0) {
        tooltip.style.top = "60px";
        tooltip.style.bottom = "auto";
      }
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = container.classList.toggle("active");

      if (isActive) {
        setTimeout(adjustTooltipPosition, 0);
      }

      this.dispatchEvent(
        new CustomEvent("bubbleToggle", {
          detail: { isOpen: isActive },
          bubbles: true,
          composed: true,
        })
      );
    });

    window.addEventListener("resize", adjustTooltipPosition);

    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        container.classList.remove("active");
      }
    });

    this._adjustTooltipPosition = adjustTooltipPosition;
  }

  cleanupEventListeners() {
    if (this._adjustTooltipPosition) {
      window.removeEventListener("resize", this._adjustTooltipPosition);
    }
  }
}

customElements.define("bubble-widget", BubbleWidget);

// For module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = BubbleWidget;
}
