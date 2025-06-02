type Unique<T extends any[]> = T extends [infer F, ...infer R] ? (F extends R[number] ? never : [F, ...Unique<R>]) : T;

export function arePropsEqual<T, K extends (keyof T)[]>(obj1: T, obj2: T, props: Unique<K>): boolean {
    for (const prop of props) {
        if (obj1[prop as keyof T] !== obj2[prop as keyof T]) {
            return false;
        }
    }
    return true;
}
