import {memo} from 'react';
import {Handle,Position,type NodeProps} from '@xyflow/react';
import type {Concept} from '../types';
import {CategoryBadge} from './CategoryBadge';
export const ConceptNode=memo(({data,selected}:NodeProps<Concept>)=><div className={`concept-card ${selected?'selected':''} ${data.isNew?'new-node':''}`}><Handle type="target" position={Position.Top}/><CategoryBadge category={data.category}/><strong title={data.label}>{data.label}</strong><Handle type="source" position={Position.Bottom}/></div>);
