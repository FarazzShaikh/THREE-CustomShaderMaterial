import { MaterialConstructor } from "./types";

// Hacky, yikes!
export function isConstructor<T extends MaterialConstructor>(
  f: T | InstanceType<T>
): f is T {
  try {
    // @ts-ignore
    new f();
  } catch (err) {
    if ((err as any).message.indexOf("is not a constructor") >= 0) {
      return false;
    }
  }
  return true;
}

export function deepMergeObjects<T extends Record<string, any>>(
  target: T,
  source: T
): T {
  for (const key in source) {
    // @ts-ignore
    if (source[key] instanceof Object)
      Object.assign(source[key], deepMergeObjects(target[key], source[key]));
  }

  Object.assign(target || {}, source);
  return target;
}

// Remove all comments in a string
// both block and inline comments
export function stripComments(str: string) {
  return str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
}
