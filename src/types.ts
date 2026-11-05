import type { Node } from '@xyflow/react';
export type Category = 'Method' | 'Tool' | 'Theory';
export type Relationship = 'relates_to' | 'uses' | 'supports';
export interface LLMNode { id:string; label:string; category:Category; summary:string; quote:string }
export interface LLMEdge { source:string; target:string; relationship:Relationship }
export interface LLMResult { chatResponse:string; nodes:LLMNode[]; edges:LLMEdge[] }
export interface ConceptNodeData extends Record<string,unknown> {label:string; category:Category; summary:string; quote:string; firstSeenMessageId:string; isNew?:boolean}
export type Concept = Node<ConceptNodeData>;
export interface ChatMessage {id:string;role:'user'|'assistant'|'error';content:string;createdAt:number;nodeIds?:string[]}
export const categoryStyles:Record<Category,{color:string;className:string}>={Method:{color:'#6494e9',className:'method'},Tool:{color:'#55ad8b',className:'tool'},Theory:{color:'#a184d6',className:'theory'}};
