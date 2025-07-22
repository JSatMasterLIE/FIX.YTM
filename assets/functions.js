function oauthSignIn() {
    let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    let params = {
        'client_id': window.fixytm['OAUTH_DATA']['web']['client_id'],
        'redirect_uri': '?',
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'response_type': 'token',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    }
    for (let i in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', i);
        input.setAttribute('value', params[i]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}

function fetchPlaylistButtonResponse() {
    let videoIds = [];
    let videoStats = [];
    fetchPlaylistItemIds(fetchPlaylistId()).then(output => {
        videoIds = output;
        console.log(`Fetched item ids: ${videoIds.join(', ')}`);
    }).then((output) => {
        fetchVideosStats(videoIds).then(output => {
            videoStats = output;
        })
    }).then(() => {
        let videos =
        window.fixytm['cachedPlaylist']['map'] = assignPlaylistItemsMap(videoStats, document.querySelectorAll("ytmusic-responsive-list-item-renderer"));
    })

}