class sceneName extends Phaser.Scene {
    constructor() {
        super("sceneKey");
    }

    init() {
        this.tileset = {
            name: "terrain",        // name of tileset when added to Tiled (see Tile tutorial linked in README)
            key: "terrain-tiles",    // tilesheet key defined in load.js (or wherever)
            tileWidth: 64,
            tileHeight: 64
        };
    }

    create() {
        console.log("Scene loaded");

        //*** Displaying Tiled layers ***//
        const layer_map = this.add.tilemap("map") // this is referencing the key to our Tiled JSON file
        const layer_tilesheet = layer_map.addTilesetImage(this.tileset.name, this.tileset.key);

        // load layers from Tiled to scene
        //      NOTE: by default, the layers will render in the order you define them 
        //            (so here, terrain is loaded, then decor is placed above it)
        //            See Phaser documentation for how to change layer order!
        const terrainLayer = layer_map.createLayer("terrain-layer", layer_tilesheet, 0, 0);
        const decorLayer = layer_map.createLayer("decor-layer", layer_tilesheet, 0, 0);

        //*** Making a map from a 2D grid ***//
        const tilegrid = [
            [122, 123, 123, 122, 123],
            [123, -1, 122, -1, 123],
            [122, 123, 122, 123, -1],
            [123, 122, 122, 123, -1],
            [-1, 123, -1, -1, 123],
        ]

        // Create a  tilemap
        const my_map = this.make.tilemap({
            data: tilegrid,
            tileWidth: this.tileset.tileWidth,      // width and height, in pixels, of individual tiles
            tileHeight: this.tileset.tileHeight,
        });

        // Add the tileset to the map
        const tileset = my_map.addTilesetImage(this.tileset.name, this.tileset.key);

        // Create a layer from the map
        const [startX, startY] = [900, 50]       
        const myLayer = my_map.createLayer(0, tileset, startX, startY);

        //*** Dynamically add tiles to map ***/
        const [dynWidth, dynHeight] = [10, 10]; // in tiles
        const dyn_map = this.make.tilemap({
            tileWidth: this.tileset.tileWidth,  
            tileHeight: this.tileset.tileHeight,
            width: dynWidth,
            height: dynHeight
        });

        const dyn_tileset = dyn_map.addTilesetImage(this.tileset.name, this.tileset.key);

        // note: layer is needed for display
        const dyn_layer = dyn_map.createBlankLayer('layer1', dyn_tileset, startX, startY + 400);
        dyn_layer.setScale(0.5);    // see Phaser docs for more layer transformations!

        const numTiles = dyn_tileset.total;     // total number of tiles in tileset
        for(let y = 0; y < dyn_map.width; y++){
            for(let x = 0; x < dyn_map.height; x++){
                let tile = Math.floor(Math.random() * numTiles); // RNG
                dyn_map.putTileAt(tile, y, x);
            }
        }
    }

    update() {
    }

}
