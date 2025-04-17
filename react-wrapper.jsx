import React, { useRef, useEffect, forwardRef } from "react";
import "./bubble-widget.js";

const BubbleWidget = forwardRef(
  (
    {
      position = "bottom-right",
      theme = "light",
      buttonColor,
      tooltipColor,
      textColor,
      shadowColor,
      buttonSize,
      buttonRadius,
      tooltipWidth,
      spacing,
      icon,
      src,
      iframeHeight,
      allow,
      sandbox,
      animation = "scale",
      onToggle,
      children,
      ...otherProps
    },
    ref
  ) => {
    const widgetRef = useRef(null);

    useEffect(() => {
      if (!widgetRef.current) return;

      const handleToggle = (e) => {
        if (onToggle) {
          onToggle(e.detail.isOpen);
        }
      };

      const element = widgetRef.current;
      element.addEventListener("bubbleToggle", handleToggle);

      return () => {
        element.removeEventListener("bubbleToggle", handleToggle);
      };
    }, [onToggle]);

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(widgetRef.current);
        } else {
          ref.current = widgetRef.current;
        }
      }
    }, [ref]);

    const getAttributes = () => {
      const attributes = {
        position,
        theme,
        animation,
        ...(buttonColor && { "button-color": buttonColor }),
        ...(tooltipColor && { "tooltip-color": tooltipColor }),
        ...(textColor && { "text-color": textColor }),
        ...(shadowColor && { "shadow-color": shadowColor }),
        ...(buttonSize && { "button-size": buttonSize }),
        ...(buttonRadius && { "button-radius": buttonRadius }),
        ...(tooltipWidth && { "tooltip-width": tooltipWidth }),
        ...(spacing && { spacing: spacing }),
        ...(icon && { icon: icon }),
        ...(src && { src: src }),
        ...(iframeHeight && { "iframe-height": iframeHeight }),
        ...(allow && { allow: allow }),
        ...(sandbox && { sandbox: sandbox }),
      };

      return attributes;
    };

    return (
      <bubble-widget ref={widgetRef} {...getAttributes()} {...otherProps}>
        {children && <div slot="content">{children}</div>}
      </bubble-widget>
    );
  }
);

BubbleWidget.displayName = "BubbleWidget";

export default BubbleWidget;
