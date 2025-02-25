import Upgrade from "./Upgrade.js";
import Seal from "./Seal.js";

let kyoro;
let yochan;

let icehole;
let score = 0;
let scoreAllTime = 0;
let fpc = 1; // fish per click
let fps = 0; // idle fish gained per second
let i = 0; // index of fish pool
let clickBuffer = 10; // # of fish/upgrade popup text in the pool
let fishPool = [];
let upgradeTxtPool = [];
let fpcPool = [];
let scoreBoard;
let fpsBoard;
let timer = 0; // counts when a second has passed
let timer2 = 0; // counts when 10 seconds have passed
let toolTip;
let toolTipText;

let fpsUpgrade;
let fpcUpgrade;
let yochanUpgrade;

let sc;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

var game = new Phaser.Game(config);

function preload ()
{
    sc = this;
    this.load.image('sky', 'assets/sky.png');
    this.load.image('icehole', 'assets/icehole.png');
    this.load.image('seal', 'assets/seal.png');
    this.load.image('fish', 'assets/fish.png');
    this.load.image('yochan', 'assets/yochan.png');
    this.load.image('babyseal', 'assets/babyseal.png');
    this.load.image('bait', 'assets/bait.PNG');
    this.load.image('fisherman', 'assets/fisherman.PNG');
    this.load.image('newseal', 'assets/newseal.PNG');
    this.load.spritesheet('kyorosprite', 'assets/kyorosprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babysprite', 'assets/babysprite.png', {frameWidth: 98, frameHeight: 98});
}

function create ()
{
    this.add.image(400, 300, 'sky');
    scoreBoard = this.add.text(20, 30, 'Fish: ' + score, {
        fontFamily: 'serif', 
        fontSize: '24px'
    });
    fpsBoard = this.add.text(20, 50, '  per second: ' + fps, {
        fontFamily: 'serif',
        fontSize: '18px'
    });

    this.anims.create({
        key: 'blink',
        frames: this.anims.generateFrameNumbers('kyorosprite', {start: 0, end: 10}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 3500
    });

    this.anims.create({
        key: 'yawn',
        frames: this.anims.generateFrameNumbers('babysprite', {start: 0, end: 10}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 5000,
        yoyo: true
    });

    icehole = this.add.image(300, 100, 'icehole').setInteractive();

    kyoro = new Seal("Kyoro", "Spotted Seal", 'Female', -1, ' ',
        this.add.sprite(400, 300, 'kyorosprite').setInteractive(), 'adult'
    )
    kyoro.sprite.anims.play('blink');

    yochan = yochan = new Seal("Yochan", "Ringed Seal", "Female", 500, ' ',
        this.add.sprite(1000, 300, 'babysprite').setInteractive(), 'baby'
    )
    yochan.sprite.anims.play('yawn');

    fpsUpgrade = new Upgrade(10, 
        this.add.image(100, 475, 'fisherman').setInteractive(),
        '  '   
    );

    fpcUpgrade = new Upgrade(5,
        this.add.image(250, 475, 'bait').setInteractive(),
        '  '
    );

    yochanUpgrade = new Upgrade(100,
        this.add.image(400, 475, 'newseal').setInteractive(),
        '  Seal: A new seal for you! \n Costs 100 fish.'
    )

    toolTip =  this.add.rectangle(900, 700, 300, 100, 0xffffff).setOrigin(0);
    toolTipText = this.add.text(900, 700, 'placeholder', { fontFamily: 'Arial', color: '#000' }).setOrigin(0);
    
    for (let d = 0; d < clickBuffer; d++) {
        let upgradeText = this.add.text(900, 700, 'Upgraded!', { fontFamily: 'Arial', color: '#000' }).setOrigin(0);
        upgradeTxtPool.push(upgradeText);
    }
    
    for(let c = 0; c < clickBuffer + 10; c++){
        let fpcText = this.add.text(900, 700, '+' + fpc, 
            {fontFamily: 'Arial', color: '#000', fontSize: '24px', fontStyle: 'bold',
                stroke: '#fff', strokeThickness: 10
            }).setOrigin(0);
        fpcPool.push(fpcText);
    }
    
    this.input.setPollOnMove();

    this.input.on('gameobjectout', function (pointer, gameObject) {
        fpsUpgrade.hover = false;
        fpcUpgrade.hover = false;
        yochanUpgrade.hover = false;
        kyoro.hover = false;
        yochan.hover = false;
        toolTip.setPosition(900, 700);
        toolTipText.setPosition(900, 700);
    });
    
    fpsUpgrade.sprite.on('pointermove', function (pointer, x, y, event) {
        fpsUpgrade.onHover(toolTip, toolTipText, pointer);
    });

    fpcUpgrade.sprite.on('pointermove', function (pointer, x, y, event) {
        fpcUpgrade.onHover(toolTip, toolTipText, pointer);
    });

    yochanUpgrade.sprite.on('pointermove', function (pointer, x, y, event) {
        yochanUpgrade.onHover(toolTip, toolTipText, pointer);
    });

    kyoro.sprite.on('pointermove', function (pointer, x, y, event){
        kyoro.onHover(toolTip, toolTipText, pointer);
    })

    yochan.sprite.on('pointermove', function(pointer, x, y, event){
        yochan.onHover(toolTip, toolTipText, pointer);
    })

    fpsUpgrade.sprite.on('pointerdown', () => {
        if(score >= fpsUpgrade.cost){
            score -= fpsUpgrade.cost;
            fpsUpgrade.level++;
            fps+=1;
            fpsUpgrade.cost+=10;

            printUpgradedText(fpsUpgrade);
        }
    });

    fpcUpgrade.sprite.on('pointerdown', () => {
        if(score >= fpcUpgrade.cost){
            score -= fpcUpgrade.cost;
            fpcUpgrade.level++;
            fpc+=1;
            fpcUpgrade.cost+=10;

            printUpgradedText(fpcUpgrade);
        }
    });

    yochanUpgrade.sprite.on('pointerdown', () => {
        if(score >= yochanUpgrade.cost){
            score -= yochanUpgrade.cost;
            yochanUpgrade.level++;
            yochan.sprite.setPosition(200, 300);
            yochanUpgrade.sprite.destroy();
            toolTip.setPosition(900, 700);
            toolTipText.setPosition(900, 700);
        }
    });

    for (let d = 0; d < clickBuffer; d++) {
        let fish = this.add.image(850, 650, 'fish');
        fishPool.push(fish);
    }

    // give fish when you click the ice hole
    icehole.on('pointerdown', () => {
        score+=fpc;
        scoreAllTime+=fpc;
        if(i == clickBuffer){
            i = 0;
        }
        let thisFish = fishPool[i];
        let thisFpc = fpcPool[i];
        i++;
        thisFish.setPosition(300, 100);
        thisFpc.setPosition(280, 100);
        this.tweens.add({
            targets: thisFish,
            x: 300 + (Math.random() * 30) * (Math.random() < 0.5 ? -1 : 1),
            y: 80 - (Math.random() * 50),
            ease: 'Cubic',
            alpha: 0,
            duration: 700,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                thisFish.setPosition(850, 650);
                thisFish.alpha = 1;
            }
        });
        this.tweens.add({
            targets: thisFpc,
            y: 50,
            ease: 'Linear',
            alpha: 0,
            duration: 900,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                thisFpc.setPosition(850, 650);
                thisFpc.alpha = 1;
            }
        })
    });



}

