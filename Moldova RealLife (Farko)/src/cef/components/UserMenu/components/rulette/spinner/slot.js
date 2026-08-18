import spin from "../../../../../assets/sounds/roulette-single-spin.mp3";

export default class Slot {
  constructor(ctx, item, size, offset) {
    this.isLeftOfCenter = false;
    this.isFirstSound = true;
    this.ctx = ctx;
    this.size = size;
    this.color = item.color;
    this.winningStep = false;

    this.padding = 5;
    this.spacing = 22;

    this.posX = offset;

    this.item = {
      width: this.size - this.padding * 2,
      height: this.size * 0.91,
      bottomLineHeight: this.size * 0.05,
      rarityImg: item.rarityImg,
      dotRadius: this.size * 0.03,
      img: item.img,
      name: item.data.name,
      size: this.size - this.padding * 2,
      y: this.padding,
    };

    this.inMove = false;
  }
  win(state) {
    this.winningStep = state;
  }

  moveX(speed) {
    this.inMove = speed > 50;
    this.posX -= speed;
    this.posX < this.item.width * 1.5 && this.isFirstSound === true
      ? this.playSound()
      : null;
  }

  canDelete() {
    return this.posX + this.item.width < 0;
  }

  playSound() {
    const audio = new Audio(spin);
    audio.volume = 0.4;
    audio.play();
    this.isLeftOfCenter = false;
    this.isFirstSound = false;
  }

  draw(index) {
    if (!this.ctx || !this.item) return;

    let opacity = !this.winningStep ? 1 : index !== 3 ? 0.3 : 1;
    let gradient = this.ctx.createRadialGradient(
      this.posX + this.size / 2,
      this.item.height / 2,
      0,
      this.posX + this.size / 2,
      this.item.height / 2,
      this.size / 2
    );
    gradient.addColorStop(0, `rgba(153, 153, 153, ${0.05 * opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${0.05 * opacity})`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      this.posX + this.padding,
      0,
      this.item.width,
      this.item.height
    );

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * opacity})`;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(
      this.posX + this.padding,
      0,
      this.item.width,
      this.item.height
    );

    if (this.item.img.complete) {
      const imgWidth = this.item.img.naturalWidth;
      const imgHeight = this.item.img.naturalHeight;

      const containerWidth = 120;
      const containerHeight = 134;

      const scale = Math.min(
        containerWidth / imgWidth,
        containerHeight / imgHeight
      );
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      const posX =
        this.posX +
        (this.item.width - containerWidth) / 2 +
        this.padding +
        (containerWidth - drawWidth) / 2;
      const posY = 10 + (containerHeight - drawHeight) / 2;

      this.ctx.globalAlpha = opacity; // Aplica transparenta pentru imagine
      this.ctx.drawImage(this.item.img, posX, posY, drawWidth, drawHeight);
      this.ctx.globalAlpha = 1; // Resetare transparenta pentru text
    }

    this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    this.ctx.font = "14px Gilroy";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      this.item.name,
      this.posX + this.item.width / 2 + this.padding,
      this.item.height - 20
    );
  }

  fixPos(fix) {
    this.x -= fix;
  }
  imgLocalOffset() {
    return this.posX + this.item.width;
  }
  canDelete() {
    return this.posX < -this.size;
  }

  localCenter() {
    return this.posX + (this.size - this.padding) / 2;
  }

  setPosX(newPosX) {
    this.posX = newPosX;
  }
}
