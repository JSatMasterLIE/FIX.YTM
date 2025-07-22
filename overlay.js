const body = document.body

// Initializing Overlay Menu
const overlayButton = document.fixytm.createFunctionalItem("button", "fix-ytm-overlay-trigger")
overlayButton.innerHTML = "Fix"
body.appendChild(overlayButton)

const overlayMenu = document.fixytm.createFunctionalItem("div", "fix-ytm-overlay-menu", "flex-wrapper")
overlayMenu.id = "fix-ytm-overlay-menu"
body.appendChild(overlayMenu)

const overlayInnerWrapper = document.fixytm.createFunctionalItem("div", "fix-ytm-overlay-inner-wrapper", "flex-wrapper")
overlayMenu.appendChild(overlayInnerWrapper)

const hideOverlayButton = document.createElement("button")
hideOverlayButton.innerHTML = "<hr />"
hideOverlayButton.id = "fix-ytm-overlay-hide"
overlayMenu.appendChild(hideOverlayButton)

const showOverlay = () => {
    overlayButton.style.display = "none"
    overlayMenu.style.display = "flex"
}
const hideOverlay = () => {
    overlayButton.style.display = "flex"
    overlayMenu.style.display = "none"
}

// Initializing the mode switch menu
const modeRenderButton = document.createElement("button")
modeRenderButton.innerHTML = "Render controls"
modeRenderButton.id = "fix-ytm-overlay-mode-render-button"
modeRenderButton.title = "Press to change mode"
overlayMenu.appendChild(modeRenderButton)

const modeMenuOptions = { // mode menu options are parts of a list presented as an object for simple plug-and-play modification and extension of the functionality
    'Authorisation': {
        'areaOfAction': '',
        'function': function() {
            let oauthButton = document.fixytm.createFunctionalItem("button", "fix-ytm-overlay-oauth-button")
            oauthButton.innerHTML = "Sign in"
            oauthButton.title = "Press to sign in"
            overlayInnerWrapper.appendChild(oauthButton)
            oauthButton.onclick = oauthSignIn
        }
    },
    'Playlist': {
        'areaOfAction': '/playlist',
        'function': function() {
            let fetchPlaylistButton = document.fixytm.createFunctionalItem("button", "fix-ytm-overlay-fetch-playlist-button")
            fetchPlaylistButton.innerHTML = "Fetch"
            fetchPlaylistButton.title = "Press to fetch playlist"
            overlayInnerWrapper.appendChild(fetchPlaylistButton)
            // fetchPlaylistButton.onclick = fetchPlaylistButtonResponse
            fetchPlaylistButton.onclick = () => renderPlaylist(Number(prompt("Items: ")))
        }},
    'default': {
        'tag': 'p',
        'warningText': 'The extension has no functionality for this area of the website yet.',
        'id': 'fix-ytm-overlay-warning',
        'function': function() {
            let warning = document.fixytm.createFunctionalItem(this.tag, this.id)
            warning.innerHTML = this.warningText
            overlayMenu.appendChild(warning)
        }
    }
    // More coming soon
}

modeRenderButton.onclick = () => {
    overlayMenu.fixytmDeleteFunctionalItems()
    if (!window.fixytm['OAUTH_DATA']['authorised']) {
        modeMenuOptions['Authorisation']['function']();
        return 0;
    } else {
        for (let i in modeMenuOptions) {
            if (window.location.pathname === modeMenuOptions[i]['areaOfAction']) {
                modeMenuOptions[i]['function']();
                return 0;
            }
        }
        modeMenuOptions['default']['function']();
        throw new Error("No mode found for this area of the website")
    }
}

overlayButton.onclick = showOverlay
hideOverlayButton.onclick = hideOverlay
