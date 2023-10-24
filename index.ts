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
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import fetch from 'node-fetch';

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
    request: {
      fetch,
    },
  });

  let page = 1;
  let env: RestEndpointMethodTypes['actions']['listEnvironmentVariables']['response'];
  do {
    env = await octokit.actions.listEnvironmentVariables({
      repository_id: parseInt(repositoryId),
      environment_name: environment,
      page: page++,
      per_page: 100,
    });

    for (const v of env.data.variables) {
      setOutput(v.name, v.value);
      doExport && exportVariable(v.name, v.value);
      info(`Successfully set ${v.name}=${v.value}`);
    }
  } while (env.data.total_count > env.data.variables.length);

  debug('Done');
})()
  .then()
  .catch((e) => {
    error(e);
    exit(1);
  });
