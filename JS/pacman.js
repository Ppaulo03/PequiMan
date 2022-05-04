import Character from "./character.js";

class Pacman extends Character
{
    constructor(speed, startPos, board)
    {
        super(speed, startPos, board)
        this.dir = this.DIRECTIONS.ArrowRight;;
        this.rotation = true;

        
        this.classesToRemove = [this.OBJECT_TYPE.PACMAN];
        this.classesToAdd = [this.OBJECT_TYPE.PACMAN];

        board.addObject(startPos, [this.OBJECT_TYPE.PACMAN])
        document.addEventListener('keydown', e => this.handleKeyInput(e, board.objectExists))
    }

    handleKeyInput(e, objectExists)
    {

        let dir = null;
        if (e.keyCode === 87) dir = this.DIRECTIONS['ArrowUp'];
        else if (e.keyCode === 83) dir = this.DIRECTIONS['ArrowDown'];
        else if (e.keyCode === 65) dir = this.DIRECTIONS['ArrowLeft'];
        else if (e.keyCode === 68) dir = this.DIRECTIONS['ArrowRight'];
        else if(e.keyCode < 37 || e.keyCode > 40) return;
        else dir = this.DIRECTIONS[e.key];
        const nextMovePos = this.pos + dir.movement;
        if(this.checkWall(nextMovePos)) return;
        
        if(dir === this.DIRECTIONS['ArrowRight']) this.change = 1;
        if(dir === this.DIRECTIONS['ArrowLeft']) this.change = -1;
        if(dir === this.DIRECTIONS['ArrowDown'] && this.dir === this.DIRECTIONS['ArrowUp'] ||
        dir === this.DIRECTIONS['ArrowUp'] && this.dir === this.DIRECTIONS['ArrowDown'])
        {
            if(this.change === -1) this.change = 1;
            else this.change = -1;  
        }

        this.dir = dir;

        
    }
}

export default Pacman;