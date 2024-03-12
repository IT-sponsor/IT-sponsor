import prisma from "./client"; // is it the right one?
import { getRepo } from "../github/api";

// Store repo info
export async function updateRepoInfo(username: string, repo: string) {
  const { created_at, updated_at, stargazers_count } = await getRepo(username, repo);
  await prisma.project.update({
    where: { repository: `github.com/${username}/${repo}` }, // fix db schema?
    data: { last_updated: updated_at, creation_date: created_at, star_count: stargazers_count }, // add star count to db schema
  });
}