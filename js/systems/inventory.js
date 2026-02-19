class InventorySystem {
    constructor(player) {
        this.player = player;
        this.items = [];
        this.maxSize = 20;
        this.gold = 0;
        
        // Equipment slots
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };
        
        // UI state
        this.isOpen = false;
        this.selectedSlot = 0;
    }
    
    addItem(item) {
        if (this.items.length >= this.maxSize) {
            console.log("Inventory is full!");
            return false;
        }
        
        // Check if item is stackable
        if (item.stackable) {
            const existingItem = this.items.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
                return true;
            }
        }
        
        // Add new item
        this.items.push({
            ...item,
            quantity: item.quantity || 1,
            equipped: false
        });
        
        return true;
    }
    
    removeItem(itemId, quantity = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1) return false;
        
        const item = this.items[index];
        
        if (item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            // Unequip if equipped
            if (item.equipped) {
                this.unequipItem(item);
            }
            this.items.splice(index, 1);
        }
        
        return true;
    }
    
    equipItem(item) {
        if (!item.equippable) return false;
        
        // Unequip current item in slot
        if (this.equipment[item.slot]) {
            this.unequipItem(this.equipment[item.slot]);
        }
        
        // Equip new item
        item.equipped = true;
        this.equipment[item.slot] = item;
        
        // Apply stat modifications
        this.applyItemStats(item, true);
        
        return true;
    }
    
    unequipItem(item) {
        if (!item.equipped) return false;
        
        // Remove from equipment slot
        this.equipment[item.slot] = null;
        item.equipped = false;
        
        // Remove stat modifications
        this.applyItemStats(item, false);
        
        return true;
    }
    
    applyItemStats(item, apply) {
        const modifier = apply ? 1 : -1;
        
        if (item.stats) {
            if (item.stats.health) {
                this.player.maxHealth += item.stats.health * modifier;
                this.player.health = Math.min(this.player.health, this.player.maxHealth);
            }
            if (item.stats.speed) {
                this.player.speed += item.stats.speed * modifier;
            }
            if (item.stats.defense) {
                this.player.defense += item.stats.defense * modifier;
            }
        }
    }
    
    useItem(item) {
        if (item.consumable) {
            // Apply consumable effects
            if (item.effects) {
                if (item.effects.heal) {
                    this.player.health = Math.min(
                        this.player.health + item.effects.heal,
                        this.player.maxHealth
                    );
                }
                if (item.effects.hunger) {
                    // Call survival system
                    window.game.survival.eat(item.effects.hunger);
                }
                if (item.effects.thirst) {
                    window.game.survival.drink(item.effects.thirst);
                }
            }
            
            // Remove consumed item
            this.removeItem(item.id, 1);
            return true;
        }
        
        return false;
    }
    
    toggleInventory() {
        this.isOpen = !this.isOpen;
    }
    
    render(ctx, camera) {
        if (!this.isOpen) return;
        
        // Darken background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw inventory panel
        const panelWidth = 600;
        const panelHeight = 400;
        const panelX = (ctx.canvas.width - panelWidth) / 2;
        const panelY = (ctx.canvas.height - panelHeight) / 2;
        
        // Panel background
        ctx.fillStyle = '#2a2a3a';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.shadowBlur = 0;
        
        // Panel border
        ctx.strokeStyle = '#6c5ce7';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Inventory', panelX + 20, panelY + 40);
        
        // Gold
        ctx.fillStyle = '#ffd700';
        ctx.font = '18px Arial';
        ctx.fillText(`Gold: ${this.gold}`, panelX + panelWidth - 120, panelY + 40);
        
        // Item slots
        const slotSize = 50;
        const slotMargin = 10;
        const startX = panelX + 20;
        const startY = panelY + 80;
        const slotsPerRow = 8;
        
        for (let i = 0; i < this.maxSize; i++) {
            const row = Math.floor(i / slotsPerRow);
            const col = i % slotsPerRow;
            const x = startX + col * (slotSize + slotMargin);
            const y = startY + row * (slotSize + slotMargin);
            
            // Slot background
            ctx.fillStyle = i === this.selectedSlot ? '#4a4a6a' : '#1a1a2e';
            ctx.fillRect(x, y, slotSize, slotSize);
            ctx.strokeStyle = '#6c5ce7';
            ctx.strokeRect(x, y, slotSize, slotSize);
            
            // Draw item if exists
            if (this.items[i]) {
                const item = this.items[i];
                
                // Item icon (simple colored square for now)
                ctx.fillStyle = item.color || '#ffffff';
                ctx.fillRect(x + 5, y + 5, slotSize - 10, slotSize - 10);
                
                // Quantity if > 1
                if (item.quantity > 1) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.fillText(item.quantity.toString(), x + slotSize - 20, y + slotSize - 10);
                }
                
                // Equipped indicator
                if (item.equipped) {
                    ctx.fillStyle = '#4ecdc4';
                    ctx.beginPath();
                    ctx.arc(x + slotSize - 10, y + 10, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        // Item description
        if (this.items[this.selectedSlot]) {
            const item = this.items[this.selectedSlot];
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.fillText(item.name, panelX + 20, panelY + panelHeight - 40);
            ctx.font = '14px Arial';
            ctx.fillStyle = '#b0b0b0';
            ctx.fillText(item.description, panelX + 20, panelY + panelHeight - 20);
        }
    }
    
    handleInput(input) {
        if (input.isKeyPressed('i')) {
            this.toggleInventory();
        }
        
        if (!this.isOpen) return;
        
        // Navigate inventory with arrow keys
        const slotsPerRow = 8;
        if (input.isKeyPressed('arrowright')) {
            this.selectedSlot = Math.min(this.maxSize - 1, this.selectedSlot + 1);
        }
        if (input.isKeyPressed('arrowleft')) {
            this.selectedSlot = Math.max(0, this.selectedSlot - 1);
        }
        if (input.isKeyPressed('arrowdown')) {
            this.selectedSlot = Math.min(this.maxSize - 1, this.selectedSlot + slotsPerRow);
        }
        if (input.isKeyPressed('arrowup')) {
            this.selectedSlot = Math.max(0, this.selectedSlot - slotsPerRow);
        }
        
        // Use/equip item with enter
        if (input.isKeyPressed('enter')) {
            const item = this.items[this.selectedSlot];
            if (item) {
                if (item.consumable) {
                    this.useItem(item);
                } else if (item.equippable) {
                    this.equipItem(item);
                }
            }
        }
        
        // Drop item with delete
        if (input.isKeyPressed('delete')) {
            this.removeItem(this.items[this.selectedSlot]?.id, 1);
        }
    }
}