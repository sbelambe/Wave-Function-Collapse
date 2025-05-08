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

    this.steps = 0;
    this.maxSteps = width * height * 5;
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
      },
    };
  }

  /**
   * Find the grid cell with the lowest entropy (fewest remaining tile options),
   * excluding cells that are already collapsed.
   */
  findLowestEntropyCell() {
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
    const options = Array.from(this.grid[y][x]);
    const validOptions = options.filter((opt) =>
      this.tileOptions.includes(opt)
    );
    if (validOptions.length === 0) return;
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
    const queue = [{ x, y }]; //collapsing the cell
    while (queue.length > 0) {
      const { x, y } = queue.shift(); //next cell tp process
      const presentTile = Array.from(this.grid[y][x])[0];
      if (!this.rules[presentTile]) continue;

      // Remove invalid options from neighbors
      for (const dir of ["up", "down", "left", "right"]) {
        const [nx, ny] = this.getNeighbor(x, y, dir);
        if (nx === null || ny === null) continue;

        const neighborOptions = this.grid[ny][nx];
        const validNeighbors = this.rules[presentTile]?.[dir];
        if (!validNeighbors) continue;

        for (const option of Array.from(neighborOptions)) {
          if (!validNeighbors.includes(option)) {
            neighborOptions.delete(option);
            queue.push({ x: nx, y: ny });
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

  stepCollapse() {
    if (this.steps > this.maxSteps) return null;

    const cell = this.findLowestEntropyCell();
    if (!cell) return null;
    if (this.grid[cell.y][cell.x].size === 0) return null;

    this.collapseCell(cell.x, cell.y);
    this.propagate(cell.x, cell.y);
    this.steps++;

    const collapsedTile = Array.from(this.grid[cell.y][cell.x])[0];
    return { x: cell.x, y: cell.y, tile: collapsedTile };
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
    const maxSteps = this.width * this.height * 5;

    while (true) {
      const cell = this.findLowestEntropyCell();
      if (!cell) break;
      if (this.grid[cell.y][cell.x].size === 0) break;

      this.collapseCell(cell.x, cell.y);
      this.propagate(cell.x, cell.y);
      if (++steps > maxSteps) break;
    }

    return this.grid.map((row) =>
      row.map((cell) => (cell.size === 1 ? Array.from(cell)[0] : -1))
    );
  }
}

