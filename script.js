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
