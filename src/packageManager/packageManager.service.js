import { Command } from 'commander'
import { cloneRepo, createPullRequest } from '../sourceControl/sourceControl.service.js';
import updateFiles from '../file/file.service.js';

const program = new Command();

export function updatePackage() {
  try {
    program.command('updatePackage')
      .description('Update package in bitbucket repo by creating pull request')
      .option('-n --name <name>', 'name of the package you want to update')
      .option('-v --version <version>', 'version of the package you want to update')
      .option('-r --repository <repository>', 'repository name')
      .option('-s --sourceBranch <sourceBranch>', 'name of the source branch')
      .action(async (options) => {
        const { name, version, repository, sourceBranch } = options;

        await cloneRepo(repository, sourceBranch);

        const updatedFiles = await updateFiles(repository, name, version);

        await createPullRequest(repository, sourceBranch, name, updatedFiles);
        console.log('updatedFiles', updatedFiles);
      });
      program.parse();
  } catch (err) {
    console.log('wait', err)
  }
}
