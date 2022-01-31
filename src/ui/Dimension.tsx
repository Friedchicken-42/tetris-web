import { useState, useEffect } from 'react'

export function windowDimension() {
    const getWindowDimension = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height }
    }

    const [dimension, setDimension] = useState(getWindowDimension());

    useEffect(() => {
        const handleResize = () => setDimension(getWindowDimension())

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    return dimension
}

