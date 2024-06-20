/* creo un array fittizio per generare un album random al caricamento della pagina */
const albumAnnunci = [
  594581752, 228423362, 513551092, 382624, 551434412, 299319, 12047958,
];
let currentArtistId = 0;
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
  currentArtistId = album.artist.id;
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
/* evento click dell'annuncio (pagina artist) */
albumArtist.style.cursor = "pointer";
albumArtist.addEventListener("click", () => {
  window.location.assign(`./Artistpage.html?id=${currentArtistId}`);
});
const buttonPlayAnnuncioHomePage = document.getElementById(
  "buttonPlayAnnuncioHomePage"
);
buttonPlayAnnuncioHomePage.addEventListener("click", () => {
  window.location.assign(`./Albumpage.html?albumId=${currentRandomId}`);
});
/* sezione per la parte playlist */
const playlistArray = [25, 50, 90, 2400, 8080, 2465]; /* tesoro */
const playlistContainer = document.getElementById("playlistContainer");

function createPlaylistCard(objPlaylist) {
  const playlistCard = document.createElement("div");
  playlistCard.classList.add("col-6", "col-sm-6", "col-lg-4", "card-hover");

  const divBAckground = document.createElement("div");
  divBAckground.classList.add("bg-dark");

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

  divBAckground.appendChild(img);
  divBAckground.appendChild(title);

  playlistCard.appendChild(divBAckground);
  playlistContainer.appendChild(playlistCard);
}

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
      createPlaylistCard(objPlaylist);
      creaPlaylistCardMobile(objPlaylist);
    })
    .catch((err) => alert(err));
});

/* altro che ti piace */
const playlistArray2 = [25, 50, 90, 2400, 8080];
const playlistContainer2 = document.getElementById("cotenitoreCarte2");

function createCardAltro(objPlaylist) {
  const card = document.createElement("div");
  card.classList.add("col-md-3", "col-lg-3", "col-xl-2", "col-6");

  const divBackground = document.createElement("div");
  divBackground.classList.add("card", "border-0", "card-hover", "bg-dark");

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("position-relative");

  const img = document.createElement("img");
  img.src = objPlaylist.picture_medium;
  img.alt = objPlaylist.title;
  img.classList.add("card-img-top");
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    console.log(`Immagine cliccata: ${objPlaylist.title}`);
  });

  const playBtn = document.createElement("button");
  playBtn.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" width="30px" height="30px" class="Svg-sc-ytk21e-0 dYnaPI"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>`;
  playBtn.classList.add(
    "btn",
    "rounded-circle",
    "bg-success",
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "position-absolute",
    "bottom-0",
    "end-0",
    "d-none",
    "p-2"
  );

  imgContainer.appendChild(img);
  imgContainer.appendChild(playBtn);

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
  divBackground.appendChild(imgContainer);
  divBackground.appendChild(cardBody);
  card.appendChild(divBackground);

  card.addEventListener("mouseover", () => {
    playBtn.classList.remove("d-none");
    card.classList.add("shadow-lg");
  });
  card.addEventListener("mouseout", () => {
    playBtn.classList.add("d-none");
    card.classList.remove("shadow-lg");
  });

  return card;
}

const row = document.createElement("div");
row.classList.add("row", "justify-content-between", "g-2");
playlistContainer2.appendChild(row);

