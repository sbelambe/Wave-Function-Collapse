// Testing.js
export default class Testing {
    static renderDebugTiles(scene, tileset, startX, startY, maxTiles = 204, rowSpacing = 10) {
      const tileWidth = tileset.tileWidth;
      const tileHeight = tileset.tileHeight;
      const tilesPerRow = 17; // Number of tiles per row
  
      let currentY = startY;
  
      for (let i = 0; i < maxTiles; i++) {
        const row = Math.floor(i / tilesPerRow);
        const col = i % tilesPerRow;
  
        if (col === 0 && i !== 0) {
          currentY += tileHeight + rowSpacing; // Only increase Y after a full row
        }
  
        // Create a mini tilemap for each row of tiles with spacing
        const tileMap = scene.make.tilemap({
          width: 1,
          height: 1,
          tileWidth,
          tileHeight,
        });
        const debugTileset = tileMap.addTilesetImage(tileset.name, tileset.key);
        const debugLayer = tileMap.createBlankLayer("debugLayer", debugTileset);
  
        const drawX = startX + col * tileWidth;
        const drawY = currentY;
  
        debugLayer.setPosition(drawX, drawY);
        tileMap.putTileAt(i, 0, 0);
  
        scene.add.text(
          drawX + tileWidth / 4,
          drawY + tileHeight / 4,
          `${i}`,
          {
            fontSize: "12px",
            fill: "#fff",
          }
        );
      }
    }
  }
  