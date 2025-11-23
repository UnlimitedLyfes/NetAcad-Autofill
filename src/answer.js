/**
 *
 * @param {Array<Answer>} answerData
 * @returns
 */
function answerQuestion(answerData) {
    const beforeShadow = [
        'app-root',
        'page-view',
        'article-view[adaptive="true"]',
        'block-view[tabindex="0"]',
        'mcq-view'
    ];
    const shadow = beforeShadow.reduce((a, v) => {
        return a.querySelector(v).shadowRoot;
    }, document);
    const question = shadow.querySelector('base-view').shadowRoot;
    const questionTextDom = question.querySelector('p').parentElement;
    const questionText = questionTextDom.textContent.trim();
    if (!questionText) {
        console.error('Cant find question');
        return;
    } else {
        console.log('Question: ' + questionText);
    }

    const answersDom = shadow.querySelector('div[role="list"]');
    if (!answersDom) {
        console.error('Cant find answersDom');
        return;
    }
    const answers = answersDom.children;
    for (let answer of Array.from(answers)) {
        const input = answer.querySelector('input');
        if (!input) continue;
        input.checked = false;
    }

    const correctAnswers = findAnswers(answerData, questionText, answers);
    if (correctAnswers.length === 0) {
        console.log('No available answers found');
        return;
    }

    for (const answer of correctAnswers) {
        const input = answer.querySelector('input');
        if (!input) continue;
        answer.querySelector('label').click();
        input.checked = true;
    }
}

/**
 *
 * @param {Array<Answer>} answerData
 * @param {string} questionText
 * @returns
 */
function findAnswers(answerData, questionText, answers) {
    if (answerData === null) {
        return [];
    }
    //console.log("Answers: ", answers)
    const correctAnswers = [];
    //console.log(answerData);
    for (let entry of answerData) {
        if (matchAnswer(questionText.trim(), entry.question.trim())) {
            for (let availableAnswer of answers) {
                // console.log(
                //     availableAnswer.textContent
                //         .trim()
                //         .replace(/[^\w]/gi, '')
                //         .replace(/\dof\d$/, '')
                // );
                for (let possibleAnswer of entry.answers) {
                    if (
                        matchAnswer(
                            availableAnswer.textContent.trim(),
                            possibleAnswer
                        )
                    ) {
                        correctAnswers.push(availableAnswer);
                    }
                }
            }
        }
    }
    return correctAnswers;
}

function matchAnswer(textA, textB) {
    const replaceRegex = /[^\w]/gi;
    const replaceRegex2 = /\dof\d$/;
    textA = textA.replace(replaceRegex, '');
    textB = textB.replace(replaceRegex, '');
    textA = textA.replace(replaceRegex2, '');
    textB = textB.replace(replaceRegex2, '');
    //console.log(textA, textB);
    return textA === textB;
}

window.answerQuestion = answerQuestion;
