import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <header className="bg-blue-600 w-full py-4 shadow-md">
                <h1 className="text-white text-3xl text-center">Welcome to POS Customer Side</h1>
            </header>
            <main className="flex-grow container mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Home Page</h2>
                    <p className="text-gray-700">This is the home page of the POS Customer Side application. Use the navigation to explore different sections.</p>
                </div>
            </main>
            <footer className="bg-blue-600 w-full py-4 text-center text-white">
                &copy; 2023 POS Customer Side. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;