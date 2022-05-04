import {chooseTile, chooseRandomTile} from "./ghostMoves.js"
import Character from "./character.js";
import { GRID_SIZE} from "./setup.js";


class Ghost extends Character
{
    constructor(speed, startPos, board, movement, name, pacman, dinamicVelocity, favorite, blinky=null)
    {
        super(speed, startPos, board);
        this.dir = this.DIRECTIONS.ArrowRight;
        this.rotation = false;
        
        this.startPos = startPos;

        this.name = name;
        this.movement = movement;

        this.classesToRemove = [this.OBJECT_TYPE.GHOST, this.OBJECT_TYPE.SCARED, this.name];
        this.classesToAdd = [this.OBJECT_TYPE.GHOST];

        this.pacman = pacman;
        this.scatter = false;
        this.favorite_tile = favorite;

        this.dead = false;
        this.dinamicVelocity = dinamicVelocity
        this.blinky = blinky;
        if(dinamicVelocity)
        {
            this.maxDots = board.dotCount;
            this.numDots = 0;
            this.velocidy_base = speed
        }
            

    }

    makeMove()
    {   
        let {classesToAdd, classesToRemove} = super.makeMove();
        if(!this.dead)
        {
            classesToAdd = [...classesToAdd, this.name]
            if(this.powerPill) classesToAdd = [...classesToAdd, this.OBJECT_TYPE.SCARED]
        }
       
        return {classesToAdd, classesToRemove}
    }
    nextMove()
    {   
        if(this.dinamicVelocity)
        {
            this.numDots = this.maxDots - this.board.dotCount;
            this.speed = this.velocidy_base - parseInt((this.numDots/(this.maxDots/3)));
        }
        if(this.dead)
        {
            if (this.pos == 159) 
            {
                const nextMovePos = this.pos + GRID_SIZE;
                const direction = this.DIRECTIONS['ArrowUp'];
                this.dead = false;
                return {nextMovePos, direction}
            }
            const { nextMovePos, direction } = chooseTile(this.pos, this.dir, this.board, 159);
            return {nextMovePos, direction}
        }
        else if(this.powerPill)
        {
            
            const {nextMovePos, direction } = chooseRandomTile(this.pos, this.dir, this.board);
            return {nextMovePos, direction}
        }
        else if(this.scatter)
        {   
            const { nextMovePos, direction } = chooseTile(this.pos, this.dir, this.board, this.favorite_tile);
            return {nextMovePos, direction}
        }
        else 
        {
            const { nextMovePos, direction } = this.movement(this.pos,this.dir,this.board, this.pacman, this.blinky);
            return {nextMovePos, direction}
        }
        
    }
}

export default Ghost