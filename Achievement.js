export default class Achievement{
    achieved;
    hover;
    sprite;
    text;

    constructor(sprite, text){
        this.hover = false;
        this.achieved = false;
        this.sprite = sprite;
        this.text = text;
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