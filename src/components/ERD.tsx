/**
* ERD (Entity Relationship Diagram) Viewer Module
* 
* This module provides components for displaying and interacting with
* entity relationship diagrams, including zoom controls and a responsive viewer.
* 
* @module components/erd-viewer
*/
import React, { useEffect } from 'react';
import dompurify from 'dompurify';
import { TransformComponent, useControls } from "react-zoom-pan-pinch";
import { IconButton } from './buttons/IconButton';
import { isFirefox } from '@/lib/agents';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/solid';

async function fetchSvg(url: string): Promise<string> {
    const buffer: string[] = [];
    const response = await fetch(url);
    const reader = response.body?.getReader();
    const len = parseInt(response.headers.get('Content-Length') ?? '0', 10);
    let bytesRead = 0;

    while (true) {
        const { done, value } = await reader!.read();
        if (done) {
            break;
        }

        bytesRead += value!.byteLength;
        console.log(`Downloaded ${bytesRead} of ${len} bytes`);
        buffer.push(new TextDecoder().decode(value));
    }

    return dompurify.sanitize(buffer.join(''), { ADD_TAGS: ['style', 'use'], ADD_ATTR: ['viewBox'] });
}

/**
* ERD zoom control buttons component
* 
* Renders zoom in and zoom out buttons for controlling the ERD view.
* Uses the react-zoom-pan-pinch library's useControls hook to manage zoom functionality.
* 
* @returns Zoom control buttons fragment
*/
export const ErdControls: React.FC<{disabled: boolean}> = ({disabled}) => {
    const { zoomIn, zoomOut } = useControls();
    return (
        <>
            <IconButton 
                icon={<MagnifyingGlassPlusIcon className="size-6" />}
                disabled={disabled} 
                aria-label="ERD vergrößern" 
                title="ERD vergrößern"  
                onClick={() => zoomIn()}
            />
            <IconButton 
                icon={<MagnifyingGlassMinusIcon className="size-6" />}
                disabled={disabled} 
                aria-label="ERD verkleinern" 
                title="ERD verkleinern"  
                onClick={() => zoomOut()}
            />
        </>
    );
};

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
export const ERD: React.FC<{ src: string; style?: React.CSSProperties; className?: string; }> = ({ src, className, style }) => {
    const [svg, setSvg] = React.useState<string | null>(null);
    const [svgSrc, setSvgSrc] = React.useState<string | null>(null);
    const Style =  () => isFirefox ?
        <style>
            {`
            .react-transform-component.transform-component-module_content__FBWxo.h-full.w-full.flex.justify-center.items-stretch {
                height: auto;
                width: 30%;
            }
            `}
        </style> : null;

    useEffect(() => {
        if (src !== svgSrc) {
            setSvgSrc(src);
            fetchSvg(src).then(setSvg);
        }
    }, [src, svgSrc]);
    return (
        <>
            <Style />
            <div className={className} style={style}></div>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentClass="h-full w-full">
                {svg ? <div className='drop-shadow-md' dangerouslySetInnerHTML={{__html: svg}} /> : <div>Loading...</div>}
            </TransformComponent>
        </>
    );
};