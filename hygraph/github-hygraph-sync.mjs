// github-hygraph-sync.js
import dotenv from 'dotenv';
import { GraphQLClient, gql } from 'graphql-request';
import { Octokit } from '@octokit/rest';

dotenv.config();

// Initialize clients
const hygraphClient = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
    headers: {
        Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
    },
});

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

// GraphQL mutation for creating/updating repositories in Hygraph
const UPSERT_REPOSITORY = gql`
  mutation UpsertRepository($name: String!, $data: RepositoryUpdateInput!) {
    upsertRepository(where: { name: $name }, 
      upsert: { 
        create: $data, 
        update: $data 
      }
    ) {
      id
      name
    }
  }
`;

// Function to fetch repository data from GitHub
async function fetchGitHubRepositories(username) {
    try {
        const { data } = await octokit.repos.listForUser({
            username,
            sort: 'updated',
            per_page: 100,
            type: 'owner'
        });

        return data;
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        throw error;
    }
}

// Function to fetch repository README
async function fetchRepositoryReadme(owner, repo) {
    try {
        const { data } = await octokit.repos.getReadme({
            owner,
            repo,
        });
        return Buffer.from(data.content, 'base64').toString();
    } catch (error) {
        console.log(`No README found for ${owner}/${repo}`);
        return '';
    }
}

// Function to fetch repository languages
async function fetchRepositoryLanguages(owner, repo) {
    try {
        const { data } = await octokit.repos.listLanguages({
            owner,
            repo,
        });
        return Object.keys(data);
    } catch (error) {
        console.error(`Error fetching languages for ${owner}/${repo}:`, error);
        return [];
    }
}

// Transform GitHub repository data to Hygraph schema format
function transformRepositoryData(repo, readmeContent, languages) {
    return {
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        homepageUrl: repo.homepage || '',
        primaryLanguage: repo.language || '',
        languages,
        stargazerCount: repo.stargazers_count,
        forkCount: repo.forks_count,
        isPrivate: repo.private,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        topics: repo.topics || [],
        owner: repo.owner.login,
        ownerAvatarUrl: repo.owner.avatar_url,
        size: repo.size,
        diskUsage: repo.size,
        hasIssuesEnabled: repo.has_issues,
        hasWikiEnabled: repo.has_wiki,
        readmeContent,
        openIssuesCount: repo.open_issues_count,
        watchersCount: repo.watchers_count,
        defaultBranch: repo.default_branch,
        license: (repo.license && repo.license.name) || null,
        featured: false, // Default value
        category: '', // You can set a default category if needed
        order: null
    };
}

// Main function to sync repositories
async function syncRepositories(username) {
    try {
        console.log(`Starting sync for user: ${username}`);

        // Fetch repositories from GitHub
        const repositories = await fetchGitHubRepositories(username);
        console.log(`Found ${repositories.length} repositories`);

        // Process each repository
        for (const repo of repositories) {
            console.log(`Processing repository: ${repo.name}`);

            // Fetch additional data
            const [readmeContent, languages] = await Promise.all([
                fetchRepositoryReadme(repo.owner.login, repo.name),
                fetchRepositoryLanguages(repo.owner.login, repo.name)
            ]);

            // Transform data to match Hygraph schema
            const repositoryData = transformRepositoryData(repo, readmeContent, languages);

            // Upsert repository in Hygraph
            try {
                await hygraphClient.request(UPSERT_REPOSITORY, {
                    name: repo.name,
                    data: repositoryData
                });
                console.log(`Successfully synced repository: ${repo.name}`);
            } catch (error) {
                console.error(`Error upserting repository ${repo.name}:`, error);
            }
        }

        console.log('Sync completed successfully!');
    } catch (error) {
        console.error('Sync failed:', error);
        throw error;
    }
}

// Example usage
// Create a .env file with your credentials:
// GITHUB_TOKEN=your_github_token
// HYGRAPH_ENDPOINT=your_hygraph_endpoint
// HYGRAPH_TOKEN=your_hygraph_token
// GITHUB_USERNAME=your_github_username

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
syncRepositories(GITHUB_USERNAME);