const params = new URLSearchParams(window.location.search);
const albumId = params.get("albumId");

const URL = "https://striveschool-api.herokuapp.com/api/deezer/album/" + albumId;

function convertitoreDurationASecondi(duration) {
  const minuti = Math.floor(duration / 60);
  const secondi = duration % 60;
  const tempo = minuti + ":" + (secondi < 10 ? "0" : "") + secondi;
  return tempo;
}

function formatTime(number) {
  //funzione che mi formatta il numero in minuti e secondi
  let str = number.toString().padStart(4, "0"); // Assicurati che sia almeno di 4 cifre
  return str.slice(0, 2) + ":" + str.slice(2);
}

fetch(URL, {
  headers: {
    "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((resp) => {
    if (resp.ok) {
      console.log(resp);
      return resp.json();
    } else {
      throw `Errore ${resp.status} : errore nella creazione dell'annuncio`;
    }
  })
  .then((album) => {
    console.log(album);
    //inserisco dati dell'album dinamicamente nel banner in alto
    const coverAlbum = document.getElementById("coverAlbum");
    coverAlbum.src = album.cover_medium;

    const titoloAlbum = document.getElementById("titoloAlbum");
    titoloAlbum.innerText = album.title;

    const imgArtista = document.getElementById("immagineArtistaAlbum");
    imgArtista.src = album.artist.picture;

    const nomeArtista = document.getElementById("nomeArtista");
    nomeArtista.innerText = album.artist.name;

    const annoAlbum = document.getElementById("annoAlbum");
    annoAlbum.innerText = album.release_date;

    const numeroBrani = document.getElementById("numeroBrani");
    numeroBrani.innerText = album.nb_tracks + " Brani";

    const durataAlbum = document.getElementById("DurataAlbum");
    durataAlbum.innerText = formatTime(album.duration);

    //ora devo generare le row che conterranno all'interno i brani presenti nell'album

    const braniContainer = document.getElementById("contenitoreBrani");
    let i = 0;
    album.tracks.data.forEach((song) => {
      i++;
      const row = document.createElement("div");
      row.classList.add("row", "d-flex", "align-items-center");

      const col1 = document.createElement("div");
      col1.classList.add("col-1", "d-flex", "justify-content-end", "d-none", "d-sm-flex");

      const songNumber = document.createElement("p");
      songNumber.innerText = i;

      const col2 = document.createElement("div");
      col2.classList.add("col-11", "col-sm-7");
      const nomeCanzone = document.createElement("p");
      nomeCanzone.classList.add("mb-1", "text-light", "pointer");
      nomeCanzone.innerText = song.title;
      //Funzione che parte al click delle canzoni dell'album per riprodurle e aggiornare il player

      nomeCanzone.addEventListener("click", () => {
        const imgPlayer = document.getElementById("album-art");
        imgPlayer.src = album.cover_small;

        const nomeBrano = document.getElementById("track-title");
        nomeBrano.innerText = song.title;

        const nomeArtista = document.getElementById("track-artist");
        nomeArtista.innerText = song.artist.name;
        const previewCanzone = document.getElementById("audioPlayer");
        previewCanzone.src = song.preview;
        previewCanzone.play();

        //ad ogni secondo che passa viene aggiornata la progressbar e i secondi della traccia
        previewCanzone.addEventListener("timeupdate", function () {
          document.getElementById("progress").value = (previewCanzone.currentTime / previewCanzone.duration) * 100;
          document.getElementById("current-time").innerText = formatTime(previewCanzone.currentTime);
          document.getElementById("duration").innerText = formatTime(previewCanzone.duration);
        });

        //al movimento dello slider simanda a vanti o indietro la canzone

        document.getElementById("progress").addEventListener("input", function () {
          previewCanzone.currentTime = previewCanzone.duration * (this.value / 100);
        });
      });

      const nomeArtista = document.createElement("p");
      nomeArtista.innerText = song.artist.name;

      const col3 = document.createElement("div");
      col3.classList.add("col-2", "d-flex", "justify-content-end", "d-none", "d-sm-flex");
      const riproduzioni = document.createElement("p");
      riproduzioni.innerText = song.rank.toLocaleString();

      const col4 = document.createElement("div");
      col4.classList.add("col-2", "d-flex", "justify-content-end", "d-none", "d-sm-flex");
      const durataCanzone = document.createElement("p");
      //qui genero il bottone per il sottomenù presente solo negli schermi piccoli
      const colSvg = document.createElement("div");
      colSvg.classList.add("col-1", "d-sm-none");
      const buttonOptions = document.createElement("button");
      buttonOptions.classList.add("btn", "btn-transparent", "p-0");
      buttonOptions.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE" width="20px" fill="currentColor"><path d="M10.5 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm0 15a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm0-7.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"></path></svg>`;

      durataCanzone.innerText = convertitoreDurationASecondi(song.duration);
      colSvg.appendChild(buttonOptions);
      col4.appendChild(durataCanzone);
      col3.appendChild(riproduzioni);
      col2.appendChild(nomeCanzone);
      col2.appendChild(nomeArtista);
      col1.appendChild(songNumber);
      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      row.appendChild(col4);
      row.appendChild(colSvg);
      braniContainer.appendChild(row);
    });
  })
  .catch((err) => console.log(err));
/* ************************************************************* */
//funzione per rendere dinamico il player dal tasto play dell'album generico
const riproduzioneAlbum = () => {
  fetch(URL, {
    headers: {
      "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((resp) => {
      if (resp.ok) {
        console.log(resp);
        return resp.json();
      } else {
        throw `Errore ${resp.status} : errore nella creazione dell'annuncio`;
      }
    })
    .then((album) => {
      const imgPlayer = document.getElementById("album-art");
      imgPlayer.src = album.cover_small;

      const nomeBrano = document.getElementById("track-title");
      nomeBrano.innerText = album.tracks.data[0].title;

      const nomeArtista = document.getElementById("track-artist");
      nomeArtista.innerText = album.tracks.data[0].artist.name;

      const previewCanzone = document.getElementById("audioPlayer");
      previewCanzone.src = album.tracks.data[0].preview;

      previewCanzone.play();

      //ad ogni secondo che passa viene aggiornata la progressbar e i secondi della traccia

      previewCanzone.addEventListener("timeupdate", function () {
        document.getElementById("progress").value = (previewCanzone.currentTime / previewCanzone.duration) * 100;
        document.getElementById("current-time").innerText = formatTime(previewCanzone.currentTime);
        document.getElementById("duration").innerText = formatTime(previewCanzone.duration);
      });

      //al movimento dello slider simanda a vanti o indietro la canzone
      document.getElementById("progress").addEventListener("input", function () {
        previewCanzone.currentTime = previewCanzone.duration * (this.value / 100);
      });
    });
};

const progressBarPlayer = () => {
  const tempoDiRiproduzione = document.getElementById("current-time");
  const progressBar = document.getElementById("progress");
  let currentTime = 0;
  let maxTime = 30;
  progressBar.style.width = "0%";
  tempoDiRiproduzione.innerText = "0:00";

  const interval = setInterval(() => {
    currentTime++;
    let percentage = (currentTime / maxTime) * 100;

    progressBar.style.width = percentage + "%";
    tempoDiRiproduzione.textContent = convertitoreDurationASecondi(currentTime);

    if (currentTime === maxTime) {
      clearInterval(interval);
    }
  }, 1000);
};

const aggiornamentoProgressBarSlider = () => {
  document.getElementById("progress").value = (audio.currentTime / audio.duration) * 100;
  document.getElementById("current-time").innerText = formatTime(audio.currentTime);
  document.getElementById("duration").innerText = formatTime(audio.duration);
};
const playButton = document.getElementById("playButton");
playButton.addEventListener("click", () => {
  riproduzioneAlbum();
});

//********************PLAYER DEFAULT********************** */
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();
let tracks = [];

async function fetchTracks() {
  try {
    let response = await fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem", {
      method: "GET",
      headers: {
        "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    });
    let data = await response.json();
    tracks = data.data.map((track) => ({
      title: track.title,
      artist: track.artist.name,
      src: track.preview,
      albumArt: track.album.cover_medium,
    }));
    loadTrack(currentTrackIndex);
  } catch (error) {
    console.error("Errore nel recupero delle tracce:", error);
  }
}

function loadTrack(index) {
  audio.src = tracks[index].src;
  document.querySelectorAll(".track-title").forEach((el) => (el.innerText = tracks[index].title));
  document.querySelectorAll(".track-artist").forEach((el) => (el.innerText = tracks[index].artist));
  document.getElementById("album-art").src = tracks[index].albumArt;
  audio.load();
}

function playPauseTrack() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    document.getElementById("play-pause").src = "play-icon.png";
  } else {
    audio.play();
    isPlaying = true;
    document.getElementById("play-pause").src = "pause-icon.png";
  }
}

function prevTrack() {
  currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
  loadTrack(currentTrackIndex);
  if (isPlaying) audio.play();
}

function nextTrack() {
  currentTrackIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
  loadTrack(currentTrackIndex);
  if (isPlaying) audio.play();
}

document.getElementById("progress").addEventListener("input", function () {
  audio.currentTime = audio.duration * (this.value / 100);
});

audio.addEventListener("timeupdate", function () {
  document.getElementById("progress").value = (audio.currentTime / audio.duration) * 100;
  document.getElementById("current-time").innerText = formatTime(audio.currentTime);
  document.getElementById("duration").innerText = formatTime(audio.duration);
});

document.getElementById("volume").addEventListener("input", function () {
  audio.volume = this.value;
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

// Caricare le tracce all'avvio
fetchTracks();

const playPauseIcons = document.querySelectorAll(".play-pause-icon");
playPauseIcons.forEach((icon) => {
  icon.addEventListener("click", playPauseTrack);
});
