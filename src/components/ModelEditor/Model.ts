import { isPlainObject, keys, merge, size, first, isEmpty } from 'lodash';
import { isArray, isBoolean, isNumber, isString, isNullOrUndefined } from 'util';

export interface IModelProperty {
  title?: string;
  field: string;
  type: PropertyType;
  description?: string;
  path: string[];
  // isArray?: boolean;
  // isItemArray?: boolean;
  // properties?: IModelProperty[];
  properties?: object;
  required?: boolean;

  default?: any;
  value?: any;

  // string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: PropertyFormat;
  enum?: string[];

  // number
  multipleOf?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;

  // object
  minProperties?: number;
  maxProperties?: number;
  additionalProperties?: boolean;

  // array
  items?: IModelProperty;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // gss
  isIdentifier?: boolean;
  indexable?: boolean;
}

export interface IModel extends IModelProperty {
  description?: string;
}

export enum PropertyType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
  null = 'null'
}

export enum PropertyFormat {
  password = 'password',
  email = 'email',
  richText = 'richText',
  image = 'image',
  video = 'video',
  color = 'color'
}

export class Model implements IModel {
  type = PropertyType.object;

  static parseProp(path: string[], field: string, value: any): IModelProperty {
    const isArr = isArray(value);
    const tmpPath = [...path];

    path = [...path, field];
    if (isString(value)) {
      return {
        field,
        path,
        type: PropertyType.string
      };
    } else if (isNumber(value)) {
      return {
        field,
        path,
        type: PropertyType.number
      };
    } else if (isBoolean(value)) {
      return {
        field,
        path,
        type: PropertyType.boolean
      };
    } else if (isArr) {
      return this.parseArrayProp(tmpPath, value, field);
    } else if (isPlainObject(value)) {
      return this.parseObjectProp(tmpPath, value, field);
    }

    return {
      field,
      path,
      type: PropertyType.string
    };
  }

  static parseModel(obj: object, title?: string): IModel {
    const model = this.parseProp([], title, obj);
    // TODO: 设置 Model 额外属性

    return { ...model };
  }

  static parseObjectProp(
    path: string[],
    obj: object,
    field?: string,
    ignorePath = false // TODO: 标注忽略路径处理的逻辑
  ): IModelProperty {
    if (!ignorePath && field) {
      path = [...path, field]; // 更新 JSON Path
    }
    const isArr = isArray(obj);
    const objectProp: IModelProperty = {
      // 默认对象属性
      field,
      path,
      properties: {},
      // isArray: isArr,
      type: PropertyType.object
    };

    if (isArr) {
      const prop = this.parseArrayProp(path, obj as any[], field);
      // objectProp.properties = prop.properties;
      // objectProp.isArray = true;
      // objectProp.type = prop.type;
    } else {
      keys(obj).forEach((key) => {
        const modelProp = this.parseProp([...path, 'properties'], key, obj[key]);
        modelProp && (objectProp.properties[key] = modelProp);
      });
    }

    return objectProp;
  }

  static parseArrayProp(
    path: string[],
    value: any[],
    field?: string,
    ignorePath = false
    // isItemArray?: boolean
  ): IModelProperty {
    if (!ignorePath && field) {
      path = [...path, field];
    }
    let items: IModelProperty;
    if (value.length) {
      items = this.parseProp(path, 'items', value[0]);
    }
    // items=this.parseProp(items)

    // if (size(items) === 0) {
    //   return defaultProp; // 如果空数组,默认为字符串数组
    // }

    // TODO: 将来可能支持多种类型. 暂时扫描全匹配类型.
    // TODO: 去除嵌套数组支持
    // const totalLen = items.length;
    // const plainObjects = items.filter((item) => isPlainObject(item));
    // const noOfPlainObjects = size(plainObjects);
    // const noOfArrays = size(items.filter((item) => isArray(item)));
    // const hasOthers = totalLen - noOfPlainObjects - noOfArrays > 0;

    // if (totalLen === noOfPlainObjects) {
    //   const finalObject = merge({}, ...plainObjects);
    //   const prop = this.parseObjectProp(path, finalObject, field, true);
    //   // prop.isArray = true;
    //   return prop;
    // } else if (totalLen === noOfArrays) {
    //   // TODO: To be removed
    //   const item = first(items);
    //   const type = isNullOrUndefined(item) ? (typeof item as PropertyType) : PropertyType.object;
    //   return {
    //     field,
    //     path,
    //     // isArray: true,
    //     // isItemArray: true,
    //     type
    //   };
    // } else if (noOfPlainObjects === 0 && noOfArrays === 0) {
    //   // pure primitive
    //   return {
    //     field,
    //     path,
    //     // isArray: true,
    //     type: typeof items[0] as PropertyType // 使用第一个元素的类型作为数组元素类型
    //   };
    // }

    const defaultProp = {
      field,
      path,
      // isArray: true,
      // isItemArray,
      items: items,
      type: PropertyType.array
    };
    return defaultProp;
  }

  // TODO: To be removed
  static collectValue(model: IModelProperty, root?: any) {
    root = root || {};
    keys(model.properties).forEach((key) => {
      let prop = model.properties[key];
      switch (prop.type) {
        case PropertyType.object:
          if (!isNullOrUndefined(prop.value)) {
            root[prop.field] = this.collectValue(prop);
          }
          break;
        default:
          if (!isNullOrUndefined(prop.value)) {
            root[prop.field] = prop.value;
          }
      }
    });
    return root;
  }

  constructor(public field: string, public path: string[] = [], public properties: {}, public items: IModelProperty) {}
}
