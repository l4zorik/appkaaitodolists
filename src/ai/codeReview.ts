export interface CodeIssue {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

export interface CodeAnalysis {
  issues: CodeIssue[];
  score: number;
  summary: string;
}

const SECURITY_RULES = [
  { pattern: /eval\s*\(/, message: 'Use of eval() is dangerous', severity: 'error' as const, rule: 'no-eval' },
  { pattern: /document\.write\s*\(/, message: 'document.write can cause XSS', severity: 'error' as const, rule: 'no-document-write' },
  { pattern: /innerHTML\s*=/, message: 'innerHTML can cause XSS', severity: 'warning' as const, rule: 'no-inner-html' },
  { pattern: /localStorage\.setItem/, message: 'Sensitive data in localStorage', severity: 'warning' as const, rule: 'no-local-storage' },
  { pattern: /fetch\s*\([^)]*password/i, message: 'Password in URL', severity: 'error' as const, rule: 'no-password-url' },
  { pattern: /console\.log\s*\(/, message: 'Console.log in production', severity: 'info' as const, rule: 'no-console' },
  { pattern: /debugger\s*;/, message: 'Debugger statement found', severity: 'info' as const, rule: 'no-debugger' },
  { pattern: /alert\s*\(/, message: 'Alert used', severity: 'info' as const, rule: 'no-alert' },
  { pattern: /var\s+/, message: 'Use let/const instead of var', severity: 'warning' as const, rule: 'no-var' },
  { pattern: /==\s*[^=]/, message: 'Use === instead of ==', severity: 'warning' as const, rule: 'eqeqeq' },
];

export function analyzeCode(code: string): CodeAnalysis {
  const lines = code.split('\n');
  const issues: CodeIssue[] = [];

  lines.forEach((line, index) => {
    for (const rule of SECURITY_RULES) {
      if (rule.pattern.test(line)) {
        issues.push({
          line: index + 1,
          severity: rule.severity,
          message: rule.message,
          rule: rule.rule,
        });
      }
    }
  });

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  const score = Math.max(0, 100 - errorCount * 20 - warningCount * 5 - infoCount * 2);

  let summary = '';
  if (score >= 90) summary = 'Excellent code quality';
  else if (score >= 70) summary = 'Good code quality';
  else if (score >= 50) summary = 'Needs improvement';
  else summary = 'Critical issues found';

  return { issues, score, summary };
}