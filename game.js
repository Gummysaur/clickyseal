import Upgrade from "./Upgrade.js";
import Seal from "./Seal.js";
import Achievement from "./Achievement.js"
import DexEntry from "./DexEntry.js"

let score = 0;
let scoreAllTime = 0;
let fpc = 1; // fish per click
let fps = 0; // idle fish gained per second
let fpsMult = 1;
let fpcMult = 1;
let i = 0; // index of fish pool
let clickBuffer = 10; // # of fish/upgrade popup text in the pool

// used for the little animated pop-ups upon clicking something
let fpcPool = [];

let scoreBoard;
let fpsBoard;
let timer = 0; // counts when a second has passed
let toolTip;
let toolTipText;
let achvTip;
let achvTipText;

// upgrade objects
let fpsUpgrade;
let fpcUpgrade;
let yochanUpgrade;
let neilUpgrade;
let fishUpgrade;
let octopusUpgrade;
let baitUpgrade;
let nikoUpgrade;
let trumpetUpgrade;

// achivement variables
let speciesAchv;
let speciesAchv2;
let speciesFound = 1;
let thousandFishAchv;
let juggleAchv;

// sealbook objects (dex like pokedex because sealBookEntry is too long)
let kyoroDex;
let babyYoDex;
let yochanDex;
let babyNeilDex;
let neilDex;
let babyNikoDex;
let nikoDex;
let babyTrumpetDex;
let trumpetDex;

// game object arrays
let allSeals = [];
let allUpgrades = [];
let allAchievements = [];
let allDexEntries =[];

