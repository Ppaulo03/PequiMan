import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from "./setup.js";

class Board
{
    constructor(DOMGrid, level)
    {
        this.dotCount = 0;
        this.grid = [];
        this.DOMGrid = DOMGrid;
        this.createGrid(level);
    }

    showStatus(gameWin)
    {
        const div = document.createElement('div');
        div.classList.add('game-status');
        div.innerHTML = `${gameWin ? 'WIN' : 'GAME OVER!'}`;
        this.DOMGrid.appendChild(div);
    }

    createGrid(level)
    {
        this.dotCount = 0;
        this.grid = [];
        this.DOMGrid.innerHTML = '';
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;
        
        level.forEach(square =>{
            const div = document.createElement('div');
            div.classList.add('square', CLASS_LIST[square]);
            if(CLASS_LIST[square] == OBJECT_TYPE.NAME) div.classList.add(OBJECT_TYPE.WALL);
            div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
            this.DOMGrid.appendChild(div);
            this.grid.push(div);

            if(CLASS_LIST[square] === OBJECT_TYPE.DOT) this.dotCount++;
        });
    }

    addObject(pos, classe)
    {
        this.grid[pos].classList.add(...classe);
    }

    removeObject(pos, classes) 
    {
        this.grid[pos].classList.remove(...classes);
    }

    objectExists (pos, object)
    {
        return this.grid[pos].classList.contains(object);
    }

    rotateDiv(pos, deg, flip) 
    {
        this.grid[pos].style.transform = `scaleX(${flip}) rotate(${deg}deg)`;
    }

    moveCharacter(character)
    {
        if(!character.shouldMove()) return;
        const {nextMovePos, direction} = character.nextMove();
        const {classesToAdd, classesToRemove} = character.makeMove();

        if(character.rotation && nextMovePos !== character.pos)
        {
            this.rotateDiv(nextMovePos, character.dir.rotation);
            this.rotateDiv(character.pos, 0)
        }

        this.removeObject(character.pos, classesToRemove)
        this.addObject(nextMovePos, classesToAdd)

    
        character.setNewPos(nextMovePos, direction)
    }
}

export default Board;