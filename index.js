"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const rest_1 = require("@octokit/rest");
const getInputRequired = (name) => (0, core_1.getInput)(name, {
    required: true,
});
(async () => {
    const environment = getInputRequired('environment');
    const repositoryId = getInputRequired('repository_id');
    const token = getInputRequired('token');
    const octokit = new rest_1.Octokit({
        auth: token,
    });
    const env = await octokit.actions.listEnvironmentVariables({
        repository_id: parseInt(repositoryId),
        environment_name: environment,
    });
    env.data.variables.forEach((v) => {
        (0, core_1.setOutput)(v.name, v.value);
        (0, core_1.info)(`Successfully set ${v.name}=${v.value}`);
    });
    (0, core_1.debug)('Done');
})()
    .then()
    .catch(core_1.error);
