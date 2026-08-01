import { Workspace, MatchPattern, ValidationResult } from './interfaces';

export class ValidationService {
  public static validateWorkspace(workspace: Partial<Workspace>): ValidationResult {
    const errors: string[] = [];

    if (!workspace.name || workspace.name.trim() === '') {
      errors.push('Workspace name is required and cannot be empty.');
    }

    if (!workspace.application || workspace.application.trim() === '') {
      errors.push('Application identity is required.');
    }

    const validEnvironments = ['development', 'staging', 'uat', 'production', 'demo', 'testing'];
    if (!workspace.environment || !validEnvironments.includes(workspace.environment)) {
      errors.push(`Environment must be one of: ${validEnvironments.join(', ')}.`);
    }

    if (!workspace.matchPatterns || workspace.matchPatterns.length === 0) {
      errors.push('At least one match pattern is required for a workspace.');
    } else {
      const patternStrings = new Set<string>();
      const priorities = new Set<number>();

      workspace.matchPatterns.forEach((mp, index) => {
        const patternErr = this.validateMatchPattern(mp);
        if (!patternErr.valid) {
          errors.push(...patternErr.errors.map((e) => `Pattern #${index + 1}: ${e}`));
        }

        if (patternStrings.has(mp.pattern.toLowerCase())) {
          errors.push(`Duplicate match pattern found in workspace: "${mp.pattern}".`);
        }
        patternStrings.add(mp.pattern.toLowerCase());

        if (priorities.has(mp.priority)) {
          // Warning or soft check for duplicate priorities
        }
        priorities.add(mp.priority);
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  public static validateMatchPattern(mp: Partial<MatchPattern>): ValidationResult {
    const errors: string[] = [];

    if (!mp.pattern || mp.pattern.trim() === '') {
      errors.push('Match pattern string cannot be empty.');
    } else if (!mp.pattern.includes('*') && !mp.pattern.startsWith('http://') && !mp.pattern.startsWith('https://')) {
      errors.push('Match pattern must be a valid URL pattern starting with http://, https://, or wildcard.');
    }

    if (typeof mp.priority !== 'number' || isNaN(mp.priority)) {
      errors.push('Priority must be a valid integer number.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
