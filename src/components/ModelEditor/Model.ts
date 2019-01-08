import { isPlainObject, keys, merge, size, first, isEmpty } from 'lodash';
import { isArray, isBoolean, isNumber, isString, isNullOrUndefined } from 'util';

export interface JsonSchemaModel {
  title?: string;
  field: string;
  type: JsonSchemaType;
  description?: string;
  path: string[];
  properties?: object;
  required?: boolean;

  default?: any;
  value?: any;

  // string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: JsonSchemaFormat;
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
  items?: JsonSchemaModel;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // gss
  isIdentifier?: boolean;
  indexable?: boolean;
}

export enum JsonSchemaType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
  null = 'null'
}

export enum JsonSchemaFormat {
  password = 'password',
  email = 'email',
  richText = 'richText',
  image = 'image',
  video = 'video',
  color = 'color'
}

export class Model implements JsonSchemaModel {
  type = JsonSchemaType.object;

  static parseProp(path: string[], field: string, value: any): JsonSchemaModel {
    const isArr = isArray(value);
    const tmpPath = [...path];

    path = [...path, field];
    if (isString(value)) {
      return {
        field,
        path,
        type: JsonSchemaType.string
      };
    } else if (isNumber(value)) {
      return {
        field,
        path,
        type: JsonSchemaType.number
      };
    } else if (isBoolean(value)) {
      return {
        field,
        path,
        type: JsonSchemaType.boolean
      };
    } else if (isArr) {
      return this.parseArrayProp(tmpPath, value, field);
    } else if (isPlainObject(value)) {
      return this.parseObjectProp(tmpPath, value, field);
    }

    return {
      field,
      path,
      type: JsonSchemaType.string
    };
  }

  static parseModel(obj: object, title?: string): JsonSchemaModel {
    const model = this.parseProp([], title, obj);
    // TODO: 设置 Model 额外属性

    return { ...model };
  }

  static parseObjectProp(
    path: string[],
    obj: object,
    field?: string,
    ignorePath = false // TODO: 标注忽略路径处理的逻辑
  ): JsonSchemaModel {
    if (!ignorePath && field) {
      path = [...path, field]; // 更新 JSON Path
    }
    const isArr = isArray(obj);
    const objectProp: JsonSchemaModel = {
      // 默认对象属性
      field,
      path,
      properties: {},
      // isArray: isArr,
      type: JsonSchemaType.object
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
  ): JsonSchemaModel {
    if (!ignorePath && field) {
      path = [...path, field];
    }
    let items: JsonSchemaModel;
    if (value.length) {
      items = this.parseProp(path, 'items', value[0]);
    }

    const defaultProp = {
      field,
      path,
      // isArray: true,
      // isItemArray,
      items: items,
      type: JsonSchemaType.array
    };
    return defaultProp;
  }

  // TODO: To be removed
  static collectValue(model: JsonSchemaModel, root?: any) {
    root = root || {};
    keys(model.properties).forEach((key) => {
      let prop = model.properties[key];
      switch (prop.type) {
        case JsonSchemaType.object:
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

  constructor(public field: string, public path: string[] = [], public properties: {}, public items: JsonSchemaModel) {}
}
