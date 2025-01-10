import { Background, Controls, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TextInputNode from './TextInputNode';
import { useCallback } from 'react';
import { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import LogicalEdge from './LogicalEdge';

const nodeTypes = { textInput: TextInputNode };

const edgeTypes = { 'logical-edge': LogicalEdge };

const initialNodes = [];
// const initialNodes = [
//     { id: '0', position: { x: 0, y: 0 }, data: { inputValue: 'Toto' }, type: 'textInput' },
// ];
const initialEdges = [];

const Flow = ({ query, setQuery }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );
     
    const onConnect = useCallback(
        (connection) => {
            const sameNode = connection.target === connection.source;
            
            const alreadyConnected = sameNode || edges.some(
                (edge) => { 
                    return (edge.source === connection.source && edge.target === connection.target) || 
                           (edge.source === connection.target && edge.target === connection.source);
                }
            );
            
            if (!sameNode && !alreadyConnected) {
                const edge = { ...connection, type: 'logical-edge', label: 'test' };
                setEdges((eds) => addEdge(edge, eds));
            }
        },
        [setEdges],
    );

    

    const addNode = () => {
        const nodeId = uuidv4();

        const onDeleteNode = () => {
            console.log();
            
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        };

        const onNodeValuesChange = (data) => {
            setNodes((nds) => 
                nds.map((node) => {
                    return node.id === nodeId ? { ...node, data } : node
                })
            );
        };

        const newNode = {
          id: nodeId,
          data: { onDelete: onDeleteNode, onValuesChange: onNodeValuesChange},
          position: {
            x: 0,
            y: 0,
          },
          type: 'textInput',
          
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const handleGenerateQuery = () => {
        console.log(nodes);
        console.log(edges);
        let q = "";
        if(edges.length === 0) {
            q = getRequestFromNode(nodes[0]);
        } else {
            console.log("nodes.length: ", nodes.length);
            
            for(let i = 0 ; i < nodes.length ; i++) {
                q = q.concat(getRequestFromNode(nodes[i]));
                if(i < nodes.length - 1) {
                    q = q.concat(' and ');
                }
            }
        }
        console.log("q: ", q);
            
        setQuery(q);
    };

    const getRequestFromNode = (node) => {
        const category  = node.data.category || 'dc.title';
        const operation = node.data.operation || 'any';
        const value = node.data.inputValue || 'test';
        return `(${category} ${operation} "${value}")`
    }

  return (
    <div className='flex flex-col'>
        <div className='bg-slate-100' style={{ width: '100vw', height: '25vh' }}>
        <ReactFlow 
            nodes={nodes} 
            edges={edges}
            nodeTypes={nodeTypes} 
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background/>
            <Controls/>
        </ReactFlow>
        </div>
        <div>
            <button className='btn-primary' onClick={addNode}>➕Ajouter un noeud</button>
            <button className='btn-primary' onClick={handleGenerateQuery}>Générer la requête</button>
        </div>
        <div className='m-2 bg-slate-200 rounded text-lg'>
            <label>{query}</label>
        </div>
    </div>
  )
}

export default Flow