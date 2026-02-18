console.log("Party start")
let currentSong = new Audio();
let songs;
let Cfolder;

async function getSongs(folder) {
    Cfolder = folder;
    try {
        let data = await fetch(`/Songs/${Cfolder}/`);
        if (!data.ok) throw new Error("Folder not found");
        let response = await data.text();

        let div = document.createElement("div")
        div.innerHTML = response;
        let a = div.getElementsByTagName("a");
        songs = []
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            if (element.href.endsWith(".mp3")) {
                let parts = element.href.split(`/Songs/${Cfolder}/`);
                if (parts.length > 1) {
                    songs.push(parts[1]);
                }
            }
        }

        // all song in library
        let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
        songUl.innerHTML = ""
        for (const song of songs) {
            songUl.innerHTML = songUl.innerHTML + `<li>
                            <img class="invert logoSize" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="Sname">${decodeURI(song).replaceAll("%20", " ")}</div>
                                <div class="artist">Artist</div>
                            </div>
                            <div class="playNow">
                                <img class="invert logoSize" src="img/play.svg" alt="">
                            </div>
                        </li>`;
        }

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
            element.addEventListener("click", e => {
                playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        });
        return songs
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    seconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/Songs/${Cfolder}/` + track;
    if (!pause) {
        currentSong.play().catch(e => console.error("Playback failed:", e));
        document.getElementById("play").src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayalbum() {
    try {
        let data = await fetch(`/Songs/`)
        if (!data.ok) throw new Error("Songs directory not found");
        let response = await data.text();

        let div = document.createElement("div")
        div.innerHTML = response
        let anchor = div.getElementsByTagName("a")
        let container = document.querySelector(".container")
        let array = Array.from(anchor)
        
        container.innerHTML = ""; // Clear container first

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/Songs/")) {
                let folder = e.href.split("/").filter(Boolean).slice(-1)[0];
                try {
                    // getting metadata
                    let infoData = await fetch(`/Songs/${folder}/info.json`)
                    if (infoData.ok) {
                        let infoResponse = await infoData.json();
                        container.innerHTML = container.innerHTML + `<div data-folder="${folder}" class="card">
                                <div class="play">
                                    <svg width="50px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style="stop-color:#4ffe5e;stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:#08fe00;stop-opacity:1" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="50" cy="50" r="48" fill="url(#playGradient)" stroke="#333"
                                            stroke-width="3" />
                                        <polygon points="40,30 70,50 40,70" fill="white" />
                                    </svg>
                                </div>
                                <img src="/Songs/${folder}/cover.jpg" alt="">
                                <h2>${infoResponse.title}</h2>
                                <p>${infoResponse.description}</p>
                            </div>`
                    }
                } catch (err) {
                    console.error(`Error loading metadata for ${folder}:`, err);
                }
            }
        }

        // loading albums
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(`${item.currentTarget.dataset.folder}`)
                if (songs.length > 0) {
                    playMusic(songs[0])
                }
            })
        })
    } catch (error) {
        console.error("Error displaying albums:", error);
    }
}

async function main() {
    // Get initial songs from a valid folder or first folder available
    await displayalbum();
    
    // Set a default album if none selected
    let albums = document.getElementsByClassName("card");
    if (albums.length > 0) {
        let firstFolder = albums[0].dataset.folder;
        songs = await getSongs(firstFolder);
        if (songs.length > 0) {
            playMusic(songs[0], true);
        }
    }

    // add event listner to play, next, pre
    const playBtn = document.getElementById("play");
    const nextBtn = document.getElementById("next");
    const preBtn = document.getElementById("pre");

    playBtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play().catch(e => console.error("Playback failed:", e))
            playBtn.src = "img/pause.svg"
        } else {
            currentSong.pause()
            playBtn.src = "img/play.svg"
        }
    })

    // Time updating
    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        }
    })

    // add event to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // add event to hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0%";
    })

    // add event to cross
    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%";
    })

    // add event to next
    nextBtn.addEventListener("click", () => {
        if (!songs) return;
        let currentTrack = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentTrack)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add event to pre
    preBtn.addEventListener("click", () => {
        if (!songs) return;
        let currentTrack = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentTrack)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // add volume control
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })
}

main()
