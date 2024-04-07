async function get_cloudy_status(location) {
    const text = "live weather in for " + location + " google";
    const googleLink = "https://www.google.com/search?q=" + encodeURIComponent(text.replace(/ /g, "+"));

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'fetchGoogleData', link: googleLink }, (response) => {
            if (response && response.data) {
                const webData = document.createElement("div");
                webData.innerHTML = response.data;

                const classSelectors = "span#wob_dc";
                const relevantArray = [];

                webData.querySelectorAll(classSelectors).forEach((item) => {
                    relevantArray.push(item.innerHTML);
                });
                resolve(relevantArray[0]);
            } else {
                console.error('Failed to fetch data from Google.');
                reject(new Error('Failed to fetch data from Google.'));
            }
        });
    });
}