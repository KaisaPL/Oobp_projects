const prompts = require('prompts');

class Rooms {
    constructor(name, description, isExit) {
        this.name = name;
        this.description = description;
        this.doors = [];
        this.creatures = [];
        this.exit = isExit;
    }
    addDoor(door){
        this.doors.push(door);
    }
    addMonsters(monster){
        this.creatures.push(monster);
    } 
}
class Characters {
    constructor(hp, hc, ap, name){
        this.hitPoints = hp;
        this.hitChance = hc;
        this.attackPoints = ap;
        this.name = name;
    }
    
}
class Player extends Characters {
    constructor(hp, hc, ap, name){
        super(hp, hc, ap, name);
        this.currentRoom = 0;
    }
    attack(enemy){
        let strike = Math.floor(Math.random()*101);
        if(strike > this.hitChance){
            console.log('Your hit misses!\n');
        }else{
            console.log('You hit the ' + enemy.name + ' and it takes ' + this.attackPoints + ' damage.\n');
            enemy.hitPoints -= this.attackPoints;
            if(enemy.hitPoints <= 0){
                console.log( enemy.name+" falls to the ground and dies. You are safe!\n")
                for(let i = 0; i < world[this.currentRoom].creatures.length; i++){
                    if(world[this.currentRoom].creatures[i] == enemy) {
                        world[this.currentRoom].creatures.splice(i, 1);    
                    }
                }
                
            }else{
                console.log(enemy.name+ ' has '+enemy.hitPoints+ ' hp left.\n');
            }
        }
    }
    look(){
        console.log(world[this.currentRoom].description);
        if(world[this.currentRoom].doors.length != 0){
            console.log('\nThere are doors leading to: ');
            for(let i = 0; i < world[this.currentRoom].doors.length; i++){
                console.log(world[this.currentRoom].doors[i].name)
            }
        }
        if(world[this.currentRoom].creatures.length != 0){
            console.log('\nYou see following creatures:');
            for(let i = 0; i < world[this.currentRoom].creatures.length; i++){
                console.log(world[this.currentRoom].creatures[i].name)
            }
        }
    }
    move(room){
        this.currentRoom = world.indexOf(room);
        if(world[this.currentRoom].exit == true){
            console.log('Finally you are safe! You won the game!')
            gameRunning = false;
        }
        for(let i = 0; i < world[this.currentRoom].creatures.length; i++){
            world[this.currentRoom].creatures[i].attack(this)
        }
    }
}
class Monsters extends Characters {
    constructor(hp, hc, ap, name){
        super(hp, hc, ap, name);
    }
    attack(player){
        let strike = Math.floor(Math.random()*101);
        console.log('The ' +this.name+ ' attacks you!');
        if(strike > this.hitChance){
            console.log("The attack misses!");
        }else{
            console.log('You get hit!');
            player.hitPoints -= this.attackPoints;
            if(player.hitPoints <= 0){
                console.log('Oh no! You lost all your hp. You are dead!');
                gameRunning = false;
            }
        }
    }
}

let entrance = new Rooms('Entrance', 'You can hear the wind and some other sound, which you cannot recognise. \n What do you do?', false);
let hallway = new Rooms('Hallway', 'The room is dimly lit with torches and you can see something moving in the corner.\n What do you do?', false);
let chamber = new Rooms('Chamber', 'It gets dark again and the air feels intimidating. What do you do?', false);
let portal = new Rooms('Portal', ' ', true);

entrance.addDoor(hallway);

hallway.addDoor(entrance);
hallway.addDoor(chamber);

chamber.addDoor(hallway);
chamber.addDoor(portal);

let player = new Player(10, 75, 2, 'Player');

let rat = new Monsters( 2, 50, 1, 'Rat' );
let voldemort = new Monsters( 4, 90, 8, 'Voldemort' );
hallway.addMonsters(rat);
chamber.addMonsters(voldemort);

let world = [entrance, hallway, chamber, portal];
let gameRunning = true;

async function gameLoop() {

    const initialActionChoices = [
        { title: 'Look around', value: 'look' },
        { title: 'Go to Room', value: 'goToRoom' },
        { title: 'Attack', value: 'attack'},
        { title: 'Exit game', value: 'exit'}
    ];

    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });

    console.log('You selected ' + response.value);

    switch(response.value){
      case 'look':
        console.log('\nYou look around ' + world[player.currentRoom].name);
        console.log(world[player.currentRoom].description);
        if(world[player.currentRoom].doors.length != 0) {
            console.log('\nYou see these doors: ');
            for(let i = 0; i < world[player.currentRoom].doors.length; i++){
                console.log(world[player.currentRoom].doors[i].name)
            }
        }
        if(world[player.currentRoom].creatures.length != 0) {
            console.log('You see these monsters: ')
            for(let i = 0; i < world[player.currentRoom].creatures.length; i++){
                console.log(world[player.currentRoom].creatures[i].name)
            }
            console.log('=============')
            for(let i = 0; i < world[player.currentRoom].creatures.length; i++){
                world[player.currentRoom].creatures[i].attack(player)
            }
        }
        break;
      case 'goToRoom':
        const roomChoices = [];
        for(let i = 0; i < world[player.currentRoom].doors.length; i++){
            roomChoices.push({
                title: world[player.currentRoom].doors[i].name,
                value: world[player.currentRoom].doors[i].name,
                room: world[player.currentRoom].doors[i]
            })
        }
    
        const response = await prompts({
          type: 'select',
          name: 'value',
          message: 'Choose your action',
          choices: roomChoices
        });
        for(let i = 0; roomChoices.length; i++){
            if(response.value == roomChoices[i].value){
                console.log('You moved to ' +roomChoices[i].value+ '\n')
                player.move(roomChoices[i].room)
                break;
            }
        }

        break;
      case 'attack':
        const monsterChoices = [];
        for(let i = 0; i < world[player.currentRoom].creatures.length; i++){
            monsterChoices.push({
                title: world[player.currentRoom].creatures[i].name,
                value: world[player.currentRoom].creatures[i].name,
                monster: world[player.currentRoom].creatures[i]
            })
        }
    
        const monsterResponse = await prompts({
          type: 'select',
          name: 'value',
          message: 'Choose your action',
          choices: monsterChoices
        });
        for(let i = 0; i < monsterChoices.length; i++){
            if(monsterResponse.value == monsterChoices[i].value){
                console.log('You attack ' +monsterChoices[i].value)
                player.attack(monsterChoices[i].monster)
                break;
            }
        }
        break;
      default:
        process.exit();
    }
    if(gameRunning){
    gameLoop();
    }
}

process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();


