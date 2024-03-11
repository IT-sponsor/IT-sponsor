
const BASE_URL = 'https://api.github.com';

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
export async function getRepo(username: string, repo: string) {
  const response = (await fetch(`${BASE_URL}/repos/${username}/${repo}`));
  if(response.status === 200)
    return response.json();
  else
    throw new Error('Failed to fetch repo');
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-activities
export async function getRepoActivity(username: string, repo: string, time_period: string = 'day' || 'week' || 'month' || 'quarter' || 'year',
                                      activity_type: string = 'push' || 'force_push' || 'branch_creation' || 'branch_deletion' || 'pr_merge' ||
                                      'merge_queue_merge') {
  const response = (await fetch(`${BASE_URL}/repos/${username}/${repo}/events`));
  if(response.status === 200)
    return response.json();
  else
    throw new Error('Failed to fetch repo activity');
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-contributors
export async function getRepoContributors(username: string, repo: string) {
  const response = (await fetch(`${BASE_URL}/repos/${username}/${repo}/contributors`));
  if(response.status === 200)
    return response.json();
  else
    throw new Error('Failed to fetch repo contributors');
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-all-repository-topics
export async function getRepoTopics(username: string, repo: string) {
  const response = (await fetch(`${BASE_URL}/repos/${username}/${repo}/topics`));
  if(response.status === 200)
    return response.json();
  else
    throw new Error('Failed to fetch repo topics');
}

// https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28#get-the-last-year-of-commit-activity
export async function getRepoCommitActivity(username: string, repo: string) {
    let retries = 5;
    while(retries > 0) {
        const response = (await fetch(`${BASE_URL}/repos/${username}/${repo}/stats/commit_activity`));
        if(response.status === 200)
            return response.json();
        else if(response.status === 202){
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries--;
        } else
            throw new Error('Failed to fetch repo commit activity');
    }
    throw new Error('Exceeded maximum retries for fetching repo commit activity');
}

// https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits

// https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28#list-repository-events = latest events in repo