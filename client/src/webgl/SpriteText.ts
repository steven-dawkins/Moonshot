import * as THREE from "three";

interface Color {
    r:number, g: number, b: number, a: number
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke(); }

export function makeTextSprite(
    message: string,
    parameters: undefined | {
        fontface: string,
        fontsize: number,
        borderThickness: number,
        borderColor: Color,
        backgroundColor: Color,
        textColor: Color} )
    {
        const defaultParameters = {
            fontface: "Arial",
            fontsize: 18,
            borderThickness: 4,
            borderColor: { r:0, g:0, b:0, a:1.0 },
            backgroundColor: { r:255, g:255, b:255, a:1.0 },
            textColor: { r: 248, g: 225, b: 108, a: 1.0 }
        }

        if ( parameters === undefined ) {
            parameters = defaultParameters;
        }

        const {fontface, fontsize, textColor, borderThickness, borderColor, backgroundColor } = {...defaultParameters,...parameters};

        var canvas = document.createElement('canvas');

        var context = canvas.getContext('2d');

        if (context === null) {
            throw new Error("Failed to create sprite canvas");
        }

        context.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context.measureText( message );
        var textWidth = metrics.width;

        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        
        //roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

        context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
        context.fillText( message, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas) 
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial( { map: texture/*, useScreenCoordinates: false*/ } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(0.5 * fontsize * 20, 0.25 * fontsize * 20, 0.75 * fontsize * 20);
        
        // sprite.scale.set(0.002 * canvas.width, 0.0025 * canvas.height, 10);
     
        return sprite;  
    }