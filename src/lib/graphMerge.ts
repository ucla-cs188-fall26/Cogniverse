import { MarkerType, type Edge } from '@xyflow/react';
import type { Concept, LLMResult } from '../types';
import { layout } from './layout';
export function mergeGraph(existingNodes:Concept[],existingEdges:Edge[],result:LLMResult,messageId:string){
 const nodes=existingNodes.map(n=>n.data.isNew?{...n,data:{...n.data,isNew:false}}:n);const ids=new Set(nodes.map(n=>n.id));
 const fresh=result.nodes.filter(n=>{if(ids.has(n.id))return false;ids.add(n.id);return true;});const positions=layout(existingNodes,fresh.length);
 fresh.forEach((n,i)=>nodes.push({id:n.id,type:'concept',position:positions[i],data:{label:n.label,category:n.category,summary:n.summary,quote:n.quote,firstSeenMessageId:messageId,isNew:true}}));
 const edges=[...existingEdges];const edgeIds=new Set(edges.map(e=>e.id));
 result.edges.forEach(e=>{const id=`${e.source}__${e.relationship}__${e.target}`;if(e.source===e.target||!ids.has(e.source)||!ids.has(e.target)||edgeIds.has(id))return;edgeIds.add(id);edges.push({id,source:e.source,target:e.target,label:e.relationship.replace('_',' '),data:{relationship:e.relationship},markerEnd:{type:MarkerType.ArrowClosed,color:'#9aa5b3'},style:{stroke:'#9aa5b3',strokeDasharray:e.relationship==='supports'?'6 4':e.relationship==='relates_to'?'2 4':undefined},labelStyle:{fontSize:10,fill:'#718096'},labelBgStyle:{fill:'#f8fafb'},labelBgPadding:[6,4]});});
 return {nodes,edges,addedNodeIds:fresh.map(n=>n.id)};
}
