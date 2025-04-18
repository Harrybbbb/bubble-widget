import React, { useRef, useEffect, forwardRef } from "react";
import "./bubble-widget.js";
import { convertPropsToAttributes, handleToggleEvent } from "./utils.js";

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
        handleToggleEvent(e, onToggle);
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
      return convertPropsToAttributes({
        position,
        theme,
        animation,
        spacing,
        icon,
        src,
        allow,
        sandbox,
        buttonColor,
        tooltipColor,
        textColor,
        shadowColor,
        buttonSize,
        buttonRadius,
        tooltipWidth,
        iframeHeight,
      });
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
