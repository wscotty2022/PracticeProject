
/** 
 * Parse the lyric from string to object
 * {time: startTime, words: lyric}
*/
function parseLyric() {
    var lines = lyric.split('\n');
    var result = [];
    for(var i = 0; i < lines.length; i++) {
        var str = lines[i];
        var parts = str.split(']');
        var timeStr = parts[0].substring(1);
        var obj = {
            time: parseTime(timeStr),
            words: parts[1]
        }; 

        result.push(obj);
    }

    return result;
}

/**
 * Parse a string to decimal (seconds)
 * @param {String} timeStr Time in string
 * @returns 
 */
function parseTime(timeStr) {
    var parts = timeStr.split(':');
    return +parts[0]*60 + +parts[1]
}

var lyricData = parseLyric();

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('ul'),
    container: document.querySelector('.container')
}

/**
 * Calculate the current index of lyric line based on the timestamp of the song being played
 * If there is no any lyric line needs to be highlighted, return -1
 */
function findIndex() {
    var currentTime = doms.audio.currentTime;
    for (var i = 0; i < lyricData.length; i++) {
        if (currentTime < lyricData[i].time) {
            return i - 1;
        }
    }

    // When no lyric line is found (when reach to the end)
    return lyricData.length - 1;
}

/**
 * Create lyric list
 */
function createLyricElements() {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < lyricData.length; i++) {
        var li = document.createElement('li');
        li.textContent = lyricData[i].words;
        fragment.appendChild(li);
    }

    doms.ul.appendChild(fragment);
}

createLyricElements();

// Height of container
var containerHeight = doms.container.clientHeight;

// Height of li
var liHeight = doms.ul.children[0].clientHeight;

var maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * Set offset of the lyric
 */
function setOffset() {
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2
    if (offset <= 0) {
        offset = 0;
    }

    if (offset > maxOffset) {
        offset = maxOffset;
    }

    doms.ul.style.transform = `translateY(-${offset}px)`;
    var li = doms.ul.querySelector('.active')
    if (li) {
        li.classList.remove('active');
    }
    var li = doms.ul.children[index];
    if (li) {
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate', setOffset)