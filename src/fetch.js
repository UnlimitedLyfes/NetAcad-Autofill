const QUESTION_REGEX = /^[0-9]+\. (.*)$/;

/**
 * Fetches answers from the specified URL.
 * @param {string} [answerURL=""] - The URL to fetch answers from.
 * @returns {Promise<Array<Answer>>} A Promise that resolves with the fetched answers.
 */
function fetchAnswers(answerURL = '') {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: answerURL,
            headers: {
                'Content-Type': 'text/html'
            },
            onload: function (response) {
                parseAnswers(response, resolve);
            },
            onerror: function (error) {
                reject(error);
            }
        });
    });
}

/**
 *
 * @param {GMXMLHttpRequestResponse} response
 * @param {(value: Answer[] | PromiseLike<Answer[]>) => void} resolve
 */
function parseAnswers(response, resolve) {
    let results = [];
    const allAnswersElement = getAllAnswersElement(response);

    let index = -1;
    for (let child of Array.from(allAnswersElement.children)) {
        index++;
        const result = parseAnswerElement(index, child, allAnswersElement);
        if (result != undefined) {
            results.push(result);
        }
    }
    results = removeDuplicates(results);
    resolve(results);
}

/**
 * @param {Array} results
 */
function removeDuplicates(results) {
    const seen = new Set();
    return results.filter(v => {
        if (seen.has(v.question)) {
            return false;
        } else {
            seen.add(v.question);
            return true;
        }
    });
}

/**
 * @param {GMXMLHttpRequestResponse} response
 * @returns {Element}
 */
function getAllAnswersElement(response) {
    const parser = new DOMParser();
    const virtualDOM = parser.parseFromString(
        response.responseText,
        'text/html'
    );

    let answersElement = virtualDOM.querySelector('.pf-content');
    if (!answersElement) {
        answersElement = virtualDOM.querySelector('.thecontent');
    }
    return answersElement;
}

/**
 * @param {number} index
 * @param {Element} allAnswersElement
 * @param {Element} element
 * @returns {Answer}
 */
function parseAnswerElement(index, element, allAnswersElement) {
    // Check for Possible Tags
    if (
        !(element.tagName === 'P' || element.tagName === 'STRONG') ||
        !element.innerHTML
    ) {
        return;
    }

    // Get Question Element
    /** @type {Element} */
    let questionElement = element.querySelector('strong');
    if (questionElement === null) {
        if (!element.textContent) {
            return;
        }
        questionElement = element;
    }

    // Get Question
    const questionText = parseQuestion(questionElement);
    if (questionText === null) {
        return;
    }

    // Get Awsners
    const answersElement = getAnswersElement(index, allAnswersElement);
    if (answersElement === null || answersElement.tagName !== 'UL') return;

    return {
        question: questionText,
        answers: getAnswers(answersElement)
    };
}

/**
 * @param {Element} questionElement
 * @returns {String}
 */
function parseQuestion(questionElement) {
    const textContent = questionElement.textContent.trim();
    const matches = textContent.match(QUESTION_REGEX);
    return matches !== null ? matches[1] : null;
}

/**
 * @param {number} index
 * @param {Element} allAnswersElement
 * @returns {Element}
 */
function getAnswersElement(index, allAnswersElement) {
    let answersElement = allAnswersElement.children[index + 1];
    if (answersElement.tagName === 'P' || answersElement.tagName === 'DIV') {
        answersElement = allAnswersElement.children[index + 2];
    }
    return answersElement;
}

/**
 * @param {Element} answersElement
 * @returns {Array<string>}
 */
function getAnswers(answersElement) {
    const answers = [];
    for (let answerDom of Array.from(
        answersElement.querySelectorAll('strong')
    )) {
        let answerText = answerDom.textContent.trim();
        if (answerText.endsWith('*')) {
            answerText = answerText.substring(0, answerText.length - 1);
        }
        answers.push(answerText);
    }

    return answers;
}

window.fetchAnswers = fetchAnswers;
