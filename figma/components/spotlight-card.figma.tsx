/**
 * Figma Code Connect — SpotlightCard
 *
 * Links the Figma "SpotlightCard" component to its FlexUI implementation.
 */

import figma from "@figma/code-connect";

figma.connect("https://www.figma.com/design/YOUR_FILE_ID?node-id=CARD_NODE_ID", {
  props: {
    title: figma.string("Title"),
    description: figma.string("Description"),
    spotlightColor: figma.string("Spotlight Color"),
    padding: figma.enum("Padding", {
      sm: "sm",
      md: "md",
      lg: "lg",
    }),
  },
  example: ({ title, description, spotlightColor, padding }) => (
    <SpotlightCard spotlightColor={spotlightColor} className={`p-${padding === "sm" ? "4" : padding === "lg" ? "8" : "6"}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </SpotlightCard>
  ),
});

function SpotlightCard(props: {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}) {
  return null;
}
