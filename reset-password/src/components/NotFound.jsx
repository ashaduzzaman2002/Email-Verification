import React from 'react';

const NotFound = () => {
  return (
    <main style={{backgroundColor: '#1A2238'}} class="h-screen w-full flex flex-col justify-center items-center">
      <h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
      <div style={{backgroundColor: '#FF6A3D'}} class=" px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
    </main>
  );
};

export default NotFound;
