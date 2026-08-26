⚙️ Chunk 7 of the paper

// main function after the helper functions
```javascript
async function yourMainFunctionName(bot) {
  // ...
}
```

### 📌 Prompt 5: Full System Prompt for Generating Function Descriptions

> Used when adding a new skill to the skill library. A one-shot example is included in the prompt.

**System instructions given to the assistant:**

You are a helpful assistant that writes a description of the given function written in Mineflayer javascript code.

1. Do not mention the function name.
2. Do not mention anything about `bot.chat` or helper functions.
3. There might be helper functions before the main function, but only the main function needs to be described.
4. Summarize the function in no more than 6 sentences.
5. The response should be a single line of text.

**One-shot example — input function:**

```javascript
async function mineCobblestone(bot) {
  // Check if the wooden pickaxe is in the inventory, if not, craft one
  let woodenPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName["wooden_pickaxe"].id);
  if (!woodenPickaxe) {
    bot.chat("Crafting a wooden pickaxe.");
    await craftWoodenPickaxe(bot);
    woodenPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName["wooden_pickaxe"].id);
  }

  // Equip the wooden pickaxe if it exists
  if (woodenPickaxe) {
    await bot.equip(woodenPickaxe, "hand");

    // Explore until we find a stone block
    await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
      const stone = bot.findBlock({
        matching: mcData.blocksByName["stone"].id,
        maxDistance: 32
      });
      if (stone) {
        return true;
      }
    });

    // Mine 8 cobblestone blocks using the wooden pickaxe
    bot.chat("Found a stone block. Mining 8 cobblestone blocks.");
    await mineBlock(bot, "stone", 8);
    bot.chat("Successfully mined 8 cobblestone blocks.");

    // Save the event of mining 8 cobblestone
    bot.save("cobblestone_mined");
  } else {
    bot.chat("Failed to craft a wooden pickaxe. Cannot mine cobblestone.");
  }
}
```

**Expected model output:**

> The function is about mining 8 cobblestones using a wooden pickaxe. First check if a wooden pickaxe is in the inventory. If not, craft one. If the wooden pickaxe is available, equip the wooden pickaxe in the hand. Next, explore the environment until finding a stone block. Once a stone block is found, mine a total of 8 cobblestone blocks using the wooden pickaxe.

---

### A.4.3 Examples

#### 🔧 Skill Library Example 1: `craftWoodenPlanks`

```javascript
async function craftWoodenPlanks(bot) {
  const logNames = ["oak_log", "birch_log", "spruce_log", "jungle_log", "acacia_log", "dark_oak_log", "mangrove_log"];
  const plankNames = ["oak_planks", "birch_planks", "spruce_planks", "jungle_planks", "acacia_planks", "dark_oak_planks", "mangrove_planks"];

  const logInInventory = logNames.find(logName => bot.inventory.count(mcData.itemsByName[logName].id) > 0);
  if (!logInInventory) {
    bot.chat("No wooden log in inventory. Mining a wooden log...");
    await mineWoodLog(bot);
  }

  const logIndex = logNames.indexOf(logInInventory);
  const plankName = plankNames[logIndex];

  bot.chat(`Crafting 4 ${plankName}...`);
  await craftItem(bot, plankName, 1);
  bot.chat(`4 ${plankName} crafted.`);
}
```

#### 🔧 Skill Library Example 2: `mineTenCobbledDeepslateBelowY0`

```javascript
async function mineTenCobbledDeepslateBelowY0(bot) {
  // Equip the iron pickaxe
  const ironPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName["iron_pickaxe"].id);
  await bot.equip(ironPickaxe, "hand");

  // Find cobbled_deepslate blocks below Y=0
  const cobbledDeepslateBlocks = await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
    const cobbledDeepslate = bot.findBlock({
      matching: mcData.blocksByName["cobbled_deepslate"].id,
      maxDistance: 32,
      position: pos => pos.y < 0
    });
    return cobbledDeepslate;
  });

  // Mine 10 cobbled_deepslate blocks
  await mineBlock(bot, "cobbled_deepslate", 10);
  bot.chat("10 cobbled_deepslate mined below Y=0.");
}
```

#### 🔧 Skill Library Example 3: `smeltFiveRawIronV2`

```javascript
async function findSuitablePosition(bot) {
  const offsets = [new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1)];
  for (const offset of offsets) {
    const position = bot.entity.position.offset(offset.x, offset.y, offset.z);
    const block = bot.blockAt(position);
    if (block.name === "air") {
      return position;
    }
  }
  return null;
}

async function smeltFiveRawIron(bot) {
  // Check if there is a furnace in the inventory
  const furnaceItem = bot.inventory.findInventoryItem(mcData.itemsByName.furnace.id);

  // If not, craft a furnace using the available cobblestone
  if (!furnaceItem) {
    await craftFurnace(bot);
  }

  // Find a suitable position to place the furnace
  const furnacePosition = await findSuitablePosition(bot);
  if (!furnacePosition) {
    bot.chat("Could not find a suitable position to place the furnace.");
    return;
  }

  // Place the furnace at the suitable position
  await placeItem(bot, "furnace", furnacePosition);

  // Smelt 5 raw iron using the available coal as fuel
  await smeltItem(bot, "raw_iron", "coal", 5);
  bot.chat("5 raw iron smelted.");
}
```

