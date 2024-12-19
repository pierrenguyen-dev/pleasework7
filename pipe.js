import { CANVAS_HEIGHT, CANVAS_WIDTH, MIN_PIPE_GAP, MAX_PIPE_GAP, BIRDSIZE, FLOOROFFSET, MaxPipeOffset, MinPipeOffset, PipeSpeed, MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT, PIPE_WIDTH } from './constants';

export default class Pipe {
    constructor(p5, spriteImage) {
        this.p5 = p5;
        this.pipesPosition = [];
        this.image = spriteImage;
    }

    generatePipeHeightAndGap() {
        const height = Math.floor(Math.random() * (MAX_PIPE_HEIGHT - MIN_PIPE_HEIGHT + 1) + MIN_PIPE_HEIGHT);

        // Scale down the gap size by reducing the range (e.g., 80% of the original max and min gap)
        const scaledMaxPipeGap = Math.floor(MAX_PIPE_GAP * 0.9); // 80% of the original max gap
        const scaledMinPipeGap = Math.floor(MIN_PIPE_GAP * 0.9); // 80% of the original min gap

        const gap = Math.floor(Math.random() * (scaledMaxPipeGap - scaledMinPipeGap + 1) + scaledMinPipeGap);
        return { height, gap };
    }

    generateNew() {
        const { height, gap } = this.generatePipeHeightAndGap();
        this.pipesPosition.push({ offset: 0, height, gap, passed: false });
        this.draw({ offset: 0, height, gap });
    }

    generateFirst() {
        const { height, gap } = this.generatePipeHeightAndGap();
        this.pipesPosition.push({ offset: -300, height, gap, passed: false });
        this.draw({ offset: -300, height, gap });
    }

    draw() {
        this.pipesPosition.forEach(pipe => {
            // Drawing the top pipe
            this.p5.image(this.image, CANVAS_WIDTH - pipe.offset, 0, PIPE_WIDTH, pipe.height, PIPE_WIDTH, 500 - pipe.height, PIPE_WIDTH, pipe.height);

            // Drawing the bottom pipe
            this.p5.image(this.image, CANVAS_WIDTH - pipe.offset, pipe.height + pipe.gap, PIPE_WIDTH, CANVAS_HEIGHT - pipe.height - pipe.gap - FLOOROFFSET, 0, 0, PIPE_WIDTH, CANVAS_HEIGHT - pipe.height - pipe.gap - FLOOROFFSET);
        });
    }

    move(level) {
        this.pipesPosition.forEach(pipe => {
            pipe.offset = pipe.offset + PipeSpeed + level;
        });

        // Remove pipes that have passed the screen
        if (this.pipesPosition[0].offset > CANVAS_WIDTH + PIPE_WIDTH) {
            this.pipesPosition.shift();
        }

        // Add new pipes when necessary
        if (this.pipesPosition[this.pipesPosition.length - 1].offset > Math.floor(Math.random() * (MaxPipeOffset - MinPipeOffset + 1) + MinPipeOffset)) {
            this.generateNew();
        }
    }

    getScore(bird) {
        const birdMiddleX = bird.birdPosition.x + BIRDSIZE.Width / 2;
        let getScore = false;
        this.pipesPosition.forEach(pipe => {
            const pipeStartX = CANVAS_WIDTH - pipe.offset;
            const pipeEndX = CANVAS_WIDTH - pipe.offset + PIPE_WIDTH;
            if (birdMiddleX > pipeStartX && birdMiddleX < pipeEndX && pipe.passed === false) {
                getScore = true;
                pipe.passed = true;
                return true;
            }
        });
        return getScore;
    }

    checkCrash(bird) {
        const birdStartX = bird.birdPosition.x;
        const birdEndX = bird.birdPosition.x + BIRDSIZE.Width;
        const birdStartY = bird.birdPosition.y;
        const birdEndY = bird.birdPosition.y + BIRDSIZE.Height;
        let crash = false;

        // Check collision with pipes
        this.pipesPosition.forEach(pipe => {
            const pipeStartX = CANVAS_WIDTH - pipe.offset;
            const pipeEndX = CANVAS_WIDTH - pipe.offset + PIPE_WIDTH;

            const topPipeStartY = 0;
            const topPipeEndY = pipe.height;

            const bottomPipeStartY = pipe.height + pipe.gap;
            const bottomPipeEndY = CANVAS_HEIGHT;

            if (((birdStartX >= pipeStartX && birdStartX < pipeEndX) || (birdEndX >= pipeStartX && birdEndX < pipeEndX))
                &&
                ((birdStartY >= topPipeStartY && birdStartY < topPipeEndY) || (birdEndY >= bottomPipeStartY && birdEndY < bottomPipeEndY))) {
                crash = true;
            }

            // Special check for bird falling below the ground
            else if (((birdStartX >= pipeStartX && birdStartX < pipeEndX) || (birdEndX >= pipeStartX && birdEndX < pipeEndX)) && birdStartY < 0) {
                crash = true;
            }
        });

        // Check if bird touches the ground (this is assuming the bird should stop when y position reaches the ground)
        if (birdEndY >= CANVAS_HEIGHT - FLOOROFFSET) {
            crash = true;
        }

        if (crash) {
            this.clearPipes(); // Clear pipes when the bird crashes or hits the ground
        }

        return crash;
    }

    // New method to clear all pipes
    clearPipes() {
        // Clear pipes from the array
        this.pipesPosition = [];  
        // Optionally, stop drawing pipes from the array if needed
        // This ensures no more pipes are drawn after game over
    }
}
