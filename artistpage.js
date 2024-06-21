document.addEventListener("DOMContentLoaded", function () {
  const id = new URLSearchParams(window.location.search).get("id");
  console.log("RESOURCE ID:", id);
  /* modifica dell'html in base all'id */
  const contenitoreImgArtist = document.getElementById("contenitoreImgArtist");
  const NomeArtista = document.getElementById("NomeArtista");
  const numeroFanArtist = document.getElementById("numeroFanArtist");
  const trackList = document.getElementById("trackList");
  let tracks = [];

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
          "x-rapidapi-key":
            "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
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
      tracks = tracklist.data.map((track) => ({
        title: track.title,
        artist: track.artist.name,
        src: track.preview,
        albumArt: track.album.cover_medium,
        rank: track.rank,
        duration: track.duration,
      }));
      trackList.querySelectorAll("li").forEach((li, index) => {
        li.addEventListener("click", () => {
          loadTrack(index);
          playPauseTrack(); // Avvia la riproduzione automaticamente
        });
      });

      // Aggiorna i dettagli delle canzoni nel tuo HTML
      updateTrackDetails();
    })
    .catch((err) => alert(err));

  function updateTrackDetails() {
    tracks.forEach((track, index) => {
      if (index < 5) {
        document.getElementById(`ImgCanzone${index + 1}`).src = track.albumArt;
        document.getElementById(`textCanzoneArtist${index + 1}`).innerText =
          track.title;
        document.getElementById(`rankArtistCanzone${index + 1}`).innerText =
          track.rank.toLocaleString();
        document.getElementById(`tempoCanzone${index + 1}`).innerText =
          convertitoreDurationASecondi(track.duration);
      }
    });
  }
  // Aggiorna i dettagli delle canzoni

  function convertitoreDurationASecondi(duration) {
    const minuti = Math.floor(duration / 60);
    const secondi = duration % 60;
    const tempo = minuti + ":" + (secondi < 10 ? "0" : "") + secondi;
    return tempo;
  }

  // funzioni player
  let currentTrackIndex = 0;
  let isPlaying = false;
  let audio = new Audio();

  function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].src;
    document
      .querySelectorAll(".track-title")
      .forEach((el) => (el.innerText = tracks[index].title));
    document
      .querySelectorAll(".track-artist")
      .forEach((el) => (el.innerText = tracks[index].artist));
    document.getElementById("album-art").src = tracks[index].albumArt;
    audio.load();
    if (isPlaying) audio.play();
    updatePlayPauseIcon();
  }

  function playPauseTrack() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play();
      isPlaying = true;
    }
    updatePlayPauseIcon();
  }

  function prevTrack() {
    currentTrackIndex =
      currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    loadTrack(currentTrackIndex);
  }

  function nextTrack() {
    currentTrackIndex =
      currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    loadTrack(currentTrackIndex);
  }

  document.getElementById("progress").addEventListener("click", function () {
    audio.currentTime = audio.duration * (this.value / 100);
  });

  audio.addEventListener("timeupdate", function () {
    document.getElementById("progress").value =
      (audio.currentTime / audio.duration) * 100;
    document.getElementById("current-time").innerText = formatTime(
      audio.currentTime
    );
    document.getElementById("duration").innerText =
      "0:30"; /* formatTime(audio.duration); */
  });

  document.getElementById("volume").addEventListener("input", function () {
    audio.volume = this.value;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  }

  function updatePlayPauseIcon() {
    document.getElementById("play-pause").src = isPlaying
      ? "pause-icon.png"
      : "play-icon.png";
  }

  document
    .getElementById("play-pause")
    .addEventListener("click", playPauseTrack);
  document.getElementById("prev-track").addEventListener("click", prevTrack);
  document.getElementById("next-track").addEventListener("click", nextTrack);
});

/* parte per la svg search */ /* da riportare in tutte le altre pagine */
document
  .getElementById("searchLink")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const barraRicercaHome = document.getElementById("barraRicercaHome");
    barraRicercaHome.classList.toggle("active");

    const iconWrapper = document.getElementById("iconWrapperSearch");
    iconWrapper.classList.toggle("active");
  });

document
  .getElementById("barraRicercaHomeInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const query = event.target.value;
      if (query) {
        searchInput(query);
      }
    }
  });
function searchInput(objSearch) {
  fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${objSearch}`,
    {
      headers: {
        "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    }
  )
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw `Errore ${resp.status} : errore nella creazione dell'annuncio`;
      }
    })
    .then((objSearch) => {
      console.log(objSearch);
    })
    .catch((err) => alert(err));
}

/* funzione per creare una lista dinamica */
const navPlaylistArray = [
  25, 50, 90, 2400, 8080, 2465, 26, 13, 656, 9357743, 543563, 266568, 2665,
  2234998, 22349984, 13456, 1345756, 66654346, 52, 54, 55, 56, 58, 60, 75, 76,
  91, 92, 93,
];
const listaNavDinamica = document.getElementById("listaNavDinamica");

function creazioneListaDinamica(objPlaylist) {
  const li = document.createElement("li");
  li.classList.add("nav-item");

  const a = document.createElement("a");
  a.classList.add("nav-link", "text-white");
  a.href = "#";
  a.textContent = objPlaylist.title;

  li.appendChild(a);
  listaNavDinamica.appendChild(li);
}

function fetchPlaylists() {
  navPlaylistArray.forEach((idAlbums) => {
    fetch(`https://deezerdevs-deezer.p.rapidapi.com/playlist/${idAlbums}`, {
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
      .then((objAlbum) => {
        console.log(objAlbum);
        creazioneListaDinamica(objAlbum);
      })
      .catch((err) => alert(err));
  });
}
fetchPlaylists();
