document.addEventListener("DOMContentLoaded", function() {
  const id = new URLSearchParams(window.location.search).get("id");
  console.log("RESOURCE ID:", id);
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
      tracks = tracklist.data.map(track => ({
        title: track.title,
        artist: track.artist.name,
        src: track.preview,
        albumArt: track.album.cover_medium,
        rank: track.rank,
        duration: track.duration
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
        document.getElementById(`textCanzoneArtist${index + 1}`).innerText = track.title;
        document.getElementById(`rankArtistCanzone${index + 1}`).innerText = track.rank.toLocaleString();
        document.getElementById(`tempoCanzone${index + 1}`).innerText = convertitoreDurationASecondi(track.duration);
      }
    });
  }
  
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

  function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].src;
    document.querySelectorAll('.track-title').forEach(el => el.innerText = tracks[index].title);
    document.querySelectorAll('.track-artist').forEach(el => el.innerText = tracks[index].artist);
    document.getElementById('album-art').src = tracks[index].albumArt;
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
    currentTrackIndex = (currentTrackIndex > 0) ? currentTrackIndex - 1 : tracks.length - 1;
    loadTrack(currentTrackIndex);
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex < tracks.length - 1) ? currentTrackIndex + 1 : 0;
    loadTrack(currentTrackIndex);
  }

  document.getElementById('progress').addEventListener('click', function() {
    audio.currentTime = audio.duration * (this.value / 100);
  });

  audio.addEventListener('timeupdate', function() {
    document.getElementById('progress').value = (audio.currentTime / audio.duration) * 100;
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    document.getElementById('duration').innerText = "0:30"; /* formatTime(audio.duration); */
  });

  document.getElementById('volume').addEventListener('input', function() {
    audio.volume = this.value;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  }

  function updatePlayPauseIcon() {
    document.querySelectorAll('.play-pause-icon').forEach(el => {
      el.innerHTML = isPlaying ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5.5A.5.5 0 0 0 6 6v4a.5.5 0 0 0 .5.5h1A.5.5 0 0 0 8 10V6a.5.5 0 0 0-.5-.5h-1zM10 5.5A.5.5 0 0 0 9.5 6v4a.5.5 0 0 0 .5.5h1A.5.5 0 0 0 11 10V6a.5.5 0 0 0-.5-.5h-1z"/>
        </svg>
      ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
        </svg>
      `;
    });
  }

  document.getElementById('svgPlayPause').addEventListener('click', function() {
    if (tracks.length > 0) {
      loadTrack(0); // Carica la prima traccia (o cambia l'indice per caricare una traccia specifica)
      playPauseTrack(); // Avvia o mette in pausa la riproduzione
    }
  });

  document.getElementById('play-pause').addEventListener('click', playPauseTrack);
  document.getElementById('prev-track').addEventListener('click', prevTrack);
  document.getElementById('next-track').addEventListener('click', nextTrack);
});
