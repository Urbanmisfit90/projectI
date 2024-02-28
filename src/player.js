export default class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    draw(context) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.translate(-this.position.x, -this.position.y);

        context.beginPath();
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        context.fillStyle = "red";
        context.fill();
        context.closePath();

        context.beginPath();
        context.moveTo(this.position.x + 30, this.position.y);
        context.lineTo(this.position.x - 10, this.position.y - 10);
        context.lineTo(this.position.x - 10, this.position.y + 10);
        context.closePath();

        context.strokeStyle = "white";
        context.stroke();
        context.restore();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    getVertices() {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        return [
            {
                x: this.position.x + cos * 30 - sin * 0,
                y: this.position.y + sin * 30 - cos * 0,
            },
            {
                x: this.position.x + cos - 10 - sin * 10,
                y: this.position.y + sin - 10 - cos * 10,
            },
            {
                x: this.position.x + cos * -10 - sin * -10,
                y: this.position.y + sin * -10 - cos * -10,
            },
        ];
    }
}