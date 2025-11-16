const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');
const { diff } = require('deep-diff');

const scriptContent = fs.readFileSync('../src/fetch.js', 'utf8');

/**
 * @param testData {string}
 * @param expectedData {Array<Answer>}
 * @returns {Promise<Array<Answer>>}
 */
module.exports = async function executeFetchTest(testData, expectedData) {
    const sandbox = {
        window: {},
        DOMParser: new JSDOM().window.DOMParser,
        console: console
    };
    vm.createContext(sandbox);
    vm.runInContext(scriptContent, sandbox);
    const { parseAnswers } = sandbox;
    return new Promise((resolve, reject) => {
        parseAnswers({ responseText: testData }, results => {
            const { diff } = require('deep-diff');
            const changes = diff({ data: results }, { data: expectedData });
            if (changes !== undefined) {
                reject(changes);
            }
            resolve();
        });
    });
};
