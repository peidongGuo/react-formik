import { take, size, last } from 'lodash';
import { isNullOrUndefined } from 'util';

export function addPathIndex(path: string[], index: number) {
  const len = size(path);
  if (len <= 1 || isNullOrUndefined(index)) {
    return path;
  }

  const indexedPath = take(path, len - 1);
  const lastName = last(indexedPath);
  if (lastName) {
    const indexedName = `${lastName}[${index}]`;
    return take(indexedPath, size(indexedPath) - 1)
      .concat(indexedName)
      .concat(last(path));
  }

  throw {
    message: 'addPathIndex error',
    params: {
      path, index
    }
  };
}

export function appendDirectIndex(path: string[], index: number) {
  const len = size(path);
  if (len > 0) {
    const lastSegment = last(path) + `[${index}]`;
    return take(path, len - 1).concat(lastSegment);
  }
  return path;
}
