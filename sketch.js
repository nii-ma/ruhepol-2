let state = "menu";

let words = [
  { text: "Schaumkronen", x: 0.3, y: 0.4, t: 0 },
  { text: "Blätterschatten", x: 0.6, y: 0.5, t: 100 },
  { text: "Windheulen", x: 0.4, y: 0.7, t: 200 }
];

let themes = {
  "Schaumkronen": { videos: [] },
  "Blätterschatten": { videos: [] },
  "Windheulen": { videos: [] }
};

let currentVideo = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(28); // kleinerer Text
  frameRate(60);

  // Videos laden
  for (let i = 1; i <= 4; i++) {
    themes["Schaumkronen"].videos.push(createVideo(`media/thema1/v${i}.mp4`));
    themes["Blätterschatten"].videos.push(createVideo(`media/thema2/v${i}.mp4`));
    themes["Windheulen"].videos.push(createVideo(`media/thema3/v${i}.mp4`));
  }

  // Videos vorbereiten
  for (let t in themes) {
    for (let v of themes[t].videos) {
      v.hide();
      v.volume(1.0);
      v.attribute("playsinline", "");
      v.position(0, 0);
      v.style("object-fit", "cover"); // Vollbild
      v.oncanplay(() => {
        // Video ist bereit
      });
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
    let floatY = sin(frameCount * 0.02 + w.t) * 10; // weniger starkes Bewegen
    let px = w.x * width;
    let py = w.y * height + floatY;
    text(w.text, px, py);
  }
}

// TouchEvent für iOS
function touchStarted() {
  userStartAudio(); // Audio freischalten
  handlePress();
  return false;
}

// Desktop Klick
function mousePressed() {
  handlePress();
}

function handlePress() {
  if (state !== "menu") return;

  for (let w of words) {
    let px = w.x * width;
    let py = w.y * height;
    if (dist(mouseX, mouseY, px, py) < 120) { // Klickbereich
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

  // Sicherstellen, dass Video geladen ist, dann abspielen
  v.oncanplaythrough = () => {
    v.play();
  };

  v.onended(videoFinished);
}

function videoFinished() {
  if (currentVideo) {
    currentVideo.stop();
    currentVideo.hide();
    currentVideo = null;
  }
  state = "menu";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (currentVideo) {
    currentVideo.size(windowWidth, windowHeight);
  }
}
