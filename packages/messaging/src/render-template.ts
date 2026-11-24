/** Replaces {{placeholder}} tokens. Unknown tokens are left empty. */
export function renderTemplate(body: string, vars: Record<string, string | number | undefined>): string {
  return body.replace(/{{\s*(\w+)\s*}}/g, (_, key: string) => String(vars[key] ?? ''));
}
