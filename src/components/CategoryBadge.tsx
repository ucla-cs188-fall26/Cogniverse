import {categoryStyles,type Category} from '../types';
export function CategoryBadge({category}:{category:Category}){return <span className={`badge ${categoryStyles[category].className}`}><i/>{category}</span>;}
