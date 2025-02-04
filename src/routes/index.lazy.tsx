import { Wrapper } from '@/components/Wrapper';
import { Button } from '@headlessui/react';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <Wrapper>
            <title>SQL Hero - Startseite</title>
            <h2>Teste dein SQL Wissen!</h2>
            <div className="max-w-2xl">
                <p>Teste dein SQL Wissen mit SQL Hero, dem SQL Tool mit interaktiven Übungen.</p>
                <p>Auf jeder Seite findest du eine Aufgabe. Beantworte die Aufgabe direkt auf der Seite. Starte den Test und du siehst, ob deine Lösung richtig ist.</p>
                <Button className="mt-6 w-32 text-2xl">Start</Button>
            </div>
        </Wrapper>
    )
}