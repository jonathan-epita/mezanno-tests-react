import { Handle, NodeToolbar } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { useEffect } from "react";
import { useCallback } from "react";

const categories = [{label: 'Titre', value: 'dc.title'}, 
                {label: 'Auteur', value: 'dc.creator '}];

const operations = [{label: 'doit contenir', value: 'any'}];

const TextInputNode = ({ data }) => {
    useEffect(() => {
        const newData = {
            ...data, 
            category: 'dc.title',
            operation: 'any',
            inputValue: ''
         };
         data.onValuesChange(newData);
    }, []);

    const onChange = useCallback((evt) => {
        const { name, value } = evt.target;
        const newData = { ...data, [name]: value };
        data.onValuesChange(newData);
    }, [data]);


    const query = `(${data.category} ${data.operation} "${data.inputValue}")`;

  return (
    <>
        <NodeToolbar position={Position.Top} align="end">
            <div className="flex text-right">
                <button onClick={data.onDelete}>❌</button>
            </div>
        </NodeToolbar>
        <Handle type="source" position={Position.Left}/>
        <div className="h-50px border p-2 rounded-md bg-white flex flex-col space-y-1">
            <select 
                className="border rounded text-center"
                onChange={onChange}
                name="category"
            >
                {categories.map((cat, index) => (
                    <option key={index} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <select 
                className="border rounded text-center"  
                onChange={onChange}
                name="operation"
            >
                {operations.map((op, index) => (
                    <option key={index} value={op.value}>{op.label}</option>
                ))}
            </select>
            <input 
                name="inputValue" 
                className="border"
                value={data.inputValue}
                onChange={onChange}
            />
            <label className="text-sm italic">{query}</label>
        </div>
        <Handle type="target" position={Position.Right}/>
        
    </>
  )
}

export default TextInputNode