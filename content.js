// TODO: Fix the altitude function
// TODO: Get gas prices
// TODO: Get precipitation
// TODO: Display in case of precipitation
// TODO: Get the pinpoint location
// TODO: Render the pinpoint on google earth
// TODO: Render the blue route on google earth
// TODO: Create a video?


let transparent_bg = document.createElement("div");
transparent_bg.style.backgroundColor = "rgb(255, 255, 255, 0.5)";
transparent_bg.style.backdropFilter = "blur(20px)";
transparent_bg.style.padding = "20px";
transparent_bg.style.position = "absolute";
transparent_bg.style.top = "90%";
transparent_bg.style.left = "33%";
transparent_bg.style.borderRadius = "20px";
transparent_bg.style.zIndex = 300;

document.body.appendChild(transparent_bg);

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



function extractCoordinates() {
    let url = window.location.href;

    const urlObj = new URL(url);
    const { pathname, searchParams } = urlObj;

    let latitude, longitude;

    if (pathname.startsWith("/maps/@")) {
        // Type 1: https://www.google.com/maps/@32.8964324,-117.2323364,15z?authuser=1&entry=ttu
        let coordinate_big_string = pathname.split("/maps/@")[1].split(",")
        return [coordinate_big_string[0], coordinate_big_string[1]]
    } else if (pathname.startsWith("/maps/place/")) {
        // Type 2: https://www.google.com/maps/place/Seventh+College/@32.8879708,-117.2447013,17z/data=!3m1!4b1!4m6!3m5!1s0x80dc07ecf9dab909:0x5cf33bc80a4bd726!8m2!3d32.8879708!4d-117.2421264!16s%2Fg%2F11j5bths62?authuser=1&entry=ttu
        const lngLtdStr = pathname.split('@')[1].split(',');
        return [lngLtdStr[0], lngLtdStr[1]];
    } else if (pathname.startsWith("/maps/dir/")) {
        // Type 3: https://www.google.com/maps/dir/Geisel+Library,+Gilman+Drive,+La+Jolla,+CA/Times+Square,+Manhattan,+NY+10036/@28.86987,-139.1407591,3z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x80dc07853cb13045:0x2d2f19f483aaaace!2m2!1d-117.2375659!2d32.881092!1m5!1m1!1s0x89c25855c6480299:0x55194ec5a1ae072e!2m2!1d-73.9855426!2d40.7579747!3e0?authuser=1&entry=ttu
        return extractSourceDestinationCoordinates(url);
    }

    if (latitude && longitude) {
        return [parseFloat(latitude), parseFloat(longitude)];
    } else {
        return null; // Invalid URL format
    }
}

function extractSourceDestinationCoordinates() {
    let url = window.location.href;

    const lngLtdSource = url.split("/data=")[1].split("!1d")[1];

    const source_lng = lngLtdSource.split("!")[0];
    const source_lat = lngLtdSource.split("!2d")[1].split("!")[0];

    source_coords = [source_lat, source_lng];

    // return this
    return { 'source_coords': source_coords };

    // const lngLtdDestination = url.split("/data=")[1].split("!1d")[2];

    // const destination_lng = lngLtdDestination.split("!")[0];
    // const destination_lat = lngLtdDestination.split("!2d")[1].split("!")[0];

    // const destination_coords = [destination_lat, destination_lng];

    // return { 'source_coords': source_coords, 'destination_coords': destination_coords };
}

async function getCityAndCountry(latitude, longitude) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const city = data.address.city;
        const country = data.address.country;

        return city + ", " + country;
    } catch (error) {
        console.error('Error:', error);
        return "Ran into errors";
    }
}

