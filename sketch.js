let state = "menu";

let words = [
  { text: "THEMA 1", x: 0.3, y: 0.4, t: 0 },
  { text: "THEMA 2", x: 0.6, y: 0.5, t: 100 },
  { text: "THEMA 3", x: 0.4, y: 0.7, t: 200 }
];

let themes = {
  "THEMA 1": { videos: [] },
  "THEMA 2": { videos: [] },
  "THEMA 3": { videos: [] }
};

let currentVideo = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(48);

  // Videos laden (MP4 H264 + AAC!)
  for (let i = 1; i <= 4; i++) {
    themes["THEMA 1"].videos.push(createVideo(`media/thema1/v${i}.mp4`));
    themes["THEMA 2"].videos.push(createVideo(`media/thema2/v${i}.mp4`));
    themes["THEMA 3"].videos.push(createVideo(`media/thema3/v${i}.mp4`));
  }

  // Alle Videos vorbereiten
  for (let t in themes) {
    for (let v of themes[t].videos) {
      v.hide();
      v.volume(1.0);
      v.attribute("playsinline", ""); // sehr wichtig für iOS
      v.position(0, 0);
      v.style("object-fit", "cover");  // Vollbild
    }
  }
}

function draw() {
  if (state === "menu") {
    background(0);
    drawMenu();
  } else {
    clear(); // Canvas transparent, Video sichtbar
  }
}

function drawMenu() {
  fill(255);
  for (let w of words) {
    let floatY = sin(frameCount * 0.02 + w.t) * 20;
    let px = w.x * width;
    let py = w.y * height + floatY;
    text(w.text, px, py);
  }
}

// TouchEvent für iOS
function touchStarted() {
  userStartAudio(); // iOS Audio freischalten
  handlePress();
  return false;
}

function handlePress() {
  if (state !== "menu") return;

  for (let w of words) {
    let px = w.x * width;
    let py = w.y * height;
    if (dist(mouseX, mouseY, px, py) < 150) {
      startTheme(w.text);
      break;
    }
  }
}

function startTheme(themeName) {
  state = "play";
  let theme = themes[themeName];
  let v = random(theme.videos);
  currentVideo = v;

  // Alle Videos stoppen
  for (let t in themes) {
    for (let vid of themes[t].videos) {
      vid.stop();
      vid.hide();
    }
  }

  // Video starten
  v.size(windowWidth, windowHeight);
  v.show();
  v.time(0);
  v.play();
  v.onended(videoFinished);
}

function videoFinished() {
  if (currentVideo) {
    currentVideo.stop();
    currentVideo.hide();
  }
  state = "menu";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (currentVideo) {
    currentVideo.size(windowWidth, windowHeight);
  }
}

