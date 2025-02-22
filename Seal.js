export default class Seal{
    name;
    species;
    gender;
    lvlUpCost;
    level;
    text;
    sprite;
    hover;

    constructor(name, species, gender, lvlUpCost, text, sprite){
        this.name = name;
        this.species = species;
        this.gender = gender;
        this.lvlUpCost = lvlUpCost;
        this.text = text;
        this.sprite = sprite;
    }

    onHover(toolTip, toolTipText, pointer){
        toolTipText.setText(this.text);
        this.hover = true;
        toolTip.x = pointer.x;
        toolTip.y = pointer.y;
        toolTipText.x = pointer.x + 5;
        toolTipText.y = pointer.y + 5;
    }

}