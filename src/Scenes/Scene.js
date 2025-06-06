import WaveFunctionCollapse from "../Classes/WaveFunctionCollapse.js";
import Testing from "../Classes/Testing.js";

class sceneName extends Phaser.Scene {
  constructor() {
    super("sceneKey");
    this.steps = 0;
    this.maxSteps = this.tileWidth * this.tileHeight * 5;
  }

  init() {
    this.tileset = {
      name: "terrain", // name of tileset when added to Tiled (see Tile tutorial linked in README)
      key: "terrain-tiles", // tilesheet key defined in load.js (or wherever)
      tileWidth: 64,
      tileHeight: 64,
    };
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      this.cameras.main.scrollY += deltaY * 0.5;
    });
    console.log("Scene loaded");

    const tilesetConfig = {
      tileWidth: this.tileset.tileWidth,
      tileHeight: this.tileset.tileHeight,
    };

    // const renderMap = () => {
    //   if (this.dynamicLayer) this.dynamicLayer.destroy();
    //   if (this.decorLayer) this.decorLayer.destroy(); // also remove old decorations

    //   this.steps = 0;
    //   const wfc = new WaveFunctionCollapse(20, 15, null);
    //   const tileGrid = wfc.collapse();

    //   const map = this.make.tilemap({
    //     data: tileGrid,
    //     ...tilesetConfig,
    //   });

    //   const tileset = map.addTilesetImage(this.tileset.name, this.tileset.key);
    //   this.dynamicLayer = map.createLayer(0, tileset, 100, 100);

    //   this.decorLayer = map.createBlankLayer("decorLayer", tileset, 100, 100);

    //   for (let y = 0; y < tileGrid.length; y++) {
    //     for (let x = 0; x < tileGrid[0].length; x++) {
    //       const baseTile = tileGrid[y][x];

    //       // Place cactus on sand (18) with 10% chance
    //       if (baseTile === 18 && Math.random() < 0.1) {
    //         this.decorLayer.putTileAt(38, x, y); // cactus tile
    //       }

    //       // You could add flowers on grass (23) here too
    //     }
    //   }
    // };

    // Initial render
    // renderMap();

    Testing.renderDebugTiles(this, this.tileset, 100, 1100); // Adjust Y to fit below WFC grid

    // Place a debug tile in top-left to see which index maps to which image
    const debugTileIndex = 202; // Change this to test different tiles
    const debugMap = this.make.tilemap({
      width: 1,
      height: 1,
      ...tilesetConfig,
    });
    const debugTileset = debugMap.addTilesetImage(
      this.tileset.name,
      this.tileset.key
    );
    const debugLayer = debugMap.createBlankLayer(
      "debug-layer",
      debugTileset,
      0,
      0
    );
    debugMap.putTileAt(debugTileIndex, 0, 0);

    // Press R to regenerate the WFC map
    this.input.keyboard.on("keydown-R", () => {
      if (this.mapLayer) this.mapLayer.destroy();
      if (this.decorLayer) this.decorLayer.destroy();
      if (this.tilemap) this.tilemap.destroy();

      this.wfc = new WaveFunctionCollapse(20, 15, null);

      this.tilemap = this.make.tilemap({
        tileWidth: this.tileset.tileWidth,
        tileHeight: this.tileset.tileHeight,
        width: 20,
        height: 15,
      });

      const tileset = this.tilemap.addTilesetImage(
        this.tileset.name,
        this.tileset.key
      );

      this.mapLayer = this.tilemap.createBlankLayer(
        "mainLayer",
        tileset,
        100,
        100
      );
      this.decorLayer = this.tilemap.createBlankLayer(
        "decorLayer",
        tileset,
        100,
        100
      );

      this.timer = this.time.addEvent({
        delay: 5,
        loop: true,
        callback: () => {
          const result = this.wfc.stepCollapse();
          if (result) {
            if (typeof result.tile !== "number" || result.tile < 0) {
              console.warn("Invalid tile index:", result);
            }

            this.mapLayer.putTileAt(result.tile, result.x, result.y);

            if (result.tile === 18 && Math.random() < 0.3) {
              this.decorLayer.putTileAt(38, result.x, result.y);
            }
            if (result.tile === 23 && Math.random() < 0.3) {
              this.decorLayer.putTileAt(42, result.x, result.y);
            }
          } else {
            this.timer.remove();
          }
        },
      });
    });
  }

  update() {
    if (this.cursors.up.isDown) {
      this.cameras.main.scrollY -= 10;
    } else if (this.cursors.down.isDown) {
      this.cameras.main.scrollY += 10;
    }
  }
}

export default sceneName;
