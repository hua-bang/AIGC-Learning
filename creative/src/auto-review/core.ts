import * as dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import ChatBot from './bot';
import { log } from './helper';

dotenv.config();

const autoReviewBot = new ChatBot();


const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || 'Your Github Token',  // Replace with your GitHub Personal Access Token
});

async function createReviewComment(reviewCommentParams: Parameters<typeof octokit.pulls.createReviewComment>[0]) {
  return await octokit.pulls.createReviewComment(reviewCommentParams);
}

async function generateReviewComment(changedFiles: any, commits: any, pullNumber: number) {
  changedFiles.forEach(async changedFile => {
    const { patch } = changedFile;

    if (changedFile.status !== 'modified' && changedFile.status !== 'added') {
      return;
    }

    if (!patch || patch.length > (process.env.MAX_BATCH_LENGTH || 200000)) {
      console.log(
        `${changedFile.filename} skipped caused by its diff is too large`
      );
      return;
    }

    const res = await autoReviewBot.codeReview(patch);

    if (!res) {
      return
    }

    await createReviewComment({
      repo,
      owner,
      pullNumber,
      commit_id: commits[commits.length - 1].sha,
      path: changedFile.filename,
      body: res,
      position: patch.split('\n').length - 1,
      pull_number: pullNumber,
    } as any);
  });
}

async function getPRInfo(owner: string, repo: string, pull_number: number) {
  try {
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number
    });
    return pr;
  } catch {
    return undefined;
  }
}

async function getCompareCommits(owner: string, repo: string, pr: Record<string, any>) {
  try {
    return (await octokit.repos.compareCommits({
      owner,
      repo,
      base: pr.base.sha,
      head: pr.head.sha
    })).data;
  } catch {
    return undefined;
  }
}

export async function autoCodeView(pullNumber: number) {

  // 1. get pull request info
  const pr = await getPRInfo(owner, repo, pullNumber);

  if (!pr) {
    log(`It's failed to get pr info, please retry the get pr info api.`);
    return;
  }

  // 2. get compareCommits
  const compareCommits = await getCompareCommits(owner, repo, pr);

  if (!compareCommits || compareCommits.files?.length === 0 || compareCommits.commits?.length === 0) {
    log(`No commit info.`);
    return ;
  }

  const { files: changedFiles = [], commits } = compareCommits;

  // 3. generate review comment
  generateReviewComment(changedFiles, commits, pullNumber);
}