import { Wrapper } from '@/components/Wrapper';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
    component: About,
});

function About() {
    return (
        <Wrapper>
            <title>SQL Hero - Über</title>
            Hello from About!
        </Wrapper>
    );
}