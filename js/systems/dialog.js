class DialogueSystem {
    constructor() {
        this.currentDialogue = null;
        this.currentNode = null;
        this.dialogueHistory = [];
        this.isActive = false;
        this.npcSpeaking = null;
        
        // Dialogue UI elements
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueText = document.getElementById('dialogue-text');
        this.dialogueOptions = document.getElementById('dialogue-options');
        
        // Typing effect
        this.typingSpeed = 30; // ms per character
        this.typingTimer = null;
        this.currentText = '';
        this.targetText = '';
        this.textIndex = 0;
        
        // Response handlers
        this.responseCallbacks = new Map();
        
        // Initialize response handlers
        this.initResponseHandlers();
    }
    
    initResponseHandlers() {
        // Register default response types
        this.registerResponseHandler('quest_accept', (response, game) => {
            game.questSystem.acceptQuest(response.questId);
            this.showMessage(`Quest accepted: ${response.questName}`);
        });
        
        this.registerResponseHandler('quest_complete', (response, game) => {
            if (game.questSystem.completeQuest(response.questId)) {
                this.showMessage(`Quest completed: ${response.questName}`);
                if (response.rewards) {
                    this.giveRewards(response.rewards, game);
                }
            }
        });
        
        this.registerResponseHandler('shop', (response, game) => {
            this.openShop(response.shopId, game);
        });
        
        this.registerResponseHandler('give_item', (response, game) => {
            if (game.inventory.addItem(response.item)) {
                this.showMessage(`Received: ${response.item.name}`);
                if (response.nextNode) {
                    this.currentNode = this.getNodeById(response.nextNode);
                    this.displayCurrentNode();
                }
            }
        });
        
        this.registerResponseHandler('check_item', (response, game) => {
            const hasItem = game.inventory.items.some(item => item.id === response.itemId);
            const nextNode = hasItem ? response.successNode : response.failureNode;
            if (nextNode) {
                this.currentNode = this.getNodeById(nextNode);
                this.displayCurrentNode();
            }
        });
        
        this.registerResponseHandler('check_quest', (response, game) => {
            const questState = game.questSystem.getQuestState(response.questId);
            const nextNode = response[questState] || response.defaultNode;
            if (nextNode) {
                this.currentNode = this.getNodeById(nextNode);
                this.displayCurrentNode();
            }
        });
    }
    
    registerResponseHandler(type, callback) {
        this.responseCallbacks.set(type, callback);
    }
    
    startDialogue(dialogueId, npc, game) {
        this.currentDialogue = DIALOGUE_DATA[dialogueId];
        if (!this.currentDialogue) {
            console.error(`Dialogue ${dialogueId} not found`);
            return;
        }
        
        this.npcSpeaking = npc;
        this.isActive = true;
        this.dialogueHistory = [];
        this.dialogueBox.classList.remove('hidden');
        
        // Start at the first node
        this.currentNode = this.getNodeById(this.currentDialogue.startNode);
        this.displayCurrentNode();
        
        // Trigger any on-start events
        if (this.currentDialogue.onStart) {
            this.currentDialogue.onStart(game, npc);
        }
    }
    
    endDialogue() {
        this.isActive = false;
        this.currentDialogue = null;
        this.currentNode = null;
        this.npcSpeaking = null;
        this.dialogueBox.classList.add('hidden');
        
        // Clear typing timer
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
            this.typingTimer = null;
        }
    }
    
    getNodeById(nodeId) {
        return this.currentDialogue.nodes.find(node => node.id === nodeId);
    }
    
    displayCurrentNode() {
        if (!this.currentNode) return;
        
        // Log to history
        this.dialogueHistory.push({
            nodeId: this.currentNode.id,
            speaker: this.currentNode.speaker || this.npcSpeaking?.name || 'Unknown',
            text: this.currentNode.text
        });
        
        // Start typing effect
        this.startTypingEffect(this.currentNode.text);
        
        // Display options
        this.displayOptions(this.currentNode.options);
        
        // Trigger node-specific events
        if (this.currentNode.onDisplay) {
            this.currentNode.onDisplay(window.game, this.npcSpeaking);
        }
    }
    
    startTypingEffect(text) {
        // Clear any existing typing timer
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
        }
        
        this.targetText = text;
        this.currentText = '';
        this.textIndex = 0;
        this.dialogueText.textContent = '';
        
        this.typingTimer = setInterval(() => {
            if (this.textIndex < this.targetText.length) {
                this.currentText += this.targetText[this.textIndex];
                this.dialogueText.textContent = this.currentText;
                this.textIndex++;
            } else {
                clearInterval(this.typingTimer);
                this.typingTimer = null;
            }
        }, this.typingSpeed);
    }
    
    displayOptions(options) {
        this.dialogueOptions.innerHTML = '';
        
        if (!options || options.length === 0) {
            // Add default "Goodbye" option
            const goodbyeButton = document.createElement('button');
            goodbyeButton.textContent = 'Goodbye';
            goodbyeButton.onclick = () => this.endDialogue();
            this.dialogueOptions.appendChild(goodbyeButton);
            return;
        }
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            
            // Check if option should be visible based on conditions
            if (option.condition && !this.evaluateCondition(option.condition)) {
                button.style.display = 'none';
            }
            
            button.onclick = () => this.selectOption(option);
            
            // Add keyboard shortcut hint
            if (index < 9) {
                button.textContent += ` [${index + 1}]`;
            }
            
            this.dialogueOptions.appendChild(button);
        });
    }
    
    selectOption(option) {
        // Play sound effect if available
        if (option.sound) {
            // Play sound
        }
        
        // Handle response if exists
        if (option.response) {
            this.handleResponse(option.response);
        }
        
        // Determine next node
        if (option.nextNode) {
            this.currentNode = this.getNodeById(option.nextNode);
            this.displayCurrentNode();
        } else if (option.action === 'end') {
            this.endDialogue();
        }
        
        // Add to history
        this.dialogueHistory.push({
            type: 'player_choice',
            text: option.text
        });
    }
    
    handleResponse(response) {
        const handler = this.responseCallbacks.get(response.type);
        if (handler) {
            handler(response, window.game);
        } else {
            console.warn(`No handler for response type: ${response.type}`);
        }
    }
    
    evaluateCondition(condition) {
        const game = window.game;
        
        switch (condition.type) {
            case 'has_item':
                return game.inventory.items.some(item => item.id === condition.itemId);
                
            case 'quest_completed':
                return game.questSystem.isQuestCompleted(condition.questId);
                
            case 'quest_active':
                return game.questSystem.isQuestActive(condition.questId);
                
            case 'has_gold':
                return game.inventory.gold >= condition.amount;
                
            case 'stat_check':
                const playerStat = game.player[condition.stat];
                return playerStat >= condition.value;
                
            case 'lore_discovered':
                return game.loreKeeper?.discoveredLore.includes(condition.loreId);
                
            case 'random':
                return Math.random() < condition.chance;
                
            default:
                return true;
        }
    }
    
    giveRewards(rewards, game) {
        if (rewards.gold) {
            game.inventory.gold += rewards.gold;
            this.showMessage(`Received ${rewards.gold} gold`);
        }
        
        if (rewards.items) {
            rewards.items.forEach(item => {
                if (game.inventory.addItem(item)) {
                    this.showMessage(`Received: ${item.name}`);
                }
            });
        }
        
        if (rewards.experience) {
            // Add experience system
            console.log(`Gained ${rewards.experience} XP`);
        }
    }
    
    showMessage(message) {
        // Temporary message display
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #4ecdc4;
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid #6c5ce7;
            z-index: 1000;
            animation: fadeOut 2s forwards;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }
    
    openShop(shopId, game) {
        // Shop implementation
        console.log(`Opening shop: ${shopId}`);
        // You can expand this into a full shop system
    }
    
    update() {
        // Handle keyboard shortcuts for options (1-9)
        if (this.isActive && this.dialogueOptions.children.length > 0) {
            for (let i = 0; i < Math.min(9, this.dialogueOptions.children.length); i++) {
                if (window.game.input.isKeyPressed((i + 1).toString())) {
                    this.dialogueOptions.children[i].click();
                    break;
                }
            }
        }
    }
}