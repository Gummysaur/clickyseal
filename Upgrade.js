export default class Upgrade {
    cost;
    sprite;
    text;
    level;
    hover;

    constructor(cost, sprite, text){
        this.cost = cost;
        this.sprite = sprite;
        this.text = text;

        this.level = 0;
        this.hover = false;
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