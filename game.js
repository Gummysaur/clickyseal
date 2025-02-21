import Upgrade from "./Upgrade.js";
let seal;
let icehole;
let score = 0;
let fpc = 1; // fish per click
let fps = 0; // idle fish gained per second
let i = 0; // index of fish pool
let clickBuffer = 10; // # of fish/upgrade popup text in the pool
let fishPool = [];
let upgradeTxtPool = [];
let scoreBoard;
let fpsBoard;
let fpcBoard;
let timer = 0;
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
    fpcBoard = this.add.text(20, 70, '  per click: ' + fpc, {
        fontFamily: 'serif',
        fontSize: '18px'
    });
    icehole = this.add.image(300, 100, 'icehole').setInteractive();
    seal = this.add.image(400, 300, 'seal').setScale(0.25);

    fpsUpgrade = new Upgrade(10, 
        this.add.rectangle(100, 500, 100, 100, 0xffffff).setInteractive(),
        '  Fisherman:\nIncreases idle fish gained per second. \n Costs 10 fish.',   
    );

    fpcUpgrade = new Upgrade(5,
        this.add.rectangle(300, 500, 100, 100, 0x00ff00).setInteractive(),
        '  Bait:\nIncreases fish gained per click. \n Costs 5 fish.'
    );

    yochanUpgrade = new Upgrade(100,
        this.add.rectangle(500, 500, 100, 100, 0x0000ff).setInteractive(),
        '  Seal: A new seal for you! \n Costs 100 fish.'
    )

    toolTip =  this.add.rectangle(900, 700, 300, 100, 0xffffff).setOrigin(0);
    toolTipText = this.add.text(900, 700, 'placeholder', { fontFamily: 'Arial', color: '#000' }).setOrigin(0);
    
    for (let d = 0; d < clickBuffer; d++) {
        let upgradeText = this.add.text(900, 700, 'Upgraded!', { fontFamily: 'Arial', color: '#000' }).setOrigin(0);
        upgradeTxtPool.push(upgradeText);
    }    
    
    this.input.setPollOnMove();

    this.input.on('gameobjectout', function (pointer, gameObject) {
        fpsUpgrade.hover = false;
        fpcUpgrade.hover = false;
        yochanUpgrade.hover = false;
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

    fpsUpgrade.sprite.on('pointerdown', () => {
        if(score >= fpsUpgrade.cost){
            score -= fpsUpgrade.cost;
            fpsUpgrade.level++;
            fps = fpsUpgrade.level * 5;
            fpsUpgrade.cost+=10;

            printUpgradedText(fpsUpgrade);
        }
    });

    fpcUpgrade.sprite.on('pointerdown', () => {
        if(score >= fpcUpgrade.cost){
            score -= fpcUpgrade.cost;
            fpcUpgrade.level++;
            fpc = fpcUpgrade.level * 3;
            fpcUpgrade.cost+=10;

            printUpgradedText(fpcUpgrade);
        }
    });

    yochanUpgrade.sprite.on('pointerdown', () => {
        if(score >= yochanUpgrade.cost){
            score -= yochanUpgrade.cost;
            yochanUpgrade.level++;
            this.add.image(200, 300, 'yochan').setScale(0.1);
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
        if(i == clickBuffer){
            i = 0;
        }
        let thisFish = fishPool[i];
        i++;
        thisFish.setPosition(300, 100);
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
    });



}

function update (time, delta)
{
    timer += delta;
    while (timer > 1000) {
        score += fps;
        timer -= 1000;
    }

    if(fpsUpgrade.hover){
        toolTipText.setText('  Fisherman:\nIncreases idle fish gained per second. \n Costs ' + fpsUpgrade.cost + ' fish.',   
        )
    }    
    if(fpcUpgrade.hover){
        toolTipText.setText('  Bait:\nIncreases fish gained per click. \n Costs ' + fpcUpgrade.cost + ' fish.'
        )
    }

    scoreBoard.setText('Fish: ' + score);
    fpsBoard.setText('  per second: ' + fps);
    fpcBoard.setText('  per click: ' + fpc);
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