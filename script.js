const mazeSize = 20;
const maze = document.getElementById('maze');

function createCell(x, y) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell-${x}-${y}`;
    return cell;
}

function initializeMaze() {
    maze.innerHTML = '';
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            maze.appendChild(createCell(x, y));
        }
    }
}

function getCell(x, y) {
    return document.getElementById(`cell-${x}-${y}`);
}

function setWall(x, y) {
    const cell = getCell(x, y);
    if (cell) cell.classList.add('wall');
}

function clearCell(x, y) {
    const cell = getCell(x, y);
    if (cell) cell.classList.remove('wall', 'path');
}

function generateMaze() {
    initializeMaze();
    
    const cells = [];
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            cells.push({x, y, entropy: Math.random()});
        }
    }
    
    while (cells.length > 0) {
        cells.sort((a, b) => a.entropy - b.entropy);
        const {x, y} = cells.shift();
        
        if (Math.random() < 0.3) {
            setWall(x, y);
        }
        
        const neighbors = [
            {x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1}
        ].filter(n => n.x >= 0 && n.x < mazeSize && n.y >= 0 && n.y < mazeSize);
        
        neighbors.forEach(n => {
            const index = cells.findIndex(cell => cell.x === n.x && cell.y === n.y);
            if (index !== -1) {
                cells[index].entropy *= 0.8;
            }
        });
    }
    
    // Ensure start and end are clear
    clearCell(0, 0);
    clearCell(mazeSize-1, mazeSize-1);
    
    // Ensure path exists (simplified)
    let x = 0, y = 0;
    while (x < mazeSize-1 || y < mazeSize-1) {
        clearCell(x, y);
        if (x < mazeSize-1 && Math.random() < 0.6) x++;
        else if (y < mazeSize-1) y++;
    }
}

function solveMaze() {
    const start = {x: 0, y: 0};
    const end = {x: mazeSize-1, y: mazeSize-1};
    const queue = [start];
    const visited = new Set();
    const parent = new Map();
    
    while (queue.length > 0) {
        const current = queue.shift();
        const {x, y} = current;
        
        if (x === end.x && y === end.y) {
            let path = [end];
            while (path[path.length-1] !== start) {
                path.push(parent.get(`${path[path.length-1].x},${path[path.length-1].y}`));
            }
            path.reverse().forEach(({x, y}) => {
                getCell(x, y).classList.add('path');
            });
            return;
        }
        
        const neighbors = [
            {x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1}
        ].filter(n => 
            n.x >= 0 && n.x < mazeSize && 
            n.y >= 0 && n.y < mazeSize &&
            !getCell(n.x, n.y).classList.contains('wall') &&
            !visited.has(`${n.x},${n.y}`)
        );
        
        for (const neighbor of neighbors) {
            queue.push(neighbor);
            visited.add(`${neighbor.x},${neighbor.y}`);
            parent.set(`${neighbor.x},${neighbor.y}`, current);
        }
    }
    
    alert("No solution found!");
}

// Initialize and generate a maze on page load
generateMaze();
