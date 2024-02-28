export function circleCollision(circle1, circle2) {
    const xDifference = circle2.position.x - circle1.position.x;
    const yDifference = circle2.position.y - circle1.position.y;
    const distance = Math.sqrt(
        xDifference * xDifference + yDifference * yDifference
    );

    return distance <= circle1.radius + circle2.radius;
}

export function circleTriangleCollision(circle, triangle) {
    for (let i = 0; i < 3; i++) {
        const start = triangle[i];
        const end = triangle[(i + 1) % 3];

        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        let dot =
            ((circle.position.x - start.x) * dx +
                (circle.position.y - start.y) * dy) /
            Math.pow(length, 2);

        let closestX = start.x + dot * dx;
        let closestY = start.y + dot * dy;

        if (
            !(
                closestX >= Math.min(start.x, end.x) &&
                closestX <= Math.max(start.x, end.x) &&
                closestY >= Math.min(start.y, end.y) &&
                closestY <= Math.max(start.y, end.y)
            )
        ) {
            closestX = closestX < start.x ? start.x : end.x;
            closestY = closestY < start.y ? start.y : end.y;
        }

        dx = closestX - circle.position.x;
        dy = closestY - circle.position.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= circle.radius) {
            return true;
        }
    }

    return false;
}