const params = new URLSearchParams(window.location.search);
const albumId = params.get("albumId");

const URL = "https://striveschool-api.herokuapp.com/api/deezer/album/" + albumId;
fetch(` https://striveschool-api.herokuapp.com/api/deezer/album/75621062`, {
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
    durataAlbum.innerText = album.duration;
  });
