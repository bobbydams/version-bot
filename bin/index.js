#!/usr/bin/env node

const { program } = require('commander');
const shell = require('shelljs')
const chalk = require('chalk')

program.version("1.0.0")

program
  .command("set-version")
  .description("Recursively set the version in formation in version.json")
  .option('-d, --directory <directory>', 'specify a specific directory')
  .option('-b, --branch <branch>', 'branch name')
  .option('-p, --pipeline-id <id>', 'pipeline id')
  .option('-d, --dry-run', 'dry run')
  .action(function (options, command) {
    setVersion(options)
  })

program
  .command("create-release")
  .description("Create a release branch in the current repo")
  .requiredOption('-v, --version-tag <version number>', 'the version number')
  .option('-d, --dry-run', 'dry run')
  .action(function (options, command) {
    createRelease(options)
  })

  program
  .command("release-history")
  .description("See the commits between two release tags")
  .option('-b, --begin-tag <tag>', 'the beginning version tag, defaults to HEAD')
  .requiredOption('-e, --end-tag <tag>', 'the end version tag')
  .action(function (options, command) {
    releaseHistory(options)
  })

program.parse(process.argv);


function releaseHistory(options) {
  beginTag = options.beginTag ? options.beginTag : "HEAD"
  if (shell.exec(`git log --abbrev-commit --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' ${beginTag}...${options.endTag}`).code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
  }
}


function createRelease(options) {
  const version = options.versionTag;

  if (options.dryRun) {
    console.log(chalk.black.bgBlue.bold(`Dry Run: release/${version}`));
  } else {
    console.log(chalk.black.bgGreen.bold(`Creating release branch: release/${version}`));
    if (shell.exec(`git checkout -b release/${version}`).code !== 0) {
      shell.echo('Error: Git commit failed');
      shell.exit(1);
    }
    if (shell.exec(`git commit --allow-empty -am "Version v${version}"`).code !== 0) {
      shell.echo('Error: Git commit failed');
      shell.exit(1);
    }
    console.log(chalk.black.bgGreen.bold(`Creating Tag: v${version}`));
    if (shell.exec(`git tag -a v${version} -m "Verson v${version}"`).code !== 0) {
      shell.echo('Error: Git commit failed');
      shell.exit(1);
    }
    if (shell.exec(`git push --tags --set-upstream origin release/${version}`).code !== 0) {
      shell.echo('Error: Git commit failed');
      shell.exit(1);
    }
    console.log(chalk.black.bgGreen.bold(`Finished creating v${version}!!! :tada:`));
  }
}


function setVersion(options) {
  let branch = options.branch ? options.branch.trim() : "";
  branch = process.env.PLUGIN_BRANCH ? process.env.PLUGIN_BRANCH : "unknown"

  let pipelineId = options.pipelineId ? options.pipelineId.trim() : "";
  pipelineId = process.env.PLUGIN_PIPELINE_ID ? process.env.PLUGIN_PIPELINE_ID : "unknown"

  let directory = options.directory ? options.directory.trim() : "";
  directory = process.env.DIRECTORY ? process.env.DIRECTORY : ""

  const date = new Date().toISOString();

  if (directory) {
    shell.cd(directory);
  }

  shell.exec("git describe --tags --dirty", function(code, stdout, stderr) {
    const commit_tag = stdout.trim();
  
    if (options.dryRun) {
      console.log(chalk.black.bgBlue.bold(`Dry Run: Commit: ${commit_tag} Branch: ${branch} Pipeline: ${pipelineId} Date: ${date}`));
    } else {
      shell.ls(`${directory}**/version.json`).forEach(function (file) {
        console.log(chalk.black.bgGreen.bold(`Updating Version File ${file} with Commit: ${commit_tag} Branch: ${branch} Pipeline: ${pipelineId} Date: ${date}`));
        shell.sed('-i', 'BUILD_VERSION', commit_tag, file);
        shell.sed('-i', 'BRANCH_NAME', branch, file);
        shell.sed('-i', 'PIPELINE_ID', pipelineId, file);
        shell.sed('-i', 'DATE', date, file);
      });
      
    }
  });
}