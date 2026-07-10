const isObject = (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

export function getDeepDiff<T extends Record<string, any>>(obj1: T, obj2: T): Partial<T> {
    const diff: Partial<T> = {};

    for (const key in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, key)) {
            const val1 = obj1[key];
            const val2 = obj2[key];

            if (isObject(val1) && isObject(val2)) {
                const nestedDiff = getDeepDiff(val1, val2);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff as any;
                }
            } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                diff[key] = val2;
            }
        }
    }

    return diff;
}

