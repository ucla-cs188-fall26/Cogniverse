import {describe,it,expect,vi} from 'vitest';
import {parseAndSanitize,LLMParseError} from '../services/llm';
import {mergeGraph} from './graphMerge';
import {layout} from './layout';
import type {Concept,LLMResult} from '../types';
vi.spyOn(console,'warn').mockImplementation(()=>{});
const concept=(id:string,x=0,y=0):Concept=>({id,type:'concept',position:{x,y},selected:true,data:{label:id,category:'Method',summary:'Original',quote:'Original quote',firstSeenMessageId:'first'}});
const result:LLMResult={chatResponse:'Answer',nodes:[{id:'a',label:'Changed',category:'Theory',summary:'Changed',quote:''},{id:'b',label:'B',category:'Tool',summary:'New',quote:''}],edges:[{source:'a',target:'b',relationship:'uses'}]};
describe('response validation',()=>{
 it('rejects malformed or missing chat text',()=>{for(const s of ['','null','{}','{"chatResponse":" "}','not json'])expect(()=>parseAndSanitize(s)).toThrow(LLMParseError);});
 it('accepts fences and sanitizes untrusted nodes and edges',()=>{const r=parseAndSanitize('```json\n'+JSON.stringify({chatResponse:'Hello',nodes:[null,{label:'First',id:' A ! ',category:'method',summary:'s'.repeat(500)},{label:'Duplicate',id:'a'},{label:'你好'},{label:'B',category:'invalid'}],edges:[{source:'A',target:'B',relationship:'invalid'},{source:'a',target:'b'},{source:'a',target:'missing'},{source:'a',target:'a'}]})+'\n```');expect(r.nodes.map(n=>n.id)).toEqual(['a','b']);expect(r.nodes[0].category).toBe('Method');expect(r.nodes[0].summary).toHaveLength(400);expect(r.nodes[1].category).toBe('Theory');expect(r.edges).toEqual([{source:'a',target:'b',relationship:'relates_to'}]);});
 it('allows links to existing nodes and wrong array types',()=>{expect(parseAndSanitize(JSON.stringify({chatResponse:'Hi',nodes:{},edges:null}))).toEqual({chatResponse:'Hi',nodes:[],edges:[]});const r=parseAndSanitize(JSON.stringify({chatResponse:'Hi',nodes:[{label:'B'}],edges:[{source:'a',target:'b',relationship:'uses'}]}),[{id:'a'}]);expect(r.edges).toHaveLength(1);});
});
describe('stable graph merges',()=>{
 it('preserves original data, selection, and dragged positions without mutation',()=>{const a=concept('a',875,900);const before=JSON.stringify(a);const r=mergeGraph([a],[],result,'second');expect(r.nodes[0]).toBe(a);expect(JSON.stringify(a)).toBe(before);expect(r.nodes[1].position).toEqual({x:875,y:1050});expect(r.nodes[1].data.firstSeenMessageId).toBe('second');expect(r.addedNodeIds).toEqual(['b']);expect(r.edges[0].id).toBe('a__uses__b');const again=mergeGraph(r.nodes,r.edges,result,'third');expect(again.nodes).toHaveLength(2);expect(again.edges).toHaveLength(1);expect(again.addedNodeIds).toEqual([]);expect(again.nodes.every(n=>!n.data.isNew)).toBe(true);});
 it('drops invalid edges and supports empty replies',()=>{expect(mergeGraph([],[],{...result,nodes:[],edges:result.edges},'id').edges).toEqual([]);});
 it('places batches below dragged bounds with distinct positions',()=>{const positions=layout([concept('a',-500,320),concept('b',20,990)],60);expect(positions[0]).toEqual({x:-500,y:1140});expect(new Set(positions.map(p=>`${p.x},${p.y}`)).size).toBe(60);});
});
