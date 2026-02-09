import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface AltBio {
  name: string;
  paragraphs: string[];
}

export function getAltBios(): AltBio[] {
  const filePath = path.join(process.cwd(), 'data', 'alts.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // Split on `---` frontmatter-style delimiters
  // gray-matter handles the first block; we need to handle multiple documents
  const documents: AltBio[] = [];
  const sections = fileContents.split(/^---$/m);

  // Sections come in pairs: empty/before first ---, frontmatter, content, frontmatter, content, ...
  // After splitting on ---, we get: ['', frontmatter1, content1, frontmatter2, content2, ...]
  for (let i = 1; i < sections.length; i += 2) {
    const frontmatterRaw = sections[i];
    const contentRaw = sections[i + 1] || '';

    // Parse the name from frontmatter
    const nameMatch = frontmatterRaw.match(/name:\s*(.+)/);
    const name = nameMatch ? nameMatch[1].trim() : 'unknown';

    // Split content into paragraphs (non-empty lines separated by blank lines)
    const paragraphs = contentRaw
      .trim()
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length > 0) {
      documents.push({ name, paragraphs });
    }
  }

  return documents;
}
