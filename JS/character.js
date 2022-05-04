import { OBJECT_TYPE, DIRECTIONS } from "./setup.js";

class Character
{
    constructor(speed, startPos, board)
    {
        this.OBJECT_TYPE = OBJECT_TYPE
        this.DIRECTIONS = DIRECTIONS
        this.pos = startPos;
        this.speed = speed;
        this.timer = 0
        this.powerPill = false
        this.board = board
        this.dir = null
        this.change = 1
    }

    shouldMove()
    {
        if(!this.dir) return false;
        if(this.timer === this.speed)
        {
            this.timer = 0;
            return true;
        }
        this.timer++;
        return false;
    }

    checkWall(pos)
    {
        if(this.board.objectExists(pos, OBJECT_TYPE.WALL) 
            || this.board.objectExists(pos, OBJECT_TYPE.GHOSTLAIR))
            return true;
        return false;
    }

    nextMove() 
    {
        let nextMovePos = this.pos + this.dir.movement;
        if(this.pos === 232 && nextMovePos === 231) nextMovePos = 259;
        else if (this.pos === 259 && nextMovePos === 260) nextMovePos = 232;
        
        if (this.checkWall(nextMovePos)) nextMovePos = this.pos;
        return { nextMovePos, direction: this.dir };
    }


    makeMove()
    {
        let classesToRemove = this.classesToRemove;
        let classesToAdd = this.classesToAdd;
        return{classesToAdd, classesToRemove};
    }

    move()
    {
        if(!this.shouldMove()) return;
        const {nextMovePos, direction} = this.nextMove();
        const {classesToAdd, classesToRemove} = this.makeMove();

        if(this.rotation && nextMovePos !== this.pos)
        {
            if(this.dir.rotation == 180) this.board.rotateDiv(nextMovePos, 0, this.change);
            else this.board.rotateDiv(nextMovePos, this.dir.rotation, this.change);
            this.board.rotateDiv(this.pos, 0, this.change);
        }

        this.board.removeObject(this.pos, classesToRemove);
        this.board.addObject(nextMovePos, classesToAdd);

        this.pos = nextMovePos;
        this.dir = direction;
    }

}

export default Character