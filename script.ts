let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let range = document.getElementById("range") as HTMLInputElement;
let boxSize = 5;
let blocksPerRow = canvas.width / boxSize;
let blocksPerCol = canvas.height / boxSize;
let colors: string[] = [];
let on = false;

for (let i = 0; i < blocksPerRow * blocksPerCol; i++) {
  colors.push("#FFFFFF");
}
range.addEventListener("change", () => {
  boxSize = +range.value;
  console.log(boxSize);
});

function fillBlock(blockIndex: number, color: string) {
  let x = (blockIndex % blocksPerRow) * boxSize;
  let y = Math.floor(blockIndex / blocksPerRow) * boxSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, boxSize, boxSize);
}

function drawBlocks() {
  colors.forEach(function (color, index) {
    fillBlock(index, color);
  });
}
let mouseX: number;
let mouseY: number;

canvas.addEventListener("mousemove", function (event) {
  let rect = canvas.getBoundingClientRect();
  mouseX = Math.floor(event.clientX - rect.left);
  mouseY = Math.floor(event.clientY - rect.top);
});

setInterval(() => {
  if (
    mouseX > boxSize &&
    mouseX < canvas.width - boxSize &&
    mouseY > boxSize &&
    mouseY < canvas.height - boxSize &&
    on
  ) {
    let blockIndex =
      Math.floor(mouseX / boxSize) +
      Math.floor(mouseY / boxSize) * blocksPerRow;

    colors[blockIndex] = "#33186B";
    fillBlock(blockIndex, colors[blockIndex]);
  }
  blurBlocks();
}, 1);

function blurBlocks() {
  let newColors = colors.slice();

  for (let y = 0; y < blocksPerCol; y++) {
    for (let x = 0; x < blocksPerRow; x++) {
      let totalRed = 0,
        totalGreen = 0,
        totalBlue = 0;
      let counter = 0;
      let index;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (
            x + dx >= 0 &&
            x + dx < blocksPerRow &&
            y + dy >= 0 &&
            y + dy < blocksPerCol
          ) {
            index = x + dx + (y + dy) * blocksPerRow;
            let color = colors[index];
            let rgb = parseInt(color.slice(1), 16);
            let red = (rgb >> 16) & 0xff;
            let green = (rgb >> 8) & 0xff;
            let blue = rgb & 0xff;

            totalRed += red;
            totalGreen += green;
            totalBlue += blue;
            counter++;
          }
        }
      }

      let avgRed = Math.round(totalRed / counter);
      let avgGreen = Math.round(totalGreen / counter);
      let avgBlue = Math.round(totalBlue / counter);
      let avgColor =
        "#" +
        ((1 << 24) + (avgRed << 16) + (avgGreen << 8) + avgBlue)
          .toString(16)
          .slice(1);

      newColors[x + y * blocksPerRow] = avgColor;
    }
  }

  colors = newColors;
  drawBlocks();
}

document.addEventListener("mouseup", () => {
  on = !on;
});

drawBlocks();
