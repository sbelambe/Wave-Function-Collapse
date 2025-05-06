import WaveFunctionCollapse from "../Classes/WaveFunctionCollapse.js";

class sceneName extends Phaser.Scene {
  constructor() {
    super("sceneKey");
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
    console.log("Scene loaded");

    const tilesetConfig = {
      tileWidth: this.tileset.tileWidth,
      tileHeight: this.tileset.tileHeight,
    };

    const renderMap = () => {
      // Clear previous WFC layer if it exists
      if (this.dynamicLayer) {
        this.dynamicLayer.destroy();
      }

      const wfc = new WaveFunctionCollapse(20, 15, null); // Replace null with rules if needed
      const tileGrid = wfc.collapse();

      const map = this.make.tilemap({
        data: tileGrid,
        ...tilesetConfig,
      });

      const tileset = map.addTilesetImage(this.tileset.name, this.tileset.key);
      this.dynamicLayer = map.createLayer(0, tileset, 100, 100); // Store ref to allow future cleanup
    };

    // Initial render
    renderMap();

    // Place a debug tile in top-left to see which index maps to which image
    const debugTileIndex = 5; // Change this to test different tiles
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
      console.log("Pressed R — regenerating map...");
      renderMap();
    });
  }

  update() {}
}

export default sceneName;
