// ==UserScript==
// @name        NetAcad-Autofill
// @namespace   https://github.com/UnlimitedLyfes
// @match       *://assessment.netacad.net/*
// @match       *://www.assessment.netacad.net/*
// @match       *://netacad.com/launch?id=*
// @match       *://www.netacad.com/launch?id=*
// @match       *://www.netacad.com/content/srwe/1.0/index.html*
// @require     https://github.com/UnlimitedLyfes/NetAcad-Autofill/raw/refs/heads/main/src/answer.js
// @require     https://github.com/UnlimitedLyfes/NetAcad-Autofill/raw/refs/heads/main/src/fetch.js
// @require     https://github.com/UnlimitedLyfes/NetAcad-Autofill/raw/refs/heads/main/src/next.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @version     1.0.0
// @author      UnlimitedLyfes
// ==/UserScript==

const URL_STORAGE_KEY = 'itexamanswers.net URL';
/** @type {Array<Answer>} */
let answerData;

window.addEventListener('keydown', async event => {
    switch (event.key) {
        case 'p':
        case 'P':
            const oldAnswersURL = GM_getValue(URL_STORAGE_KEY);
            const newAnswersURL = prompt(
                'Please input the answer url (itexamanswers.net)',
                oldAnswersURL
            );
            GM_setValue(URL_STORAGE_KEY, newAnswersURL);
            answerData = await window.fetchAnswers(newAnswersURL);
            break;

        case 'n':
        case 'N':
            const next = window.getNext();
            next.click();
            break;

        case 'a':
        case 'A':
            window.answerQuestion(answerData);
            break;
    }
});
