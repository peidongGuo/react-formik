import { nth } from 'lodash';
export function findPatternNames(reg: RegExp, str: string) {
  let m = null;
  const names = [];
  while ((m = reg.exec(str)) != null) {
    names.push(nth(m, 1));
  }
  return names;

}

export function poplatePatternValues(reg: RegExp, str: string, context: object) {
  return str.replace(reg, (match, name, offset) => {
    return context[name];
  });
}
