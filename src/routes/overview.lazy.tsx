import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Wrapper } from '@/components/Wrapper'
import { CHALLENGES } from '@/constants'

export const Route = createLazyFileRoute('/overview')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Wrapper>
            <h2>Hello "/overview"!</h2>
            <ol>
                {CHALLENGES.map((challenge, index) => (
                    <li key={index}>
                        <Link to={`/challenges/${challenge.no}`}>{challenge.title}</Link>
                    </li>
                ))}
            </ol>
        </Wrapper>
    )
}
