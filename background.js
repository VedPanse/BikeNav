chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchGoogleData' && request.link) {
        // Make the fetch operation here
        fetch(request.link)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                sendResponse({data});
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({error: 'Failed to fetch data from Google.'});
            });

        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});
