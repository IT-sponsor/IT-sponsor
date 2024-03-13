"use server";
const BASE_URL = 'https://api.github.com/repos';

async function fetchData(endpoint: string, error: string, options?: RequestInit): Promise<JSON> {
  options = options || {};
  options.headers = { 'Accept': 'application/vnd.github+json', ...options.headers };
  const response = await fetch(`${BASE_URL}/${endpoint}`, options);
  if(response.status === 200)
    return response.json();
  else
    throw new Error(`Failed to fetch ${error} with status: ` + response.status + ' ' + response.statusText);
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
export async function getRepo(repo: string): Promise<JSON> {
  return await fetchData(`${repo}`, 'repo');
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-activities
export async function getRepoActivity(
  repo: string,
  time_period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
  activity_type: 'push' | 'force_push' | 'branch_creation' | 'branch_deletion' | 'pr_merge' | 'merge_queue_merge' = 'push'
  ): Promise<JSON> {
  return await fetchData(`${repo}/events?time_period=${time_period}&activity_type=${activity_type}`, 'repo activity');
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-contributors
export async function getRepoContributors(repo: string): Promise<JSON> {
  return await fetchData(`${repo}/contributors`, 'repo contributors');
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-all-repository-topics
export async function getRepoTopics(repo: string): Promise<JSON> {
  return await fetchData(`${repo}/topics`, 'repo topics');
}

// https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28#get-the-last-year-of-commit-activity
export async function getRepoCommitActivity(repo: string): Promise<JSON> {
  return await fetchData(`${repo}/stats/commit_activity`, 'repo commit activity');
}

// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
// 1k files limit
/// 1 MB or smaller: All features of this endpoint are supported.
/// Between 1-100 MB: Only the raw or object custom media types are supported. 
// Both will work as normal, except that when using the object media type, the content field will be an empty string and the encoding field will be "none".
// To get the contents of these larger files, use the raw media type.
/// Greater than 100 MB: This endpoint is not supported.
export async function getRepoContent(repo: string, path: string | null = null): Promise<JSON> {
  return await fetchData(`${repo}/contents${path ? '/' + path : ''}`, 'repo content', { headers: { Accept: 'application/vnd.github.raw+json' } });
}






// https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits

// https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28#list-repository-events = latest events in repo