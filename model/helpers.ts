function pairs<T>(arr: T[]): [T, T][] {
    let res: [T, T][] = [];

    for (let i = 0; i < arr.length - 1; i++) {
        const a = arr[i];

        for (let j = i + 1; j < arr.length; j++) {
            const b = arr[j];

            res.push([a, b]);
        }
    }

    return res;
}


/**
 * Maps a value from range to another range
 * @param n value to map
 * @param start1 lower bound of the input range
 * @param stop1 upper bound of the input range
 * @param start2 lower bound of the output range
 * @param stop2 upper bound of the output range
 * @returns mapped value
 */
function map(n: number, start1: number, stop1: number, start2: number, stop2: number) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

/**
 * Maps a value from range to another range. Compared to [[map]],
 * this will also constrain the value to the output range.
 * @param n value to map
 * @param start1 lower bound of the input range
 * @param stop1 upper bound of the input range
 * @param start2 lower bound of the output range
 * @param stop2 upper bound of the output range
 * @returns mapped and constrained value
 */
function mapConstrain(v: number, start1: number, stop1: number, start2: number, stop2: number) {
    const newVal = map(v, start1, stop1, start2, stop2);

    if (start2 < stop2) {
        return this.constrain(newVal, start2, stop2);
    } else {
        return this.constrain(newVal, stop2, start2);
    }
}

/**
 * Constrains the given value between the minum and maximum value
 * @param v value to constrain
 * @param min minimum value
 * @param max maximum value
 * @returns constrained value
 */
function constrain(v: number, min: number, max: number) {
    return Math.max(Math.min(v, max), min);
};

/**
 * For now just a wrapper around `console.log` to print messages to the development console
 * @param args 
 */
function log(...args: any[]) {
    console.log("build():", args);
}


// Lifted from: https://zalo.github.io/blog/closest-point-between-segments/

export { log, pairs, map, mapConstrain, constrain };