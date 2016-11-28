//Creating sprite using sprite sheets for animation
var mouse_moved = false;
var touch_started = false;
var explode_sprite_sheet;
var player_sprite_sheet;
var tile_sprite_sheet;
var explode_sprite;
var player_walk;
var player_stand;
var player_sprite;
var tile_frames;

var old_man_sheet;
var old_man_animation;

var old_man_frames = [
  {'name':'old_walk01', 'frame':{'x':0, 'y': 0, 'width': 256, 'height': 256}},
  {'name':'old_walk02', 'frame':{'x':256, 'y': 0, 'width': 256, 'height': 256}},
  {'name':'old_walk03', 'frame':{'x':512, 'y': 0, 'width': 256, 'height': 256}},
  {'name':'old_walk04', 'frame':{'x':768, 'y': 0, 'width': 256, 'height': 256}},
  {'name':'old_walk05', 'frame':{'x':1024, 'y': 0, 'width': 256, 'height': 256}}
  //{'name':'old_walk06', 'frame':{'x':1280, 'y': 0, 'width': 256, 'height': 256}}
  ];
var level1Grid = [[0,3,0,0,0,0,3,0],
                  [0,2,2,0,0,3,1,0],
                  [1,1,1,1,1,2,1,2]];
var tileSize = 70;

var Gravity = .8;
var platforms;
var groundTouch = false;



