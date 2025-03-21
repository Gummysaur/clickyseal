export default class Achievement{
    achieved;
    hover;
    sprite;
    achSprite; // string containing the name of the asset this achievement has when unlocked
    text;

    constructor(sprite, text, achSprite){
        this.hover = false;
        this.achieved = false;
        this.sprite = sprite;
        this.text = text;
        this.achSprite = achSprite;
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