
// importation de la classe Game.js
import Game from './game.js';
import Fruit from './Fruit.js';

// mise en place de l'action des clics sur les boutons + les gestionnaires du clavier pour contrôler Greedy
const init = () => {
   const canvas = document.getElementById("playfield");
   const game = new Game(canvas);
   document.getElementById("stopAndStartGame").addEventListener("click", () => game.animate());
}

window.addEventListener("load", init);

//
console.log('le bundle a été généré !');
