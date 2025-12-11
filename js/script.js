console.log("Party start")
let currentSong = new Audio();
let songs;
let Cfolder;
async function getSongs(folder){
    Cfolder = folder
    let data = await fetch(`http://127.0.0.1:5500/Songs/${Cfolder}/`)
    let response = await data.text();
    
    let div = document.createElement("div")
    div.innerHTML = response;
    let a = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < a.length; index++) {
        const element = a[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/Songs/${Cfolder}/`)[1])
        }
        
    }
        // all song in library
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +`<li>
                            <img class="invert logoSize" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="Sname">${song.replaceAll("%20"," ")}</div>
                                <div class="artist">Artist</div>
                            </div>
                            <div class="playNow">
                                <img class="invert logoSize" src="img/play.svg" alt="">
                            </div>
                        </li>
        </li>`;
    } 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click",e=>{
            playMusic(element.querySelector(".info").firstElementChild.innerHTML)
        })
    });
    return songs
}

const formatTime= (seconds)=> {
  // Ensure it's a non-negative integer
  seconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Add leading zeros if needed
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}



const playMusic = (track, pause=false)=>{
    currentSong.src = `/Songs/${Cfolder}/`+track;
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)

}

async function displayalbum() {
    let data = await fetch(`http://127.0.0.1:5500/Songs/`)
    let response = await data.text();
    
    let div = document.createElement("div")
    div.innerHTML = response
    let anchor = div.getElementsByTagName("a")
    let container = document.querySelector(".container")
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/Songs/")){
            // console.log(e.href.split("/").slice(-1)[0])
            let folder = e.href.split("/").slice(-1)[0]
            //geting metadata
            let data = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`)
            let response = await data.json();
            container.innerHTML = container.innerHTML +`<div data-folder="${folder}" class="card">
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
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    //loading albums
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main(){
    await getSongs("vela");
    playMusic(songs[0],true)

    //add event listner to play, next, pre
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src ="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    //Time updating
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%"
    })

    //add event to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })
    //add event to hamburger
    document.querySelector(".hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left = "0%";
    })
    //add event to cross
    document.querySelector(".cross").addEventListener("click",e=>{
        document.querySelector(".left").style.left = "-100%";
    })
    //add event to next
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
    //add event to pre
    pre.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
    //add volume control
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume =parseInt(e.target.value)/100
    })

}
main()
displayalbum()