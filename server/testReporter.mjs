export default class TestReporter {
    constructor(globalConfig, reporterOptions, reporterContext) {
        this._globalConfig = globalConfig;
        this._options = reporterOptions;
        this._context = reporterContext;
    }

    onRunComplete(contexts, results) {
        // Combine results
        console.log("Tests ran")
    }
}