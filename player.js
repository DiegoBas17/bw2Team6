// scripts.js
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();
let tracks = [];

async function fetchTracks() {
  try {
    let response = await fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem", {
      method: "GET",
      headers: {
        "x-rapidapi-key": "488a8ebce0msh914112a61b3a6a1p19c0e4jsn3acc13a47a88",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    });
    let data = await response.json();
    tracks = data.data.map((track) => ({
      title: track.title,
      artist: track.artist.name,
      src: track.preview,
      albumArt: track.album.cover_medium,
    }));
    loadTrack(currentTrackIndex);
  } catch (error) {
    console.error("Errore nel recupero delle tracce:", error);
  }
}

function loadTrack(index) {
  audio.src = tracks[index].src;
  document.getElementById("track-title").innerText = tracks[index].title;
  document.getElementById("track-artist").innerText = tracks[index].artist;
  document.getElementById("album-art").src = tracks[index].albumArt;
  audio.load();
}

function playPauseTrack() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    document.getElementById("play-pause").src = "play-icon.png";
  } else {
    audio.play();
    isPlaying = true;
    document.getElementById("play-pause").src = "pause-icon.png";
  }
}

function prevTrack() {
  currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
  loadTrack(currentTrackIndex);
  if (isPlaying) audio.play();
}

function nextTrack() {
  currentTrackIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
  loadTrack(currentTrackIndex);
  if (isPlaying) audio.play();
}

document.getElementById("progress").addEventListener("input", function () {
  audio.currentTime = audio.duration * (this.value / 100);
});

audio.addEventListener("timeupdate", function () {
  document.getElementById("progress").value = (audio.currentTime / audio.duration) * 100;
  document.getElementById("current-time").innerText = formatTime(audio.currentTime);
  document.getElementById("duration").innerText = formatTime(audio.duration);
});

document.getElementById("volume").addEventListener("input", function () {
  audio.volume = this.value;
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

// Caricare le tracce all'avvio
fetchTracks();
