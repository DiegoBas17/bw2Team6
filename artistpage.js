document.addEventListener("DOMContentLoaded", function() {
   // Recupera l'id dell'artista dalla URL
  const id = new URLSearchParams(window.location.search).get("id");
  console.log("RESOURCE ID:", id);
  // Seleziona gli elementi del DOM che verranno aggiornati con i dettagli dell'artista
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
      // Aggiorna il DOM con i dettagli dell'artista
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
      //prova array
      
       // Mappa i dati delle tracce in un array di oggetti traccia
      tracks = tracklist.data.map(track => ({
        title: track.title,
        artist: track.artist.name,
        src: track.preview,
        albumArt: track.album.cover_medium,
        rank: track.rank,
        duration: track.duration,
      }));
       // Aggiungi event listener per ogni elemento della lista delle tracce
      trackList.querySelectorAll("li").forEach((li, index) => {
        li.addEventListener("click", () => {
          loadTrack(index);
          playPauseTrack(); // Avvia la riproduzione automaticamente
        });
      });
      
        // Aggiorna i dettagli delle canzoni nel DOM
      updateTrackDetails();
    })
    .catch((err) => alert(err));
 // Funzione per aggiornare i dettagli delle tracce nel DOM
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
   // Funzione per convertire la durata in minuti e secondi
  function convertitoreDurationASecondi(duration) {
    const minuti = Math.floor(duration / 60);
    const secondi = duration % 60;
    const tempo = minuti + ":" + (secondi < 10 ? "0" : "") + secondi;
    return tempo;
  }

  // Funzioni player
  let currentTrackIndex = 0;
  let isPlaying = false;
  let audio = new Audio();

   // Funzione per caricare una traccia specifica
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
    updatePlayPauseIcons();
  }
// Funzione per mettere in play/pausa la traccia corrente
  function playPauseTrack() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play();
      isPlaying = true;
    }
    updatePlayPauseIcon();
    updatePlayPauseIcons();
  }
 // Funzione per passare alla traccia precedente
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
 // Event listener click per la barra di progresso
  document.getElementById('progress').addEventListener('click', function() {
    audio.currentTime = audio.duration * (this.value / 100);
  });
 // Event listener per aggiornare il tempo corrente e la barra di progresso
 audio.addEventListener('timeupdate', function() {
  // Aggiorna la barra di progresso solo se l'audio è in riproduzione
  if (isPlaying) {
    document.getElementById('progress').value = (audio.currentTime / audio.duration) * 100;
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    document.getElementById('duration').innerText = "0:30"; /* formatTime(audio.duration); */
  }
});
// Event listener per il controllo del volume
  document.getElementById('volume').addEventListener('input', function() {
    audio.volume = this.value;
  });
// Funzione per formattare il tempo in minuti e secondi
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  }
 // Funzione per aggiornare l'icona play/pausa
  function updatePlayPauseIcon() {
    document.querySelectorAll('.play-pause-icon').forEach(el => {
      el.innerHTML = isPlaying ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="green" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
           <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
        </svg>
      ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="green" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
        </svg>
      `;
    });
  }  // Funzione per aggiornare tutte le icone play/pausa nel DOM
  function updatePlayPauseIcons() {
    document.querySelectorAll('.play-pause-icons').forEach(el => {
      el.innerHTML = isPlaying ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
</svg>
      ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
</svg>
      `;
    });
  }
  // Event listener per il bottone play/pausa del player principale
  document.getElementById('svgPlayPause').addEventListener('click', function() {
    if (tracks.length > 0) {
      loadTrack(0); // Carica la prima traccia (o cambia l'indice per caricare una traccia specifica)
      playPauseTrack(); // Avvia o mette in pausa la riproduzione
    }
  });
// Event listener per riproduzione
  document.getElementById('play-pause').addEventListener('click', playPauseTrack);
  document.getElementById('play-pause-mobile').addEventListener('click', playPauseTrack);
  document.getElementById('prev-track').addEventListener('click', prevTrack);
  document.getElementById('next-track').addEventListener('click', nextTrack);
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
