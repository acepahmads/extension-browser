/**
 * Dynamic Metadata Synchronization Engine - Sprint D1.5
 * Automatically scans, parses, and indexes all Markdown documents from /docs
 * eliminating hardcoded registries.
 */

export interface DocMetadata {
  id: string;
  title: string;
  type: 'report' | 'milestone' | 'phase' | 'adr' | 'architecture' | 'roadmap' | 'version' | 'changelog' | 'context' | 'general';
  category: 'Foundation' | 'Architecture' | 'Documentation' | 'Development' | 'Platform';
  phaseGroup: string;
  sprint: string;
  milestoneId: string;
  phaseId?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED' | 'BLOCKED' | 'ACCEPTED' | 'PROPOSED' | 'VERIFIED' | 'APPROVED';
  version: string;
  createdDate: string;
  updatedDate: string;
  author: string;
  reviewer: string;
  module: string;
  summary: string;
  filePath: string;
  content: string;
  completion: number;
  deliverables: string[];
  notes: string;
}

export class MetadataEngine {
  private static instance: MetadataEngine | null = null;
  private documents: Map<string, DocMetadata> = new Map();

  private constructor() {
    this.parseAllMarkdownFiles();
  }

  public static getInstance(): MetadataEngine {
    if (!MetadataEngine.instance) {
      MetadataEngine.instance = new MetadataEngine();
    }
    return MetadataEngine.instance;
  }

