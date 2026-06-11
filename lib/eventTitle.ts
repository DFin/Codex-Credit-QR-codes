export const DEFAULT_EVENT_TITLE = "Codex Community Workshop Göppingen";

export function normalizeEventTitle(title: string) {
  return title.trim() || DEFAULT_EVENT_TITLE;
}
