import path from "path"

export default class TestReporter {
    constructor(globalConfig, reporterOptions, reporterContext) {
        this._globalConfig = globalConfig;
        this._options = reporterOptions;
        this._context = reporterContext;
    }

    // must return the following for each test: num passing cases, num failing cases, failureMessage

    async onRunComplete(contexts, results) {
        const { addTestResults } = await import('./testRunner.mjs');
        
        results.testResults.forEach((testResult, testIndex) => {
            const rootDir = "server"
            const pathSegment = testResult.testFilePath.split(path.sep)
            const targetIndex = pathSegment.lastIndexOf(rootDir)

            // values to return to test runner script
            const testPath = pathSegment.slice(targetIndex, pathSegment.length).join(path.sep)
            const testTitle = testResult.testResults[0].ancestorTitles[0]
            const numPassing = testResult.numPassingTests
            const numFailing = testResult.numFailingTests
            const failureMessage = testResult.failureMessage

            const resultsSummary = {
                testPath: testPath,
                testTitle: testTitle,
                numPassing: numPassing,
                numFailing: numFailing,
                failureMessage: failureMessage
            }

            
            if (testIndex === results.testResults.length - 1 && testPath.startsWith("server/e2e")){
                addTestResults(resultsSummary, true) // true meaning all results should be printed after this one is sent
            } else {
                addTestResults(resultsSummary, false) // false meaning more test results will be sent, thus already sent ones shouldnt be printed
            }
        });

    }
}