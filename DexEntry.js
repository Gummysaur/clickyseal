export default class DexEntry{
    seal;
    achieved;
    hover;
    sprite;
    achSprite; // string containing the name of the asset this achievement has when unlocked
    text;
    handled;

    constructor(seal, sprite, text, achSprite){
        this.seal = seal;
        this.sprite = sprite;
        this.text = text;
        this.achSprite = achSprite;

        this.hover = false;
        this.achieved = false;
        this.handled = false;
    }

    onHover(toolTip, toolTipText, pointer){
        toolTipText.setText(this.text);
        toolTipText.setVisible(true);
        toolTip.setVisible(true);
        this.hover = true;
        toolTip.x = pointer.x;
        toolTip.y = pointer.y;
        toolTipText.x = pointer.x + 5;
        toolTipText.y = pointer.y + 5;
    }

    handleAchieved(){
        this.sprite.setTexture(this.achSprite);
        this.text = 'Name: ' + this.seal.name + 
            '\nSpecies: ' + this.seal.species +
            '\nGender: ' + this.seal.gender +
            '\n' + this.seal.text;
        this.handled = true;
    }
}