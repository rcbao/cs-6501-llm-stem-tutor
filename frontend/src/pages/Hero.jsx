import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated, config } from "react-spring";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);

    const slideIn = useSpring({
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 24,
        config: config.slow,
    });

    // Trigger the animation when the component mounts
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);
        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, []);

    return (
        <div className="flex-grow isolate bg-lime-50 dark:bg-lime-800">
            <main>
                <animated.div
                    style={slideIn}
                    className="relative px-6 lg:px-8 py-20"
                >
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
                        <div className="text-center">
                            <p></p>
                            <h1 className="text-6xl font-extrabold tracking-tight text-lime-950 dark:text-white">
                                STEM Tutor
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-lime-950 dark:text-white">
                                Your personal AI tutor for Science/Math
                                subjects!
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    to={`/chat/`}
                                    className="rounded-md bg-lime-900 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>
                    </div>
                </animated.div>
            </main>
        </div>
    );
}
