import { Vector2 } from "three";

export class RocketPaths
{
    constructor(
        private moonPosition: Vector2,
        private moonRadius: number,
        private earthRadius: number,
        private earthPosition: Vector2,
        private numRockets: number) {

    }

    private calculateRocketPosition(position: number, progress: number) {

        const alpha = this.numRockets === 1
            ? 0.75
            : position / this.numRockets;
    
        const startPositionX = Math.sin(alpha * Math.PI - Math.PI/4) * this.earthRadius + this.earthPosition.x;
        const startPositionY = Math.cos(alpha * Math.PI - Math.PI/4) * this.earthRadius + this.earthPosition.y;
    
        const endPositionX = this.moonPosition.x - this.moonRadius;
        const endPositionY = this.moonPosition.y - this.moonRadius;
        
        const startPosition = new Vector2(startPositionX, startPositionY);
        const endPosition = new Vector2(endPositionX, endPositionY);
    
        const midpoint = startPosition.clone().add(startPosition.clone().sub(this.earthPosition).multiplyScalar(2.0));
    
        return startPosition.multiplyScalar((1 - progress) * (1 - progress))
                .add(midpoint.multiplyScalar(2.0 * (1 - progress) * progress))
                .add(endPosition.multiplyScalar(progress * progress));
    }
    
    calculateRocketVector(position: number, progress: number) {
        const previous = this.calculateRocketPosition(position, progress - 0.01);
        const current = this.calculateRocketPosition(position, progress);
    
        const diff = current.clone().sub(previous);
    
        return { position: current, vector: diff };
    }
    
    // calculateRocketAngle(position: number, numRockets: number, progress: number) {
    //     const diff = this.calculateRocketVector(position, numRockets, progress);
    
    //     return diff.angle();
    // }
}