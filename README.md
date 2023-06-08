To create an API plugin script that you can use across multiple projects, we'll use Node.js and a package called `octokit/rest.js`, which is a client library for the GitHub API.

First, you'll need to install the `@octokit/rest` package with npm by running `npm install @octokit/rest`.

The following script creates a branch called `gh-api-plugin` in a given repository and sets up permissions to modify the repository:

```javascript
const { Octokit } = require("@octokit/rest");
const base64 = require('js-base64').Base64;

async function createBranchAndSetup(repoOwner, repoName, token) {
  const octokit = new Octokit({ auth: token });

  try {
    // Get the default branch (usually "main" or "master")
    const { data: repo } = await octokit.rest.repos.get({
      owner: repoOwner,
      repo: repoName,
    });
    const defaultBranch = repo.default_branch;

    // Get the commit SHA of the latest commit to the default branch
    const { data: ref } = await octokit.rest.git.getRef({
      owner: repoOwner,
      repo: repoName,
      ref: `heads/${defaultBranch}`,
    });
    const sha = ref.object.sha;

    // Create a new branch from the latest commit
    await octokit.rest.git.createRef({
      owner: repoOwner,
      repo: repoName,
      ref: `refs/heads/gh-api-plugin`,
      sha: sha,
    });

    console.log('Branch created successfully');
  } catch (error) {
    console.error('An error occurred', error);
  }
}

// Use the function
createBranchAndSetup('your-username', 'your-repo', 'your-token');
```

In this script, replace `'your-username'`, `'your-repo'`, and `'your-token'` with your GitHub username, your repository name, and your GitHub Personal Access Token, respectively.

Please note that you should keep your GitHub Personal Access Token secret, as it gives full access to your GitHub account. If you want to modify the repository (create/update/delete files), you would do it on the newly created `gh-api-plugin` branch and then you can create a pull request to merge changes into the default branch.

This script only covers creating a branch. The GitHub API offers much more functionality, and you can modify this script to suit your needs. For more information on how to use the GitHub API with Octokit, please refer to the [Octokit documentation](https://octokit.github.io/rest.js/v18).