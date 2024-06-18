/* creo un array fittizio per generare un album random al caricamento della pagina */
const albumAnnunci = [
  594581752, 228423362, 513551092, 382624, 393303017, 551434412,
];
/* funzione per ottenere un index random per usarlo nell'array */
function randomIdAnnuncio() {
  const randomIndex = Math.floor(Math.random() * albumAnnunci.length);
  return albumAnnunci[randomIndex];
}
const albumArtist = document.getElementById("autoreAnnuncio");
/* funzione per aggiornare l'annuncio */
function aggiornamentoAnnuncio(album) {
  const albumImage = document.getElementById("albumImage");
  const albumTitle = document.getElementById("titoloAnnuncio");

  const albumPromotion = document.getElementById("testoPromozionaleAnnuncio");
  albumImage.src = album.cover_medium;
  albumImage.alt = album.title;
  albumTitle.innerText = album.title;
  albumArtist.innerText = album.artist.name;
  albumPromotion.innerText = `Ascolta il nuovo album di ${album.artist.name}`;
}
let currentRandomId = 0;

function idRandomAnnunciForFetch() {
  const id = randomIdAnnuncio();
  currentRandomId = id;

  fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${id}`, {
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
      /* continuo con cambiare la sezione annuncio */
      aggiornamentoAnnuncio(objAlbum);
    })
    .catch((err) => alert(err));
}
/* evento play dell'annuncio (pagina artist) */
albumArtist.style.cursor = "pointer";
albumArtist.addEventListener("click", () => {
  window.location.assign(`./Artistpage.html?id=${currentRandomId}`);
});
/* sezione per la parte playlist */
const playlistArray = [25, 50, 90, 2400, 8080, 2465];
const playlistContainer = document.getElementById("playlistContainer");
playlistArray.forEach((id) => {
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/playlist/${id}`, {
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
    .then((objPlaylist) => {
      console.log(objPlaylist);
      const playlistCard = document.createElement("div");
      playlistCard.classList.add("col-4", "bg-dark", "card-hover");
      playlistCard.style.cursor = "pointer";
      playlistCard.addEventListener("click", () => {
        console.log(`Immagine cliccata: ${objPlaylist.title}`);
      });

      const img = document.createElement("img");
      img.src = objPlaylist.picture_medium;
      img.alt = objPlaylist.title;
      img.classList.add("d-inline");
      img.style.width = "80px";

      const title = document.createElement("p");
      title.innerHTML = objPlaylist.title;
      title.classList.add("d-inline", "ms-2");

      playlistCard.appendChild(img);
      playlistCard.appendChild(title);
      playlistContainer.appendChild(playlistCard);
    })
    .catch((err) => alert(err));
});
/* altro che ti piace */
const playlistArray2 = [25, 50, 90, 2400, 8080];
const playlistContainer2 = document.getElementById("cotenitoreCarte2");

playlistArray2.forEach((id) => {
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/playlist/${id}`, {
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
    .then((objPlaylist) => {
      const card = document.createElement("div");
      card.classList.add("card", "border-0", "card-hover");
      card.style.width = "18%";

      const img = document.createElement("img");
      img.src = objPlaylist.picture_medium;
      img.alt = objPlaylist.title;
      img.classList.add("card-img-top");
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        console.log(`Immagine cliccata: ${objPlaylist.title}`);
      });

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.innerHTML = objPlaylist.title;
      cardTitle.style.cursor = "pointer";
      cardTitle.addEventListener("click", () => {
        console.log(`Titolo cliccato: ${objPlaylist.title}`);
      });

      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.innerHTML = "Le playlist del momento";

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      card.appendChild(img);
      card.appendChild(cardBody);
      playlistContainer2.appendChild(card);
    })
    .catch((err) => alert(err));
});

window.addEventListener("DOMContentLoaded", idRandomAnnunciForFetch);
