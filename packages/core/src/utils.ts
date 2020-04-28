export function mapValues<T extends object, U>(
  obj: T,
  fn: (v: any, k: string) => U
) {
  return Object.entries(obj).reduce((o, [k, v]) => {
    return Object.assign(o, { [k]: fn(v, k) });
  }, {} as { [k in keyof T]: U });
}
