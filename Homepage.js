//creo un array fittizio per generare un album random al caricamento della pagina / 
const albumAnnunci = [   594581752, 228423362, 513551092, 382624, 393303017, 551434412, ]; 
// funzione per ottenere un index random per usarlo nell'array  
function randomIdAnnuncio() {   
    const randomIndex = Math.floor(Math.random() * albumAnnunci.length);   
    return albumAnnunci[randomIndex]; } 
    /* funzione per aggiornare l'annuncio */ 
function aggiornamentoAnnuncio(album) {   
    const albumImage = document.querySelector(".heroAnnuncio img");   
    const albumTitle = document.getElementById("titoloAnnuncio");   
    const albumArtist = document.getElementById("autoreAnnuncio");   
    const albumPromotion = document.getElementById("testoPromozionaleAnnuncio");    
    albumImage.src = album.cover_medium;   
    albumImage.alt = album.title;    
    albumTitle.innerText = album.title;    
    albumArtist.innerText = album.artist.name;    
    albumPromotion.innerText = `Ascolta il nuovo album di ${album.artist.name}`; 
} 
function idRandomAnnunciForFetch() {
    const id = randomIdAnnuncio();

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
            throw Errore `${resp.status} : errore nella creazione del prodotto`;
          }
        })
        .then((objAlbum) => {
          console.log(objAlbum);
          /* continuo con cambiare la sezione annuncio */
          aggiornamentoAnnuncio(objAlbum);
        })
        .catch((err) => alert(err));
    }
    
    window.addEventListener("DOMContentLoaded", idRandomAnnunciForFetch);