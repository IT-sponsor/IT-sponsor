import prisma from "./client"; // is it the right one?
import { getRepo, getRepoContributors } from "../github/api";

// Store repo info
export async function updateRepoInfo(username: string, repo: string) {
  const { created_at, updated_at, stargazers_count } = await getRepo(username, repo);
  await prisma.project.update({
    where: { repository: `github.com/${username}/${repo}` }, // fix db schema?
    data: { updated_at: updated_at, created_at: created_at, star_count: stargazers_count }, // add star count to db schema
  });
}

// Returns contributor username array
export async function getContributorArray(username: string, repo: string) {
  const contributors = await getRepoContributors(username, repo);
  return contributors.map((contributor: any) => contributor.login);
}