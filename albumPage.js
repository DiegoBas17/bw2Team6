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
    coverAlbum.src = album.cover;

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
      col1.classList.add("col-1");

      const songNumber = document.createElement("p");
      songNumber.innerText = i;

      const col2 = document.createElement("div");
      col2.classList.add("col-7");
      const nomeCanzone = document.createElement("p");
      nomeCanzone.classList.add("mb-1", "text-light");
      nomeCanzone.innerText = song.title;
      const nomeArtista = document.createElement("p");
      nomeArtista.innerText = song.artist.name;

      const col3 = document.createElement("div");
      col3.classList.add("col-2", "d-flex", "justify-content-end");
      const riproduzioni = document.createElement("p");
      riproduzioni.innerText = song.rank.toLocaleString();

      const col4 = document.createElement("div");
      col4.classList.add("col-2", "d-flex", "justify-content-end");
      const durataCanzone = document.createElement("p");

      durataCanzone.innerText = convertitoreDurationASecondi(song.duration);

      col4.appendChild(durataCanzone);
      col3.appendChild(riproduzioni);
      col2.appendChild(nomeCanzone);
      col2.appendChild(nomeArtista);
      col1.appendChild(songNumber);
      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      row.appendChild(col4);
      braniContainer.appendChild(row);
    });
  });