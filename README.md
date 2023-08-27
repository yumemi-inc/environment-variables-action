# Environment Variables Action

> **Warning**  
> This is not an official product of YUMEMI Inc.

Fetch environment variables without creating deployments.


## Why?

We can adopt [Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
in cases of deployments using GitHub Actions. However, we sometimes need to use environment variables **before** the
deployment. Let's say you are applying Terraform stack via Actions. You don't need approval for the deployment in planning,
but running plan usually requires environment variables.

Using this action, you can use the environment variables from the workflow runs that is not attached to any environments.
Thus you can defer approval after planning, before applying your stack.


## Getting Started

### Prerequisites

- GitHub PAT (Supports fine-graded tokens)
  - As you know we usually can `${{ github.token }}` instead, but in this case we can not use it since the token does
    not support `environments:read` scope.

```yaml
name: Terraform

on:
  push:
    branches:
      - main

jobs:
  plan:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3

      - id: env
        uses: yumemi-inc/environment-variables-action@v1
        with:
          environment: staging
          token: '${{ secrets.FETCH_ENVIRONMENTS_TOKEN }}'

      - run: terraform plan
        env:
          AWS_PROFILE: '${{ steps.env.outputs.AWS_PROFILE }}'
```
