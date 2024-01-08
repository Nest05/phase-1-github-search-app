 document.addEventListener('DOMContentLoaded', () =>{
const userList = document.querySelector('#user-list')
const repoList = document.querySelector('#repos-list')
const form = document.querySelector('#github-form')
const searchButton = document.querySelector('#search-button')
const searchInput = document.querySelector('#search')

// Default search type is users
let searchType = 'users';

searchButton.addEventListener('click', () => {
    searchType = (searchType === 'users') ? 'repos' : 'users';

    // Update search input placeholder and clear previous search results
    searchInput.placeholder = (searchType === 'users') ? 'Search users...' : 'Search repos...';
    userList.innerHTML = '';
    repoList.innerHTML = '';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = searchInput.value;

  if (searchType === 'users'){
    fetch(`https://api.github.com/users/${keyword}`)
    .then(response => response.json())
    .then(user => {
       
            const name = user.login
            const avatar = user.avatar_url
            const profileLink = user.html_url


            userList.innerHTML = `
            <h2>${name}</h2>
            <img src='${avatar}' alt='User Avatar'/>
            <a href='${profileLink}'>Profile Link</a>
            `;

            const nameElement = userList.querySelector('h2');
            nameElement.addEventListener('click', () =>{
            fetch(`https://api.github.com/users/${name}`)
            .then(resp => resp.json())
            .then(user => {
                const reposUrl = user.repos_url

                fetch(reposUrl)
                .then(res => res.json())
                .then(json => {
                repoList.innerHTML = '';

                json.forEach(repo => {
                    const repoName = repo.name;
                    const repoLink = repo.html_url;

                    const repoItem = document.createElement('li');
                    repoItem.innerHTML = `
                    <a href='${repoLink}'>${repoName}</a>
                    `
                    repoList.appendChild(repoItem);
                })
                })
            })
        })
    })
       
  }else if (searchType === 'repos') {
    // Search for repos
    fetch('https://api.github.com/search/repositories?q=${keyword}')
    .then(res => res.json())
    .then(data => {
        data.items.forEach(repo => {
        const repoName = repo.name;
        const repoLink = repo.html_url;

        const repoItem = document.createElement('li')
        repoItem.innerHTML = `
        <a href='${repoLink}'>${repoName}</a>`;

        repoList.appendChild(repoItem);
        })
    })
  }
})
 

})