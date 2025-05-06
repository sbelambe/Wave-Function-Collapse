"use strict" // debug with extreme prejudice
import Load from "./Scenes/load.js";
import sceneName from "./Scenes/Scene.js";

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 2400,
    height: 2400,
    scene: [Load, sceneName]
}

// you can define global variables here
const GAME = new Phaser.Game(config);
const GLOBAL = "I am a global variable :)"