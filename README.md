# Version Bot

This NodeJs CLI is used to manage versions and releases in multiple Git repositories.

## Setup

To use this CLI directly install NodeJs and Yarn package manager. Run these commands once.

```shell
$ yarn install
```

This command will make the `version-bot` available in your path.

```shell
$ npm link
```

To test, run the following command

```shell
$ version-bot --version
1.0.0
```

# Set Version

This CLI can set a version number, pipeline id, branch name, and date to files named `version.json`.

Example of a `version.json` file

```json
{
  "version": "BUILD_VERSION",
  "branchName": "BRANCH_NAME",
  "pipelineId": "PIPELINE_ID",
  "buildDate": "DATE"
}
```

## Usage as CLI

Below is an example command which will set a version in any `version.json` file.

```shell
$ version-bot set-version --branch main --pipeline-id 1234
```

## Usage as Docker container

This repository includes a Dockerfile for running with Docker alone. This method
does not require NodeJs. The command below will mount the current directory to the Docker container.
This currently only works with the `set-release` command.

```shell
$ docker run --mount type=bind,source="$(pwd)"/,target=/src version-bot -f set-version --branch main --pipeline-id 1234
```

# Release Branch and Tag

Create a release branch and release tag in the current repo and push it to remote.

```shell
$ version-bot create-release --version-tag 1.0.0
```

# Release History

Displays the version history between two tags

```shell
$ version-bot release-history --end-tag v1.0.0
```
