
//! Variables

const mapsInput = document.getElementById(`mapsInput`);
const ignoreInput = document.getElementById(`ignoreInput`);
const mapsOutput = document.getElementById(`mapsOutput`);
const latencyInput = document.getElementById(`latencyInput`);
const instantOutput = document.getElementById("instantOutput");

const urlType = document.getElementById(`urlType`);
const openingButton = document.getElementById(`openingButton`);

const mapsText = document.getElementById("mapsText");
const IDsText = document.getElementById("IDsText");
const URLsText = document.getElementById("URLsText");
const openingText = document.getElementById("openingText");

let maps = [];
let mapsToLoad;
let mapsToIgnore;
let mapsToConvert;
let processedMap;

let IDs = [];
let unprocessableIDs = [];
let URLs = [];

let opening = false;
let latency;
let currentURL = 0;

let openingInterval;

let powershellCode;

//! Getting data from site

function loadMaps(example) {
    // Example
    if (example) {
        mapsInput.textContent =`
375648 S3RL - Bass Slut (Original Mix)
392215 IOSYS - Cirno no Perfect Sansuu Kyoushitsu
396221 Kurokotei - Galaxy Collapse
39804 xi - FREEDOM DiVE
58951 UNDEAD CORPORATION - Yoru Naku Usagi wa Yume o Miru`;
    }

    // Spliting maps input
    mapsToLoad = (mapsInput.value).split(`\n`);
    if (example) mapsToLoad.shift();

    // Spliting ignore input
    if (mapsToIgnore != "") {
        mapsToIgnore = (ignoreInput.value).split(`\n`);
        mapsToConvert = mapsToLoad.filter(map => !mapsToIgnore.includes(map));
    }

    // Maps array
    console.log(`Preparing to load the following maps [${mapsToConvert.length}]`, mapsToConvert, `Skipping the following maps [${mapsToIgnore.length}]`, mapsToIgnore);
    maps = mapsToConvert;
    console.log(`Successfully loaded the following maps [${maps.length}]`, maps, `Skipped the following maps [${mapsToIgnore.length}]`, mapsToIgnore);
    mapsText.textContent = `Loaded maps: ${mapsToConvert.length}`;
}

//! Converting data to proper format

function getIDs() {
    console.log(`Preparing to get IDs of the following maps [${maps.length}]`, maps);
    for (let i = 0; i < maps.length; i++) {
        processedMap = maps[i].split(" ")[0];
        if (isNaN(processedMap)) {
            unprocessableIDs.push(maps[i]);
            continue;
        };
        IDs.push(processedMap);
    }
    console.log(`Successfully got IDs of the following maps [${IDs.length}]`, IDs, `Unprocessable IDs [${unprocessableIDs.length}]`, unprocessableIDs);
    IDsText.textContent = `Loaded IDs: ${IDs.length} / Unprocessable IDs: ${unprocessableIDs.length}`;
}

function generateURLs() {
    console.log(`Preparing to generate URLs of the following IDs [${IDs.length}]`, IDs);
    for (let i = 0; i < IDs.length; i++) {
        if (urlType.value == `osu`) URLs.push("https://osu.ppy.sh/beatmapsets/".concat(IDs[i]));
        else if (urlType.value == `nerinyan`) URLs.push("https://nerinyan.moe/d/".concat(IDs[i]));
    }
    console.log(`Successfully generated URLs of the following IDs [${URLs.length}]`, URLs);
    URLsText.textContent = `Generated URLs: ${URLs.length}`;
    mapsOutput.textContent = URLs;
}

//! Opening tabs

function openingProcess(instant) {
    if (instant) {
        console.log(`Opening ${URLs.length} URLs at once`, URLs);
        for (let i = 0; i < URLs.length; i++) {
            window.open(URLs[i], '_blank');
        }
        console.log(`Successfully opened ${URLs.length} URLs at once`, URLs);
        return;
    }

    latency = latencyInput.value;

    if (isNaN(latency)) {
        console.log(`Latency must be an integer`);
        openingText.textContent = `No processes running / Latency must be an integer`;
        return;
    };

    if (!opening) {
        opening = true;
        openingButton.textContent = `Stop`;
        openingText.textContent = `Opening with latency ${latency}ms`;
        openingInterval = setInterval(openWeb, latency);
    } else if (opening) {
        opening = false;
        openingButton.textContent = `Start`;
        openingText.textContent = `No processes running`;
        clearInterval(openingInterval);
        console.log(`Opening URLs stopped ${currentURL + 1}/${URLs.length} URLs have been opened`);
    }
}

function openWeb() {
    if (currentURL == URLs.length - 1) {
        opening = false;
        clearInterval(openingInterval);
        console.log(`Opening URLs stopped ${currentURL + 1}/${URLs.length} URLs have been opened`);
        openingButton.textContent = `Start`;
        openingText.textContent = `No processes running / All URLs opened`;
    }
    window.open(URLs[currentURL], '_blank');
    console.log(`The URL ${URLs[currentURL]} [${currentURL + 1}/${URLs.length}] has been opened. Next one opening in ${latency}ms`);
    currentURL++;
}

//! Open at once using powershell

function generatePS() {
    powershellCode = "powershell ";

    for (let i = 0; i < URLs.length; i++) {
        powershellCode = powershellCode.concat(`Start-Process "${URLs[i]}"; `);
    }

    console.log(`Generated powershell code for ${URLs.length} URLs`, URLs, powershellCode);
    instantOutput.textContent = powershellCode;
    navigator.clipboard.writeText(powershellCode);
}