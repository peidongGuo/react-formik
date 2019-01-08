import * as React from 'react';
import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { Button, message, Modal } from 'antd';
import { unset, entries, assign, isArray, isEmpty, isPlainObject } from 'lodash';

import { JsonSchemaModel, Model, JsonSchemaType } from '../../components/ModelEditor/Model';

interface Props {}

interface State {}

@observer
class EditJsonSchemaModel extends React.Component<Props, State> {
  @observable
  inputJsonData = {};
  @observable
  dynamicJsonSchema: JsonSchemaModel = null;
  @observable
  propOnEdit: JsonSchemaModel = null;
  @observable
  propOnHold: JsonSchemaModel = null;

  componentWillReceiveProps(nextProps: Props) {
    console.log('will receive props!');
  }

  componentDidMount() {
    console.log('mounted component');
  }

  render() {
    return (
      <div className="model-wrapper">
        <div className="model-edit">
          <Button type="primary" onClick={() => this.handleAddTopProp()}>
            增加顶级属性
          </Button>
        </div>
        <div className="model-props">
          {/* {!isEmpty(properties) &&
            Object.getOwnPropertyNames(properties).map((key, index) => {
              let prop = properties[key];
              return (
                // <PropertyRow
                  key={index}
                  prop={prop}
                  onClick={this.handleEditProp}
                  onDeleteClick={this.handleDeleteProp}
                  onPropChange={this.handlePropChange}
                  // onPropAdd={this.handleSubPropAdd}
                />
              );
            })} */}

          <Modal
            title="编辑属性"
            visible={!!this.propOnEdit}
            onOk={this.handlePopupPropOk}
            onCancel={() => this.handleEditProp(null)}
          >
            {/* <PropertyEditor prop={this.propOnEdit} onPropChange={this.handlePropOnHoldChange} /> */}
          </Modal>
          {/* <pre>{JSON.stringify(model, null, 2)}</pre> */}
        </div>
      </div>
    );
  }

  handleJsonUpdate = (data: string | object): void => {
    console.log(data);
  };

  handleAddTopProp = (prop: JsonSchemaModel = null) => {
    const fieldName = prompt('field name');
    if (!fieldName) {
      return;
    }
    if (!prop) {
      prop = {
        field: fieldName,
        type: JsonSchemaType.string,
        path: []
      };
    }
    this.dynamicJsonSchema.properties[fieldName] = prop;
  };

  handleEditProp = (prop: JsonSchemaModel) => {
    console.log(prop);
    this.propOnEdit = prop;
  };

  handleDeleteProp = (prop: JsonSchemaModel) => {
    unset(this.dynamicJsonSchema.properties, prop.path.slice(2));
    // this.props.onModelChange(toJS(this.model), toJS(this.exampleObject));
  };

  handlePropChange = (prop: JsonSchemaModel) => {
    assign(this.propOnEdit, toJS(prop));
    console.log('updated prop', toJS(prop), toJS(this.propOnEdit));
    // this.props.onModelChange(toJS(this.model), toJS(this.exampleObject));
  };

  handlePropOnHoldChange = (prop: JsonSchemaModel): void => {
    this.propOnHold = prop;
  };

  handlePopupPropOk = (): void => {
    this.handlePropChange(this.propOnHold);
    this.propOnEdit = null;
    this.propOnHold = null;
  };
}

export default EditJsonSchemaModel;
