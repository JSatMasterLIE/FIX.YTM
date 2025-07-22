// Overlay utils
document.fixytm.createFunctionalItem = (tag = "button", id, className = "fix-ytm-functionality-item") => { // create a fixytm functionality element and mark it to make it easy to remove automatically later
    let element = document.createElement(tag)
    element.className = className
    id && (element.id = id)
    return element
}
HTMLElement.prototype.fixytmDeleteFunctionalItems = function(className = "fix-ytm-functionality-item") { // clean up an element from child elements created by fixytm
    let targets = this.getElementsByClassName(className)
    for (let i = 0; i < targets.length; i++) targets[i].remove()
}

// Playlist utils
function fetchLocalPlaylistItemsStatic() { // fetch a static array of items of the viewed playlist
    if (window.location.pathname !== "/playlist") throw new Error("You are not on a playlist page");
    return document.querySelector("div#contents.style-scope.ytmusic-playlist-shelf-renderer").childNodes;
}
function assignPlaylistItemsMap(keysArray, itemsArray) { // assigns each video in an array to a specific key (reminder: always keep the original keys: their copies won't work because Map objects recognize keys by their links, not their content; optimized to use video.statistics elements as keys
    if (keysArray.length !== itemsArray.length) throw new Error("keysArray and itemsArray must have the same length");
    let map = new Map();
    for (let i = 0; i < keysArray; i++) map.set(keysArray[i], itemsArray[i]);
    window.fixytm['cachedPlaylist']['map'] = map;
    return map;
}
function fetchPlaylistId() { // fetch playlistId of the playlist currently viewed by the user
    let id = window.location.search.split("=")[1];
    console.log("FIXYT: Fetching playlist id: " + id);
    return id;
}
async function renderPlaylist(itemsCount) { // push-render all DOM items in long playlists before mapping or realigning them
    let rendertgt = document.querySelector("div#contents.style-scope.ytmusic-playlist-shelf-renderer").childNodes
    let renderedItems = 0;
    let cycle = 0;
    while (renderedItems < itemsCount && cycle++ < window.fixytm['MAX_CYCLES_PER_RENDER']) {
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(100);
        renderedItems = rendertgt.length;
    }
    window.scrollTo(0, 0)
}

sleep = ms => new Promise(resolve => setTimeout(resolve, ms));