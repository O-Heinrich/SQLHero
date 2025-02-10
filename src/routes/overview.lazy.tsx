import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Wrapper } from '@/components/Wrapper'
import { CHALLENGES } from '@/constants'

export const Route = createLazyFileRoute('/overview')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Wrapper>
            <h2>Übersicht</h2>
            <ol>
                {CHALLENGES.map(({no, title}, index) => (
                    <li key={index}>
                        <Link to={`/challenges/$name`} params={{name: no.toString()}}>
                            {title}
                        </Link>
                    </li>
                ))}
            </ol>
        </Wrapper>
    )
}
