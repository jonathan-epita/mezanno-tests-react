import { EdgeLabelRenderer, BaseEdge, getStraightPath } from "@xyflow/react";

const LogicalEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
    const [edgePath, labelX, labelY, offsetX, offsetY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
    
    console.log('source: ', sourceX, ' ; ', sourceY);
    
    const destX = Math.max(targetX, sourceX) - Math.min(targetX, sourceX) + Math.min(targetX, sourceX);
    const destY = sourceY - targetY;
    console.log(destX, destY);
    
   
    return (
      <>
        <BaseEdge id={id} path={edgePath} />
        <EdgeLabelRenderer>
            {/* <select 
                style={{
                    position: 'absolute',
                    // transform: `translate(${targetX}px, ${targetY}px)`, //translate(-50%, -50%) 
                    pointerEvents: 'all',
                }}
            >
                <option>ET</option>
                <option>OU</option>
            </select> */}
            <button 
            style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                pointerEvents: 'all',
            }}>Test</button>
        </EdgeLabelRenderer>
      </>
    );
}

export default LogicalEdge