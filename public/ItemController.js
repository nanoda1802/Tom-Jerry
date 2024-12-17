import Item from "./Item.js";
import { itemTable } from "./Socket.js";

class ItemController {
  nextInterval = null;
  starInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
    this.setNextStarTime();
  }

  setNextItemTime() {
    this.nextInterval = 500;
  }
  setNextStarTime() {
    this.starInterval = 5000;
  }

  // 랜덤이 아니라 스테이지 고정으로 나오게
  createItem(stage) {
    const itemInfo = this.itemImages[itemTable.data[stage - 1].id - 1];
    const maxHeight = Math.floor(itemInfo.height / 1.5);
    const minHeight = Math.floor((this.canvas.height - itemInfo.height) / 1.5);
    const x = this.canvas.width * 1.5;
    const y = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

    const item = new Item(this.ctx, itemInfo.id, x, y, itemInfo.width, itemInfo.height, itemInfo.image);

    this.items.push(item);
  }

  update(stage, gameSpeed, deltaTime) {
    if (this.starInterval !== null && this.starInterval <= 0) {
      this.createItem(6);
      this.setNextStarTime();
    } else if (this.nextInterval <= 0) {
      this.createItem(stage);
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;
    this.starInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }
  // 부딪히면 사라지는 로직 메서드
  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