// the scene
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
    this.load.image('fish2', 'assets/fish2.PNG')
    this.load.image('octopus', 'assets/octopus.PNG');
    this.load.image('bait', 'assets/bait.PNG');
    this.load.image('bait2', 'assets/bait2.PNG');
    this.load.image('fisherman', 'assets/fisherman.PNG');
    this.load.image('newseal', 'assets/newseal.PNG');
    this.load.image('achievements', 'assets/achievements.PNG');
    this.load.image('sealbook', 'assets/sealbook.PNG');
    this.load.image('locked', 'assets/locked.PNG');
    this.load.image('speciesachv', 'assets/speciesachv.PNG');
    this.load.image('juggleachv', 'assets/juggleachv.PNG');
    this.load.spritesheet('kyorosprite', 'assets/kyorosprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babysprite', 'assets/babysprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('iceholesprite', 'assets/iceholesprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('yochansprite', 'assets/yochansprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babyneilsprite', 'assets/babyneilsprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('neilsprite', 'assets/neilsprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babynikosprite', 'assets/babynikosprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('nikosprite', 'assets/nikosprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('babytrumpetsprite', 'assets/babytrumpetsprite.png', {frameWidth: 98, frameHeight: 98});
    this.load.spritesheet('trumpetsprite', 'assets/trumpetsprite.png', {frameWidth: 98, frameHeight: 98});
}

function create ()
{
    let sky = this.add.image(400, 300, 'sky');

    let fishPool = [];
    let upgradeTxtPool = [];

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
    let achievementsButton = this.add.image(900, 50, 'achievements').setInteractive({useHandCursor: true});
    let sealbookButton = this.add.image(900, 200, 'sealbook').setInteractive({useHandCursor: true});

    setupAnims(sc);

    let icehole = this.add.sprite(400, 175, 'iceholesprite').setInteractive({ useHandCursor: true });
    icehole.anims.play('water');

    let clickit = this.add.text(430, 165, '<- Click Here!', {
        fontFamily: 'serif',
        fontSize: '20px',
        fontStyle: 'italic',
        stroke: '#000', 
        strokeThickness: 5
    });
    this.tweens.add({
        targets: clickit,
        alpha: 0,
        duration: 1000,
        delay: 2000
    });

    let kyoro = new Seal("Kyoro", "Spotted Seal", 'Female', -1, 'A shy and curious seal.',
        this.add.sprite(400, 300, 'kyorosprite').setInteractive({ useHandCursor: true }), 'adult', 0,
        'none', 'blink'
    );
    kyoro.sprite.anims.play('blink');

    let yochan = new Seal("Yochan", "Ringed Seal", "Female", 500, 'A spoiled diva.',
        this.add.sprite(200, 300, 'babysprite').setInteractive({ useHandCursor: true }), 'baby', 5,
        'yawn', 'look'
    );
    yochan.sprite.setVisible(false);
    yochan.sprite.anims.play('yawn');

    let neil = new Seal('Neil', "Elephant Seal", "Male", 1000, 'Stubborn and short-tempered.', 
        this.add.sprite(550, 300, 'babyneilsprite').setInteractive({useHandCursor: true}), 'baby', 10,
        'banana', 'rest'
    );
    neil.sprite.setVisible(false);
    neil.sprite.anims.play('banana');

    let niko = new Seal('Niko', 'Baikal Seal', 'Male', 1500, 'A silly, quirky seal.', 
        this.add.sprite(180, 200, 'babynikosprite').setInteractive({useHandCursor: true}), 'baby', 15,
        'rollover', 'frogblink'
    );
    niko.sprite.setVisible(false);
    niko.sprite.anims.play('rollover');

    let trumpet = new Seal('Trumpet', 'Harbor Seal', 'Female', 2000, 'A friendly, playful seal.', 
        this.add.sprite(580, 200, 'babytrumpetsprite').setInteractive({useHandCursor: true}), 'baby', 20,
        'fiddle', 'jumpa'
    );
    trumpet.sprite.setVisible(false);
    trumpet.sprite.anims.play('fiddle');

    allSeals.push(kyoro);
    allSeals.push(yochan);
    allSeals.push(neil);
    allSeals.push(niko);
    allSeals.push(trumpet);

    fpsUpgrade = new Upgrade(10, 
        this.add.image(100, 475, 'fisherman').setInteractive({ useHandCursor: true }),
        '  Fisherman:\nProduces 1 fish per second. '   
    );

    fpcUpgrade = new Upgrade(5,
        this.add.image(250, 475, 'bait').setInteractive({ useHandCursor: true }),
        '   Bait:\nGives +1 fish per click. '
    );

    yochanUpgrade = new Upgrade(100,
        this.add.image(400, 475, 'newseal').setInteractive({ useHandCursor: true }),
        '  Seal:\n A new seal for you! '
    );

    neilUpgrade = new Upgrade(700,
        this.add.image(400, 475, 'newseal').setInteractive({useHandCursor: true}),
        '  Seal:\n Another new seal for you! '
    );
    neilUpgrade.sprite.setVisible(false);

    nikoUpgrade = new Upgrade(1000,
        this.add.image(400, 475, 'newseal').setInteractive({useHandCursor: true}),
        '  Seal: \n Yet another new seal for you! '
    );
    nikoUpgrade.sprite.setVisible(false);

    trumpetUpgrade = new Upgrade(1500,
        this.add.image(400, 475, 'newseal').setInteractive({useHandCursor: true}),
        '  Seal: \n Yet another new seal for you! '
    );
    trumpetUpgrade.sprite.setVisible(false);

    fishUpgrade = new Upgrade(500,
        this.add.image(550, 475, 'fish2').setInteractive({useHandCursor: true}),
        '  Salmon:\n Increases fish per second by 25%. '
    );
    fishUpgrade.sprite.setVisible(false);

    octopusUpgrade = new Upgrade(800,
        this.add.image(550, 475, 'octopus').setInteractive({useHandCursor: true}),
        '  Octopus:\n Increases FpS by another 25%. '
    );
    octopusUpgrade.sprite.setVisible(false);

    baitUpgrade = new Upgrade(700,
        this.add.image(700, 475, 'bait2').setInteractive({useHandCursor: true}),
        '  Golden Bait:\n Increases fish per click by 50%. '
    )
    baitUpgrade.sprite.setVisible(false);

    allUpgrades.push(fpsUpgrade);
    allUpgrades.push(fpcUpgrade);
    allUpgrades.push(yochanUpgrade);
    allUpgrades.push(neilUpgrade);
    allUpgrades.push(nikoUpgrade);
    allUpgrades.push(trumpetUpgrade);
    allUpgrades.push(fishUpgrade);
    allUpgrades.push(octopusUpgrade);
    allUpgrades.push(baitUpgrade);

    toolTip =  this.add.rectangle(900, 700, 300, 100, 0xffffff).setOrigin(0).setVisible(false);
    toolTipText = this.add.text(900, 700, 'placeholder', { fontFamily: 'Arial', color: '#000' }).setOrigin(0).setVisible(false);
    achvTip = this.add.rectangle(185, 20, 500, 50, 0xffffff).setOrigin(0).setAlpha(0);
    achvTipText = this.add.text(210, 35, 'placeholder', {fontFamily: 'Arial', color: '#000'}).setOrigin(0).setAlpha(0);
    
    for (let d = 0; d < clickBuffer; d++) {
        let upgradeText = this.add.text(900, 700, 'Upgraded!', { fontFamily: 'Arial', color: '#000' }).setOrigin(0).setVisible(false);
        upgradeTxtPool.push(upgradeText);
    }
    
    for(let c = 0; c < clickBuffer + 10; c++){
        let fpcText = this.add.text(380, 175, '+' + (Math.floor(fpc * fpcMult)), 
            {fontFamily: 'Arial', color: '#000', fontSize: '24px', fontStyle: 'bold',
                stroke: '#fff', strokeThickness: 10
            }).setOrigin(0).setVisible(false);
        fpcPool.push(fpcText);
    }
    
    this.input.setPollOnMove();

    this.input.on('gameobjectout', function (pointer, gameObject) {
        allSeals.forEach(function(s){
            s.hover = false;
        });
        allUpgrades.forEach(function(u){
            u.hover = false;
        })
        toolTip.setVisible(false);
        toolTipText.setVisible(false);
    });

    allUpgrades.forEach(function(u){
        u.sprite.on('pointermove', function(pointer){
            u.onHover(toolTip, toolTipText, pointer);
        });
    });

    allSeals.forEach(function(s){
        s.sprite.on('pointermove', function(pointer){
            s.onHover(toolTip, toolTipText, pointer);
        });
    });

    fpsUpgrade.sprite.on('pointerdown', () => {
        if(score >= fpsUpgrade.cost){
            score -= fpsUpgrade.cost;
            fpsUpgrade.level++;
            fps+=1;
            fpsUpgrade.cost+=10;

            printUpgradedText(fpsUpgrade, upgradeTxtPool);
        }
    });

    fpcUpgrade.sprite.on('pointerdown', () => {
        if(score >= fpcUpgrade.cost){
            score -= fpcUpgrade.cost;
            fpcUpgrade.level++;
            fpc+=1;
            fpcUpgrade.cost+=10;

            printUpgradedText(fpcUpgrade, upgradeTxtPool);
        }
    });

    yochanUpgrade.sprite.on('pointerdown', () => {
        if(score >= yochanUpgrade.cost){
            score -= yochanUpgrade.cost;
            yochanUpgrade.level++;
            speciesFound++;
            babyYoDex.achieved = true;
            yochan.sprite.setVisible(true);
            yochanUpgrade.sprite.destroy();
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
            neilUpgrade.sprite.setVisible(true);
            fishUpgrade.sprite.setVisible(true);
            baitUpgrade.sprite.setVisible(true);
        }
    });

    neilUpgrade.sprite.on('pointerdown', () => {
        if(score >= neilUpgrade.cost){
            score -= neilUpgrade.cost;
            speciesFound++;
            babyNeilDex.achieved = true;
            neilUpgrade.level++;
            neil.sprite.visible = true;
            neilUpgrade.sprite.destroy();
            nikoUpgrade.sprite.setVisible(true);
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    });

    nikoUpgrade.sprite.on('pointerdown', ()=>{
        if(score >= nikoUpgrade.cost){
            score -= nikoUpgrade.cost;
            speciesFound++;
            babyNikoDex.achieved = true;
            nikoUpgrade.level++;
            niko.sprite.setVisible(true);
            nikoUpgrade.sprite.destroy();
            trumpetUpgrade.sprite.setVisible(true);
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    });

    trumpetUpgrade.sprite.on('pointerdown', ()=>{
        if(score >= trumpetUpgrade.cost){
            score -= trumpetUpgrade.cost;
            speciesFound++;
            babyTrumpetDex.achieved = true;
            trumpetUpgrade.level++;
            trumpet.sprite.setVisible(true);
            trumpetUpgrade.sprite.destroy();
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    });

    fishUpgrade.sprite.on('pointerdown', () => {
        if(score >= fishUpgrade.cost){
            score -= fishUpgrade.cost;
            fishUpgrade.level++;
            fpsMult += 0.25;
            fishPool[2].setTexture('fish2');
            fishPool[5].setTexture('fish2');
            fishUpgrade.sprite.destroy();
            octopusUpgrade.sprite.setVisible(true);
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    });

    octopusUpgrade.sprite.on('pointerdown', () =>{
        if(score >= octopusUpgrade.cost){
            score -= octopusUpgrade.cost;
            octopusUpgrade.level++;
            fpsMult += 0.25;
            fishPool[7].setTexture('octopus');
            octopusUpgrade.sprite.destroy();
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    });

    baitUpgrade.sprite.on('pointerdown', () => {
        if(score >= baitUpgrade.cost){
            score -= baitUpgrade.cost;
            baitUpgrade.level++;
            fpcMult += 0.5;
            baitUpgrade.sprite.destroy();
            toolTip.setVisible(false);
            toolTipText.setVisible(false);
        }
    });

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
            yochanDex.achieved = true;
            yochan.sprite.setTexture('yochansprite');
            yochan.sprite.anims.play('look');
            fps += yochan.fps;
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
            neilDex.achieved = true;
            neil.sprite.setTexture('neilsprite');
            neil.sprite.anims.play('rest');
            fps += neil.fps;
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
    });

    niko.sprite.on('pointerdown', () => {
        if(score >= niko.lvlUpCost && niko.stage === 'baby'){
            score -= niko.lvlUpCost;
            niko.lvl++;
            niko.stage = 'adult';
            nikoDex.achieved = true;
            niko.sprite.setTexture('nikosprite');
            niko.sprite.anims.play('frogblink');
            fps += niko.fps;
        }
        this.tweens.add({
            targets: niko.sprite,
            y: '-=20',
            ease: 'Cubic',
            duration: 300,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                sc.tweens.add({
                    targets: niko.sprite,
                    y: 200,
                    ease: 'Bounce',
                    duration: 400,
                    repeat: 0,
                    yoyo: false
                })
            }
        });
    });

    trumpet.sprite.on('pointerdown', () => {
        if(score >= trumpet.lvlUpCost && trumpet.stage === 'baby'){
            score -= trumpet.lvlUpCost;
            trumpet.lvl++;
            trumpet.stage = 'adult';
            trumpetDex.achieved = true;
            trumpet.sprite.setTexture('trumpetsprite');
            trumpet.sprite.anims.play('jumpa');
            fps += trumpet.fps;
        }
        this.tweens.add({
            targets: trumpet.sprite,
            y: '-=30',
            ease: 'Cubic',
            duration: 300,
            repeat: 0,
            yoyo: false,
            onComplete: function(){
                sc.tweens.add({
                    targets: trumpet.sprite,
                    y: 200,
                    ease: 'Bounce',
                    duration: 300,
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
    };

    // give fish when you click the ice hole
    icehole.on('pointerdown', () => {
        score+=(fpc * fpcMult);
        scoreAllTime+=(fpc * fpcMult);
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
            duration: 400,
            repeat: 0,
            yoyo: true,
            onComplete: function(){
                thisFish.setPosition(400, 175);
                thisFish.setVisible(false);
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

    // set up achievements and sealbook
    let achievementsScreen = this.add.container(750, 345);
    let sealbookScreen = this.add.container(750, 345);

    achievementsScreen.setVisible(false);
    sealbookScreen.setVisible(false);
    sealbookScreen.add(this.add.rectangle(0, 0, 2000, 800, 0x000000).setAlpha(0.5).setInteractive());
    sealbookScreen.add(this.add.rectangle(0, 0, 800, 500, 0xffffff));
    achievementsScreen.add(this.add.rectangle(0, 0, 2000, 800, 0x000000).setAlpha(0.5).setInteractive());
    achievementsScreen.add(this.add.rectangle(0, 0, 800, 500, 0xffffff));

    let backButton = this.add.text(-350, -200, 'Back', {
        fontFamily: 'serif', 
        fontSize: '24px',
        color: '#000'
    }).setInteractive({useHandCursor:true});
    let backButton2 = this.add.text(-350, -200, 'Back', {
        fontFamily: 'serif', 
        fontSize: '24px',
        color: '#000'
    }).setInteractive({useHandCursor:true});
    achievementsScreen.add(backButton);
    sealbookScreen.add(backButton2);

    speciesAchv = new Achievement(this.add.image(-280, -110, 'locked').setInteractive(), 'Locked', 'speciesachv');
    thousandFishAchv = new Achievement(this.add.image(-180, -110, 'locked').setInteractive(), 'Locked', 'fish');
    juggleAchv = new Achievement(this.add.image(-80, -110, 'locked').setInteractive(), 'Locked', 'juggleachv');
    speciesAchv2 = new Achievement(this.add.image(20, -110, 'locked').setInteractive(), 'Locked', 'speciesachv');
    allAchievements.push(speciesAchv);
    allAchievements.push(thousandFishAchv);
    allAchievements.push(juggleAchv);
    allAchievements.push(speciesAchv2);

    kyoroDex = new DexEntry(kyoro, this.add.sprite(-280, -110, 'kyorosprite').setInteractive(), 'Locked', 'kyorosprite', false);
    kyoroDex.achieved = true;
    babyYoDex = new DexEntry(yochan, this.add.sprite(-180, -110, 'locked').setInteractive(), 'Locked', 'babysprite', true);
    yochanDex = new DexEntry(yochan, this.add.sprite(-80, -110, 'locked').setInteractive(), 'Locked', 'yochansprite', false);
    babyNeilDex = new DexEntry(neil, this.add.sprite(20, -110, 'locked').setInteractive(), 'Locked', 'babyneilsprite', true);
    neilDex = new DexEntry(neil, this.add.sprite(120, -110, 'locked').setInteractive(), 'Locked', 'neilsprite', false);
    babyNikoDex = new DexEntry(niko, this.add.sprite(220, -110, 'locked').setInteractive(), 'Locked', 'babynikosprite', true);
    nikoDex = new DexEntry(niko, this.add.sprite(320, -110, 'locked').setInteractive(), 'Locked', 'nikosprite', false);
    babyTrumpetDex = new DexEntry(trumpet, this.add.sprite(-280, -10, 'locked').setInteractive(), 'Locked', 'babytrumpetsprite', true);
    trumpetDex = new DexEntry(trumpet, this.add.sprite(-180, -10, 'locked').setInteractive(), 'Locked', 'trumpetsprite', false);

    allDexEntries.push(kyoroDex);
    allDexEntries.push(babyYoDex);
    allDexEntries.push(yochanDex);
    allDexEntries.push(babyNeilDex);
    allDexEntries.push(neilDex);
    allDexEntries.push(babyNikoDex);
    allDexEntries.push(nikoDex);
    allDexEntries.push(babyTrumpetDex);
    allDexEntries.push(trumpetDex);
    
    allAchievements.forEach(function(a){
        achievementsScreen.add(a.sprite);
    })

    allDexEntries.forEach(function(d){
        sealbookScreen.add(d.sprite);
    })

    toolTip.depth = 20;
    toolTipText.depth = 20;

    backButton.on('pointerdown', ()=>{
        achievementsScreen.setVisible(false);
    })

    backButton2.on('pointerdown', ()=>{
        sealbookScreen.setVisible(false);
    })

    achievementsButton.on('pointerdown', () =>{
        achievementsScreen.setVisible(true);
    });

    sealbookButton.on('pointerdown', () => {
        sealbookScreen.setVisible(true);
    })

    allAchievements.forEach(function(a){
        a.sprite.on('pointermove', function(pointer){
            a.onHover(toolTip, toolTipText, pointer);
        })
    })

    allDexEntries.forEach(function(d){
        d.sprite.on('pointermove', function(pointer){
            d.onHover(toolTip, toolTipText, pointer);
        });
        d.sprite.on('pointerdown', () => {
            if(d.baby && d.achieved){ 
                d.sprite.anims.play(d.seal.babyAnimName);
                d.sprite.anims.stopAfterRepeat(0);
            }
            else if(!d.baby && d.achieved){
                d.sprite.anims.play(d.seal.adultAnimName);
                d.sprite.anims.stopAfterRepeat(0);
            }
            
        });
    });

}

function update (time, delta)
{
    timer += delta;
    while (timer > 1000) {
        score += (fps * fpsMult);
        scoreAllTime += (fps * fpsMult);
        timer -= 1000;
    }

    allUpgrades.forEach(function(u){
        if(u.hover){
            toolTipText.setText(u.text + '\nCosts ' + u.cost + ' fish. \n Quantity: ' 
                + u.level
            );
        }
    })

    allSeals.forEach(function(s){
        if(s.hover){
            toolTipText.setText('Name: ' + s.name + 
                '\nSpecies: ' + s.species +
                '\nGender: ' + s.gender +
                '\n' + s.text
            );

            if(s.stage === 'baby'){
                toolTipText.appendText('Needs ' + s.lvlUpCost + ' fish to grow up.');
            }
            else if(s.stage === 'adult'){
                toolTipText.appendText('Adult. Catches ' + s.fps + ' fish per second.');
            }
        }
    });

    if(speciesFound >= 2 && !speciesAchv.achieved){
        speciesAchv.achieved = true;
        speciesAchv.sprite.setTexture(speciesAchv.achSprite);
        speciesAchv.text = 'Discover 2 seal species.';
        printAchievement(sc, speciesAchv);

    }
    if(speciesFound >= 4 && !speciesAchv2.achieved){
        speciesAchv2.achieved = true;
        speciesAchv2.sprite.setTexture(speciesAchv2.achSprite).setTint(0x00ffff);
        speciesAchv2.text = 'Discover 4 seal species.';
        printAchievement(sc, speciesAchv2);

    }

    if(scoreAllTime >= 1000 && !thousandFishAchv.achieved){
        thousandFishAchv.achieved = true;
        thousandFishAchv.sprite.setTexture(thousandFishAchv.achSprite);
        thousandFishAchv.text = "Catch 1000 fish in total.";
        printAchievement(sc, thousandFishAchv);

    }

    if(!juggleAchv.achieved){
        allSeals.forEach(function(s){
            if(s.sprite.y < 175){
                juggleAchv.achieved = true;
                juggleAchv.sprite.setTexture(juggleAchv.achSprite);
                juggleAchv.text = 'Juggle any seal above the icehole.';
                printAchievement(sc, juggleAchv);
            }
        });
    }

    allDexEntries.forEach(function(d){
        if(d.achieved && !d.handled){
            d.handleAchieved();
        }
    })

    scoreBoard.setText('Fish: ' + Math.floor(score));
    fpsBoard.setText('  per second: ' + Math.floor((fps * fpsMult)));
    for(let c = 0; c < clickBuffer; c++){
        fpcPool[c].setText('+' + Math.floor(fpc * fpcMult));
    }
}

function printUpgradedText(upgrade, upgradeTxtPool){
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
        repeatDelay: 5500
    });

    sc.anims.create({
        key: 'look',
        frames: sc.anims.generateFrameNumbers('yochansprite', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 5000,
        yoyo: true
    });

    sc.anims.create({
        key: 'banana',
        frames: sc.anims.generateFrameNumbers('babyneilsprite', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 10000,
        yoyo: true
    });

    sc.anims.create({
        key: 'rest',
        frames: sc.anims.generateFrameNumbers('neilsprite', {start: 0, end: 11}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 12000,
        yoyo: true
    });

    sc.anims.create({
        key: 'rollover',
        frames: sc.anims.generateFrameNumbers('babynikosprite', {start: 0, end: 6}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 2500,
        yoyo: true
    });

    sc.anims.create({
        key: 'frogblink',
        frames: sc.anims.generateFrameNumbers('nikosprite', {start: 0, end: 12}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 2000
    });

    sc.anims.create({
        key: 'fiddle',
        frames: sc.anims.generateFrameNumbers('babytrumpetsprite', {start: 0, end: 5}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 1500,
        yoyo: true
    });

    sc.anims.create({
        key: 'jumpa',
        frames: sc.anims.generateFrameNumbers('trumpetsprite', {start: 0, end: 10}),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 2200
    });
}

function printAchievement(sc, achv){
    achvTipText.setText('Achievement Unlocked: ' + achv.text);
    sc.tweens.add({
        targets: [achvTipText, achvTip],
        y: '-=5',
        ease: 'Cubic',
        alpha: 1,
        duration: 3000,
        onComplete: function(){
            sc.tweens.add({
                targets: [achvTipText, achvTip],
                y: '+=5',
                ease: 'Cubic',
                alpha: 0,
                duration: 1000
            });
        }
    });
}