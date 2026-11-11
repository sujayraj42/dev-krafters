/**
 * DOM & Layout Inspection Utilities
 */

require('../bootstrap');

/**
 * Checks if HTML string has valid structure and basic semantic tags
 */
function validateSemanticHtml(html) {
  const issues = [];
  // Check for button inside link
  if (/<a[^>]*>[\s\S]*?<button[\s\S]*?<\/a>/i.test(html)) {
    issues.push('Invalid HTML: <button> nested inside <a>');
  }
  // Check for unclosed headings
  if (/<h[1-6][^>]*>[^<]*$/i.test(html)) {
    issues.push('Unclosed heading tag');
  }
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Extract CSS variables defined in CSS string
 */
function parseCssVariables(cssText) {
  const vars = {};
  const varMatches = [...cssText.matchAll(/--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)];
  for (const match of varMatches) {
    vars[`--${match[1]}`] = match[2].trim();
  }
  return vars;
}

module.exports = {
  validateSemanticHtml,
  parseCssVariables,
};
