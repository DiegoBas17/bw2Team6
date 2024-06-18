const id = new URLSearchParams(window.location.search).get("id");
console.log("RESOURCE ID:", id);
/* modifica dell'html in base all'id */
const contenitoreImgArtist = document.getElementById("contenitoreImgArtist");
const NomeArtista = document.getElementById("NomeArtista");
const numeroFanArtist = document.getElementById("numeroFanArtist");
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
    numeroFanArtist.innerHTML = objArtist.nb_fan.toLocaleString();

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
    /* modifico le img delle canzoni */
    const ImgCanzone1 = document.getElementById("ImgCanzone1");
    ImgCanzone1.src = tracklist.data[0].album.cover_small;
    const ImgCanzone2 = document.getElementById("ImgCanzone2");
    ImgCanzone2.src = tracklist.data[1].album.cover_small;
    const ImgCanzone3 = document.getElementById("ImgCanzone3");
    ImgCanzone3.src = tracklist.data[2].album.cover_small;
    const ImgCanzone4 = document.getElementById("ImgCanzone4");
    ImgCanzone4.src = tracklist.data[3].album.cover_small;
    const ImgCanzone5 = document.getElementById("ImgCanzone5");
    ImgCanzone5.src = tracklist.data[4].album.cover_small;
    /* modifico i testi delle canzoni */
    const textCanzoneArtist1 = document.getElementById("textCanzoneArtist1");
    textCanzoneArtist1.innerHTML = tracklist.data[0].title;
    const textCanzoneArtist2 = document.getElementById("textCanzoneArtist2");
    textCanzoneArtist2.innerHTML = tracklist.data[1].title;
    const textCanzoneArtist3 = document.getElementById("textCanzoneArtist3");
    textCanzoneArtist3.innerHTML = tracklist.data[2].title;
    const textCanzoneArtist4 = document.getElementById("textCanzoneArtist4");
    textCanzoneArtist4.innerHTML = tracklist.data[3].title;
    const textCanzoneArtist5 = document.getElementById("textCanzoneArtist5");
    textCanzoneArtist5.innerHTML = tracklist.data[4].title;
    /* modifico il numero di riproduzioni*/
    const rankArtistCanzone1 = document.getElementById("rankArtistCanzone1");
    rankArtistCanzone1.innerHTML = tracklist.data[0].rank.toLocaleString();
    const rankArtistCanzone2 = document.getElementById("rankArtistCanzone2");
    rankArtistCanzone2.innerHTML = tracklist.data[1].rank.toLocaleString();
    const rankArtistCanzone3 = document.getElementById("rankArtistCanzone3");
    rankArtistCanzone3.innerHTML = tracklist.data[2].rank.toLocaleString();
    const rankArtistCanzone4 = document.getElementById("rankArtistCanzone4");
    rankArtistCanzone4.innerHTML = tracklist.data[3].rank.toLocaleString();
    const rankArtistCanzone5 = document.getElementById("rankArtistCanzone5");
    rankArtistCanzone5.innerHTML = tracklist.data[4].rank.toLocaleString();
    /* modifico la durata della canzone */
  })
  .catch((err) => alert(err));
