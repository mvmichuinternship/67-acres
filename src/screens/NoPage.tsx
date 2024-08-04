import React from "react";

const NoPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center justify-center h-screen w-[40%]">
          {/* <h1 className="text-blue-400 text-6xl font-bold">404</h1> */}
          <p className="text-blue-400 text-3xl font-bold mt-4">
            Page Not Found
          </p>
          <p className="text-blue-400 text-lg mt-2">
            The page you are looking for might have been moved or deleted.
          </p>
          <a
            href="/"
            className="mt-6 bg-white text-blue-400 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Go Home
          </a>
        </div>
        <img
          src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png"
          alt="404 Image"
          className="w-[30%] h-[10%]"
        />
      </div>
      <a
        href="/"
        className="mt-6 bg-white text-blue-400 px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default NoPage;
