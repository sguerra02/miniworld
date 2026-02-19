// Game initialization
class Game {
	constructor() {
		this.canvas = document.getElementById('game-canvas');
		this.ctx = this.canvas.getContext('2d');
		
		// Initialize systems
		this.input = new InputHandler();
		this.camera = new Camera(this.canvas);
		this.collision = new CollisionSystem();
		this.survival = new SurvivalSystem();
		this.questSystem = new QuestSystem();
		// Initialize dialogue system
		this.dialogue = new DialogueSystem();

		// Create NPCs
		this.npcs = [
		    new NPC(350, 350, {
	      name: 'Elder Guardian',
	        dialogueId: 'elder_guardian',
	        color: '#6c5ce7',
	        quests: ['echoes_of_past']
	    }),
	    new NPC(800, 600, {
	        name: 'Rootweaver',
	        dialogueId: 'rootweaver',
		     color: '#00b894',
	        quests: ['root_tongue']
	    }),
	    new NPC(200, 450, {
		     name: 'Villager',
	        dialogueId: 'villager',
        color: '#fdcb6e',
        patrolPath: [
            { x: 200, y: 450 },
            { x: 250, y: 450 },
            { x: 250, y: 500 },
            { x: 200, y: 500 }
        ]
    })
];

		// Add NPCs to combat system for potential enemy interactions
		this.combat.enemies = this.npcs.filter(npc => npc.hostile);
		// Initialize world
		this.map = new Map(100, 100); // 100x100 tile world
		this.player = new Player(500, 500, this.input);
		// In Game constructor, after initializing other systems
		this.combat = new CombatSystem();
		this.inventory = new InventorySystem(this.player);

		// Add enemies to combat system
		this.combat.enemies = []; // Add your enemy instances here
		
		// Set up camera bounds based on map size
		this.camera.setBounds(
	    	0, 
    		0, 
    		this.map.width * this.map.tileSize, 
    		this.map.height * this.map.tileSize
		);
		// Start game
		this.lastTime = 0;
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}
	
	gameLoop(timestamp) {
		const deltaTime = timestamp - this.lastTime;
		this.lastTime = timestamp;
		
		// Update
		this.update(deltaTime);
		
		// Render
		this.render();
		
		requestAnimationFrame(this.gameLoop);
	}
	
	update(deltaTime) {
	this.player.update(deltaTime, this.collision, this.map);
	this.camera.follow(this.player);
	this.camera.updateShake(); // Add this
	
	this.survival.update(deltaTime, this.player);
	this.combat.update(deltaTime); // Add this
	this.inventory.handleInput(this.input); // Add this
	
	this.dialogue.update();
	this.questSystem.update();
	
	this.updateUI();
}

render() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.map.render(this.ctx, this.camera);
	this.player.render(this.ctx, this.camera);
	
	// Render combat effects (projectiles, damage numbers)
	this.combat.render(this.ctx, this.camera);
	
	// Render inventory on top
	this.inventory.render(this.ctx, this.camera);
}
	
	updateUI() {
		document.getElementById('health-bar').style.width = `${this.player.health}%`;
		document.getElementById('hunger-bar').style.width = `${this.survival.hunger}%`;
		document.getElementById('thirst-bar').style.width = `${this.survival.thirst}%`;
		document.getElementById('fatigue-bar').style.width = `${this.survival.fatigue}%`;
		
		const currentZone = this.map.getZoneAt(this.player.x, this.player.y);
		document.getElementById('area-name').textContent = currentZone?.name || 'Unknown';
	}
}

// Start the game when page loads
window.addEventListener('load', () => {
	new Game();
});