const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const playerImgs = {
    idle: loadImg("assets/player/idle.png"),
    walk1: loadImg("assets/player/walk1.png"),
    walk2: loadImg("assets/player/walk2.png")
};
const bgImgs = [
    loadImg("assets/backgrounds/room1.png"),
    loadImg("assets/backgrounds/room2.png")
];
const itemImgs = {
    apple: loadImg("assets/items/apple.png"),
    ball: loadImg("assets/items/ball.png")
};

// Game state
let currentRoom = 0;
let player = { x:100, y:300, frame:0, direction:1, inv:[] };
let items = [
    {name:"apple", x:300, y:350},
    {name:"ball", x:500, y:380}
];
let keys = {};

// Controls
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
document.getElementById("saveBtn").onclick = saveGame;
document.getElementById("loadBtn").onclick = loadGame;

// Game loop
function update() {
    movePlayer();
    draw();
    requestAnimationFrame(update);
}

function movePlayer() {
    let moving = false;
    if(keys["ArrowRight"]) { player.x += 4; player.direction = 1; moving=true; }
    if(keys["ArrowLeft"])  { player.x -= 4; player.direction = -1; moving=true; }
    if(keys["ArrowUp"])    { player.y -= 4; moving=true; }
    if(keys["ArrowDown"])  { player.y += 4; moving=true; }

    // Animation
    if(moving) {
        player.frame = (player.frame+1) % 20;
    } else {
        player.frame = 0;
    }

    // Item pickup
    items = items.filter(it => {
        if(Math.hypot(player.x - it.x, player.y - it.y) < 40) {
            if(!player.inv.includes(it.name)) player.inv.push(it.name);
            return false;
        }
        return true;
    });

    updateInventoryUI();
}

function draw() {
    // background
    ctx.drawImage(bgImgs[currentRoom],0,0,canvas.width,canvas.height);

    // player sprite
    let img = playerImgs.idle;
    if(player.frame > 5 && player.frame < 15) img = playerImgs.walk1;
    if(player.frame >= 15) img = playerImgs.walk2;

    ctx.save();
    if(player.direction == -1) {
        ctx.scale(-1,1);
        ctx.drawImage(img, -player.x -50, player.y, 50, 70);
    } else {
        ctx.drawImage(img, player.x, player.y, 50, 70);
    }
    ctx.restore();

    // items
    items.forEach(it => ctx.drawImage(itemImgs[it.name], it.x, it.y, 40, 40));
}

function updateInventoryUI() {
    document.getElementById("inventory").innerText =  
      "Inventory: " + player.inv.join(", ");
}

function saveGame() {
    localStorage.setItem("saveData", JSON.stringify({player, currentRoom}));
    alert("Game Saved!");
}
function loadGame() {
    let data = JSON.parse(localStorage.getItem("saveData"));
    if(data) { player = data.player; currentRoom = data.currentRoom; alert("Loaded!"); }
}

function loadImg(src) {
    let img = new Image();
    img.src = src;
    return img;
}

update();
