import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';
import "./App.css";

function App() {
    const [count, setCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <button onClick={() => setIsOpen(true)}>Open dialog</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={clsx('relative',  'z-50')}>
                <div className={clsx('fixed',  'inset-0',  'flex',  'w-screen',  'items-center',  'justify-center',  'p-4')}>
                    <DialogPanel className={clsx('max-w-lg',  'space-y-4',  'border',  'bg-sky-950',  'p-12')}>
                        <DialogTitle className={clsx('font-bold')}>Deactivate account</DialogTitle>
                        <Description>This will permanently deactivate your account</Description>
                        <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                        <div className={clsx('flex', 'gap-4')}>
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button onClick={() => setIsOpen(false)}>Deactivate</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            <div className={clsx('flex',  'gap-4',  'justify-center')}>
                <a href='https://vite.dev' target='_blank'>
                    <img src={viteLogo} className='logo' alt='Vite logo' />
                </a>
                <a href='https://react.dev' target='_blank'>
                    <img
                        src={reactLogo}
                        className='logo react'
                        alt='React logo'
                    />
                </a>
            </div>
            <h1 className={clsx('text-4xl',  'w-full',  'text-transparent',  'bg-clip-text',  'font-extrabold',  'bg-gradient-to-r',  'from-cyan-600',  'to-green-700',  'p-2')}>Vite + React</h1>
            <div className='card'>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className='read-the-docs'>
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
