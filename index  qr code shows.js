import "./main.scss";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./game/constants";
import Pipe from "./game/pipe";
import Bird from "./game/bird";
import Floor from "./game/floor";
import Text from "./game/gameText";
import Button from "./game/gameButton";
import P5 from "p5";
import Images from "./assets/sprite.png";
import BackgroundImage from "./assets/background.png";
import font from "./assets/FlappyBirdy.ttf";
import Storage from "./storage";
import Tune from "./assets/tune.mp3";
import qrCodeImage from "./assets/qr.png"; // Import QR code image

const sketch = (p5) => {
  let background = p5.loadImage(BackgroundImage);
  let spriteImage = p5.loadImage(Images);
  let birdyFont = p5.loadFont(font);
  let qrCodeImg; // Declare the variable for QR code image
  let gameStart;
  let gameOver;
  let bird;
  let pipe;
  let floor;
  let gameButton;
  let gameText;
  let score;
  let storage;
  let bestScore;

  let bgMusic;
  let bgMusicIsPlaying = false; // Track music state
  let button;

  const resetGame = () => {
    gameStart = false;
    gameOver = false;
    bird = new Bird(p5, spriteImage);
    pipe = new Pipe(p5, spriteImage);
    floor = new Floor(p5, spriteImage);
    gameText = new Text(p5, birdyFont);
    gameButton = new Button(p5, gameText, spriteImage);
    storage = new Storage();
    score = 0;
    pipe.generateFirst();
    bird.draw();
    floor.draw();
    let dataFromStorage = storage.getStorageData();

    if (dataFromStorage === null) {
      bestScore = 0;
    } else {
      bestScore = dataFromStorage.bestScore;
    }

    // Ensure music is playing and looping after reset
    if (!bgMusicIsPlaying) {
      bgMusic.loop(); // Start looping the music if it's not already
      bgMusicIsPlaying = true;
    }
  };

  const canvasClick = () => {
    if (p5.mouseButton === "left") {
      if (gameOver === false) bird.jump();
      if (gameStart === false) gameStart = true;
      if (
        gameOver &&
        p5.mouseX > CANVAS_WIDTH / 2 - 85 &&
        p5.mouseX < CANVAS_WIDTH / 2 + 75 &&
        p5.mouseY > CANVAS_HEIGHT / 2 + 100 &&
        p5.mouseY < CANVAS_HEIGHT / 2 + 160
      )
        resetGame();
    }
  };

  p5.setup = () => {
    var canvas = p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Load QR code image here
    qrCodeImg = p5.loadImage(qrCodeImage); // Load QR code image
    console.log("QR Code Image Loaded:", qrCodeImg); // Debugging: check if image is loaded

    // Music
    bgMusic = p5.createAudio(Tune);
    bgMusic.volume(0.5); // Adjust the volume to your liking

    // Button to toggle music
    button = p5.createButton("Music \nOn/Off");
    button.position(CANVAS_WIDTH / 2 - 85, CANVAS_HEIGHT / 2 + 100);
    button.mousePressed(musicToggle);

    canvas.touchStarted(canvasTouch);

    resetGame();
  };

  // Music toggle function
  function musicToggle() {
    if (!bgMusicIsPlaying) {
      bgMusic.loop(); // Start looping the music if it's not already
      bgMusicIsPlaying = true;
    } else {
      bgMusic.stop(); // Stop the music if it is playing
      bgMusicIsPlaying = false;
    }
  }

  p5.draw = () => {
    p5.image(background, 0, 0);
    const level = Math.floor(score / 10);

    if (gameStart && gameOver === false) {
      pipe.move(level);
      pipe.draw();

      bird.update();
      bird.draw();

      floor.update();
      floor.draw();

      gameOver = pipe.checkCrash(bird) || bird.isDead();

      if (pipe.getScore(bird)) score++;
    } else {
      pipe.draw();
      bird.draw();
      floor.draw();
      if (gameOver) bird.update();
      else {
        floor.update();
      }
    }

    if (gameStart === false) {
      gameText.startText();
    }

    if (gameOver) {
      if (score > bestScore) {
        bestScore = score;
        storage.setStorageData({ bestScore: score });
      }

      gameText.gameOverText(score, bestScore, level);
      gameButton.resetButton();

      // Debugging: check if gameOver is true and QR code image is loaded
      console.log("Game Over State:", gameOver); // Debugging: check if gameOver is true
      console.log("QR Code loaded:", qrCodeImg); // Debugging: check if the image is loaded

      // Draw the QR code (adjust position to ensure it's visible)
      p5.image(qrCodeImg, CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 + 100, 200, 200); // Draw the QR code
    } else {
      gameText.scoreText(score, level);
    }
  };

  const canvasTouch = () => {
    if (gameOver === false) bird.jump();
    if (gameStart === false) gameStart = true;
    if (gameOver) resetGame();
  };

  p5.keyPressed = (e) => {
    if (e.key === " ") {
      if (gameOver === false) bird.jump();
      if (gameStart === false) gameStart = true;
      if (gameOver) {
        resetGame();
      }
    }

    if (e.key === "r") {
      if (gameOver) {
        resetGame();
      }
    }
  };
};

new P5(sketch, "Game");
