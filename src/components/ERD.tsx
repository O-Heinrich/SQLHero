/**
* ERD (Entity Relationship Diagram) Viewer Module
* 
* This module provides components for displaying and interacting with
* entity relationship diagrams, including zoom controls and a responsive viewer.
* 
* @module components/erd-viewer
*/
import React from 'react';
import { TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import { IconButton } from './buttons/IconButton';
import { isFirefox } from '@/lib/agents';

/**
* ERD zoom control buttons component
* 
* Renders zoom in and zoom out buttons for controlling the ERD view.
* Uses the react-zoom-pan-pinch library's useControls hook to manage zoom functionality.
* 
* @returns Zoom control buttons fragment
*/
const ErdCtrls: React.FC<{disabled: boolean}> = ({disabled}) => {
    const { zoomIn, zoomOut } = useControls();
    return (
        <>
            <IconButton 
                icon={<ZoomInIcon size={1.5} />}
                disabled={disabled} 
                aria-label="ERD vergrößern" 
                title="ERD vergrößern"  
                onClick={() => zoomIn()}
            />
            <IconButton 
                icon={<ZoomOutIcon size={1.5} />}
                disabled={disabled} 
                aria-label="ERD verkleinern" 
                title="ERD verkleinern"  
                onClick={() => zoomOut()}
            />
        </>
    );
};

const FirefoxFix = () => null;

/**
* ERD viewer component
* 
* Displays an entity relationship diagram image with zoom and pan capabilities.
* Wraps the image in a TransformComponent for interactive viewing.
* 
* @param props - Component properties
* @param props.src - Source URL of the ERD image to display
* @returns ERD viewer component
* 
* @example
* ```tsx
* <ERD src="/images/database-schema.png" />
* ```
*/
export const ERD: React.FC<{ src: string }> = ({ src }) => {
    if (isFirefox) {
        return <img src={src} alt="ERD" width="100%" height="100%" className="erd" />;
    }
    return (
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentClass="h-full w-full flex justify-center items-stretch">
            <img src={src} alt="ERD" width="100%" height="100%" className="erd" />
        </TransformComponent>
    );
};

export const ErdControls = isFirefox ? FirefoxFix : ErdCtrls;