export interface RegistryComponent {
  name: string;
  title: string;
  description: string;
}

/** Read the same index.json contract used by the CLI and registry builder. */
export function searchRegistry(data: unknown, query: string): RegistryComponent[] {
  if (!data || typeof data !== "object" || !("items" in data) || !Array.isArray(data.items)) {
    throw new Error("Invalid component registry index");
  }
  const normalized = query.trim().toLowerCase();
  return data.items.flatMap((item: unknown) => {
    if (!item || typeof item !== "object" || !("type" in item) || item.type !== "registry:ui" ||
        !("name" in item) || typeof item.name !== "string" ||
        !("description" in item) || typeof item.description !== "string") return [];
    const title = "title" in item && typeof item.title === "string"
      ? item.title
      : item.name.replace(/(^|[-:])(\w)/g, (_match, separator: string, character: string) => `${separator ? " " : ""}${character.toUpperCase()}`);
    const component = { name: item.name, title, description: item.description };
    return `${component.name} ${title} ${component.description}`.toLowerCase().includes(normalized) ? [component] : [];
  });
}
