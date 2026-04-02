/**
 * Figma Code Connect — ShimmerButton
 *
 * Links the Figma "ShimmerButton" component to its FlexUI implementation.
 * When a designer selects this component in Figma, they see the React code.
 */

import figma from "@figma/code-connect";

figma.connect("https://www.figma.com/design/YOUR_FILE_ID?node-id=BUTTON_NODE_ID", {
  props: {
    label: figma.string("Label"),
    variant: figma.enum("Variant", {
      primary: "primary",
      secondary: "secondary",
      ghost: "ghost",
    }),
    size: figma.enum("Size", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
    disabled: figma.boolean("Disabled"),
  },
  example: ({ label, variant, size, disabled }) => (
    <ShimmerButton variant={variant} size={size} disabled={disabled}>
      {label}
    </ShimmerButton>
  ),
});

// Type reference — not executed, only used by Figma Code Connect
function ShimmerButton(props: {
  children: React.ReactNode;
  variant?: string;
  size?: string;
  disabled?: boolean;
}) {
  return null;
}
