import Upgrade from "./Upgrade.js";
import Seal from "./Seal.js";

let kyoro;
let yochan;
let neil;

let icehole;
let score = 2000;
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
let achievementsButton;
let sealbookButton;
let achievementsScreen;
let sealbookScreen;
let timer = 0; // counts when a second has passed
let timer2 = 0; // counts when 10 seconds have passed
let toolTip;
let toolTipText;

let fpsUpgrade;
let fpcUpgrade;
let yochanUpgrade;
let neilUpgrade;

let sc;

var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 690,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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
    this.load.image('fish', 'assets/fish.png');
    this.load.image('bait', 'assets/bait.PNG');
    this.load.image('fisherman', 'assets/fisherman.PNG');
    this.load.image('newseal', 'assets/newseal.PNG');
    this.load.image('achievements', 'assets/achievements.PNG');
    this.load.image('sealbook', 'assets/sealbook.PNG');
    this.load.spritesheet('kyorosprite', 'assets/kyorosprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babysprite', 'assets/babysprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('iceholesprite', 'assets/iceholesprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('yochansprite', 'assets/yochansprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babyneilsprite', 'assets/babyneilsprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('neilsprite', 'assets/neilsprite.png', {frameWidth: 98, frameHeight: 98});
}

function create ()
{
    let sky = this.add.image(400, 300, 'sky');
    sky.scaleX = 3;
    sky.scaleY = 1.3;
    this.add.rectangle(50, 390, 700, 160, 0xffffff).setOrigin(0);
    scoreBoard = this.add.text(20, 30, 'Fish: ' + score, {
        fontFamily: 'serif', 
        fontSize: '24px'
    });
    fpsBoard = this.add.text(20, 50, '  per second: ' + fps, {
        fontFamily: 'serif',
        fontSize: '18px'
    });
    achievementsButton = this.add.image(900, 50, 'achievements').setInteractive({useHandCursor: true});
    sealbookButton = this.add.image(900, 200, 'sealbook').setInteractive({useHandCursor: true});

    setupAnims(sc);

    icehole = this.add.sprite(400, 175, 'iceholesprite').setInteractive({ useHandCursor: true });
    icehole.anims.play('water');

    kyoro = new Seal("Kyoro", "Spotted Seal", 'Female', -1, ' ',
        this.add.sprite(400, 300, 'kyorosprite').setInteractive({ useHandCursor: true }), 'adult'
    );
    kyoro.sprite.anims.play('blink');

    yochan = new Seal("Yochan", "Ringed Seal", "Female", 500, ' ',
        this.add.sprite(200, 300, 'babysprite').setInteractive({ useHandCursor: true }), 'baby'
    );
    yochan.sprite.setVisible(false);
    yochan.sprite.anims.play('yawn');

    neil = new Seal('Neil', "Elephant Seal", "Male", 1000, ' ', 
        this.add.sprite(550, 300, 'babyneilsprite').setInteractive({useHandCursor: true}), 'baby'
    );
    neil.sprite.setVisible(false);
    neil.sprite.anims.play('banana');

    fpsUpgrade = new Upgrade(10, 
        this.add.image(100, 475, 'fisherman').setInteractive({ useHandCursor: true }),
        '  '   
    );

    fpcUpgrade = new Upgrade(5,
        this.add.image(250, 475, 'bait').setInteractive({ useHandCursor: true }),
        '  '
    );

    yochanUpgrade = new Upgrade(100,
        this.add.image(400, 475, 'newseal').setInteractive({ useHandCursor: true }),
        '  Seal: A new seal for you! \n Costs 100 fish.'
    );

    neilUpgrade = new Upgrade(700,
        this.add.image(400, 475, 'newseal').setInteractive({useHandCursor: true}),
        '  Seal: Another new seal for you! \n Costs 700 fish.'
    );
    neilUpgrade.sprite.visible = false;

    toolTip =  this.add.rectangle(900, 700, 300, 100, 0xffffff).setOrigin(0).setVisible(false);
    toolTipText = this.add.text(900, 700, 'placeholder', { fontFamily: 'Arial', color: '#000' }).setOrigin(0).setVisible(false);
    
    for (let d = 0; d < clickBuffer; d++) {
        let upgradeText = this.add.text(900, 700, 'Upgraded!', { fontFamily: 'Arial', color: '#000' }).setOrigin(0).setVisible(false);
        upgradeTxtPool.push(upgradeText);
    }
    
    for(let c = 0; c < clickBuffer + 10; c++){
        let fpcText = this.add.text(380, 175, '+' + fpc, 
            {fontFamily: 'Arial', color: '#000', fontSize: '24px', fontStyle: 'bold',
                stroke: '#fff', strokeThickness: 10
            }).setOrigin(0).setVisible(false);
        fpcPool.push(fpcText);
    }
    
    this.input.setPollOnMove();

    this.input.on('gameobjectout', function (pointer, gameObject) {
        fpsUpgrade.hover = false;
        fpcUpgrade.hover = false;
        yochanUpgrade.hover = false;
        kyoro.hover = false;
        yochan.hover = false;
        neil.hover = false;
        toolTip.setVisible(false);
        toolTipText.setVisible(false);
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

    neilUpgrade.sprite.on('pointermove', function (pointer){
        neilUpgrade.onHover(toolTip, toolTipText, pointer);
    });

    kyoro.sprite.on('pointermove', function (pointer, x, y, event){
        kyoro.onHover(toolTip, toolTipText, pointer);
    });

    yochan.sprite.on('pointermove', function(pointer, x, y, event){
        yochan.onHover(toolTip, toolTipText, pointer);
    });

    neil.sprite.on('pointermove', function(pointer){
        neil.onHover(toolTip, toolTipText, pointer);
    });

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
            yochan.sprite.setVisible(true);
            yochanUpgrade.sprite.destroy();
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
            neilUpgrade.sprite.setVisible(true);
        }
    });

    neilUpgrade.sprite.on('pointerdown', () => {
        if(score >= neilUpgrade.cost){
            score -= neilUpgrade.cost;
            neilUpgrade.level++;
            neil.sprite.visible = true;
            neilUpgrade.sprite.destroy();
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    })

    kyoro.sprite.on('pointerdown', () => {
        this.tweens.add({
            targets: kyoro.sprite,
            y: '-=15',
            ease: 'Cubic',
            duration: 240,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                sc.tweens.add({
                    targets: kyoro.sprite,
                    y: 300,
                    ease: 'Bounce',
                    duration: 600,
                    repeat: 0,
                    yoyo: false
                })
            }
        });
    })

    yochan.sprite.on('pointerdown', () => {
        if(score >= yochan.lvlUpCost && yochan.stage === 'baby'){
            score -= yochan.lvlUpCost;
            yochan.lvl++;
            yochan.stage = 'adult';
            yochan.sprite.setTexture('yochansprite');
            yochan.sprite.anims.play('look');
        }
        this.tweens.add({
            targets: yochan.sprite,
            y: '-=20',
            ease: 'Cubic',
            duration: 100,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                sc.tweens.add({
                    targets: yochan.sprite,
                    y: 300,
                    ease: 'Bounce',
                    duration: 600,
                    repeat: 0,
                    yoyo: false
                })
            }
        });
    })

    neil.sprite.on('pointerdown', () => {
        if(score >= neil.lvlUpCost && neil.stage === 'baby'){
            score -= neil.lvlUpCost;
            neil.lvl++;
            neil.stage = 'adult';
            neil.sprite.setTexture('neilsprite');
            neil.sprite.anims.play('rest');
        }
        this.tweens.add({
            targets: neil.sprite,
            y: '-=10',
            ease: 'Cubic',
            duration: 340,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                sc.tweens.add({
                    targets: neil.sprite,
                    y: 300,
                    ease: 'Bounce',
                    duration: 600,
                    repeat: 0,
                    yoyo: false
                })
            }
        });
    })

    for (let d = 0; d < clickBuffer; d++) {
        let fish = this.add.image(400, 175, 'fish').setScale(0.5);
        fish.setVisible(false);
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
        thisFish.setVisible(true);
        thisFpc.setVisible(true);
        this.tweens.add({
            targets: thisFish,
            x: 400 + (Math.random() * 30) * (Math.random() < 0.5 ? -1 : 1),
            y: 130 - (Math.random() * 50),
            ease: 'Cubic',
            alpha: 0,
            duration: 700,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                thisFish.setPosition(400, 175);
                thisFish.setVisible(false);
                thisFish.alpha = 1;
            }
        });
        this.tweens.add({
            targets: thisFpc,
            y: 75,
            ease: 'Linear',
            alpha: 0,
            duration: 900,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                thisFpc.setPosition(380, 175);
                thisFpc.setVisible(false);
                thisFpc.alpha = 1;
            }
        })
    });

    achievementsScreen = this.add.container(300, 400);
    sealbookScreen = this.add.container(300, 400);

    achievementsScreen.setVisible(false);
    sealbookScreen.setVisible(false);
    achievementsScreen.add(this.add.rectangle(250, -50, 800, 500, 0xffffff));

    achievementsButton.on('pointerdown', () =>{
        achievementsScreen.setVisible(true);
    })

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
            '\nGender: ' + yochan.gender +
            '\n  A spoiled diva.'
        );
        if(yochan.stage === 'baby'){
            toolTipText.appendText('Needs ' + yochan.lvlUpCost + ' fish to grow up.');
        }
        else if(yochan.stage === 'adult'){
            toolTipText.appendText('All grown up!');
        }
    }
    if(neil.hover){
        toolTipText.setText('Name: ' + neil.name +
            '\nSpecies: ' + neil.species +
            '\nGender: ' + neil.gender +
            '\n Stubborn and short-tempered.'
        );
        if(neil.stage === 'baby'){
            toolTipText.appendText('Needs ' + neil.lvlUpCost + ' fish to grow up.');
        }
        else if(neil.stage === 'adult'){
            toolTipText.appendText('All grown up!');
        }
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
    thisText.setVisible(true);
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
            thisText.setVisible(false);
            thisText.alpha = 1;
        }
    });
}

function setupAnims(sc){
    sc.anims.create({
        key: 'blink',
        frames: sc.anims.generateFrameNumbers('kyorosprite', {start: 0, end: 10}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 3500
    });

    sc.anims.create({
        key: 'yawn',
        frames: sc.anims.generateFrameNumbers('babysprite', {start: 0, end: 10}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 5000,
        yoyo: true
    });

    sc.anims.create({
        key: 'water',
        frames: sc.anims.generateFrameNumbers('iceholesprite', {start: 0, end: 11}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 7500
    })

    sc.anims.create({
        key: 'look',
        frames: sc.anims.generateFrameNumbers('yochansprite', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 5000,
        yoyo: true
    })

    sc.anims.create({
        key: 'banana',
        frames: sc.anims.generateFrameNumbers('babyneilsprite', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 10000,
        yoyo: true
    })

    sc.anims.create({
        key: 'rest',
        frames: sc.anims.generateFrameNumbers('neilsprite', {start: 0, end: 11}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 12000,
        yoyo: true
    })
}