/* HTML Element Variables */

const main = document.getElementsByTagName("main")[0];
const footer = document.getElementsByTagName("footer")[0];
const fullscreen = document.getElementById("fullscreen");
const share = document.getElementById("share");
const auto = document.getElementById("auto");
let randomInterval;
const delayMin = document.getElementById("delayMin");
const delayMax = document.getElementById("delayMax");
const pause = document.getElementById("pause");
const randColor = document.getElementById("randColor");
const brightnessMin = document.getElementById("brightnessMin");
const color = document.getElementById("color");
const randSize = document.getElementById("randSize");
const sizeGrav = document.getElementById("sizeGrav");
const sizeMin = document.getElementById("sizeMin");
const sizeMax = document.getElementById("sizeMax");
const sparkDistMin = document.getElementById("sparkDistMin");
const sparkDistMax = document.getElementById("sparkDistMax");
const fireworkDistMin = document.getElementById("fireworkDistMin");
const fireworkDistMax = document.getElementById("fireworkDistMax");
const sparksMin = document.getElementById("sparksMin");
const sparksMax = document.getElementById("sparksMax");
const fadeMin = document.getElementById("fadeMin");
const fadeMax = document.getElementById("fadeMax");
const fadeDur = document.getElementById("fadeDur");
const gravityMin = document.getElementById("gravityMin");
const gravityMax = document.getElementById("gravityMax");
const reset = document.getElementById("reset");

/* Utility Functions */

// Random between
function random(min, max) {
    return min === max ? min : Math.random() * (max - min) + parseInt(min);
}

// Random timing
function setRandomInterval(func, minDelay, maxDelay) {
    let timeout;
    let running = 1;

    function runInterval() {
        function timeoutFunction() {
            func();
            runInterval();
        }
        timeout = setTimeout(timeoutFunction, random(minDelay, maxDelay));
    }
    runInterval();
    return {
        clear() {
            clearTimeout(timeout);
            running = 0;
        },
        isRunning() {
            return running;
        }
    };
}

/* Params */

function updateVals() {
    const params = new window.URLSearchParams(window.location.search);
    if (params) {
        for (const entry of params.entries()) {
            const el = document.getElementById(entry[0]);
            if (el) {
                el.value = entry[1];
            }
        }
        if (!params.has("auto")) {
            auto.checked = false;
            if (randomInterval) {
                randomInterval.clear();
            }
            delayMin.classList.add("disabled");
            delayMax.classList.add("disabled");
        } else {
            auto.checked = true;
            if (!randomInterval || !randomInterval.isRunning()) {
                randomInterval = setRandomInterval(randFirework, delayMin.value, delayMax.value);
            }
            delayMin.classList.remove("disabled");
            delayMax.classList.remove("disabled");
        }
        pause.checked = params.has("pause");
        if (params.get("randColor") === "chosen") {
            color.classList.remove("disabled");
            brightnessMin.classList.add("disabled");
        } else {
            color.classList.add("disabled");
            brightnessMin.classList.remove("disabled");
        }
        if (params.get("randSize") == "firework") {
            sizeGrav.classList.add("disabled");
        } else {
            sizeGrav.classList.remove("disabled");
        }
        sizeGrav.checked = params.has("sizeGrav");
    }
}

window.addEventListener("popstate", function(e) {
    updateVals();
});

function getCurrentParams() {
    const params = Array.from(new FormData(document.getElementsByTagName("form")[0]).entries());
    let string = "?";
    for (let i = 0; i < params.length; i++) {
        string += params[i][0] + "=" + params[i][1].replace("#", "%23") + "&";
    }
    return string.substring(0, string.length - 1);
}

function updateParams() {
    history.pushState(null, "Fireworks", getCurrentParams());
}

const params = new window.URLSearchParams(window.location.search);
if (Array.from(params).length) {
    updateVals();
} else {
    randomInterval = setRandomInterval(randFirework, delayMin.value, delayMax.value);
    updateParams();
}

/* Firework Functions */

function genColor() {
    let col = [0, 0, 0];
    while (Math.sqrt(0.299 * Math.pow(col[0], 2) + 0.587 * Math.pow(col[1], 2) + 0.114 * Math.pow(col[2], 2)) < brightnessMin.value) {
        for (let i = 0; i < 3; i++) {
            col[i] = Math.random() * (1 << 8);
        }
    }
    for (let i = 0; i < 3; i++) {
        col[i] = ("0" + (col[i] | 0).toString(16)).slice(-2);
    }
    return "#" + col[0] + col[1] + col[2];
}

