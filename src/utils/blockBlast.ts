export const BOARD_SIZE = 8;
export type Cell = string | null;
export type Board = Cell[][];
export interface Piece { cells: [number, number][]; color: string; id: number }
export const SHAPES: [number, number][][] = [
  [[0,0]], [[0,0],[0,1]], [[0,0],[0,1],[0,2]], [[0,0],[1,0],[2,0]],
  [[0,0],[0,1],[0,2],[0,3]], [[0,0],[1,0],[2,0],[3,0]],
  [[0,0],[0,1],[1,0],[1,1]], [[0,0],[1,0],[2,0],[2,1]],
  [[0,1],[1,1],[2,0],[2,1]], [[0,0],[0,1],[1,0]],
  [[0,0],[0,1],[0,2],[1,1]], [[0,1],[1,0],[1,1],[1,2]],
  [[0,0],[0,1],[1,1],[1,2]], [[0,1],[0,2],[1,0],[1,1]],
  [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
];
const COLORS = ['#f6c833','#45b7d1','#d93876','#26c281','#a78bfa','#ff925c'];
export const emptyBoard = (): Board => Array.from({ length: BOARD_SIZE }, () => Array<Cell>(BOARD_SIZE).fill(null));
export function makeHand(random = Math.random): Piece[] {
  return Array.from({ length:3 }, (_, id) => ({ id, cells: SHAPES[Math.floor(random()*SHAPES.length)], color: COLORS[Math.floor(random()*COLORS.length)] }));
}
export function canPlace(board: Board, piece: Piece, row: number, col: number) {
  return Number.isInteger(row) && Number.isInteger(col) && piece.cells.every(([r,c]) => row+r>=0 && row+r<BOARD_SIZE && col+c>=0 && col+c<BOARD_SIZE && !board[row+r][col+c]);
}
export function hasMove(board: Board, pieces: (Piece|null)[]) {
  return pieces.some(piece => piece && board.some((row,r) => row.some((_,c) => canPlace(board,piece,r,c))));
}
export function placePiece(board: Board, piece: Piece, row: number, col: number) {
  if (!canPlace(board,piece,row,col)) return null;
  const next = board.map(line => [...line]);
  piece.cells.forEach(([r,c]) => { next[row+r][col+c]=piece.color; });
  // Identify both axes before clearing, so intersections count as two lines.
  const rows = next.flatMap((line,r) => line.every(Boolean) ? [r] : []);
  const cols = Array.from({length:BOARD_SIZE},(_,c)=>c).filter(c => next.every(line=>Boolean(line[c])));
  const cleared: [number,number][] = [];
  next.forEach((line,r)=>line.forEach((_,c)=>{if(rows.includes(r)||cols.includes(c)){next[r][c]=null;cleared.push([r,c]);}}));
  const lines=rows.length+cols.length;
  return { board:next, points:piece.cells.length+lines*10+(lines>1?(lines-1)*5:0), lines, cleared };
}
