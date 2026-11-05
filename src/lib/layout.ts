import type { Concept } from '../types';
export const COL_W=250, ROW_H=150, COLS=3;
export function layout(existing:Concept[], count:number) {
 const positions=existing.map(n=>n.position); const startX=positions.length?Math.min(...positions.map(p=>p.x)):0;
 const startY=positions.length?Math.max(...positions.map(p=>p.y))+ROW_H:0;
 return Array.from({length:count},(_,i)=>{const p={x:startX+(i%COLS)*COL_W,y:startY+Math.floor(i/COLS)*ROW_H};while(positions.some(q=>Math.abs(q.x-p.x)<COL_W/2&&Math.abs(q.y-p.y)<ROW_H/2))p.y+=ROW_H;positions.push(p);return p;});
}
