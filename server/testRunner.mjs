import { exec } from 'child_process';
import { fileURLToPath } from "url";

var testResults = []

/* FYI: each item in the test results array follows the following format:
 item:  {
    testPath: (string) path to test file,
    testTitle: (string)
    numPassing: (int) num of passing cases in this test
    numFailing: (int) num of failing cases in this test
    failureMessage: failureMessage (null or string) any relevant error messages from this test
}*/

export function outputTestResults() {
    var passedTestCases = 0;
    var failedTestCases = 0;
    var passedTestSuites = 0;
    var failedTestSuites = 0;
    testResults.forEach(testResult => {
        // passing test
        if (testResult.numFailing === 0) {
            console.log("PASS" + " " + testResult.testTitle + " | " + testResult.testPath)
            passedTestSuites = passedTestSuites + 1
        }
        // failing test
        else {
            console.log("PASS" + " " + testResult.testTitle + " | " + testResult.testPath)
            console.log(testResult.failureMessage)
            failedTestSuites = failedTestSuites + 1
        }
        passedTestCases = passedTestCases + testResult.numPassing
        failedTestCases = failedTestCases + testResult.numFailing
    })
    const totalTestSuites = passedTestSuites + failedTestSuites
    const totalTestCases = passedTestCases + failedTestCases
    console.log("\n")
    console.log("Test Suites: " + passedTestSuites + " passed, " + failedTestSuites + " failed, " + totalTestSuites + " total")
    console.log("Tests: " + passedTestCases + " passed, " + failedTestCases + " failed, " + totalTestCases + " total")

}

export function addTestResults(newTestResults, output) {
    testResults.push(newTestResults)
    if (output) { outputTestResults() }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    exec('npm run test:unit', (error, stdout, stderr) => {
        console.log(stdout);
    });
    exec('npm run test:e2e', (error, stdout, stderr) => {
        console.log(stdout);
    });
}