function createSpark(x, y, col, siz, dist) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    if (randColor.value === "spark") {
        spark.style.backgroundColor = genColor();
    } else if (randColor.value === "firework") {
        spark.style.backgroundColor = col;
    } else {
        spark.style.backgroundColor = color.value;
    }
    const fallRand = Math.random();
    if (randSize.value === "spark") {
        siz = (sizeGrav.checked ? fallRand : Math.random()) * (sizeMax.value - sizeMin.value) + parseInt(sizeMin.value);
        spark.style.height = siz + "px";
        spark.style.width = siz + "px";
    } else {
        spark.style.height = siz + "px";
        spark.style.width = siz + "px";
    }
    spark.style.top = y - siz / 2 + "px";
    spark.style.left = x - siz / 2 + "px";
    const dir = Math.random() * 2 * Math.PI;
    const rand = dist * random(sparkDistMin.value, sparkDistMax.value);
    spark.style.setProperty("--vertical", rand * Math.sin(dir) + "px");
    spark.style.setProperty("--horizontal", rand * Math.cos(dir) + "px");
    spark.style.setProperty("--fadeDelay", random(fadeMin.value, fadeMax.value) + "ms");
    spark.style.setProperty("--fadeDur", fadeDur.value + "ms");
    spark.style.setProperty("--fall", fallRand * (gravityMax.value - gravityMin.value) + parseInt(gravityMin.value) + "px");
    spark.style.setProperty("--time", parseInt(fadeMax.value) + parseInt(fadeDur.value) + "ms");
    main.append(spark);
    if (!pause.checked) {
        setTimeout(function() {
            spark.remove();
        }, parseInt(fadeMax.value) + parseInt(fadeDur.value));
    }
    return spark;
}

function createFirework(x, y) {
    const sparks = random(sparksMin.value, sparksMax.value);
    const col = genColor();
    const siz = random(sizeMin.value, sizeMax.value);
    const dist = random(fireworkDistMin.value, fireworkDistMax.value);
    let sparkList = [];
    for (let i = 0; i < sparks; i++) {
        sparkList.push(createSpark(x, y, col, siz, dist));
    }
    if (!pause.checked) {
        setTimeout(function() {
            for (let i = 0; i < sparks; i++) {
                sparkList[i].classList.add("start");
            }
        });
    }
}

function randFirework() {
    createFirework(Math.random() * main.offsetWidth, Math.random() * main.offsetHeight);
}

/* Listeners */

main.addEventListener("click", function(e) {
    createFirework(e.offsetX, e.offsetY);
});

fullscreen.addEventListener("click", function() {
    footer.style.display = "none";
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        footer.style.display = "block";
    }
});

share.addEventListener("click", function() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: "Fireworks",
            url: url
        }).catch(console.error);
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).catch(console.error);
    } else {
        alert(url);
    }
});

auto.addEventListener("click", function() {
    if (this.checked) {
        delayMin.classList.remove("disabled");
        delayMax.classList.remove("disabled");
        randomInterval = setRandomInterval(randFirework, delayMin.value, delayMax.value);
    } else {
        delayMin.classList.add("disabled");
        delayMax.classList.add("disabled");
        randomInterval.clear();
    }
    updateParams();
});

delayMin.addEventListener("change", function() {
    this.value = Math.max(0, Math.min(this.value, delayMax.value));
    if (auto.checked) {
        randomInterval.clear();
        randomInterval = setRandomInterval(randFirework, delayMin.value, delayMax.value);
    }
    updateParams();
});

delayMax.addEventListener("change", function() {
    this.value = Math.max(this.value, delayMin.value);
    if (auto.checked) {
        randomInterval.clear();
        randomInterval = setRandomInterval(randFirework, delayMin.value, delayMax.value);
    }
    updateParams();
});

pause.addEventListener("click", function() {
    if (!this.checked) {
        const sparkList = document.getElementsByClassName("spark");
        for (let i = 0; i < sparkList.length; i++) {
            const spark = sparkList[i];
            spark.classList.add("start");
            setTimeout(function() {
                spark.remove();
            }, parseInt(fadeMax.value) + parseInt(fadeDur.value));
        }
    }
    updateParams();
});

randColor.addEventListener("change", function() {
    if (this.value !== "chosen") {
        color.classList.add("disabled");
        brightnessMin.classList.remove("disabled");
    } else {
        color.classList.remove("disabled");
        brightnessMin.classList.add("disabled");
    }
    updateParams();
});

color.addEventListener("change", function() {
    updateParams();
});

brightnessMin.addEventListener("change", function() {
    this.value = Math.max(this.min, Math.min(this.value, this.max));
    updateParams();
});

randSize.addEventListener("change", function() {
    if (randSize.value == "firework") {
        sizeGrav.classList.add("disabled");
    } else {
        sizeGrav.classList.remove("disabled");
    }
    updateParams();
});

sizeGrav.addEventListener("change", function() {
    updateParams();
});

// Min and max value calculations for number inputs
const minMaxes = [
    [sizeMin, sizeMax],
    [sparkDistMin, sparkDistMax],
    [fireworkDistMin, fireworkDistMax],
    [sparksMin, sparksMax],
    [fadeMin, fadeMax],
    [gravityMin, gravityMax]
];
for (let i = 0; i < minMaxes.length; i++) {
    minMaxes[i][0].addEventListener("change", function() {
        this.value = Math.max(0, Math.min(this.value, minMaxes[i][1].value));
        updateParams();
    });
    minMaxes[i][1].addEventListener("change", function() {
        this.value = Math.max(this.value, minMaxes[i][0].value);
        updateParams();
    });
}

fadeDur.addEventListener("change", function() {
    this.value = Math.max(0, this.value);
    updateParams();
});

reset.addEventListener("click", function() {
    window.location = window.location.href.split("?")[0];
});
