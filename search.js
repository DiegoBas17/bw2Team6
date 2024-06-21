const params = new URLSearchParams(window.location.search);
const idSearch = params.get("id");

const URL = "https://deezerdevs-deezer.p.rapidapi.com/search/?q=" + idSearch;

window.addEventListener("DOMContentLoaded", () => {
  fetch(URL, {
    headers: {
      "x-rapidapi-key": "29c0a4f314mshac4cba9bf78ad4cp17ff1cjsn5a53e9406430",
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
    .then((search) => {
      console.log(search);
    })
    .catch((err) => console.log(err));
});
