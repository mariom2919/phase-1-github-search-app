// index.js

document.getElementById('github-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const searchTerm = document.getElementById('search').value.trim();
    
    if (searchTerm === '') {
        alert('Please enter a GitHub username.');
        return;
    }
    
    try {
        const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!usersResponse.ok) {
            throw new Error(`GitHub API error: ${usersResponse.status}`);
        }
        
        const usersData = await usersResponse.json();
        displayUsers(usersData.items);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from GitHub API.');
    }
});

function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear previous results
    
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.login;
        li.addEventListener('click', async function() {
            try {
                const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (!reposResponse.ok) {
                    throw new Error(`GitHub API error: ${reposResponse.status}`);
                }
                
                const reposData = await reposResponse.json();
                displayRepos(reposData);
                
            } catch (error) {
                console.error('Error fetching repositories:', error);
                alert('Failed to fetch repositories from GitHub API.');
            }
        });
        
        userList.appendChild(li);
    });
}

function displayRepos(repos) {
    const reposList = document.getElementById('repos-list');
    reposList.innerHTML = ''; // Clear previous results
    
    repos.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.name;
        reposList.appendChild(li);
    });
}
