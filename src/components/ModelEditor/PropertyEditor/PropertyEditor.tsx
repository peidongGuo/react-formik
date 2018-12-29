import './PropertyEditor.css';

import { Select, Switch, Button, Input, Menu, Dropdown } from 'antd';
import { keys } from 'lodash';
import * as React from 'react';

import { IModelProperty, PropertyFormat, PropertyType } from '../Model';
import { observable } from 'mobx';

const { Option } = Select;
interface Props {
  prop: IModelProperty;
  onPropChange: (prop: IModelProperty) => void;
}

interface SelfProp {
  description: string;
}

class PropertyEditor extends React.Component<Props, {}> {
  @observable
  prop: IModelProperty;

  componentDidMount() {
    this.prop = { ...this.props.prop };
    console.log(this.prop);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.prop = { ...this.props.prop };
  }

  render() {
    const { prop } = this.props;
    if (!prop) {
      return null;
    }
    const { type, title, description, format, required } = prop;

    return (
      <div>
        <h1>{this.props.prop.path.join('>')}</h1>

        <Input
          name="description"
          defaultValue={description}
          placeholder="字段描述"
          onChange={(e: any) => (this.props.prop.description = e.nativeEvent.target.value)}
          onBlur={this.handleInputChange}
        />

        {type === PropertyType.string && (
          <div>
            <section>
              <Select defaultValue={format} style={{ width: 120 }} onChange={this.handleUpdateFormat}>
                {keys(PropertyFormat).map((format) => (
                  <Option key={format} value={format}>
                    {format}
                  </Option>
                ))}
              </Select>
            </section>

            <Input
              name="minLength"
              defaultValue={this.props.prop.minLength && this.props.prop.minLength.toString()}
              placeholder="最小长度"
              type="number"
              onChange={(e: any) => (this.props.prop.minLength = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
            <Input
              name="maxLength"
              type="number"
              defaultValue={this.props.prop.maxLength && this.props.prop.maxLength.toString()}
              placeholder="最大长度"
              onChange={(e: any) => (this.props.prop.maxLength = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
            <Input
              name="pattern"
              type="string"
              defaultValue={this.props.prop.pattern && this.props.prop.pattern.toString()}
              placeholder="正则验证表达式"
              onChange={(e: any) => (this.props.prop.pattern = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />

            <Input
              name="enum"
              type="string"
              defaultValue={this.props.prop.enum && this.props.prop.enum.toString()}
              placeholder="将枚举值用逗号分隔"
              onChange={(e: any) => (this.props.prop.enum = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
          </div>
        )}

        {type === PropertyType.number && (
          <div>
            <section>
              <Input
                name="minimum"
                type="number"
                defaultValue={this.props.prop.minimum && this.props.prop.minimum.toString()}
                placeholder="最小值"
                onChange={(e: any) => (this.props.prop.minimum = e.nativeEvent.target.value)}
                onBlur={this.handleInputChange}
              />
              <Switch
                defaultChecked={this.props.prop.exclusiveMinimum}
                // checked={this.props.prop.exclusiveMinimum}
                checkedChildren="包括最小值"
                unCheckedChildren="不包括最小值"
                onChange={this.handleExclusiveMinimumChange}
              />
            </section>
            <section>
              <Input
                name="maximum"
                type="number"
                defaultValue={this.props.prop.maximum && this.props.prop.maximum.toString()}
                placeholder="最小值"
                onChange={(e: any) => (this.props.prop.maximum = e.nativeEvent.target.value)}
                onBlur={this.handleInputChange}
              />
              <Switch
                defaultChecked={this.props.prop.exclusiveMaximum}
                // checked={this.props.prop.exclusiveMaximum}
                checkedChildren="包括最大值"
                unCheckedChildren="不包括最大值"
                onChange={this.handleExclusiveMaximumChange}
              />
            </section>
            <section>
              <Input
                name="multipleOf"
                type="number"
                defaultValue={this.props.prop.multipleOf && this.props.prop.multipleOf.toString()}
                placeholder="是谁的倍数"
                onChange={(e: any) => (this.props.prop.multipleOf = e.nativeEvent.target.value)}
                onBlur={this.handleInputChange}
              />
            </section>
          </div>
        )}

        {type === PropertyType.object && (
          <div>
            <Input
              name="minProperties"
              type="number"
              defaultValue={this.props.prop.minProperties && this.props.prop.minProperties.toString()}
              placeholder="最少属性个数"
              onChange={(e: any) => (this.props.prop.minProperties = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
            <Input
              name="maxProperties"
              type="number"
              defaultValue={this.props.prop.maxProperties && this.props.prop.maxProperties.toString()}
              placeholder="最多属性个数"
              onChange={(e: any) => (this.props.prop.maxProperties = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
            <Switch
              defaultChecked={this.props.prop.additionalProperties}
              checkedChildren="可以使用未定义属性"
              unCheckedChildren="不可以使用未定义属性"
              onChange={this.handleAdditionalPropertiesChange}
            />
          </div>
        )}

        {type === PropertyType.array && (
          <div>
            <Input
              name="minItems"
              type="number"
              defaultValue={this.props.prop.minItems && this.props.prop.minItems.toString()}
              placeholder="最少元素个数"
              onChange={(e: any) => (this.props.prop.minItems = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
            <Input
              name="maxItems"
              type="number"
              defaultValue={this.props.prop.maxItems && this.props.prop.maxItems.toString()}
              placeholder="最多元素个数"
              onChange={(e: any) => (this.props.prop.maxItems = e.nativeEvent.target.value)}
              onBlur={this.handleInputChange}
            />
            <Switch
              defaultChecked={this.props.prop.uniqueItems}
              checkedChildren="元素唯一"
              unCheckedChildren="元素可不唯一"
              onChange={this.handleUniqueChange}
            />
          </div>
        )}
      </div>
    );
  }
  handleInputChange = (e: any) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log(name);
    this.prop[name] = value;
    if (name === 'enum') {
      this.prop[name] = value.split(',');
    }
    this.emitChange();
  };

  handleDescriptionChange = (e: any) => {
    this.prop.description = e.nativeEvent.target.value;
    this.emitChange();
  };

  handleUpdateFormat = (format: any) => {
    this.prop.format = format;
    this.emitChange();
  };

  handleExclusiveMinimumChange = (chgValue) => {
    this.prop.exclusiveMinimum = chgValue;
    this.emitChange();
  };

  handleExclusiveMaximumChange = (chgValue) => {
    this.prop.exclusiveMaximum = chgValue;
    this.emitChange();
  };
  handleAdditionalPropertiesChange = (chgValue) => {
    this.prop.additionalProperties = chgValue;
    this.emitChange();
  };
  handleUniqueChange = (chgValue) => {
    this.prop.uniqueItems = chgValue;
    this.emitChange();
  };

  emitChange = (): void => {
    this.props.onPropChange(this.prop);
  };
}

export default PropertyEditor;
