import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";

export default class GameText {
  constructor(p5, font, qrCodeImage) {
    this.p5 = p5;
    this.qrCodeImage = qrCodeImage; // Store the QR code image
    p5.textFont(font);
    p5.strokeWeight(5);
    p5.stroke(51);
    p5.fill("white");
    p5.textAlign(p5.CENTER);
  }

  scoreText(score, level) {
    this.p5.textSize(50);
    this.p5.text(score, 0, 100, CANVAS_WIDTH);
    this.p5.textSize(20);
    this.p5.text(`Level: ${level + 1}`, 0, CANVAS_HEIGHT - 15, 110);
  }

  startText() {
    this.p5.textSize(30);
    this.p5.text("FLAPPY INVENTORY", 0, CANVAS_HEIGHT / 2 + 100, CANVAS_WIDTH);
    this.p5.textSize(20);
    this.p5.text("PRESS [SPACE] TO START", 0, CANVAS_HEIGHT / 2 + 150, CANVAS_WIDTH);
    this.p5.textSize(20);
    this.p5.text("Level: 1", 0, CANVAS_HEIGHT - 15, 110);
  }

  gameOverText(score, bestScore, level) {
    // Draw red rectangle behind the text
    this.p5.fill("#E02735");
    this.p5.noStroke();
    this.p5.rect(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 - 150, 200, 50);

    // Draw text on top of the rectangle
    this.p5.textSize(25);
    this.p5.fill("white");
    this.p5.text("NOT SO EASY?", 0, CANVAS_HEIGHT / 2 - 115, CANVAS_WIDTH);

    // Continue with other game over text
    this.p5.textSize(30);
    this.p5.strokeWeight(3)
    this.p5.stroke(0);
    this.p5.text("'KANBAN SMART' HELPS BALANCE YOUR INVENTORY", 0, CANVAS_HEIGHT / 2 - 45, CANVAS_WIDTH);
    this.p5.textSize(20);
    this.p5.text("FIND OUT MORE:", 0, CANVAS_HEIGHT / 2 + 30, CANVAS_WIDTH);
    
    // Draw the QR Code image here
    //const qrCodeX = CANVAS_WIDTH / 2 - 100; // Position X for QR code
    //const qrCodeY = CANVAS_HEIGHT / 2 + 60; // Position Y for QR code
    //this.p5.image(this.qrCodeImage, qrCodeX, qrCodeY, 200, 200); // Render QR code

    this.p5.noStroke();
    this.p5.textSize(20);
    this.p5.text(`Level: ${level + 1}`, 0, CANVAS_HEIGHT - 15, 110);
    this.p5.textSize(20);
    this.p5.text("PRESS [R] TO RESTART", 0, CANVAS_HEIGHT - 15, CANVAS_WIDTH);
    this.p5.text("Score: " + score, 0, CANVAS_HEIGHT - 15, CANVAS_WIDTH + 380);
  }
}
