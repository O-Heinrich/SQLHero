import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { Wrapper } from '@/components/Wrapper';
import { CHALLENGES } from 'virtual:sql-hero';

export const Route = createLazyFileRoute('/overview')({
    component: RouteComponent,
})

interface CardProps {
    title: string;
    number: number;
    tags:  string[];
}

const Card: React.FC<CardProps> = ({ title, number, tags }) => {
    return (
        <div className="max-w-sm rounded-xl flex-col min-h-full overflow-hidden shadow-lg bg-white/10 dark:black hover:shadow-xl transition-shadow duration-300 cursor-pointer opacity-80">
            <div className="px-6 py-4 flex-1">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">
                    {/* task.task.replace(/<br \/>/g, ' ')} {/* Replace <br /> with space for better text flow */}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #{number}
                </span>
                {tags.map((tag, index) => (
                    <span key={index} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

function RouteComponent() {
    return (
        <Wrapper>
            <title>SQL Hero - Übersicht</title>
            <h2>Übersicht</h2>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 py-8'>
                {CHALLENGES.map(({ number, title, schema }, index) => (
                    <Link key={index} to={`/challenges/$name`} params={{ name: number.toString() }} className='justify-self-stretch'>
                        <Card title={title} number={number} tags={ [schema.split('/').pop()] } />
                    </Link>
                ))}
            </section>
        </Wrapper>
    )
}
