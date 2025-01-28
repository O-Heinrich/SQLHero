import { Wrapper } from '@/components/Wrapper';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <Wrapper>
            <title>SQL Hero - Startseite</title>
            <h3>Welcome Home!</h3>
        </Wrapper>
    )
}