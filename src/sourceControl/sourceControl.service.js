import simpleGit from "simple-git";
import fs from 'fs';
import axios from 'axios';

const getLocalRepoDirectory = (repositoryName) => {
  return `${process.env.TEMP_REPO_DIR}/${repositoryName}`
}

const add = async (repositoryName, updateFilesLocation) => {
  await simpleGit(getLocalRepoDirectory(repositoryName)).add(updateFilesLocation);
}

const commit = async (repositoryName, message) => {
  const repoDir = getLocalRepoDirectory(repositoryName);
  await simpleGit(repoDir).commit(message);
};

const push = async (repositoryName, branch) => {
  await simpleGit(getLocalRepoDirectory(repositoryName)).push('origin', branch);
};

const cloneRepo = async (repositoryName='redocly-trial', branch='default-branch') => {
  const repoRemotePath = `https://${process.env.USER_NAME}:${process.env.PASSWORD}@bitbucket.org/${process.env.REPO_WORKSPACE}/${repositoryName}.git`;
  const repoDir = getLocalRepoDirectory(repositoryName);

  if (fs.existsSync(repoDir)) {
    await fs.rmSync(repoDir, { recursive: true, force: true });
  }

  await simpleGit().clone(repoRemotePath, repoDir);
  await simpleGit(repoDir).checkoutLocalBranch(branch);
};

const createPR = async (repositoryName, sourceBranch, destinationBranch) => {
  const workspace = process.env.REPO_WORKSPACE;
  const repoFullName = `${workspace}/${repositoryName}`;
  const url = `https://api.bitbucket.org/2.0/repositories/${process.env.REPO_WORKSPACE}/${repositoryName}/pullrequests`;
  const body = {
    title: 'npm package update',
    description: 'Update package.json',
    source: {
      branch: {
        name: sourceBranch
      },
      repository: {
        full_name: repoFullName,
      }
    },
    destination: {
      branch: {
        name: destinationBranch
      },
      repository: {
        full_name: repoFullName,
      }
    }
  };

  const response = await axios.request(url, {
    method: 'POST',
    headers: {
      Authorization: getAuthToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return await response.json();
}

const getAuthToken = () => {
  return `Basic ${Buffer.from(`${process.env.USER_NAME}:${process.env.PASSWORD}`).toString('base64')}`
}

const createPullRequest = async (repositoryName, sourceBranch, packageName, updatedFilesLocations, destinationBranch = 'master') => {
  await add(repositoryName, updatedFilesLocations);
  await commit(repositoryName, `Update package: ${packageName}`);
  await push(repositoryName, sourceBranch);
  await createPR(repositoryName, sourceBranch, destinationBranch);
}

export { cloneRepo, createPullRequest };