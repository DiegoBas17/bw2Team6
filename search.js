const params = new URLSearchParams(window.location.search);
const idSearch = params.get("id");

const URL = "https://deezerdevs-deezer.p.rapidapi.com/search/?q=" + idSearch;

function convertitoreDurationASecondi(duration) {
  const minuti = Math.floor(duration / 60);
  const secondi = duration % 60;
  const tempo = minuti + ":" + (secondi < 10 ? "0" : "") + secondi;
  return tempo;
}

function formatTime(number) {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const riproduzioneAlbum = () => {
  fetch(URL, {
    headers: {
      "x-rapidapi-key": "29c0a4f314mshac4cba9bf78ad4cp17ff1cjsn5a53e9406430",
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
    .then((search) => {
      const imgPlayer = document.getElementById("album-art");
      imgPlayer.src = search.data[0].album.cover_small;

      const nomeBrano = document.getElementById("track-title");
      nomeBrano.innerText = search.data[0].title;

      const nomeArtista = document.getElementById("track-artist");
      nomeArtista.innerText = search.data[0].artist.name;

      const previewCanzone = document.getElementById("audioPlayer");
      previewCanzone.src = search.data[0].preview;

      previewCanzone.play();

      //ad ogni secondo che passa viene aggiornata la progressbar e i secondi della traccia
      previewCanzone.addEventListener("timeupdate", function () {
        document.getElementById("progress").value = (previewCanzone.currentTime / previewCanzone.duration) * 100;
        document.getElementById("current-time").innerText = formatTime(previewCanzone.currentTime);
        document.getElementById("duration").innerText = formatTime(previewCanzone.duration);
      });

      //al movimento dello slider si manda avanti o indietro la canzone
      document.getElementById("progress").addEventListener("input", function () {
        previewCanzone.currentTime = previewCanzone.duration * (this.value / 100);
      });
    });
};

window.addEventListener("DOMContentLoaded", () => {
  fetch(URL, {
    headers: {
      "x-rapidapi-key": "29c0a4f314mshac4cba9bf78ad4cp17ff1cjsn5a53e9406430",
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
    .then((search) => {
      const coverAlbum = document.getElementById("coverAlbum");
      coverAlbum.src = search.data[0].artist.picture_medium;
      coverAlbum.crossOrigin = "Anonymous";

      const imgThief = coverAlbum;
      const colorThief = new ColorThief();
      if (imgThief.complete) {
        const coloreDomimante = colorThief.getColor(imgThief);
        const main = document.getElementsByTagName("main")[0];
        main.style.backgroundImage = `linear-gradient(to bottom, rgb(${coloreDomimante[0]}, ${coloreDomimante[1]}, ${coloreDomimante[2]}), black 50%)`;
      }

      const titoloAlbum = document.getElementById("titoloAlbum");
      titoloAlbum.innerText = search.data[0].artist.name;

      const numeroBrani = document.getElementById("numeroBrani");
      numeroBrani.innerText = search.data.length + " Brani";

      const braniContainer = document.getElementById("contenitoreBrani");
      let i = 0;
      search.data.forEach((song) => {
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

        nomeCanzone.addEventListener("click", () => {
          const imgPlayer = document.getElementById("album-art");
          imgPlayer.src = song.album.cover_small;

          const nomeBrano = document.getElementById("track-title");
          nomeBrano.innerText = song.title;
          const nomeBrano1 = document.getElementById("track-title-mobile");
          nomeBrano1.innerText = song.title;


          const nomeArtista = document.getElementById("track-artist");
          nomeArtista.innerText = song.artist.name;
          const nomeArtista1 = document.getElementById("track-artist-mobile");
          nomeArtista1.innerText = song.artist.name;

          const previewCanzone = document.getElementById("audioPlayer");
          previewCanzone.src = song.preview;
          previewCanzone.play();

          previewCanzone.addEventListener("timeupdate", function () {
            document.getElementById("progress").value = (previewCanzone.currentTime / previewCanzone.duration) * 100;
            document.getElementById("current-time").innerText = formatTime(previewCanzone.currentTime);
            document.getElementById("duration").innerText = formatTime(previewCanzone.duration);
          });

          document.getElementById("progress").addEventListener("input", function () {
            previewCanzone.currentTime = previewCanzone.duration * (this.value / 100);
          });
        });

        const nomeArtista = document.createElement("p");
        nomeArtista.innerText = song.album.title;

        const col3 = document.createElement("div");
        col3.classList.add("col-2", "d-flex", "justify-content-end", "d-none", "d-sm-flex");
        const riproduzioni = document.createElement("p");
        riproduzioni.innerText = song.rank.toLocaleString();

        const col4 = document.createElement("div");
        col4.classList.add("col-2", "d-flex", "justify-content-end", "d-none", "d-sm-flex");
        const durataCanzone = document.createElement("p");
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

  const playButton = document.getElementById("playButtonVerde");
  playButton.addEventListener("click", () => {
    riproduzioneAlbum();
  });

  const audio = document.getElementById("audioPlayer");
  const buttonPlayerPlayPause = document.getElementById("play-pause");
  const buttonPlayerPlayPause1 = document.getElementById("play-pause-mobile");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");

document.getElementById('volume').addEventListener('input', function() {
  audio.volume = this.value;
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playIcon.classList.add("d-none");
    pauseIcon.classList.remove("d-none");
  } else {
    audio.pause();
    playIcon.classList.remove("d-none");
    pauseIcon.classList.add("d-none");
  }
}

buttonPlayerPlayPause.addEventListener("click", togglePlayPause);
buttonPlayerPlayPause1.addEventListener("click", togglePlayPause);
});

//////////
  buttonPlayerPlayPause.addEventListener("click", togglePlayPause);
  buttonPlayerPlayPause1.addEventListener("click", togglePlayPause);
  

  /* parte per la svg search */ /* da riportare in tutte le altre pagine */
  document.getElementById("searchLink").addEventListener("click", function (event) {
    event.preventDefault();
    const barraRicercaHome = document.getElementById("barraRicercaHome");
    barraRicercaHome.classList.toggle("active");

    const iconWrapper = document.querySelector(".iconWrapperSearch");
    iconWrapper.classList.toggle("active");
  });

  document.getElementById("barraRicercaHomeInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const query = event.target.value;
      if (query) {
        searchInput(query);
      }
    }
  });
  function searchInput(objSearch) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${objSearch}`, {
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
      .then((objSearch) => {
        console.log(objSearch);
      })
      .catch((err) => alert(err));
  }

  /* funzione per creare una lista dinamica */
  const navPlaylistArray = [
    25, 50, 90, 2400, 8080, 2465, 26, 13, 656, 9357743, 543563, 266568, 2665, 2234998, 22349984, 13456, 1345756,
    66654346, 52, 54, 55, 56, 58, 60, 75, 76, 91, 92, 93,
  ];
  const listaNavDinamica = document.getElementById("listaNavDinamica");

  function creazioneListaDinamica(objPlaylist) {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.classList.add("nav-link", "text-white");
    a.href = `./playlist.html?idPlaylist=${objPlaylist.id}`;
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
