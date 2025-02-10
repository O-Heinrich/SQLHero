import { Wrapper } from '@/components/Wrapper'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/overview')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Wrapper>
            <h2>Hello "/overview"!</h2>
        </Wrapper>
    )
}
