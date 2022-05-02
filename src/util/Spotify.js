const clientId = '37d434a9f6984eefba1ce4b6179d4819'
const redirectUri = 'http://jamdown.surge.sh'
let accessToken = ''
const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken
        }
        // check for an access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1]
            const expiresIn = Number(expiresInMatch[1])
            // wipes the access token and URL parameters.
            window.setTimeout(() => accessToken = '', expiresIn*1000)
            window.history.pushState('Access Token',null,'/')
            return accessToken
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl
        }
    },

    search(term) {
        const accessToken = this.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: {
            Authorization: `Bearer ${accessToken}`
        }}).then(res => res.json())
        .then(data =>{
            if(!data.tracks){
                return [];
            }
            return data.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist(name,trackUris) {
        if(!name || !trackUris.length) {
            return
        }
        const accessToken = this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`}
        let userId;

        return fetch('https://api.spotify.com/v1/me',{headers:headers})
            .then(res => res.json())
            .then(data => {
                userId= data.id
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: name})
                }).then(res => res.json())
                    .then(data => {
                        const playlistId = data.id
                        console.log(playlistId)
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
                            headers: headers,
                            method: 'POSt',
                            body: JSON.stringify({ uris: trackUris})
                        })
                    })
            }
        )
    }
}
export default Spotify