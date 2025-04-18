class BubbleWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this._initTemplate();
  }

  static get observedAttributes() {
    return [
      "position",
      "theme",
      "icon",
      "button-size",
      "tooltip-width",
      "button-color",
      "tooltip-color",
      "text-color",
    ];
  }

  _initTemplate() {
    const styles = document.createElement("style");
    styles.textContent = `
      :host {
        position: fixed;
        z-index: 1000;
      }
      .bubble-container {
        position: relative;
      }
      .bubble-container.active .tooltip {
        display: block;
      }
      .bubble-btn {
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        border-radius: 50%;
      }
      .bubble-btn:hover {
        transform: scale(1.1);
      }
      .tooltip {
        display: none;
        position: absolute;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 80vw;
        z-index: 1001;
        padding: 15px;
      }
      .tooltip::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        transform: rotate(45deg);
        z-index: 1000;
      }
      .content-iframe {
        width: 100%;
        border: none;
        overflow: hidden;
      }
    `;

    this.container = document.createElement("div");
    this.container.className = "bubble-container";

    this.button = document.createElement("button");
    this.button.className = "bubble-btn";
    this.button.setAttribute("aria-label", "Toggle widget");

    this.iconSlot = document.createElement("slot");
    this.iconSlot.name = "icon";
    this.button.appendChild(this.iconSlot);

    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";

    this.contentSlot = document.createElement("slot");
    this.contentSlot.name = "content";
    this.tooltip.appendChild(this.contentSlot);

    this.container.appendChild(this.button);
    this.container.appendChild(this.tooltip);

    this.shadowRoot.appendChild(styles);
    this.shadowRoot.appendChild(this.container);
  }

  connectedCallback() {
    this._updateStyles();
    this._setupEventListeners();
  }

  attributeChangedCallback() {
    this._updateStyles();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._adjustTooltipPosition);
    document.removeEventListener("click", this._handleOutsideClick);
    this.button.removeEventListener("click", this._toggleTooltip);
  }

  _updateStyles() {
    const position = this.getAttribute("position") || "bottom-right";
    const theme = this.getAttribute("theme") || "light";
    const buttonSize = this.getAttribute("button-size") || "50px";
    const tooltipWidth = this.getAttribute("tooltip-width") || "200px";
    const buttonColor =
      this.getAttribute("button-color") || (theme === "dark" ? "#333" : "#fff");
    const tooltipColor =
      this.getAttribute("tooltip-color") ||
      (theme === "dark" ? "#444" : "#fff");
    const textColor =
      this.getAttribute("text-color") || (theme === "dark" ? "#fff" : "#000");

    this.style.cssText = this._getPositionStyle(position);

    this.button.style.cssText = `
      width: ${buttonSize}; 
      height: ${buttonSize};
      background-color: ${buttonColor};
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-size: calc(${buttonSize} * 0.5);
    `;
    this.tooltip.style.cssText = `
      background-color: ${tooltipColor}; 
      color: ${textColor};
      width: ${tooltipWidth};
      ${this._getTooltipPositionStyle(position)}
    `;

    const pointerStyle = this._getPointerPositionStyle(position, tooltipColor);

    const styleSheet = this.shadowRoot.querySelector("style");
    const styleText = styleSheet.textContent;
    const newTooltipAfterRule = `.tooltip::after {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      transform: rotate(45deg);
      z-index: 1000;
      background-color: ${tooltipColor};
      ${pointerStyle}
    }`;

    const updatedStyleText = styleText.replace(
      /\.tooltip::after \{[^}]+\}/,
      newTooltipAfterRule
    );

    styleSheet.textContent = updatedStyleText;
  }

  _getPositionStyle(position) {
    const positions = {
      "top-left": "top: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "bottom-right": "bottom: 20px; right: 20px;",
      top: "top: 20px; left: 50%; transform: translateX(-50%);",
      bottom: "bottom: 20px; left: 50%; transform: translateX(-50%);",
    };

    return positions[position] || positions["bottom-right"];
  }

  _getTooltipPositionStyle(position) {
    if (position === "bottom")
      return "bottom: calc(100% + 15px); left: 50%; transform: translateX(-50%);";
    if (position === "top")
      return "top: calc(100% + 15px); left: 50%; transform: translateX(-50%);";
    if (position.includes("bottom"))
      return "bottom: calc(100% + 15px); left: 0;";
    if (position.includes("top")) return "top: calc(100% + 15px); left: 0;";

    return position.includes("left")
      ? "right: calc(100% + 15px); top: 0;"
      : "left: calc(100% + 15px); top: 0;";
  }

  _getPointerPositionStyle(position, color) {
    if (position === "bottom")
      return "bottom: -6px; left: 50%; margin-left: -6px;";
    if (position === "bottom-right") return "bottom: -6px; right: 15px;";
    if (position === "bottom-left") return "bottom: -6px; left: 15px;";
    if (position === "top") return "top: -6px; left: 50%; margin-left: -6px;";
    if (position === "top-right") return "top: -6px; right: 15px;";
    if (position === "top-left") return "top: -6px; left: 15px;";
    if (position.includes("left")) return "left: -6px; top: 15px;";

    return "right: -6px; top: 15px;";
  }

  _setupEventListeners() {
    this._adjustTooltipPosition = () => {
      if (!this.isOpen) return;

      const rect = this.tooltip.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        this.tooltip.style.left = "auto";
        this.tooltip.style.right = "0";
        this.tooltip.style.transform = "none";
      }

      if (rect.left < 0) {
        this.tooltip.style.left = "0";
        this.tooltip.style.right = "auto";
        this.tooltip.style.transform = "none";
      }

      if (rect.bottom > window.innerHeight) {
        this.tooltip.style.top = "auto";
        this.tooltip.style.bottom = "60px";
      }

      if (rect.top < 0) {
        this.tooltip.style.top = "60px";
        this.tooltip.style.bottom = "auto";
      }
    };

    this._handleOutsideClick = (e) => {
      if (!this.contains(e.target)) {
        this.container.classList.remove("active");
        this.isOpen = false;
      }
    };

    this._toggleTooltip = (e) => {
      e.stopPropagation();
      this.isOpen = this.container.classList.toggle("active");

      if (this.isOpen) {
        setTimeout(this._adjustTooltipPosition, 0);
      }

      this.dispatchEvent(
        new CustomEvent("bubble-toggle", {
          detail: { isOpen: this.isOpen },
          bubbles: true,
          composed: true,
        })
      );
    };

    this.button.addEventListener("click", this._toggleTooltip);
    window.addEventListener("resize", this._adjustTooltipPosition);
    document.addEventListener("click", this._handleOutsideClick);
  }
}
customElements.define("bubble-widget", BubbleWidget);

if (typeof module !== "undefined" && module.exports) {
  module.exports = BubbleWidget;
}
