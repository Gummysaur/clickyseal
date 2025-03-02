export default class Seal{
    name;
    species;
    gender;
    lvlUpCost;
    level;
    text;
    sprite;
    hover;
    stage;

    constructor(name, species, gender, lvlUpCost, text, sprite, stage){
        this.name = name;
        this.species = species;
        this.gender = gender;
        this.lvlUpCost = lvlUpCost;
        this.text = text;
        this.sprite = sprite;
        this.stage = stage;
        this.hover = false;
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

}