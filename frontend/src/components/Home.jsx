import React from 'react';
import Images from './Image/Images';
import './Home.css';

const Home = ({ isLoggedIn }) => {
    return (
        <React.Fragment>
            {
                isLoggedIn &&
                <div className="flex items-center justify-center font-bold pt-4">
                    <div className="text-center space-y-12">
                        <div className="text-center text-2xl font-bold">
                            <div className="relative inline-grid grid-cols-1 grid-rows-1 gap-12 overflow-hidden">
                                <span className="animate-word col-span-full row-span-full">Welcome, </span>
                                <span className="animate-word-delay-1 col-span-full row-span-full">नमस्कार, </span>
                                <span className="animate-word-delay-2 col-span-full row-span-full">Bonjour, </span>
                                <span className="animate-word-delay-3 col-span-full row-span-full">Hola, </span>
                                <span className="animate-word-delay-4 col-span-full row-span-full">Konnichiwa, </span>
                            </div>
                            {localStorage.getItem('username').toUpperCase()}
                        </div>
                    </div>
                </div>

            }
            <Images />
        </React.Fragment>
    );
}

export default Home;