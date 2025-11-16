const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const executeFetchTest = require('./fetch.test');

const ERROR_MESSAGE = chalk.red('[Error]');
const TEST_MESSAGE = chalk.blue('[Test]');
const SUCCESS_MESSAGE = chalk.green('Success:');
const FAILED_MESSAGE = chalk.red('Failed:');

(async () => {
    let fail = 0;
    const dataDirectory = path.join(__dirname, 'data');
    const directories = fs.readdirSync(dataDirectory);
    const promises = directories.map(directory => {
        const testDataDirectory = path.join(dataDirectory, directory);

        if (!fs.lstatSync(testDataDirectory).isDirectory()) {
            console.error(
                ERROR_MESSAGE,
                'Test data directory is not a directory:',
                testDataDirectory
            );
            return Promise.resolve();
        }

        const testJSONFilePath = path.join(testDataDirectory, 'test.json');
        if (!fs.existsSync(testJSONFilePath)) {
            console.error(
                ERROR_MESSAGE,
                'Test config file missing:',
                testJSONFilePath
            );
            return Promise.resolve();
        }

        const data = fs.readFileSync(testJSONFilePath, 'utf8');
        try {
            const jsonData = JSON.parse(data);
            const testData = fs.readFileSync(
                path.join(testDataDirectory, jsonData.file),
                'utf8'
            );

            return executeFetchTest(testData, jsonData.expected)
                .then(() => {
                    console.log(TEST_MESSAGE, SUCCESS_MESSAGE, jsonData.name);
                })
                .catch(error => {
                    fail++;
                    console.error(
                        TEST_MESSAGE,
                        FAILED_MESSAGE,
                        jsonData.name,
                        error
                    );
                });
        } catch (parseErr) {
            console.error(ERROR_MESSAGE, 'Parsing test config file:', parseErr);
            return Promise.resolve();
        }
    });

    await Promise.all(promises);

    if (fail > 0) {
        process.exitCode = 1;
        console.error(`${ERROR_MESSAGE} Failed Tests: ${fail}`);
    }
})();