// Normally you would put this in a .json file, but I'm putting it here
// for example purposes
var player_frames = [
  {'name':'player_walk01', 'frame':{'x':0, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk02', 'frame':{'x':71, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk03', 'frame':{'x':142, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk04', 'frame':{'x':0, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk05', 'frame':{'x':71, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk06', 'frame':{'x':142, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk07', 'frame':{'x':213, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk08', 'frame':{'x':284, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk09', 'frame':{'x':213, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk10', 'frame':{'x':355, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk11', 'frame':{'x':284, 'y': 95, 'width': 70, 'height': 94}}
];


function preload() {
  
  old_man_sheet = loadSpriteSheet('assets/sprite_sheet_old_man.png', old_man_frames);
  old_man_animation = loadAnimation(old_man_sheet);
  //
  //  There are two different ways to load a SpriteSheet
  //     1. Given width, height that will be used for every frame and the
  //        number of frames to cycle through. The sprite sheet must have a
  //        uniform grid with consistent rows and columns.
  //     2. Given an array of frame objects that define the position and
  //        dimensions of each frame.  This is Flexible because you can use
  //        sprite sheets that don't have uniform rows and columns.
  //
  //    Below demonstrates both methods:



  // Load the json for the tiles sprite sheet
  tile_frames = loadJSON('assets/tiles.json');

  // Load the explode sprite sheet using frame width, height and number of frames
  explode_sprite_sheet = loadSpriteSheet('assets/explode_sprite_sheet.png', 171, 158, 11);

  // Load player sprite sheet from frames array
  player_sprite_sheet = loadSpriteSheet('assets/player_spritesheet.png', player_frames);
  
  // Load tiles sprite sheet from frames array
  tile_sprite_sheet = loadSpriteSheet('assets/tiles_spritesheet.png', tile_frames);

  // Exploding star animation
  explode_animation = loadAnimation(explode_sprite_sheet);

  // Player walk animation passing in a SpriteSheet
  player_walk = loadAnimation(player_sprite_sheet);

  // An animation with a single frame for standing
  player_stand = loadAnimation(new SpriteSheet('assets/player_spritesheet.png',
    [{'name':'player_stand', 'frame':{'x':284, 'y': 95, 'width': 70, 'height': 94}}]));
}

function setup() {
  print(tile_frames[0]);
  createCanvas(800, 400);
  //generate a random level design
  /*for(var i = 0; i < 20;i++){
    var tempRan = round(random(0,3));
    level1Grid.push(tempRan);
  }*/
  // Create the exploding star sprite and add it's animation
  explode_sprite = createSprite(width / 2, 100, 171, 158);
  explode_sprite.addAnimation('explode', explode_animation);

  // Create the Player sprite and add it's animations
  player_sprite = createSprite(100, 100, 70, 94);
  player_sprite.friction = 0.93;
  player_sprite.addAnimation('walk', player_walk);
  player_sprite.addAnimation('stand', player_stand);
  player_sprite.addAnimation('old',old_man_animation);
  player_sprite.debug = true;
  
  print(tile_frames[0]);
  platforms = new Group();
  
  var floorHeight = 100;
  
  for(var y = 0;y < level1Grid.length;y++){
   for(var x = 0;x < level1Grid[y].length;x++){// pull the grid values out of the array
   var gridValue = level1Grid[y][x];
   //draw a different tile depending on grid value
   switch(gridValue){
     case 0:
       
       break;
       
      case 1:
        var sprite = createSprite(x*tileSize, floorHeight + (y*tileSize));
        var tempImage = loadAnimation(new SpriteSheet('assets/tiles_spritesheet.png',[tile_frames[4]]));
       sprite.addAnimation('normal',tempImage);
        sprite.debug = true;
       platforms.add(sprite);
      break;
      case 2:
        var sprite = createSprite(x*tileSize, floorHeight + (y*tileSize));
       var tempImage = loadAnimation(new SpriteSheet('assets/tiles_spritesheet.png',[tile_frames[6]]));
       sprite.addAnimation('normal',tempImage);
       platforms.add(sprite);
      break;
      case 3:
      var sprite = createSprite(x*tileSize, floorHeight + (y*tileSize));
       
       var tempImage = loadAnimation(new SpriteSheet('assets/tiles_spritesheet.png',[tile_frames[0]]));
       sprite.addAnimation('normal',tempImage);
       platforms.add(sprite);
      break;
      
   }
 }
}
  
  
}

function draw() {
  clear();
  background(0);

// loop through the grid array
 




  /*
  randomSeed(4);
  for(var i = 0; i < 20;i++){
     tile_sprite_sheet.drawFrame('stone.png', random(2000), random(0,200));
  }*/

  // Draw the sign tiles
  tile_sprite_sheet.drawFrame('signExit.png', 700, 260);
  tile_sprite_sheet.drawFrame('signRight.png', 0, 260);
  /*
  // Mobile friendly controls
  var eventX;
  if (isTouch()) {
    eventX = touchX;
  } else {
    eventX = mouseX;
  }

  //if mouse is to the left
  if(eventX < player_sprite.position.x - 10) {
    player_sprite.changeAnimation('walk');
    // flip horizontally
    player_sprite.mirrorX(-1);
    // move left
    player_sprite.velocity.x = -2;
  }
  else if(eventX > player_sprite.position.x + 10) {
    player_sprite.changeAnimation('walk');
    // flip horizontally
    player_sprite.mirrorX(1);
    // move right
    player_sprite.velocity.x = 2;
  }*/
  fill(255);
  textSize(40)
  text(player_sprite.velocity.x,100,100);
  //use the standing frame if the character velocity drops below a certain amount
  if(player_sprite.velocity.x < 0.1 && player_sprite.velocity.x > -0.1){
    player_sprite.changeAnimation('stand');
    //if close to the mouse, don't move
    player_sprite.velocity.x = 0;
  }
  
  // make the floor solid
  player_sprite.collide(platforms);
  player_sprite.overlap(platforms, groundTest);
  // making gravity
  player_sprite.velocity.y += Gravity;
  
  
  /*
  //happen at regular intervals
  var prob = 1;
  if(random(100) < prob){
    player_sprite.velocity.x += random(-5,5);
  }
  */
  
  //dead test
  if(player_sprite.position.y > height){
    stroke(255);
    textSize(100);
    text("DEAD",100,100);
    //gameState = 'over';
  }
  
  //keep the camera on the player except if they fall dow a hole.
  camera.position.x = player_sprite.position.x;
  if(player_sprite.position.y < height-200){
    camera.position.y = player_sprite.position.y;
  }
  //camera.position.y = player_sprite.position.y;
  //draw the sprite
 
  drawSprites();
}

function touchStarted() {
  touch_started = true;
}

function mouseMoved() {
  mouse_moved = true;
}
function keyTyped() {
 switch(key){
  case 'a':
   player_sprite.changeAnimation('walk');
    // flip horizontally
    
    player_sprite.mirrorX(-1);
    // move left
    player_sprite.velocity.x = -5;
   break;
  case 's':
    player_sprite.changeAnimation('old');
    // flip horizontally
    
    player_sprite.mirrorX(1);
    // move right
    player_sprite.velocity.x = 5;
    break;
  case 'w':
    if(groundTouch){
      player_sprite.changeAnimation('walk');
      player_sprite.velocity.y = -20;
      groundTouch = false;
    }
  break;
 }
}
function isTouch() {
  return touch_started && !mouse_moved;
}

function groundTest(player,platform){
  groundTouch = true;
}
