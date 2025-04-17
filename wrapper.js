import React, { useEffect, useRef } from "react";

const BubbleWidgetReact = ({
  position = "bottom-right",
  theme = "light",
  icon,
  children,
  content,
  buttonSize,
  buttonRadius,
  tooltipWidth,
  spacing,
  buttonColor,
  tooltipColor,
  textColor,
  shadowColor,
  animation = "scale",
  onToggle,
  src,
  iframeHeight,
  allow,
  sandbox,
}) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    const loadComponent = async () => {
      if (!customElements.get("bubble-widget")) {
        try {
          await import("./widget");
        } catch (error) {
          console.error("Failed to load BubbleWidget web component:", error);
        }
      }
    };

    loadComponent();
  }, []);

  useEffect(() => {
    const widget = widgetRef.current;
    if (widget && onToggle) {
      widget.addEventListener("bubbleToggle", onToggle);

      return () => {
        widget.removeEventListener("bubbleToggle", onToggle);
      };
    }
  }, [onToggle]);

  const getAttributes = () => {
    const attrs = {
      ref: widgetRef,
      position,
      theme,
      "button-size": buttonSize,
      "button-radius": buttonRadius,
      "tooltip-width": tooltipWidth,
      spacing,
      "button-color": buttonColor,
      "tooltip-color": tooltipColor,
      "text-color": textColor,
      "shadow-color": shadowColor,
      animation,
      src,
      "iframe-height": iframeHeight,
      allow,
      sandbox,
    };

    return Object.entries(attrs).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  return (
    <bubble-widget {...getAttributes()}>
      {icon && <span slot="icon">{icon}</span>}
      {!src && <div slot="content">{content || children}</div>}
    </bubble-widget>
  );
};

export default BubbleWidgetReact;
