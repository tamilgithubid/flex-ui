const REGISTRY_URL = "https://flex-ui-wine.vercel.app/r";

export function formatComponent(component, registry) {
  return {
    name: component.name,
    label: component.label,
    tier: component.tier,
    tierLabel: registry.tiers[String(component.tier)],
    category: component.category,
    tags: component.tags,
    description: component.description,
    dependencies: component.dependencies,
    sourcePath: "components/flexui/" + component.name + ".tsx",
    docsPath: "/docs/components/" + component.name,
    installCommand: 'npx shadcn@latest add "' + REGISTRY_URL + "/" + encodeURIComponent(component.name) + '.json"',
  };
}
