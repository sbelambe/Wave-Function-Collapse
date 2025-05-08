export default class WaveFunctionCollapse {
  /**
   * Don't change anything in the contructor for now.
   * @param {*} width
   * @param {*} height
   * @param {*} rules
   */
  constructor(width, height, rules) {
    this.width = width;
    this.height = height;

    // Use provided rules or fall back to a simple default rule set
    this.rules = rules || this.defaultRules();

    // Get list of all tile IDs used in rules (e.g., [0, 1, 2])
    this.tileOptions = Object.keys(this.rules).map(Number);

    // Create grid: each cell starts with a Set of all possible tile options
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Set(this.tileOptions))
    );
    console.log("Allowed tile options:", this.tileOptions);
  }

  /**
   * Defines valid neighboring tiles for each tile ID.
   * For each tile (e.g., 0, 1, 2), specify which tiles are allowed
   * in the 'up', 'down', 'left', and 'right' directions.
   *
   *
   */
  // defaultRules() {
  //   return {

  //     // dirt
  //     // 0 1 2
  //     // 17 18 19
  //     // 34 35 36
  //     0: {
  //       up: [0, 5],
  //       down: [0, 5],
  //       left: [0, 5],
  //       right: [0, 5],
  //     },
  //     // grass
  //     //5 6 7
  //     // 22 23 24
  //     // 39 40 41
  //     5: {
  //       up: [0, 5, 202],
  //       down: [0, 5, 202],
  //       left: [0, 5, 202],
  //       right: [0, 5, 202],
  //     },
  //     202: {
  //       // water
  //       // 186 202 203
  //       up: [202, 5],
  //       down: [202, 5],
  //       left: [202, 5],
  //       right: [202, 5],
  //     },
  //   };
  // }
  // defaultRules() {
  //   return {
  //     // Dirt tiles (surrounded by grass or more dirt)
  //     0: { up: [39, 40, 41, 202, 186, 203], down: [17, 18, 19, 34, 35, 36], left: [7, 23, 24, 40, 41], right: [1, 2, 18, 19, 35, 36]},
  //     1: { up: [39, 40, 41, 202, 186, 203], down: [17, 18, 19, 34, 35, 36], left: [7, 23, 24, 40, 41], right: [1, 2, 18, 19, 35, 36]},
  //     2: { up: [0, 5], down: [0, 5], left: [0, 5], right: [0, 5] },
  //     17: { up: [0, 5], down: [0, 5], left: [0, 5], right: [18] },
  //     18: { up: [1], down: [35], left: [17], right: [19] },
  //     19: { up: [2], down: [36], left: [18], right: [0, 5] },
  //     34: { up: [17], down: [0, 5], left: [0, 5], right: [35] },
  //     35: { up: [18], down: [0, 5], left: [34], right: [36] },
  //     36: { up: [19], down: [0, 5], left: [35], right: [0, 5] },

  //     // Grass tiles
  //     5: { up: [0, 5, 202], down: [22], left: [0, 5, 202], right: [6] },
  //     6: { up: [0, 5, 202], down: [23], left: [5], right: [7] },
  //     7: { up: [0, 5, 202], down: [24], left: [6], right: [0, 5, 202] },
  //     22: { up: [5], down: [39], left: [0, 5, 202], right: [23] },
  //     23: { up: [6], down: [40], left: [22], right: [24] },
  //     24: { up: [7], down: [41], left: [23], right: [0, 5, 202] },
  //     39: { up: [22], down: [0, 5, 202], left: [0, 5, 202], right: [40] },
  //     40: { up: [23], down: [0, 5, 202], left: [39], right: [41] },
  //     41: { up: [24], down: [0, 5, 202], left: [40], right: [0, 5, 202] },

  //     // Water tiles
  //     202: { up: [202, 5], down: [202, 5], left: [202, 5], right: [202, 5] },
  //     186: { up: [202, 5], down: [202, 5], left: [202, 5], right: [202, 5] },
  //     203: { up: [202, 5], down: [202, 5], left: [202, 5], right: [202, 5] },
  //   };
  // }

  defaultRules() {
    return {
      // Center Dirt (18) can be next to edge/center dirt and adjacent grass
      18: {
        up: [202, 186, 18, 23, 86],
        down: [202, 186, 18, 23, 86],
        left: [202, 186, 18, 23, 86],
        right: [202, 186, 18, 23, 86],
      },

      // Center Grass (23) can be next to edge/center grass and adjacent dirt
      23: {
        up: [202, 186, 18, 23, 86],
        down: [202, 186, 18, 23, 86],
        left: [202, 186, 18, 23, 86],
        right: [202, 186, 18, 23, 86],
      },

      // Water blocks can still touch each other or transition grass
      202: {
        up: [202, 186, 18, 23, 86],
        down: [202, 186, 18, 23, 86],
        left: [202, 186, 18, 23, 86],
        right: [202, 186, 18, 23, 86],
      },
      186: {
        up: [202, 186, 18, 23, 86],
        down: [202, 186, 18, 23, 86],
        left: [202, 186, 18, 23, 86],
        right: [202, 186, 18, 23, 86],
      },
      203: {
        up: [202, 186, 18, 23, 86],
        down: [202, 186, 18, 23, 86],
        left: [202, 186, 18, 23, 86],
        right: [202, 186, 18, 23, 86],
      },
      86: {
        up: [202, 186, 18, 23, 86],
        down: [202, 186, 18, 23, 86],
        left: [202, 186, 18, 23, 86],
        right: [202, 186, 18, 23, 86],
      }
    };
  }

  /**
   * Find the grid cell with the lowest entropy (fewest remaining tile options),
   * excluding cells that are already collapsed.
   */
  findLowestEntropyCell() {
    // TODO: Implement logic to find the cell with the fewest options
    let minOptions = Infinity;
    let lowestCell = null;

    //nesting through the grid, checking for tile with lowest options
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const options = this.grid[y][x];

        //skipping cells that are already collapsed
        if (options.size > 1 && options.size < minOptions) {
          minOptions = options.size;
          lowestCell = { x, y };
        }
      }
    }
    return lowestCell; //returns null if every cell is collapsed
  }

  /**
   * Collapse a cell at (x, y) by choosing a tile option at random.
   * Replace the cell's set with just the chosen tile ID.
   */
  collapseCell(x, y) {
    // TODO: Randomly pick one option and set it as the only value for the cell
    const options = Array.from(this.grid[y][x]); //now an array of the tile's options
    const validOptions = options.filter((opt) =>
      this.tileOptions.includes(opt)
    );
    if (validOptions.length === 0) {
      console.warn(`No valid options at (${x}, ${y})`);
      return;
    }
    const selectedTile =
      validOptions[Math.floor(Math.random() * validOptions.length)];
    this.grid[y][x] = new Set([selectedTile]); //now only 1 option and back to set
  }

  /**
   * Propagate constraints outward from the given cell.
   * This step removes invalid tile options from neighboring cells
   * based on the adjacency rules.
   */
  propagate(x, y) {
    // TODO: Implement constraint propagation (e.g., using a queue)

    const queue = [{ x, y }]; //collapsing the cell

    while (queue.length > 0) {
      const { x, y } = queue.shift(); //next cell tp process
      const presentTile = Array.from(this.grid[y][x])[0];
      if (!this.rules[presentTile]) {
        console.warn("No rules for tile", presentTile);
        continue;
      }

      // 4 directions:
      for (const dir of ["up", "down", "left", "right"]) {
        const [nx, ny] = this.getNeighbor(x, y, dir); //coordinations of the neighbor
        if (nx === null || ny === null) {
          //out of bounds
          continue; // Skip out-of-bounds
        }
        const neighborOptions = this.grid[ny][nx]; //location options of the neighbor
        const validNeighbors = this.rules[presentTile]?.[dir];
        if (!validNeighbors) continue;

        // Remove invalid options from neighbors
        for (const option of Array.from(neighborOptions)) {
          if (!validNeighbors.includes(option)) {
            neighborOptions.delete(option);
            queue.push({ x: nx, y: ny }); // Re-check this neighbor in case the validity changes
          }
        }
      }
    }
  }

  /**
   * Safely return coordinates of a neighboring cell in the given direction.
   * Return [null, null] if out of bounds.
   */
  getNeighbor(x, y, dir) {
    // TODO: Return [nx, ny] for the neighbor in direction `dir`
    const directions = {
      up: [x, y - 1], //same column, previous row
      down: [x, y + 1], //same column, next row
      left: [x - 1, y], //previous column, same row
      right: [x + 1, y], //next column, same row
    };
    const [nx, ny] = directions[dir]; // Get neighbor coordinates

    // Return neighbor OR null if out of bounds
    return nx >= 0 && nx < this.width && ny >= 0 && ny < this.height
      ? [nx, ny]
      : [null, null];
  }

  /**
   * Main collapse algorithm:
   * - Repeatedly find a cell with lowest entropy
   * - Collapse it to one option
   * - Propagate constraints to neighbors
   * - Stop when all cells are collapsed or contradiction occurs
   */
  // collapse() {
  //   // TODO: Implement main loop calling findLowestEntropyCell(), collapseCell(), and propagate()

  //   // After collapsing, convert grid of Sets to grid of tile IDs for rendering
  //   // Example return value: [[0, 1, 0], [1, 0, 2], ...]
  //   return this.grid.map((row) =>
  //     row.map((cell) => (cell.size === 1 ? [...cell][0] : 0))
  //   );
  // }

  collapseDecor(baseGrid) {
    return baseGrid.map((row) =>
      row.map((tile) => {
        if (tile === 18 && Math.random() < 0.1) return 38; // cactus on sand
        return -1;
      })
    );
  }

  collapse() {
    let steps = 0;

    // ✅ Step 1: Pick a starting cell manually and collapse it
    const startX = Math.floor(this.width / 2); // or 0
    const startY = Math.floor(this.height / 2); // or 0
    this.collapseCell(startX, startY);
    this.propagate(startX, startY);

    // ✅ Step 2: Continue WFC as usual
    while (true) {
      const cell = this.findLowestEntropyCell();
      if (!cell) break;

      if (this.grid[cell.y][cell.x].size === 0) {
        console.error("Contradiction detected at", cell.x, cell.y);
        break;
      }

      this.collapseCell(cell.x, cell.y);
      this.propagate(cell.x, cell.y);

      if (++steps > this.width * this.height * 5) {
        console.warn("Too many steps — likely contradiction");
        break;
      }
    }

    return this.grid.map((row) =>
      row.map((cell) => (cell.size === 1 ? Array.from(cell)[0] : -1))
    );
  }
}
