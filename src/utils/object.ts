interface ObjectConstructor {
  /**
   * Returns an object created by key-value entries for properties and methods
   * @param entries An iterable object that contains key-value entries for properties and methods.
   */
  fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k in PropertyKey]: T };

  /**
   * Returns an object created by key-value entries for properties and methods
   * @param entries An iterable object that contains key-value entries for properties and methods.
   */
  fromEntries(entries: Iterable<readonly any[]>): any;
}

if (Object.fromEntries) {
  Object.fromEntries = (xs: [string|number|symbol, any][]) => xs.reduce((acc, [key, value]) => ({...acc, [key]: value}), {})
}