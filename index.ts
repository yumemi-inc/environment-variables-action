import { exit } from 'node:process';

import {
  debug,
  error,
  exportVariable,
  getBooleanInput,
  getInput,
  info,
  setOutput,
} from '@actions/core';
import { Octokit } from '@octokit/rest';

const getInputRequired = (name: string) =>
  getInput(name, {
    required: true,
  });

(async () => {
  const environment = getInputRequired('environment');
  const repositoryId = getInputRequired('repository_id');
  const token = getInputRequired('token');
  const doExport = getBooleanInput('export');

  const octokit = new Octokit({
    auth: token,
  });

  const env = await octokit.actions.listEnvironmentVariables({
    repository_id: parseInt(repositoryId),
    environment_name: environment,
  });

  env.data.variables.forEach((v) => {
    setOutput(v.name, v.value);
    doExport && exportVariable(v.name, v.value);
    info(`Successfully set ${v.name}=${v.value}`);
  });

  debug('Done');
})()
  .then()
  .catch((e) => {
    error(e);
    exit(1);
  });
