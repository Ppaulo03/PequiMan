import { OBJECT_TYPE, DIRECTIONS, LEVEL, GRID_SIZE, CLASS_LIST} from "./setup.js";

/*
const grid = []
const num_col = LEVEL.length/GRID_SIZE
for(var j = 0; j<num_col; j++){
    let linha = []
    for(var k = 0; k<GRID_SIZE; k++)
    {
        linha[k] = LEVEL[(20*j) + k]
    }
    grid[j] = linha
}

let lista_fechada = []
lista_fechada[50] = 0

class Cell
{
    constructor(pos, gCost, hCost, parent)
    {
        this.position = pos;
        this.gCost = gCost
        this.hCost = hCost
        this.cost = gCost + hCost;
        this.parent = parent;
    }
}
export function findPath(position, direction, board, target, ignoreGhosts=false)
{
    const target_gridpos = get_grid_pos(target);
    const directions = [-1, 1, -GRID_SIZE, GRID_SIZE]
    var open_list = {}, closed_list = {};

    open_list[position] = new Cell(position, 0,0, null) 

    let cont = 0
    while(Object.keys(open_list).length > 0)
    {
        let min_cost = Object.entries(open_list).sort((a, b) => a[1].cost - b[1].cost)[0][0]
        let cell = open_list[min_cost]
        closed_list[min_cost] = open_list[min_cost]
        delete open_list[min_cost]
    
        directions.forEach(dir =>{
            const pos = parseInt(min_cost) + dir
            if(CLASS_LIST[LEVEL[pos]] === OBJECT_TYPE.WALL || pos in closed_list) return;
            const gCost = 10 + cell.cost;
            if(pos in open_list && open_list[pos].gCost < gCost) return;
            const gridPos = get_grid_pos(pos);
            const hCost = (Math.abs(target_gridpos[0] - gridPos[0]) +
                            Math.abs(target_gridpos[1] - gridPos[1])) *10;
            
            open_list[pos] = new Cell(pos, gCost, hCost, cell);
            
            return;     
        });
        
        if (cont > 1000) break;
        cont++;
    }
    let path = []; 
    let cell = closed_list[target]
    while (cell.parent != null) 
    {
        path.unshift(cell.position)
        cell = cell.parent
    }

    let nextMovePos = 0
    if(path.length === 0) nextMovePos = position;
    else nextMovePos = path[0];
    let dir = null;
    
    if(!ignoreGhosts && board.objectExists(nextMovePos, OBJECT_TYPE.GHOST)) nextMovePos = position
    if(nextMovePos === position) dir = direction;
    else if(nextMovePos === position - 1) dir = DIRECTIONS['ArrowLeft']
    else if(nextMovePos === position + 1) dir = DIRECTIONS['ArrowRight']
    else if(nextMovePos === position - GRID_SIZE) dir = DIRECTIONS['ArrowUp']
    else dir = DIRECTIONS['ArrowDown']
    
    return {nextMovePos, direction: dir}
}

function get_grid_pos(pos)
{
    return [parseInt(pos/GRID_SIZE), pos%GRID_SIZE];
}*/


export function chooseTile(position, direction, board, target)
{
   
    const tiles = [-GRID_SIZE, -1, GRID_SIZE, 1];
    let nextMovePosHash = {};
    tiles.forEach(tile =>
    {
        let nextPos = position + tile;
        if(position === 232 && nextPos === 231) nextPos = 259;
        else if (position === 259 && nextPos === 260) nextPos = 232;  

        if(direction.movement + tile === 0) return;
        if(!board.objectExists(nextPos, OBJECT_TYPE.WALL) && 
            !board.objectExists(nextPos, OBJECT_TYPE.GHOSTLAIR))
        {
                const dist = Math.pow(parseInt((nextPos-target)/GRID_SIZE),2) + 
                            Math.pow((nextPos%GRID_SIZE)-(target%GRID_SIZE),2);
                nextMovePosHash[tile] = [dist];
        }
    });
    let nextMovePos = position;
    let dir = direction;
    if (Object.keys(nextMovePosHash).length > 0)
    {
        let minHash = Object.entries(nextMovePosHash).sort((a, b) => a[1] - b[1])[0][0];
        nextMovePos = position + parseInt(minHash);

        if(nextMovePos === 231) nextMovePos = 259;
        else if (nextMovePos === 260) nextMovePos = 232;
    
        if(minHash == 1) dir = DIRECTIONS['ArrowRight'];
        else if(minHash == -1) dir = DIRECTIONS['ArrowLeft'];
        else if(minHash == GRID_SIZE) dir = DIRECTIONS['ArrowDown'];
        else dir = DIRECTIONS['ArrowUp'];
    }

    return {nextMovePos, direction: dir};
}

export function chooseRandomTile(position, direction, board)
{
    const tiles = [-GRID_SIZE, -1, GRID_SIZE, 1];
    let nextMovePosList = [];
    tiles.forEach(tile =>
    {
        let nextPos = position + tile;
        if(position === 232 && nextPos === 231) nextPos = 259;
        else if (position === 259 && nextPos === 260) nextPos = 232;
        if(direction.movement + tile === 0) return;
        if(!board.objectExists(nextPos, OBJECT_TYPE.WALL) && 
            !board.objectExists(nextPos, OBJECT_TYPE.GHOSTLAIR))
        {
            nextMovePosList.push(tile)
        }
    });

    let random_tile = nextMovePosList[Math.floor(Math.random()*nextMovePosList.length)];
    let nextMovePos = position + parseInt(random_tile);
    if(nextMovePos === 231) nextMovePos = 259;
    else if (nextMovePos === 260) nextMovePos = 232;
    
    let dir = null;
    if(random_tile == 1) dir = DIRECTIONS['ArrowRight'];
    else if(random_tile == -1) dir = DIRECTIONS['ArrowLeft'];
    else if(random_tile == GRID_SIZE) dir = DIRECTIONS['ArrowDown'];
    else dir = DIRECTIONS['ArrowUp'];

    return {nextMovePos, direction: dir};
}

export function BlinkyMove(position, direction, board, pacman, blinky)
{
    const {nextMovePos, direction: dir} = chooseTile(position, direction, board, pacman.pos);    
    return {nextMovePos, direction: dir}
}

export function PinkyMove(position, direction, board, pacman, blinky)
{   
    let target = pacman.pos + (2*pacman.dir.movement);
    if(pacman.dir.movement === -GRID_SIZE) target = target-2;
    const {nextMovePos, direction: dir} = chooseTile(position, direction, board, target);    
    return {nextMovePos, direction: dir}
}

export function InkyMove(position, direction, board, pacman, blinky)
{   
    let target = pacman.pos + (2*pacman.dir.movement);
    if(pacman.dir.movement === -GRID_SIZE) target = target-2;

    target = target - (blinky.pos - target);
    const {nextMovePos, direction: dir} = chooseTile(position, direction, board, target);    
    return {nextMovePos, direction: dir}
}

export function ClydeMove(position, direction, board, pacman)
{
    const dist = Math.abs(parseInt((pacman.pos - position)/GRID_SIZE)) +
            Math.abs((pacman.pos%GRID_SIZE) - (position%GRID_SIZE));

    let target = 0;
    if(dist > 8) target = pacman.pos;
    else target = 421;
    const {nextMovePos, direction: dir} = chooseTile(position, direction, board, target); 
    return {nextMovePos, direction: dir};
}
