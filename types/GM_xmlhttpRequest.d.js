/**
 * @param {Object} request
 * @param {string} request.method
 * @param {string} request.url
 * @param {Object<string, string>} [request.headers]
 * @param {function(GMXMLHttpRequestResponse):void} [request.onload]
 * @param {Function} [request.onerror]
 * @returns {void}
 */
function GM_xmlhttpRequest(request) {}

/**
 * Response object for the HTTP request.
 * @typedef {Object} GMXMLHttpRequestResponse
 * @property {string} responseText - The response body as text.
 */
