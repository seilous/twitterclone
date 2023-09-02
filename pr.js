const axios = require('axios');

// Replace 'YOUR_PERSONAL_ACCESS_TOKEN' with your GitHub personal access token
const token = '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';

// Specify the repository details
const owner = 'seilous'; // GitHub username (not case-sensitive)
const repo = 'twitterclone'; // Repository name (case-sensitive)

// Define the branch name and base branch
const branchName = 'pr/newfeature';
const baseBranch = 'master'; // Change this to the target branch

// Define the pull request title and body
const pullRequestTitle = 'Pull Request Title';
const pullRequestBody = 'Description of the pull request';

// Define the file path and content
const filePath = 'mod.js'; // Change this to the path of your file
const fileContent = 'Hello, World!'; // Change this to your content

// Function to create a pull request
async function createPullRequest() {
  try {
    // Step 1: Create a new branch
    await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: await getBranchSha(owner, repo, baseBranch),
    }, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    // Step 2: Create a commit with the new file
    const fileResponse = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      message: 'Add a new file',
      content: Buffer.from(fileContent).toString('base64'),
      branch: branchName,
    }, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    // Step 3: Create a pull request
    const pullRequestResponse = await axios.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      title: pullRequestTitle,
      body: pullRequestBody,
      head: branchName,
      base: baseBranch,
    }, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    console.log(`Pull request created: ${pullRequestResponse.data.html_url}`);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Error Response:', error.response.data);
    }
  }
}

// Function to get the SHA of a branch
async function getBranchSha(owner, repo, branch) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.data.object.sha;
}

// Create the pull request
createPullRequest();