async function get_temperature(location, unit) {
    const text = "live weather in " + unit + " for " + location + " google";
    const googleLink = "https://www.google.com/search?q=" + encodeURIComponent(text.replace(/ /g, "+"));

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'fetchGoogleData', link: googleLink }, (response) => {
            if (response && response.data) {
                const webData = document.createElement("div");
                webData.innerHTML = response.data;

                const classSelectors = "span.wob_t.q8U8x";
                const relevantArray = [];

                webData.querySelectorAll(classSelectors).forEach((item) => {
                    relevantArray.push(item.innerHTML);
                });

                if (unit === 'F') {
                    resolve(relevantArray[0] + ' F');
                } else {
                    resolve(relevantArray[0] + ' C');
                }
            } else {
                console.error('Failed to fetch data from Google.');
                reject(new Error('Failed to fetch data from Google.'));
            }
        });
    });
}

async function get_precipitation(location) {
    const text = "live weather in " + " for " + location + " google";
    const googleLink = "https://www.google.com/search?q=" + encodeURIComponent(text.replace(/ /g, "+"));

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'fetchGoogleData', link: googleLink }, (response) => {
            if (response && response.data) {
                const webData = document.createElement("div");
                webData.innerHTML = response.data;

                const classSelectors = "span#wob_pp";
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


// async function scrapeGasPrices(state) {
//     const url = "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=pet&s=emm_epm0_pte_nus_dpg&f=m";

//     try {
//         const response = await fetch(url);
//         const html = await response.text();
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, 'text/html');

//         // Example: Extracting gas prices from the webpage
//         const gasPricesElement = doc.querySelector('.gas-prices'); // Assuming gas prices are inside an element with class "gas-prices"
//         const gasPricesText = gasPricesElement.textContent.trim(); // Extracting text content

//         return gasPricesText;
//     } catch (error) {
//         console.error('Error:', error);
//         return "Failed to fetch gas prices";
//     }
// }

// // Call the function to scrape gas prices
// scrapeGasPrices("Alabama").then(text => console.log(text)).catch(error => console.error(error));


async function appendWeatherStatus(temperature) {
    try {
        const weatherWidgetText = document.createElement("span");
        weatherWidgetText.innerHTML = "Weather: " + temperature;
        weatherWidgetText.style.zIndex = 300;
        weatherWidgetText.style.paddingRight = "20px";
        transparent_bg.appendChild(weatherWidgetText);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function appendPrecipitationStatus(precipitation) {
    try {
        const weatherWidgetText = document.createElement("span");
        weatherWidgetText.innerHTML = "Precipitation: " + precipitation;
        weatherWidgetText.style.zIndex = 300;
        weatherWidgetText.style.paddingRight = "20px";
        transparent_bg.appendChild(weatherWidgetText);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function appendCloudyStatus(cloudyness) {
    try {
        const weatherWidgetText = document.createElement("span");
        weatherWidgetText.innerHTML = "Cloudyness status: " + cloudyness;
        weatherWidgetText.style.zIndex = 300;
        weatherWidgetText.style.paddingRight = "20px";
        transparent_bg.appendChild(weatherWidgetText);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function main() {
    try {
        // Get latitude and longitude from coordinates
        let latitude, longitude;
        const current_location = extractCoordinates();

        if (current_location instanceof Array) {
            latitude = current_location[0];
            longitude = current_location[1];
        } else if (current_location && current_location.source_coords) {
            latitude = current_location.source_coords[0];
            longitude = current_location.source_coords[1];
        } else {
            console.error('Failed to extract coordinates');
            return;
        }

        // Get city and country based on coordinates
        const locationInfo = await getCityAndCountry(latitude, longitude);
        const temperature = await get_temperature(locationInfo, "F");
        const precipitationChances = await get_precipitation(locationInfo);
        const cloudyness = await get_precipitation(locationInfo);

        // Append weather status to the document
        appendWeatherStatus(temperature);
        appendPrecipitationStatus(precipitationChances);
        appendCloudyStatus(cloudyness);
        
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


function gasPrices(price) {
    const gasPriceText = document.createElement("p");
    gasPriceText.innerHTML = "Total gas price: " + price;
    gasPriceText.style.backgroundColor = "red";
    gasPriceText.style.position = "absolute";
    gasPriceText.style.top = "95%";
    gasPriceText.style.left = "75%";
    gasPriceText.style.zIndex = 300;
    // document.body.appendChild(gasPriceText);
}

function addImmersionButton() {
    const button = document.createElement("span");
    button.style.backgroundColor = "rgb(255, 255, 255, 0.3)";
    button.style.backdropFilter = "blur(20px)";
    button.style.cursor = "pointer";
    button.style.padding = "5px";
    button.style.position = "absolute";

    button.style.top = "70%";
    button.style.right = "2%";

    button.innerHTML = "Immersive View"

    button.addEventListener("click", () => {
        startImmersion();
    });

    document.body.appendChild(button);
}



function get_google_earth_url(latitude, longitude) {
    var angle = "1.6";
    var depth = "850";
    var tail = "35y,90.20609555h,68.07985574t,0r/data=OgMKATA"
    var url = "https://earth.google.com/web/@" + latitude + "," + longitude + "," + angle + "a" + "," +
        depth + "d," + tail;

    return url;
}

function convertToDMS(decimal) {
    // Check if the input is valid
    if (isNaN(decimal)) {
        return "Invalid input";
    }

    // Ensure the input is within the valid range
    if (decimal < -180 || decimal > 180) {
        return "Value out of range";
    }

    // Determine direction (N, S, E, W)
    var direction = decimal >= 0 ? (decimal >= 0 ? "N" : "E") : (decimal >= 0 ? "S" : "W");

    // Convert decimal degrees to degrees, minutes, seconds
    var absDecimal = Math.abs(decimal);
    var degrees = Math.floor(absDecimal);
    var minutesDecimal = (absDecimal - degrees) * 60;
    var minutes = Math.floor(minutesDecimal);
    var seconds = Math.round((minutesDecimal - minutes) * 60);

    // Construct the DMS string
    var dmsString = degrees + "° " + minutes + "' " + seconds + "\" " + direction;
    return dmsString;
}


// async function scrapeElevation(decimal1, decimal2) {
//     /*
//     TAKES DECIMALS
//     */

//     // Construct the URL with the location query
//     var url = "https://whatismyelevation.com/location/" + decimal1 + "," + decimal2;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;

//         return city + ", " + country;
//     } catch (error) {
//         console.error('Error:', error);
//         return "Ran into errors";
//     }
// }

// // Example usage
// var elevation = news("32.875573", "-117.2323364"); // Decimal
// alert("Elevation is: ", elevation);


function panCamera() {
    // Get latitude and longitude
    let latitude, longitude;

    const currentCoordinates = extractCoordinates();

    if (currentCoordinates instanceof Array) {
        latitude = currentCoordinates[0];
        longitude = currentCoordinates[1];
    } else {
        latitude = currentCoordinates.source_coords[0];
        longitude = currentCoordinates.source_coords[1];
    }

    // Get Google Earth URL
    const googleEarthUrl = get_google_earth_url(latitude, longitude);

    // Open Google Earth in a new window
    const googleEarthWindow = window.open(googleEarthUrl, '_blank');

    // Add event listener for when the window finishes loading
    googleEarthWindow.addEventListener('load', () => {
        // Dispatch cmd+right event
        alert("Triggered event");
        dispatchCmdRightEvent(googleEarthWindow);
    });
}


addImmersionButton();
gasPrices(2.3);
main();

function startImmersion() {
    panCamera();
}

// Function to create and dispatch the event
function dispatchCmdRightEvent() {
    var event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'ArrowRight',
        code: 'ArrowRight',
        ctrlKey: true,  // CMD key on Mac
    });

    // Dispatching the event to the document
    document.dispatchEvent(event);
}

function getCoordinateArray() {
    const source_location = extractCoordinates();
    let latitude;
    let longitude;

    if (source_location instanceof Array) {
        latitude = source_location[0];
        longitude = source_location[1];
    } else {
        latitude = source_location.source_coords[0];
        longitude = source_location.source_coords[1];
    }
}

getCoordinateArray();