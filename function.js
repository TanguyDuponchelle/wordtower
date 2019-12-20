let starNumber = 10;
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
const possibleWords = ['word', 'Plouf', 'run', 'speed', 'fast', 'php', 'Darth_Vader', 'loremIpsum', 'Table', 'Escabeau', 'hazard', 'souris', 'Bit', 'ornithorynque', 'châtaigne', 'Sarasins', 'poubelle', 'dinosaure', 'string', 'bytes', 'Poutou', 'vermifuge', 'fenouille', 'Radiateur', 'poireau', 'cuillère', 'pléonasme', 'glabelle', 'Perchoir', 'Chaussettes']
let word;
let wordArray;
let label;
let error = 0;
const input = document.getElementById('typerInput');
function start() {
  word = possibleWords[getRandomInt(possibleWords.length)];
  wordArray = word.split('');
  document.getElementById('typer').classList.remove("hidden");
  label = document.getElementById('typerLabel').innerHTML = word;
  input.focus();
}
input.addEventListener('keyup', (e) => {
  const array = e.target.value.split('');
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== wordArray[i]) {
      input.disabled = true;
      input.style.color = 'red';
      setTimeout(
        () => {
          input.disabled = false;
          input.focus();
          error++;
        },
        500);
    }
    else {
      input.style.color = 'white';
    }
  }
  if (e.target.value === word) {
    input.value = "";
    document.getElementById('typer').classList.add("hidden");
    seconds = seconds + 5;
  }
}
);
var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game = new Phaser.Game(config);
function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}
function create() {

  this.add.image(800, 600, 'sky');
  platforms = this.physics.add.staticGroup();
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(300, window.innerHeight + 75, 'ground').setScale(6).refreshBody();

  //  Now let's create some ledges
  platforms.create(window.innerWidth - 200, innerHeight - 150, 'ground');
  platforms.create(0, innerHeight - 150, 'ground');
  platforms.create(window.innerWidth / 2, innerHeight / 2 + 50, 'ground');

  // The player and its settings
  player = this.physics.add.sprite(100, window.innerHeight - 100, 'dude');
  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();
  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  console.log(starNumber);
  stars = this.physics.add.group({
    key: 'star',
    repeat: starNumber - 1,
    setXY: { x: window.innerWidth / starNumber, y: 0, stepX: (window.innerWidth - (window.innerWidth / starNumber)) / starNumber }
  });
  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  bombs = this.physics.add.group();
  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}
function update() {
  socket.emit('playerPosUpdate', { number: playerNumber === 1 ? 1 : 2, x: player.x, y: player.y });
  if (gameOver) {
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('game-over__link').focus();
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-300);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(300);
    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
function collectStar(player, star) {
  star.disableBody(true, true);
  //  Add and update the score
  score += 10;
  start();
  scoreText.setText('Score: ' + score);
  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    starNumber = starNumber - 1;
    stars = this.physics.add.group({
      key: 'star',
      repeat: starNumber - 1,
      setXY: { x: window.innerWidth / starNumber, y: 0, stepX: (window.innerWidth - (window.innerWidth / starNumber)) / starNumber }
    });
    stars.children.iterate(function (child) {
      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}
function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
}