for (let i = 0; i < playlistArray2.length; i++) {
  const id = playlistArray2[i];
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
      const card = createCardAltro(objPlaylist);

      if (i === playlistArray2.length - 1) {
        card.classList.add("d-none", "d-xl-block");
      }

      row.appendChild(card);
    })
    .catch((err) => alert(err));
}
/* parte mobile */
function creaPlaylistCardMobile(objPlaylist) {
  const contenitoreCardsPlaylistMobile = document.getElementById(
    "contenitoreCardsPlaylistMobile"
  );

  const cartaPlaylistMobile = document.createElement("div");
  cartaPlaylistMobile.classList.add("bg-dark", "my-3", "px-4", "py-3");

  const row = document.createElement("div");
  row.classList.add("row");

  const colLeft = document.createElement("div");
  colLeft.classList.add("col-6");

  const img = document.createElement("img");
  img.src = objPlaylist.picture_medium;
  img.alt = objPlaylist.title;
  img.classList.add("w-100");

  const colRight = document.createElement("div");
  colRight.classList.add("col-6");

  const paragrafoPlaylistMobile = document.createElement("p");
  paragrafoPlaylistMobile.classList.add("text-secondary");
  paragrafoPlaylistMobile.textContent = "Playlist";

  const playlistTitle = document.createElement("p");
  playlistTitle.textContent = objPlaylist.title;

  const iconsLeftContainer = document.createElement("div");

  const cuoreIconContainer = document.createElement("div");
  cuoreIconContainer.classList.add("d-inline");
  cuoreIconContainer.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#1CD860" class="bi bi-heart-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
    </svg>
  `;

  const puntiniIconContainer = document.createElement("div");
  puntiniIconContainer.classList.add("d-inline");
  puntiniIconContainer.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-three-dots-vertical mx-2" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </svg>
  `;

  const iconsRightContainer = document.createElement("div");
  iconsRightContainer.classList.add("d-flex", "align-items-center");

  const numberOfTracks = document.createElement("p");
  numberOfTracks.classList.add("d-inline", "mx-2", "mb-0");
  numberOfTracks.textContent = `${objPlaylist.nb_tracks} brani`;

  const playIconContainer = document.createElement("div");
  playIconContainer.classList.add(
    "bg-black",
    "rounded-circle",
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "d-inline"
  );
  playIconContainer.style.width = "40px";
  playIconContainer.style.height = "40px";
  playIconContainer.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16" style="width: 20px; height: 20px;">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
    </svg>
  `;

  colLeft.appendChild(img);
  colRight.appendChild(paragrafoPlaylistMobile);
  colRight.appendChild(playlistTitle);

  iconsLeftContainer.appendChild(cuoreIconContainer);
  iconsLeftContainer.appendChild(puntiniIconContainer);

  iconsRightContainer.appendChild(numberOfTracks);
  iconsRightContainer.appendChild(playIconContainer);

  const iconsContainer = document.createElement("div");
  iconsContainer.classList.add("d-flex", "justify-content-between", "mt-3");

  iconsContainer.appendChild(iconsLeftContainer);
  iconsContainer.appendChild(iconsRightContainer);

  row.appendChild(colLeft);
  row.appendChild(colRight);

  cartaPlaylistMobile.appendChild(row);
  cartaPlaylistMobile.appendChild(iconsContainer);

  contenitoreCardsPlaylistMobile.appendChild(cartaPlaylistMobile);
}

window.addEventListener("DOMContentLoaded", idRandomAnnunciForFetch);

/* footer */
const tempoDiRiproduzione = document.getElementById("tempoDiRiproduzione");
const progressBar = document.getElementById("progress-bar");
const playButton = document.getElementById("playButtonMusic");
let currentTime = 0;
let maxTime = 30;

playButton.addEventListener("click", function () {
  currentTime = 0;
  progressBar.style.width = "0%";
  tempoDiRiproduzione.textContent = "0:00";

  const interval = setInterval(() => {
    currentTime++;
    let percentage = (currentTime / maxTime) * 100;
    progressBar.style.width = percentage + "%";
    tempoDiRiproduzione.textContent = convertitoreDurationASecondi(currentTime);

    if (currentTime === maxTime) {
      clearInterval(interval);
    }
  }, 1000);
});
function convertitoreDurationASecondi(duration) {
  const minuti = Math.floor(duration / 60);
  const secondi = duration % 60;
  const tempo = minuti + ":" + (secondi < 10 ? "0" : "") + secondi;
  return tempo;
}
/* parte per la scg search */
document
  .getElementById("searchLink")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const barraRicercaHome = document.getElementById("barraRicercaHome");
    barraRicercaHome.classList.toggle("active");

    const iconWrapper = document.querySelector(".iconWrapperSearch");
    iconWrapper.classList.toggle("active");
  });
