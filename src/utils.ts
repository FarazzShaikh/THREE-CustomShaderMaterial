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

// Remove all comments in a string
// both block and inline comments
export function stripComments(str: string) {
  return str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
}
