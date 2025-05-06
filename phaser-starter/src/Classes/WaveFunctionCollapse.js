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
  }

  /**
   * Defines valid neighboring tiles for each tile ID.
   * For each tile (e.g., 0, 1, 2), specify which tiles are allowed
   * in the 'up', 'down', 'left', and 'right' directions.
   *
   *
   */
  defaultRules() {
    return {
      0: { up: [0, 1], down: [0, 2], left: [0, 1], right: [0, 1] }, // grass
      1: { up: [0, 1], down: [1], left: [0, 1], right: [0, 2] }, // water
      2: { up: [2], down: [2], left: [2, 0], right: [0, 2] }, // dirt
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
    const options = [this.grid[y][x]]; //now an array of the tile's options
    const selectedTile = options[Math.floor(Math.random() * options.length)];
    this.grid[y][x] = new Set([selectedTile]); //now only 1 option and back to set
    
  }

  /**
   * Propagate constraints outward from the given cell.
   * This step removes invalid tile options from neighboring cells
   * based on the adjacency rules.
   */
  propagate(x, y) {
    // TODO: Implement constraint propagation (e.g., using a queue)
  }

  /**
   * Safely return coordinates of a neighboring cell in the given direction.
   * Return [null, null] if out of bounds.
   */
  getNeighbor(x, y, dir) {
    // TODO: Return [nx, ny] for the neighbor in direction `dir`
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

  collapse() {
    let steps = 0;

    while (true) {
      const cell = this.findLowestEntropyCell();
      if (!cell) break; // All cells are collapsed

      this.collapseCell(cell.x, cell.y);
      this.propagate(cell.x, cell.y);

      if (++steps > this.width * this.height * 5) {
        console.warn("Too many steps — likely contradiction in constraints.");
        break;
      }
    }

    // Convert each Set in the grid to a single tile ID for rendering
    return this.grid.map((row) =>
      row.map((cell) => (cell.size === 1 ? [...cell][0] : 0))
    );
  }
}
