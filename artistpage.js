const id = new URLSearchParams(window.location.search).get("id");
console.log("RESOURCE ID:", id);
/* modifica dell'html in base all'id */
const contenitoreImgArtist = document.getElementById("contenitoreImgArtist");
const NomeArtista = document.getElementById("NomeArtista");
const numeroFanArtist = document.getElementById("numeroFanArtist");
fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`, {
  headers: {
    "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw `Errore ${resp.status} : errore nella creazione dell'annuncio`;
    }
  })
  .then((objArtist) => {
    console.log(objArtist);
    contenitoreImgArtist.style.backgroundImage = `url(${objArtist.picture_xl})`;
    NomeArtista.innerHTML = objArtist.name;
    numeroFanArtist.innerHTML = `${objArtist.nb_fan.toLocaleString()} ascoltatori mensili`;

    // Fetch della tracklist
    return fetch(objArtist.tracklist, {
      headers: {
        "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    });
  })
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw `Errore ${resp.status} : errore nel recupero della tracklist`;
    }
  })
  .then((tracklist) => {
    console.log(tracklist);
    /* modifico le img delle canzoni */
    const ImgCanzone1 = document.getElementById("ImgCanzone1");
    ImgCanzone1.src = tracklist.data[0].album.cover_small;
    const ImgCanzone2 = document.getElementById("ImgCanzone2");
    ImgCanzone2.src = tracklist.data[1].album.cover_small;
    const ImgCanzone3 = document.getElementById("ImgCanzone3");
    ImgCanzone3.src = tracklist.data[2].album.cover_small;
    const ImgCanzone4 = document.getElementById("ImgCanzone4");
    ImgCanzone4.src = tracklist.data[3].album.cover_small;
    const ImgCanzone5 = document.getElementById("ImgCanzone5");
    ImgCanzone5.src = tracklist.data[4].album.cover_small;
    /* modifico i testi delle canzoni */
    const textCanzoneArtist1 = document.getElementById("textCanzoneArtist1");
    textCanzoneArtist1.innerHTML = tracklist.data[0].title;
    const textCanzoneArtist2 = document.getElementById("textCanzoneArtist2");
    textCanzoneArtist2.innerHTML = tracklist.data[1].title;
    const textCanzoneArtist3 = document.getElementById("textCanzoneArtist3");
    textCanzoneArtist3.innerHTML = tracklist.data[2].title;
    const textCanzoneArtist4 = document.getElementById("textCanzoneArtist4");
    textCanzoneArtist4.innerHTML = tracklist.data[3].title;
    const textCanzoneArtist5 = document.getElementById("textCanzoneArtist5");
    textCanzoneArtist5.innerHTML = tracklist.data[4].title;
    /* modifico il numero di riproduzioni*/
    const rankArtistCanzone1 = document.getElementById("rankArtistCanzone1");
    rankArtistCanzone1.innerHTML = tracklist.data[0].rank.toLocaleString();
    const rankArtistCanzone2 = document.getElementById("rankArtistCanzone2");
    rankArtistCanzone2.innerHTML = tracklist.data[1].rank.toLocaleString();
    const rankArtistCanzone3 = document.getElementById("rankArtistCanzone3");
    rankArtistCanzone3.innerHTML = tracklist.data[2].rank.toLocaleString();
    const rankArtistCanzone4 = document.getElementById("rankArtistCanzone4");
    rankArtistCanzone4.innerHTML = tracklist.data[3].rank.toLocaleString();
    const rankArtistCanzone5 = document.getElementById("rankArtistCanzone5");
    rankArtistCanzone5.innerHTML = tracklist.data[4].rank.toLocaleString();
    /* modifico la durata della canzone */
    const tempoCanzone1 = document.getElementById("tempoCanzone1");
    duration1 = tracklist.data[0].duration;
    tempoCanzone1Secondi = convertitoreDurationASecondi(duration1);
    tempoCanzone1.innerHTML = tempoCanzone1Secondi;
    const tempoCanzone2 = document.getElementById("tempoCanzone2");
    duration2 = tracklist.data[1].duration;
    tempoCanzone1Secondi = convertitoreDurationASecondi(duration2);
    tempoCanzone2.innerHTML = tempoCanzone1Secondi;
    const tempoCanzone3 = document.getElementById("tempoCanzone3");
    duration3 = tracklist.data[2].duration;
    tempoCanzone1Secondi = convertitoreDurationASecondi(duration3);
    tempoCanzone3.innerHTML = tempoCanzone1Secondi;
    const tempoCanzone4 = document.getElementById("tempoCanzone4");
    duration4 = tracklist.data[3].duration;
    tempoCanzone1Secondi = convertitoreDurationASecondi(duration4);
    tempoCanzone4.innerHTML = tempoCanzone1Secondi;
    const tempoCanzone5 = document.getElementById("tempoCanzone5");
    duration5 = tracklist.data[4].duration;
    tempoCanzone1Secondi = convertitoreDurationASecondi(duration5);
    tempoCanzone5.innerHTML = tempoCanzone1Secondi;
  })
  .catch((err) => alert(err));

function convertitoreDurationASecondi(duration) {
  const minuti = Math.floor(duration / 60);
  const secondi = duration % 60;
  const tempo = minuti + ":" + (secondi < 10 ? "0" : "") + secondi;
  return tempo;
}
//funzioni player
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();
let tracks = [];

async function fetchTracks() {
    try {
        let response = await fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88',
                'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        });
        let data = await response.json();
        tracks = data.data.map(track => ({
            title: track.title,
            artist: track.artist.name,
            src: track.preview,
            albumArt: track.album.cover_medium
        }));
        loadTrack(currentTrackIndex);
    } catch (error) {
        console.error('Errore nel recupero delle tracce:', error);
    }
}

function loadTrack(index) {
    audio.src = tracks[index].src;
    document.getElementById('track-title').innerText = tracks[index].title;
    document.getElementById('track-artist').innerText = tracks[index].artist;
    document.getElementById('album-art').src = tracks[index].albumArt;
    audio.load();
}

function playPauseTrack() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        document.getElementById('play-pause').src = 'play-icon.png';
    } else {
        audio.play();
        isPlaying = true;
        document.getElementById('play-pause').src = 'pause-icon.png';
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex > 0) ? currentTrackIndex - 1 : tracks.length - 1;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex < tracks.length - 1) ? currentTrackIndex + 1 : 0;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

document.getElementById('progress').addEventListener('input', function() {
    audio.currentTime = audio.duration * (this.value / 100);
});

audio.addEventListener('timeupdate', function() {
    document.getElementById('progress').value = (audio.currentTime / audio.duration) * 100;
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    document.getElementById('duration').innerText = formatTime(audio.duration);
});

document.getElementById('volume').addEventListener('input', function() {
    audio.volume = this.value;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
}

// Caricare le tracce all'avvio
fetchTracks();
