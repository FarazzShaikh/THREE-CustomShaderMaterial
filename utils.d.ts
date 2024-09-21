import { MaterialConstructor } from './types';

export declare function isConstructor<T extends MaterialConstructor>(f: T | InstanceType<T>): f is T;
export declare function stripComments(str: string): string;