function update (time, delta)
{
    timer += delta;
    timer2 += delta;
    while (timer > 1000) {
        score += fps;
        scoreAllTime += fps;
        timer -= 1000;
    }

    if(fpsUpgrade.hover){
        toolTipText.setText('  Fisherman:\nProduces 1 fish per second. \n Costs ' 
            + fpsUpgrade.cost + ' fish. \n Quantity: ' + fpsUpgrade.level   
        );
    }    
    if(fpcUpgrade.hover){
        toolTipText.setText('  Bait:\nGives +1 fish per click. \n Costs ' 
            + fpcUpgrade.cost + ' fish. \n Quantity: ' + fpcUpgrade.level
        );
    }
    if(kyoro.hover){
        toolTipText.setText('Name: ' + kyoro.name + 
            '\nSpecies: ' + kyoro.species +
            '\nGender: ' + kyoro.gender +
        '\n  A shy and curious seal.');
    }
    if(yochan.hover){
        toolTipText.setText('Name: ' + yochan.name +
            '\nSpecies: ' + yochan.species +
            '\nGender: ' + kyoro.gender +
            '\n  A spoiled diva.'
        );
    }

    scoreBoard.setText('Fish: ' + score);
    fpsBoard.setText('  per second: ' + fps);
    for(let c = 0; c < clickBuffer; c++){
        fpcPool[c].setText('+' + fpc);
    }
}

function printUpgradedText(upgrade){
    if(i == clickBuffer){
        i = 0;
    }
    let thisText = upgradeTxtPool[i];
    i++;
    thisText.setPosition(upgrade.sprite.x, upgrade.sprite.y);
    sc.tweens.add({
        targets: thisText,
        y: upgrade.sprite.y - 100,
        ease: 'Cubic',
        alpha: 0,
        duration: 700,
        repeat: 0,
        yoyo: false,
        onComplete: function(){
            thisText.setPosition(900, 700);
            thisText.alpha = 1;
        }
    });
}