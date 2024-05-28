function hype() {
  if (document.getElementById("hype").disabled === false) {
    document.getElementById("hype").disabled = true;
    music.pause();
  } else {
    document.getElementById("hype").disabled = false;
    if (typeof music === "undefined") {
      music = new Audio("/music/gosh.mp3");
    }
    music.play();
  }
}
