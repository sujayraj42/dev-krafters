/**
 * Component Rendering & SSR Inspection Helper
 */

require('../bootstrap');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Render a React component or element to static HTML string.
 */
function renderComponent(ComponentOrElement, props = {}) {
  let element;
  if (React.isValidElement(ComponentOrElement)) {
    element = ComponentOrElement;
  } else if (typeof ComponentOrElement === 'function') {
    element = React.createElement(ComponentOrElement, props);
  } else {
    throw new Error('Invalid component passed to renderComponent');
  }

  return ReactDOMServer.renderToStaticMarkup(element);
}

/**
 * Basic HTML element search and attribute inspection helper
 */
function inspectHtml(html) {
  const plainText = decodeHtmlEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ');

  return {
    html,
    text: plainText,
    contains(str) {
      return html.includes(str) || plainText.includes(str);
    },
    matches(regex) {
      return regex.test(html) || regex.test(plainText);
    },
    count(pattern) {
      if (typeof pattern === 'string') {
        return (html.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      }
      return (html.match(pattern) || []).length;
    },
    extractLinks() {
      const matches = [...html.matchAll(/href=["']([^"']+)["']/g)];
      return matches.map((m) => m[1]);
    },
  };
}

module.exports = {
  renderComponent,
  inspectHtml,
  decodeHtmlEntities,
};
