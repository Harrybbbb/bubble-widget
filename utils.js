/**
 * Utility functions for BubbleWidget wrappers
 */

/**
 * Converts camelCase props to kebab-case attributes
 * @param {Object} props - The props object with camelCase keys
 * @return {Object} Attributes object with kebab-case keys
 */
export function convertPropsToAttributes(props) {
  const result = {};

  const directProps = [
    "position",
    "theme",
    "animation",
    "spacing",
    "icon",
    "src",
    "allow",
    "sandbox",
  ];
  directProps.forEach((prop) => {
    if (props[prop] !== undefined) {
      result[prop] = props[prop];
    }
  });

  const kebabCaseMap = {
    buttonColor: "button-color",
    tooltipColor: "tooltip-color",
    textColor: "text-color",
    shadowColor: "shadow-color",
    buttonSize: "button-size",
    buttonRadius: "button-radius",
    tooltipWidth: "tooltip-width",
    iframeHeight: "iframe-height",
  };

  Object.entries(kebabCaseMap).forEach(([camelProp, kebabProp]) => {
    if (props[camelProp] !== undefined) {
      result[kebabProp] = props[camelProp];
    }
  });

  return result;
}

/**
 * Handles the toggle event from the widget
 * @param {Event} event - The original event
 * @param {Function} callback - The callback to call with the isOpen state
 */
export function handleToggleEvent(event, callback) {
  if (callback && typeof callback === "function") {
    callback(event.detail.isOpen);
  }
}

/**
 * Default theme properties based on theme type
 * @param {string} theme - The theme name ('light' or 'dark')
 * @return {Object} Theme properties
 */
export function getDefaultThemeProps(theme = "light") {
  return {
    buttonColor: theme === "dark" ? "#333" : "#fff",
    tooltipColor: theme === "dark" ? "#444" : "#fff",
    textColor: theme === "dark" ? "#fff" : "#000",
    shadowColor: theme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)",
  };
}
