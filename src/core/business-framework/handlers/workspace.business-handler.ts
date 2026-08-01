/**
 * Workspace Domain Business Handler - WP-4 Stage 2
 */
import { BusinessHandler } from '../business.handler';
import { BusinessExecutionContext } from '../business.context';
import { BusinessResult } from '../business.result';
import { BusinessError } from '../business.error';
import { Workspace } from '../../../config/interfaces';

export interface WorkspaceInput {
  workspace?: Workspace;
  workspaceId?: string;
  pattern?: string;
  name?: string;
  version?: string;
}

export interface WorkspaceOutput {
  validated: boolean;
  workspaceId: string | null;
  workspaceName: string | null;
  matchPatternCount: number;
  processedAt: number;
}

export class WorkspaceBusinessHandler implements BusinessHandler<WorkspaceInput, WorkspaceOutput> {
  public readonly handlerId = 'WorkspaceBusinessHandler';
  public readonly targetTopic: string;

  constructor(targetTopic = 'workspace.changed') {
    this.targetTopic = targetTopic;
  }

  public async execute(
    context: BusinessExecutionContext<WorkspaceInput>
  ): Promise<BusinessResult<WorkspaceOutput>> {
    const startTime = Date.now();

    // Verify topic belongs to workspace.* domain
    if (!context.topic.startsWith('workspace.')) {
      return {
        success: false,
        data: null,
        executionTimeMs: Date.now() - startTime,
        error: new BusinessError(
          'INVALID_DOMAIN_TOPIC',
          `WorkspaceBusinessHandler cannot process topic: ${context.topic}`,
          false
        )
      };
    }

    const payload = context.payload || {};
    const workspace: Workspace | undefined = payload.workspace;
    const workspaceId = payload.workspaceId || workspace?.id || null;
    const workspaceName = payload.name || workspace?.name || null;
    const matchPatternCount = workspace?.matchPatterns?.length || 0;

    const output: WorkspaceOutput = {
      validated: true,
      workspaceId,
      workspaceName,
      matchPatternCount,
      processedAt: Date.now()
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[WorkspaceBusinessHandler][Executed Validation]', context.topic, output);
    }

    return {
      success: true,
      data: output,
      executionTimeMs: Date.now() - startTime,
      error: null
    };
  }
}
