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
