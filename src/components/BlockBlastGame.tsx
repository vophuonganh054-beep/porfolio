import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BOARD_SIZE, canPlace, emptyBoard, hasMove, makeHand, Piece, placePiece } from '../utils/blockBlast';

const BEST_KEY = 'pa_block_best_v1';
const shapeSize = (piece: Piece) => ({ rows:Math.max(...piece.cells.map(([r])=>r))+1, cols:Math.max(...piece.cells.map(([,c])=>c))+1 });
function Shape({ piece }: { piece: Piece }) {
  const {rows,cols}=shapeSize(piece);
  return <span className="block-piece-shape" style={{gridTemplateColumns:`repeat(${cols},1fr)`,gridTemplateRows:`repeat(${rows},1fr)`,width:cols*17,height:rows*17}} aria-hidden="true">
    {Array.from({length:rows*cols},(_,i)=><span key={i} style={piece.cells.some(([r,c])=>r===Math.floor(i/cols)&&c===i%cols)?{background:piece.color,border:'1px solid #ffffff55',boxShadow:'inset 2px 2px 0 #ffffff30,inset -2px -2px 0 #0004'}:{}} />)}
  </span>;
}
export function BlockBlastGame() {
  const {isVi}=useLanguage();
  const [game,setGame]=useState(()=>({board:emptyBoard(),hand:makeHand() as (Piece|null)[],score:0,lines:0,cleared:[] as [number,number][],lastPoints:0,moves:0}));
  const [best,setBest]=useState(()=>{try{const n=Number(localStorage.getItem(BEST_KEY));return Number.isSafeInteger(n)&&n>=0?n:0;}catch{return 0;}});
  const [selected,setSelected]=useState<number|null>(null);
  const [hover,setHover]=useState<{r:number;c:number}|null>(null);
  const [notice,setNotice]=useState('');
  const boardRef=useRef<HTMLDivElement>(null);
  const suppressClick=useRef(false);
  const drag=useRef<{pointerId:number;index:number}|null>(null);
  const over=!hasMove(game.board,game.hand);
  const piece=selected===null?null:game.hand[selected];
  const valid=Boolean(piece&&hover&&canPlace(game.board,piece,hover.r,hover.c));
  useEffect(()=>{if(game.score>best){setBest(game.score);try{localStorage.setItem(BEST_KEY,String(game.score));}catch{/* Local best is optional. */}}},[game.score,best]);
  useEffect(()=>{if(!game.cleared.length)return;const timer=window.setTimeout(()=>setGame(g=>({...g,cleared:[]})),400);return()=>window.clearTimeout(timer);},[game.cleared]);
  useEffect(()=>{const cancel=()=>{drag.current=null;setHover(null);};window.addEventListener('blur',cancel);return()=>window.removeEventListener('blur',cancel);},[]);
  const locate=(x:number,y:number)=>{const b=boardRef.current?.getBoundingClientRect();if(!b||x<b.left||y<b.top||x>=b.right||y>=b.bottom)return null;return {r:Math.floor((y-b.top)/b.height*BOARD_SIZE),c:Math.floor((x-b.left)/b.width*BOARD_SIZE)};};
  const place=(index:number,r:number,c:number)=>{
    const p=game.hand[index];if(!p||over)return;
    const result=placePiece(game.board,p,r,c);
    if(!result){setNotice(isVi?'Khối chưa vừa ở đây. Chọn một ô khác nhé.':'That piece does not fit here. Try another cell.');return;}
    const hand=game.hand.map((item,i)=>i===index?null:item);
    setGame({...game,board:result.board,hand:hand.every(item=>!item)?makeHand():hand,score:game.score+result.points,lines:game.lines+result.lines,cleared:result.cleared,lastPoints:result.points,moves:game.moves+1});
    setSelected(null);setHover(null);setNotice('');
  };
  const reset=()=>{drag.current=null;setGame({board:emptyBoard(),hand:makeHand(),score:0,lines:0,cleared:[],lastPoints:0,moves:0});setSelected(null);setHover(null);setNotice('');};
  return <section className="block-window" aria-labelledby="block-game-title">
    <header className="block-titlebar"><span>▦ BLOCKS.EXE</span><span aria-hidden="true">▪ ▪ ▪</span></header>
    <div className="block-layout">
      <div className="block-info">
        <p className="block-eyebrow">MINI GAME // MY WORLD</p>
        <h2 id="block-game-title">BLOCK BLAST <small>MINI</small></h2>
        <p>{isVi?'Kéo khối vào bảng 8 × 8. Lấp đầy một hàng hoặc cột để xóa và ghi điểm. Dùng hết 3 khối để nhận bộ mới!':'Drag blocks onto the 8 × 8 board. Complete rows or columns to clear them. Use all 3 pieces to get a new set!'}</p>
        <div className="block-scores"><span>{isVi?'Điểm':'Score'}<strong>{game.score}</strong></span><span>{isVi?'Kỷ lục':'Best'}<strong>{best}</strong></span><span>{isVi?'Đã xóa':'Cleared'}<strong>{game.lines}</strong></span></div>
        <button type="button" onClick={reset} className="block-restart">{isVi?'Ván mới':'New game'} ↻</button>
        <p className="block-tip">{isVi?'Có thể chạm chọn khối, rồi chạm ô đặt góc trên trái của khối. Không xoay khối, không giới hạn thời gian.':'You can also select a piece, then tap its top-left cell. No rotation, no time limit.'}</p>
        <p role="status" aria-live="polite" className="block-status">{over?(isVi?'Hết chỗ đặt rồi! Bấm Ván mới để chơi lại.':'No moves left! Start a new game.'):notice||(game.lastPoints?`+${game.lastPoints} ${isVi?'điểm':'points'}`:(isVi?'Chọn một khối bên dưới để bắt đầu.':'Choose a piece below to start.'))}</p>
        <p className="block-credit">{isVi?'Bản mini tự xây dựng cho MY WORLD. Cảm hứng từ ':'A mini game built for MY WORLD. Inspired by '}<a href="https://www.blockblast.com/about-us" target="_blank" rel="noopener noreferrer">Block Blast! — Hungry Studio</a>.</p>
      </div>
      <div className="block-play-area">
        <div ref={boardRef} className="block-board" role="group" aria-label={isVi?'Bảng xếp khối 8 nhân 8':'8 by 8 block board'} onPointerLeave={()=>{if(!drag.current)setHover(null);}}>
          {game.board.flatMap((row,r)=>row.map((color,c)=>{
            const ghost=Boolean(piece&&hover&&piece.cells.some(([pr,pc])=>hover.r+pr===r&&hover.c+pc===c));
            const flash=game.cleared.some(([cr,cc])=>cr===r&&cc===c);
            return <button key={`${r}-${c}`} type="button" className={'block-cell'+(color?' filled':'')+(ghost?' ghost':'')+(flash?' cleared':'')}
              style={{background:ghost?(valid?piece!.color:'#ef4444'):color||undefined,opacity:ghost ? .65 : 1}}
              aria-label={`${isVi?'Hàng':'Row'} ${r+1}, ${isVi?'cột':'column'} ${c+1}: ${color?(isVi?'đã có khối':'occupied'):(isVi?'trống':'empty')}`}
              disabled={over} onPointerEnter={()=>{if(!drag.current)setHover({r,c});}} onFocus={()=>setHover({r,c})}
              onClick={()=>{if(selected!==null)place(selected,r,c);}} />;
          }))}
        </div>
        <div className="block-tray" role="group" aria-label={isVi?'Ba khối để chọn':'Three available pieces'}>
          {game.hand.map((p,index)=><button key={index} type="button" className={'block-piece'+(selected===index?' selected':'')} disabled={!p||over} aria-pressed={selected===index}
            aria-label={p?(isVi?`Chọn khối ${index+1}, ${p.cells.length} ô`:`Select piece ${index+1}, ${p.cells.length} cells`):(isVi?'Khối đã dùng':'Piece used')}
            onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}if(p){setSelected(index);setNotice('');}}}
            onPointerDown={event=>{if(!p||over||event.button!==0)return;suppressClick.current=false;setSelected(index);setNotice('');drag.current={pointerId:event.pointerId,index};event.currentTarget.setPointerCapture(event.pointerId);}}
            onPointerMove={event=>{if(drag.current?.pointerId===event.pointerId)setHover(locate(event.clientX,event.clientY));}}
            onPointerUp={event=>{const d=drag.current;if(!d||d.pointerId!==event.pointerId)return;drag.current=null;const pos=locate(event.clientX,event.clientY);if(pos){suppressClick.current=true;place(d.index,pos.r,pos.c);}else setHover(null);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
            onPointerCancel={()=>{drag.current=null;setHover(null);}} onLostPointerCapture={()=>{drag.current=null;setHover(null);}}>
            {p?<Shape piece={p}/>:<span aria-hidden="true" className="block-used">✓</span>}
          </button>)}
        </div>
        {over&&<div className="block-game-over">{isVi?'HẾT LƯỢT ĐẶT':'NO MOVES LEFT'} · {game.score} {isVi?'điểm':'points'}</div>}
      </div>
    </div>
  </section>;
}
