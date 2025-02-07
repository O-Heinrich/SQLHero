import { Skeleton } from '@/components/Skeleton';
import { Wrapper } from '@/components/Wrapper';
import { Button } from '@headlessui/react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';

import hljs from "highlight.js";

import { useEffect } from 'react';

export const Route = createLazyFileRoute('/')({
    component: Index,
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <Skeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
})

function Index() {
    useEffect(() => {
        hljs.highlightAll();
    }, []);

    return (
        <Wrapper>
            <title>SQL Hero - Startseite</title>
            <h2>Teste dein SQL Wissen!</h2>
            <div className="max-w-2xl">
                <p>Teste dein SQL Wissen mit SQL Hero, dem SQL Tool mit interaktiven Übungen.</p>
                <p>Auf jeder Seite findest du eine Aufgabe. Beantworte die Aufgabe direkt auf der Seite. Starte den Test und du siehst, ob deine Lösung richtig ist.</p>
                <Link to="/challenges/$name" params={{name: '1'}}>
                    <Button className="mt-6 text-2xl">
                        Start
                    </Button>
                </Link>
            </div>
        </Wrapper>
    )
}