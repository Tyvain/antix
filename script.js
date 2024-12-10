const mastodonInstance = "https://mastodon.social";
const clientId = "VOTRE_CLIENT_ID";
const clientSecret = "VOTRE_CLIENT_SECRET";
const redirectUri = "https://votreutilisateur.github.io/mastodon-tag-viewer"; // URL GitHub Pages

async function login() {
    const authUrl = `${mastodonInstance}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read`;
    window.location.href = authUrl;
}

async function fetchAccessToken(code) {
    const response = await fetch(`${mastodonInstance}/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
            code: code
        })
    });
    const data = await response.json();
    return data.access_token;
}

async function fetchPosts(accessToken) {
    const response = await fetch(`${mastodonInstance}/api/v2/timelines/tag/gaming`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const posts = await response.json();
    const postList = document.getElementById("posts");
    posts.forEach(post => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <p><strong>${post.account.display_name}</strong>: ${post.content}</p>
        `;
        postList.appendChild(listItem);
    });
}

// Vérification après redirection
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("code")) {
    const code = urlParams.get("code");
    fetchAccessToken(code).then(token => {
        document.getElementById("login").style.display = "none";
        document.getElementById("content").style.display = "block";
        fetchPosts(token);
    });
}

