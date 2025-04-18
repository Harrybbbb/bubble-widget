/**
 * Handles the bubble toggle event for wrapper components
 * @param {CustomEvent} event - The bubble toggle event
 * @param {Function} callback - The callback to be called with isOpen status
 */
export const handleToggleEvent = (event, callback) => {
  if (callback && typeof callback === "function") {
    const isOpen = event.detail.isOpen;
    callback(isOpen);
  }
};

/**
 * Converts React-style camelCase props to HTML-style kebab-case attributes
 * @param {Object} props - Object containing component props
 * @returns {Object} - Object with kebab-case attributes
 */
export const convertPropsToAttributes = (props) => {
  const result = {};

  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined) return;

    // Convert camelCase to kebab-case
    const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    result[kebabKey] = value;
  });

  return result;
};
