import './PropertyRow.css';

import * as React from 'react';

import { IModelProperty, PropertyType } from '../Model';
import { isEmpty, unset } from 'lodash';
import { Switch, Icon, Menu, Dropdown, Input } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

interface Props {
  prop: IModelProperty;
  onClick: (prop: IModelProperty) => void;
  onDeleteClick: (prop: IModelProperty) => void;
  onPropChange: (prop: IModelProperty) => void;
}

export class PropertyRow extends React.Component<Props, {}> {
  @observable
  title = '';

  @observable
  field = '';

  componentDidMount() {
    this.title = this.props.prop.title || '';
    this.field = this.props.prop.field;
    // this.types=Object.keys(PropertyType)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.title = nextProps.prop.title || '';
    this.field = nextProps.prop.field || '';
  }

  render() {
    const { field, title, type, required, properties, format, items } = this.props.prop;
    return (
      <div className="prop-row">
        <div className="prop-settings">
          <span className="prop-field">
            {field === 'items' ? (
              'items'
            ) : (
              <Input
                placeholder="字段标题"
                value={this.field}
                // onChange={(e: any) => (this. = e.nativeEvent.target.value)}
                onBlur={this.handleFieldChange}
              />
            )}
          </span>
          <div className="more">
            <span className="prop-title">
              <Input
                placeholder="字段标题"
                value={this.title}
                onChange={(e: any) => (this.title = e.nativeEvent.target.value)}
                onBlur={this.handleTitleChange}
              />
            </span>
            <Dropdown
              overlay={
                <Menu>
                  {Object.keys(PropertyType).map((type) => (
                    <Menu.Item key={type}>
                      <a onClick={(e) => this.handleTypeChange(e, type)}>{type}</a>
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <span className="prop-type">{type}</span>
            </Dropdown>
            <span className="prop-required">
              <Switch
                defaultChecked={false}
                checked={required}
                checkedChildren="必填"
                unCheckedChildren="可选"
                onChange={this.handleRequiredChange}
              />
            </span>
            <span className="prop-indexable">
              <Switch
                defaultChecked={false}
                checkedChildren="可以索引"
                unCheckedChildren="不可索引"
                onChange={this.handleIndexable}
              />
            </span>
            <span className="prop-id">
              <Switch
                defaultChecked={true}
                checkedChildren="是识别符"
                unCheckedChildren="非识别符"
                onChange={this.handleIdentifierChange}
              />
            </span>
            <span>
              <a onClick={this.handleEditClick} title="设置属性">
                <Icon type="setting" />
              </a>
            </span>
            {field !== 'items' && (
              <span>
                <a onClick={this.handleDeleteClick} title="删除属性">
                  <Icon type="delete" />
                </a>
              </span>
            )}
            {type === PropertyType.object && (
              <span>
                <a onClick={this.handleAddChildProp} title="添加子属性">
                  <Icon type="plus" />
                </a>
              </span>
            )}
          </div>
        </div>
        {!isEmpty(properties) && (
          <div className="prop-props">
            {Object.getOwnPropertyNames(properties).map((key, index) => {
              let prop = properties[key];
              return (
                <PropertyRow
                  key={prop.field}
                  prop={prop}
                  onClick={this.props.onClick}
                  onDeleteClick={this.props.onDeleteClick}
                  onPropChange={this.props.onPropChange}
                />
              );
            })}
          </div>
        )}
        {!isEmpty(items) && (
          <div className="prop-props">
            <PropertyRow
              key={'items'}
              prop={items}
              onClick={this.props.onClick}
              onDeleteClick={this.props.onDeleteClick}
              onPropChange={this.props.onPropChange}
            />
          </div>
        )}
      </div>
    );
  }

  handleFieldChange = (e: any) => {};
  handlePropChange = (e: any) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.props.prop[name] = value;
  };

  handleEditClick = (e: any) => {
    console.log(this.props.prop);
    this.props.onClick(this.props.prop);
  };

  handleDeleteClick = (e: any) => {
    console.log(this.props.prop);
    this.props.onDeleteClick(this.props.prop);
  };

  handleAddChildProp = (e: any) => {
    const fieldName = prompt('field name');
    if (!fieldName) {
      return;
    }
    const prop: IModelProperty = {
      field: fieldName,
      type: PropertyType.string,
      path: [...this.props.prop.path, 'properties', fieldName]
    };
    this.props.prop.properties[fieldName] = prop;
  };

  handleTypeChange = (e: any, type: string) => {
    e.preventDefault();
    console.log(type);
    if (type === this.props.prop.type) {
      return;
    }
    this.props.prop.type = type as PropertyType;

    unset(this.props.prop, 'properties');

    unset(this.props.prop, 'minLength');
    unset(this.props.prop, 'maxLength');
    unset(this.props.prop, 'pattern');
    unset(this.props.prop, 'format');
    unset(this.props.prop, 'enum');

    unset(this.props.prop, 'multipleOf');
    unset(this.props.prop, 'minimum');
    unset(this.props.prop, 'maximum');
    unset(this.props.prop, 'exclusiveMaximum');
    unset(this.props.prop, 'minProperties');
    unset(this.props.prop, 'maxProperties');
    unset(this.props.prop, 'additionalProperties');

    unset(this.props.prop, 'items');
    unset(this.props.prop, 'minItems');
    unset(this.props.prop, 'maxItems');
    unset(this.props.prop, 'uniqueItems');

    if (type === PropertyType.array) {
      this.props.prop.items = {
        field: 'items',
        path: [...this.props.prop.path, 'items'],
        type: PropertyType.string
      };
    } else if (type === PropertyType.object) {
      this.props.prop.properties = {};
    }

    this.props.onPropChange(this.props.prop);
  };

  handleTitleChange = (e: any) => {
    this.props.prop.title = e.nativeEvent.target.value;
    // this.props.prop.description = e.nativeEvent.target.value;
    this.props.onPropChange(this.props.prop);
  };

  handleRequiredChange = (required: boolean): void => {
    this.props.prop.required = required;
    this.props.onPropChange(this.props.prop);
  };

  handleIndexable = (indexable: boolean): void => {
    this.props.prop.indexable = indexable;
    this.props.onPropChange(this.props.prop);
  };

  handleIdentifierChange = (identifier: boolean): void => {
    this.props.prop.isIdentifier = identifier;
    this.props.onPropChange(this.props.prop);
  };
}

export default observer(PropertyRow);
