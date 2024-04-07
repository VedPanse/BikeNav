const axios = require('axios');
const cheerio = require('cheerio');

const REGEX_PATTERN = /\b\d+�F\b/;

function get_temperature(location, unit) {
    async function getTemperature(location, unit) {
        try {
            const response = await axios.get(`https://www.google.com/search?q=live+weather+${location.replace(" ", "+")}+google`);
            const $ = cheerio.load(response.data);
            const allLinks = $('div.BNeawe.iBp4i.AP7Wnd');

            for (let i = 0; i < allLinks.length; i++) {
                const text = $(allLinks[i]).text();
                const temperature = text.match(REGEX_PATTERN);
                if (temperature) {
                    return temperature[0].replace('�', ' '); // Replace question mark with space
                }
            }

            return "Unavailable";
        } catch (error) {
            console.error("Error:", error);
            return "Ran into errors";
        }
    }

    getTemperature(location, unit)
        .then(result => console.log(result))
        .catch(error => console.error("Error:", error));
}

module.exports = { getTemperature };