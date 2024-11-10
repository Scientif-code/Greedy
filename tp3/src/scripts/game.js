import Greedy from './Greedy.js';
import KeyManager from './keyManager.js';
import Fruit from './Fruit.js';
import Hungry from './Hungry.js'

export default class Game {
  #canvas;
  #context;
  #greedy;
  #fruits = []; // Tableau pour stocker les fruits
  #fruitInterval; // Timer pour créer un fruit toutes les secondes
  #hungries = []; // Tableau pour stocker les hungries

  constructor(canvas) {
      this.#canvas = canvas;
      this.#context = canvas.getContext('2d');
      this.keyManager = new KeyManager();
      this.#greedy = new Greedy(canvas.width / 2, canvas.height / 2);

      // Ajoute un écouteur d'événements au clic sur le bouton "stopAndStartGame"
      document.getElementById("stopAndStartGame").addEventListener("click", () => {
          this.#fruitInterval = setInterval(this.addFruit.bind(this), 1000);
      });

      document.addEventListener('keydown', this.keyDownHandler.bind(this));
      document.addEventListener('keyup', this.keyUpHandler.bind(this));
  }


  addFruit() {
    const x = this.aleaRange(Fruit.FRUIT_WIDTH, this.#canvas.width - Fruit.FRUIT_WIDTH);
    const y = this.aleaRange(Fruit.FRUIT_HEIGHT, this.#canvas.height - Fruit.FRUIT_HEIGHT);

    const newFruit = new Fruit(x, y);

    setInterval(() => this.removeFruits(newFruit), 8000);


    this.#fruits.push(newFruit);
  }

  removeFruits(fruit) {
      this.#fruits = this.#fruits.filter(f => (f !== fruit) );
  }

  addHungry() {
      const x = this.aleaRange(Hungry.HUNGRY_WIDTH, this.#canvas.width - Hungry.HUNGRY_WIDTH);
      const y = this.aleaRange(Hungry.HUNGRY_HEIGHT, this.#canvas.height - Hungry.HUNGRY_HEIGHT);

      let newHungry = new Hungry(x, y);

      if (newHungry.collisionWith(this.#greedy)) {
          newHungry.x += this.#greedy.width;
          newHungry.y += this.#greedy.height;
      }
      this.#hungries.push(newHungry);
  }

  checkHungrySpawn() {
      if (this.#hungries.length === 0) {
          this.addHungry();
      } else {
          this.#hungries.forEach(hungry => {
              if (hungry.fruitsEaten === hungry.fruitsthreshold) {
                  this.addHungry();
                  hungry.fruitsthreshold += 7; // Augmenter le seuil pour ce hungry
              }
          });
      }
  }


  removeHungry(hungry) {
      this.#hungries = this.#hungries.filter(f => (f !== hungry));
  }


  aleaRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  alea(n) {
    return Math.floor(Math.random() * n);
  }

  findTarget() {
      if (this.#fruits.length < 1) {
          this.#hungries.forEach((hungry) => {
            hungry.target = this.#greedy;
          });
      } else {
          this.#hungries.forEach((hungry) => {
              if (!hungry.target || !this.#fruits.includes(hungry.target)) {
                  hungry.target = this.#fruits[this.alea(this.#fruits.length)];
              }

          });
      }
  }


  animate() {
    if (!this.Gameover()) {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        // Dessiner le joueur
        this.#greedy.draw(this.#context);
        this.#greedy.handleMoveKeys(this.keyManager);
        this.#greedy.move(this.#canvas);

        // Dessiner les Hungries et les déplacer
        this.checkHungrySpawn();

        // Choix des cibles pour chaque Hungry
        this.#hungries.forEach(hungry => {
            this.findTarget();
            hungry.moveTowards(hungry.target);

            if (hungry.collisionWith(this.#greedy)) {
                this.removeHungry(hungry);
                if (this.#greedy.lifepoints>=0) {
                  document.getElementById("life-" + this.#greedy.lifepoints).style.display = "none";
                }
                this.#greedy.lifepoints--;
            }

            // Vérifier la collision avec les fruits
            this.#fruits.forEach(fruit => {
                if (fruit.collisionWith(hungry)) {
                    hungry.fruitsEaten++; // Incrémenter fruitsEaten pour ce hungry
                    this.removeFruits(fruit);
                }
            });

            // Dessiner le hungry après avoir déplacé
            hungry.draw(this.#context);
        });

        // Dessiner les fruits et mettre à jour le tableau
        this.#fruits.forEach(fruit => {
            fruit.draw(this.#context);
            if (fruit.collisionWith(this.#greedy)) {
                this.addPoints();
            }
        });
        this.#fruits = this.#fruits.filter(fruit => !fruit.collisionWith(this.#greedy));

        // Appeler la prochaine frame d'animation
        requestAnimationFrame(this.animate.bind(this));
    } else {
        this.drawGameOverandscore();

    }
}


  Gameover() {
    return this.#greedy.lifepoints <= 0;
  }

  drawGameOverandscore() {
      // Fond gris semi-transparent
      this.#context.fillStyle = "rgba(0, 0, 0)";
      this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

      // Texte "Game Over" centré
      this.#context.font = "bold 40px Arial";
      this.#context.fillStyle = "white";
      this.#context.textAlign = "center";
      this.#context.fillText("Game Over", this.#canvas.width / 2, this.#canvas.height / 2 - 20);

      // Sauvegarder le meilleur score avant de l'afficher
      this.saveBestScore();

      // Afficher le meilleur score
      const bestScore = this.getBestScore();
      this.#context.font = "20px Arial";
      this.#context.fillText("Best Score: " + bestScore, this.#canvas.width / 2, this.#canvas.height / 2 + 20);

      // Message supplémentaire
      this.#context.font = "20px Arial";
      this.#context.fillText("Rechargez la page pour rejouer", this.#canvas.width / 2, this.#canvas.height / 2 + 60);
  }




  saveBestScore() {
      const bestScore = localStorage.getItem("bestScoreValue");
      if (!bestScore || this.#greedy.points > parseInt(bestScore)) {
        localStorage.setItem("bestScoreValue", this.#greedy.points);
      }
  }

  getBestScore() {
      return localStorage.getItem("bestScoreValue");
  }


  keyDownHandler(event) {
    if (event.key === 'ArrowLeft') {
      this.keyManager.leftPressed();
    } else if (event.key === 'ArrowRight') {
      this.keyManager.rightPressed();
    } else if (event.key === 'ArrowUp') {
      this.keyManager.upPressed();
    } else if (event.key === 'ArrowDown') {
      this.keyManager.downPressed();
    }
  }

  keyUpHandler(event) {
    if (event.key === 'ArrowLeft') {
      this.keyManager.leftReleased();
    } else if (event.key === 'ArrowRight') {
      this.keyManager.rightReleased();
    } else if (event.key === 'ArrowUp') {
      this.keyManager.upReleased();
    } else if (event.key === 'ArrowDown') {
      this.keyManager.downReleased();
    }
  }

  addPoints() {
    this.#greedy.points += 100;
    document.getElementById("score").textContent = this.#greedy.points;
  }

}
