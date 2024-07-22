document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value.trim();

    if (searchTerm === '') {
        alert('Please enter a GitHub username.');
        return;
    }

    try {
        // Clear previous results
        document.getElementById('user-list').innerHTML = '';
        document.getElementById('repositories').innerHTML = '';

        // Search for users
        const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const users = data.items; // Array of users

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.textContent = user.login;
            userDiv.addEventListener('click', async function() {
                // Fetch repositories for the selected user
                const repoResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!repoResponse.ok) {
                    throw new Error(`HTTP error! Status: ${repoResponse.status}`);
                }

                const repos = await repoResponse.json();

                // Display repositories
                const repoContainer = document.getElementById('repositories');
                repoContainer.innerHTML = `<h3>Repositories for ${user.login}:</h3>`;
                repos.forEach(repo => {
                    const repoDiv = document.createElement('div');
                    repoDiv.textContent = repo.name;
                    repoContainer.appendChild(repoDiv);
                });
            });

            document.getElementById('user-list').appendChild(userDiv);
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch data from GitHub API.');
    }
});
