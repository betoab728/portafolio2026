import { marked } from "marked";

export function renderPostContent(content: string): string {
  return marked.parse(content) as string;
}