#### 🔧 Skill Library Example 4: `fillBucketWithWater`

```javascript
async function fillBucketWithWater(bot) {
  // Find a water block nearby
  const waterBlock = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
    const water = bot.findBlock({
      matching: mcData.blocksByName.water.id,
      maxDistance: 32
    });
    return water;
  });

  if (!waterBlock) {
    bot.chat("Could not find water.");
    return;
  }

  // Go to the water block
  const adjacentBlock = waterBlock.position.offset(0, 1, 0);
  await bot.pathfinder.goto(
    new GoalGetToBlock(adjacentBlock.x, adjacentBlock.y, adjacentBlock.z)
  );

  // Look at the water block
  await bot.lookAt(waterBlock.position, true);

  // Equip the bucket
  const bucket = bot.inventory.findInventoryItem(mcData.itemsByName.bucket.id);
  await bot.equip(bucket, "hand");

  // Activate the bucket to collect water
  await bot.activateItem();
  bot.chat("Filled the bucket with water.");
}
```

#### 🔧 Skill Library Example 5: `catchFiveFishSafely`

```javascript
async function catchFiveFishSafely(bot) {
  // Check if the bot has a fishing rod in its inventory
  let fishingRod = bot.inventory.findInventoryItem(mcData.itemsByName.fishing_rod.id);
  if (!fishingRod) {
    await craftFishingRod(bot);
    fishingRod = bot.inventory.findInventoryItem(mcData.itemsByName.fishing_rod.id);
  }

  // Find a nearby water block
  let waterBlock;
  while (!waterBlock) {
    waterBlock = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
      const foundWaterBlock = bot.findBlock({
        matching: mcData.blocksByName.water.id,
        maxDistance: 32
      });
      return foundWaterBlock;
    });
    if (!waterBlock) {
      bot.chat("No path to the water block. Trying to find another water block...");
    }
  }

  // Move to a block adjacent to the water block
  const adjacentBlock = waterBlock.position.offset(0, 1, 0);
  await bot.pathfinder.goto(new GoalBlock(adjacentBlock.x, adjacentBlock.y, adjacentBlock.z));

  // Look at the water block
  await bot.lookAt(waterBlock.position);

  // Equip the fishing rod
  await bot.equip(fishingRod, "hand");

  // Fish in the water 5 times
  for (let i = 0; i < 5; i++) {
    try {
      await bot.fish();
      bot.chat(`Fish ${i + 1} caught.`);
    } catch (error) {
      if (error.message === "Fishing cancelled") {
        bot.chat("Fishing was cancelled. Trying again...");
        i--; // Retry the same iteration
      } else {
        throw error;
      }
    }
  }
}
```

---

## A.5 Self-Verification

### A.5.1 Components in the Prompt

The input prompt to GPT-4 consists of the following components:

1. **Agent's state** — other recently-seen blocks and nearby entities are excluded since they aren't useful for assessing task completeness.
2. **Task proposed by the automatic curriculum.**
3. **Task context** — GPT-3.5 is prompted for general suggestions on how to solve the task; in practice this is handled by the automatic curriculum via its question-answering mechanism.
4. **Chain-of-thought prompting** in the response — GPT-4 first reasons about the task's success or failure, outputs a boolean outcome, and finally provides a critique if the task fails.
5. **Few-shot examples** for in-context learning.

### A.5.2 Full Prompt

#### 📌 Prompt 6: Full System Prompt for Self-Verification

You are an assistant that assesses my progress of playing Minecraft and provides useful guidance. You are required to evaluate if I have met the task requirements. Exceeding the task requirements is also considered a success, while failing to meet them requires you to provide critique to help me improve.

**Information provided to the assistant:**

| Field | Description |
|---|---|
| Biome | The biome after the task execution |
| Time | The current time |
| Nearby blocks | Surrounding blocks (not yet collected, useful for placing/planting tasks) |
| Health | Current health |
| Hunger | Current hunger level (20.0 = successfully ate food, for eating tasks) |
| Position | Current position |
| Equipment | Final equipment (crafted items are sometimes equipped) |
| Inventory (xx/36) | Final inventory (used to check mining/smelting tasks) |
| Chests | Chest contents, if the task requires placing items in a chest |
| Task | The objective to accomplish |
| Context | The context of the task |

**Required response format (JSON only):**

```json
{
  "reasoning": "reasoning",
  "success": true,
  "critique": "critique"
}
```

> Ensure the response can be parsed by Python `json.loads`, e.g.: no trailing commas, no single quotes, etc.

**Example input begins:**

```
INPUT:
Inventory (2/36): {'oak_log':2, 'spruce_log':2}
```
