console.log("FIXYT: Fix Youtube Music broken features extension is up and running!")
console.log("Current API key installed: " + window.fixytm['API_KEY'])

console.log("FIXYT: Initializing playlist functionality")

async function fetchPlaylistItemIds(playlistId) { // fetch videoId for each item of the playlist
    if (typeof playlistId !== "string") throw new TypeError("playlistId must be a string");
    let outputArray = [];
    let XHRs = [];
    let responses = [];
    let cycle = 0;
    let nextPageToken = "";
    while (cycle < window.fixytm['MAX_CYCLES_PER_FETCH']) {
        await new Promise((resolve, reject) => {
            XHRs[cycle] = new XMLHttpRequest();
            XHRs[cycle].open("GET", `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=${window.fixytm['MAX_PAGE_ITEMS']}&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${window.fixytm['API_KEY']}`);
            XHRs[cycle].onload = () => {
                responses[cycle] = JSON.parse(XHRs[cycle].responseText)
                console.log(`Request ${cycle} fetched ${responses[cycle].items.length} items successfully`);
                console.log(`Status: ${XHRs[cycle].status}`);
                resolve();
            }
            XHRs[cycle].onerror = () => {
                console.error(`Request ${cycle} failed: ${XHRs[cycle].status}`);
                reject(new Error('XMLHttpRequest failed; see message above for details'));
            }
            XHRs[cycle].send();
        })
        if (responses[cycle].nextPageToken) nextPageToken = responses[cycle++].nextPageToken; else break;
    }
    let key = 0;
    for (let i in responses) {
        for (let j in responses[i].items) outputArray[key++] = responses[i].items[j].contentDetails.videoId;
    }
    window.fixytm['cachedPlaylist']['id'] = playlistId;
    window.fixytm['cachedPlaylist']['itemIds'] = outputArray;
    window.fixytm['cachedPlaylist']['size'] = outputArray.length;
    console.log(`Fetched ${window.fixytm['cachedPlaylist']['size']} items from playlist ${playlistId}`);
    return outputArray;
}

async function fetchVideosStats(videoIds) {
    if (typeof videoIds !== "object") throw new TypeError("videoId must be an array");
    let outputArray = [];
    let XHRs = [];
    let responses = [];
    let cycle = 0;
    let request = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&maxResults=${window.fixytm[`MAX_PAGE_ITEMS`]}&key=${window.fixytm['API_KEY']}&id=`;
    let nextPageToken = "";
    for(let i in videoIds) request += `${videoIds[i]}%2C`
    while (cycle < window.fixytm['MAX_CYCLES_PER_FETCH']) {
        await new Promise(resolve, reject => {
            XHRs[cycle] = new XMLHttpRequest();
            XHRs[cycle].open("GET", `${request}&pageToken=${nextPageToken}`)
            XHRs[cycle].onload = () => {
                responses[cycle] = JSON.parse(XHRs[cycle].responseText)
                console.log(`Request ${cycle} fetched ${responses[cycle].items.length} items successfully`);
                console.log(`Status: ${XHRs[cycle].status}`);
                resolve();
            }
            XHRs[cycle].onerror = () => {
                console.error(`Request ${cycle} failed: ${XHRs[cycle].status}`);
                reject(new Error('XMLHttpRequest failed; see message above for details'));
            }
            XHRs[cycle].send();
        })
        if (responses[cycle].nextPageToken) nextPageToken = responses[cycle++].nextPageToken; else break;
    }
    let key = 0;
    for (let i in responses) {
        for (let j in responses[i].items) outputArray[key++] = responses[i].items[j].statistics;
    }

    return outputArray;
}


