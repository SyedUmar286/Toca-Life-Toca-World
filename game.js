const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let player = { x: 100, y: 100, width: 50, height: 50, color: "red", inventory: [] };
let items = [
    { id: 1, x: 300, y: 200, width: 40, height: 40, color: "green", name: "Apple" },
    { id: 2, x: 500, y: 400, width: 40, height: 40, color: "blue", name: "Ball" }
];
let keys = {};
let rooms = [
    { id: 1, name: "Room 1", bgColor: "#fceabb" },
    { id: 2, name: "Room 2", bgColor: "#d0f4f7" }
];
let currentRoom = 0;

// Event listeners
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

document.getElementById("saveBtn").addEventListener("click", saveGame);
document.getElementById("loadBtn").addEventListener("click", loadGame);

// Game loop
function update() {
    movePlayer();
    checkItemPickup();
    draw();
    requestAnimationFrame(update);
}

function movePlayer() {
    if(keys["ArrowUp"]) player.y -= 5;
    if(keys["ArrowDown"]) player.y += 5;
    if(keys["ArrowLeft"]) player.x -= 5;
    if(keys["ArrowRight"]) player.x += 5;

    // Room teleport (simple)
    if(player.x > canvas.width) { currentRoom = (currentRoom+1) % rooms.length; player.x = 0; }
    if(player.x < 0) { currentRoom = (currentRoom-1+rooms.length) % rooms.length; player.x = canvas.width-50; }
}

function checkItemPickup() {
    items.forEach((item, idx) => {
        if(player.x < item.x + item.width &&
           player.x + player.width > item.x &&
           player.y < item.y + item.height &&
           player.y + player.height > item.y) {
            // Pick item
            if(!player.inventory.includes(item.name)) {
                player.inventory.push(item.name);
                console.log("Picked up:", item.name);
            }
        }
    });
}

function draw() {
    // Room background
    ctx.fillStyle = rooms[currentRoom].bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw items
    items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });

    // Inventory display
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Inventory: " + player.inventory.join(", "), 10, canvas.height - 10);
}

function saveGame() {
    const saveData = { player, currentRoom };
    localStorage.setItem("tocaWorldSave", JSON.stringify(saveData));
    alert("Game Saved!");
}

function loadGame() {
    const data = JSON.parse(localStorage.getItem("tocaWorldSave"));
    if(data) {
        player = data.player;
        currentRoom = data.currentRoom;
        alert("Game Loaded!");
    } else {
        alert("No saved game found.");
    }
}

// Start game
update();
