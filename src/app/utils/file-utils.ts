export function parseJsonFileContent(content: string): any | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}