import { Workspace, MatchPattern } from './interfaces';
import { WorkspaceRegistry } from './workspace.registry';
import { matchWildcardPattern } from '../utils/url';
import { Logger } from '../services/logger';

const MODULE = 'WorkspaceResolver';

export interface ResolutionResult {
  workspace: Workspace;
  matchedPattern: MatchPattern;
}

export class WorkspaceResolver {
  /**
   * Resolves a URL to an Active Workspace & Matched Pattern
   * Evaluates all enabled Workspaces & enabled matchPatterns sorted by priority
   */
  public static async resolveUrl(url: string): Promise<ResolutionResult | null> {
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return null;
    }

    try {
      const allWorkspaces = await WorkspaceRegistry.getAll();
      const enabledWorkspaces = allWorkspaces.filter((w) => w.enabled);

      const matches: ResolutionResult[] = [];

      for (const workspace of enabledWorkspaces) {
        const enabledPatterns = workspace.matchPatterns.filter((mp) => mp.enabled);

        for (const patternObj of enabledPatterns) {
          if (matchWildcardPattern(patternObj.pattern, url)) {
            matches.push({
              workspace,
              matchedPattern: patternObj
            });
          }
        }
      }

      if (matches.length === 0) {
        Logger.debug(MODULE, `No matching workspace found for URL: [${url}]`);
        return null;
      }

      // Sort by pattern priority descending (highest priority number first)
      matches.sort((a, b) => b.matchedPattern.priority - a.matchedPattern.priority);

      const winner = matches[0];
      Logger.info(
        MODULE,
        `Resolved URL [${url}] -> Workspace: [${winner.workspace.application} - ${winner.workspace.name}] (Pattern: ${winner.matchedPattern.pattern}, Priority: ${winner.matchedPattern.priority})`
      );

      return winner;
    } catch (err) {
      Logger.error(MODULE, 'Error resolving workspace for URL', err);
      return null;
    }
  }
}
