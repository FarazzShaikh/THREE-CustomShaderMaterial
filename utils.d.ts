import { MaterialConstructor } from './types';

export declare function isConstructor<T extends MaterialConstructor>(f: T | InstanceType<T>): f is T;
export declare function deepMergeObjects<T extends Record<string, any>>(target: T, source: T): T;
export declare function stripComments(str: string): string;
export declare function stripNewLines(str: string): string;
export declare function stripSpaces(str: string): string;
export declare function isEmptyFunction(func: Function): boolean;
