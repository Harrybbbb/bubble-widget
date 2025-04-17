import { ReactNode } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "bubble-widget": BubbleWidgetAttributes;
    }
  }
}

export type WidgetPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom";

export type ButtonAnimation = "scale" | "rotate" | "bounce" | "none";

export type WidgetTheme = "light" | "dark" | string;

interface BubbleWidgetAttributes extends React.HTMLAttributes<HTMLElement> {
  position?: WidgetPosition;
  theme?: WidgetTheme;
  icon?: string;
  "button-size"?: string;
  "button-radius"?: string;
  "tooltip-width"?: string;
  spacing?: string;
  "button-color"?: string;
  "tooltip-color"?: string;
  "text-color"?: string;
  "shadow-color"?: string;
  animation?: ButtonAnimation;
  src?: string;
  "iframe-height"?: string;
  allow?: string;
  sandbox?: string;
}

export interface BubbleWidgetProps {
  position?: WidgetPosition;
  theme?: WidgetTheme;
  icon?: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
  buttonSize?: string;
  buttonRadius?: string;
  tooltipWidth?: string;
  spacing?: string;
  buttonColor?: string;
  tooltipColor?: string;
  textColor?: string;
  shadowColor?: string;
  animation?: ButtonAnimation;
  onToggle?: (event: CustomEvent) => void;
  src?: string;
  iframeHeight?: string;
  allow?: string;
  sandbox?: string;
}

export interface ThemeColors {
  button: string;
  tooltip: string;
  text: string;
  shadow: string;
}

export type PositionStyle = {
  [key in WidgetPosition]: string;
};

declare const BubbleWidgetReact: React.FC<BubbleWidgetProps>;
export default BubbleWidgetReact;