  /**
   * Dynamically import all Markdown files from /docs directory using Vite glob
   */
  private parseAllMarkdownFiles(): void {
    const rawDocs = import.meta.glob('../../../docs/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

    for (const [path, content] of Object.entries(rawDocs)) {
      const doc = this.parseMarkdownMetadata(path, content);
      this.documents.set(doc.id, doc);
    }
  }

  /**
   * Parse Markdown header block / blockquote metadata
   */
  private parseMarkdownMetadata(filePath: string, content: string): DocMetadata {
    const cleanPath = filePath.replace('../../../', '');
    const filename = cleanPath.split('/').pop() || '';
    
    // Extract Title (# Heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/—/g, '-').trim() : filename.replace('.md', '');

    // Extract Blockquote Metadata Key-Values (> **Key**: Value)
    const metadataMap: Record<string, string> = {};
    const metaRegex = />\s*\*\*([^*]+)\*\*:\s*(.+)$/gm;
    let match;
    while ((match = metaRegex.exec(content)) !== null) {
      const key = match[1].trim().toLowerCase();
      const val = match[2].trim();
      metadataMap[key] = val;
    }

    // Determine Document Type
    let type: DocMetadata['type'] = 'general';
    if (cleanPath.includes('/reports/')) type = 'report';
    else if (cleanPath.includes('/adr/')) type = 'adr';
    else if (cleanPath.includes('/roadmap/')) type = 'roadmap';
    else if (cleanPath.includes('/milestones/')) {
      type = filename.startsWith('Phase-') ? 'phase' : 'milestone';
    } else if (filename === 'CHANGELOG.md') type = 'changelog';
    else if (filename === 'VERSION.md') type = 'version';
    else if (filename === 'CONTEXT.md') type = 'context';
    else if (cleanPath.includes('/architecture/')) type = 'architecture';

    // ID derivation
    let id = metadataMap['id'] || filename.replace('.md', '');
    if (type === 'phase') {
      const parentDir = cleanPath.split('/').slice(-2, -1)[0] || '';
      id = `${parentDir}-${filename.replace('.md', '')}`;
    }

    // Determine Sprint & Milestone
    const sprint = metadataMap['sprint'] || this.inferSprintFromPath(cleanPath);
    const milestoneId = metadataMap['milestone'] || this.inferMilestoneIdFromPath(cleanPath);

    // Status parsing
    const rawStatus = (metadataMap['status'] || 'COMPLETED').toUpperCase();
    let status: DocMetadata['status'] = 'COMPLETED';
    if (rawStatus.includes('IN_PROGRESS') || rawStatus.includes('IN PROGRESS')) status = 'IN_PROGRESS';
    else if (rawStatus.includes('PLANNED')) status = 'PLANNED';
    else if (rawStatus.includes('BLOCKED')) status = 'BLOCKED';
    else if (rawStatus.includes('ACCEPTED')) status = 'ACCEPTED';
    else if (rawStatus.includes('VERIFIED')) status = 'VERIFIED';
    else if (rawStatus.includes('APPROVED')) status = 'APPROVED';

    // Summary extraction
    let summary = metadataMap['summary'] || '';
    if (!summary) {
      const summaryMatch = content.match(/##\s*1\.\s*(?:Sprint|Phase|Executive)?\s*Summary\s*\n+([\s\S]*?)(?=\n##|$)/i);
      if (summaryMatch) {
        summary = summaryMatch[1].replace(/^[#>\-\s*]+/gm, '').trim().slice(0, 200) + '...';
      } else {
        summary = `Documentation record for ${title}`;
      }
    }

    // Category derivation
    const category = this.inferCategory(sprint, cleanPath);
    const phaseGroup = this.inferPhaseGroup(category);

    // Completion percentage calculation
    let completion = 100;
    if (status === 'IN_PROGRESS') completion = 66;
    else if (status === 'PLANNED') completion = 0;

    return {
      id,
      title,
      type,
      category,
      phaseGroup,
      sprint,
      milestoneId,
      phaseId: type === 'phase' ? filename.replace('.md', '') : undefined,
      status,
      version: metadataMap['version'] || '1.0.0',
      createdDate: metadataMap['created'] || '2026-07-31',
      updatedDate: metadataMap['last updated'] || '2026-07-31',
      author: metadataMap['author'] || 'Lead Software Architect',
      reviewer: metadataMap['reviewer'] || 'Enterprise Architecture Board',
      module: metadataMap['location'] || cleanPath,
      summary,
      filePath: cleanPath,
      content,
      completion,
      deliverables: this.extractDeliverables(content),
      notes: metadataMap['notes'] || `${status} document record`
    };
  }

  private inferSprintFromPath(path: string): string {
    if (path.includes('Sprint3B') || path.includes('Sprint-3B')) return 'Sprint 3B';
    if (path.includes('Sprint2.1')) return 'Sprint 2.1';
    if (path.includes('SprintD0.1')) return 'Sprint D0.1';
    if (path.includes('SprintD1.4')) return 'Sprint D1.4';
    if (path.includes('SprintD1.5')) return 'Sprint D1.5';
    return 'Sprint Execution';
  }

  private inferMilestoneIdFromPath(path: string): string {
    const match = path.match(/(M\d{2})/);
    return match ? match[1] : 'M05';
  }

  private inferCategory(sprint: string, path: string): DocMetadata['category'] {
    if (path.includes('/architecture/') || sprint.includes('3A')) return 'Architecture';
    if (path.includes('/reports/') || sprint.includes('D0') || sprint.includes('D1')) return 'Documentation';
    if (sprint.includes('3B') || sprint.includes('4') || sprint.includes('5')) return 'Development';
    return 'Foundation';
  }

  private inferPhaseGroup(category: DocMetadata['category']): string {
    if (category === 'Foundation') return 'Phase 1: Foundation';
    if (category === 'Architecture') return 'Phase 2: Architecture';
    if (category === 'Documentation') return 'Phase 3: Documentation';
    if (category === 'Development') return 'Phase 4: Development';
    return 'Phase 5: Platform';
  }

  private extractDeliverables(content: string): string[] {
    const list: string[] = [];
    const delivMatch = content.match(/##\s*(?:\d\.\s*)?Deliverables[\s\S]*?\n\n/i);
    if (delivMatch) {
      const items = delivMatch[0].match(/^[*\-]\s+(.+)$/gm);
      if (items) {
        items.forEach(i => list.push(i.replace(/^[*\-]\s+/, '').trim()));
      }
    }
    return list.length > 0 ? list : ['Metadata Engine Indexing', 'Dynamic Portal Sync'];
  }

  /**
   * Public getters for reactive collections
   */
  public getAllDocuments(): DocMetadata[] {
    return Array.from(this.documents.values());
  }

  public getDocumentsByType(type: DocMetadata['type']): DocMetadata[] {
    return this.getAllDocuments().filter(d => d.type === type);
  }
}
