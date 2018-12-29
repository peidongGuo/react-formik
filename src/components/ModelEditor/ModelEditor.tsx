import * as React from 'react';

import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';

import './ModelEditor.css';
import 'codemirror/mode/javascript/javascript';

import { Button, message, Modal, Steps } from 'antd';
import * as GenerateSchema from 'generate-schema';
import * as hjson from 'hjson';
import { unset, entries, assign, isArray, isEmpty, isPlainObject } from 'lodash';
import { UnControlled as CodeMirror } from 'react-codemirror2';

// import ModelForm from '../Form/ModelForm/ModelForm';
import PropertyEditor from './PropertyEditor/PropertyEditor';
import { IModel, IModelProperty, Model, PropertyType } from './Model';
import PropertyRow from './PropertyRow/PropertyRow';

interface Props {
  example?: any;
  model?: IModel;
  onModelChange?: (model: IModel, example: any) => void;
}

interface State {
  $this: ModelEditor;
}

const Step = Steps.Step;

class ModelEditor extends React.Component<Props, State> {
  state = {
    $this: this
  };

  @observable
  currentStep = 0;
  @observable
  jsonString = '';
  @observable
  exampleObject = {};
  @observable
  model = { properties: {} } as any;
  @observable
  propOnEdit: IModelProperty = null;
  @observable
  propOnHold: IModelProperty = null;

  componentWillReceiveProps(nextProps: Props) {
    console.log(`nextProps`, nextProps);
    const { model, example } = nextProps;
    if (!isEmpty(example)) {
      if (isPlainObject(example)) {
        this.jsonString = JSON.stringify(example, null, 2);
      } else {
        this.jsonString = example;
      }
      this.currentStep = 1;
    } else {
      this.jsonString = '';
    }
    this.model = nextProps.model;
    this.forceUpdate(); // ?？？不知道什么意思
    console.log('will receive props!');
  }

  componentDidMount() {
    // console.log(this.props);
    const { model, example } = this.props;
    if (!isEmpty(example)) {
      if (isPlainObject(example)) {
        this.jsonString = JSON.stringify(example, null, 2);
      } else {
        this.jsonString = example;
      }
      this.currentStep = 1;
    } else {
      this.jsonString = '';
    }
    this.model = model;

    // 直接跳过step1,直接到step2
    this.exampleObject = {
      username2: 'gpd',
      books: [{ name: 'js', title: 'js' }, { name: 'js', title: 'js' }, { name: 'js', title: 'js' }],
      coat: { color: 'red', size: { level1: 150, level2: 160 } }
    };
    this.exampleObject = {
      name: 'gpd',
      age: 20,
      isMale: true,
      hate: ['asdf', 'adsfadf', 'asfdasdf'],
      favorites: [{ name: 'read', time: 20 }, { name: 'basketball', time: 20 }, { name: 'music', time: 20 }],
      coat: {
        color: 'red',
        size: 170
      }
    };
    this.handleNext();
  }

  render() {
    const { title, properties } = this.model || ({} as any);

    const steps = [
      {
        title: '输入 JSON 数据样例',
        content: (
          <div style={{ width: 500, height: 300, display: 'flex' }}>
            <CodeMirror
              value={this.jsonString}
              options={{
                mode: 'application/json',
                tabSize: 2,
                theme: 'neat',
                lineNumbers: true
              }}
              onChange={(editor, data, value) => {
                try {
                  this.exampleObject = hjson.parse(value);
                  console.log(`exampleObject`, toJS(this.exampleObject));
                } catch (e) {}
              }}
              onBlur={(e) => {
                if (this.exampleObject) {
                  this.jsonString = JSON.stringify(this.exampleObject, null, 2);
                }
              }}
            />
          </div>
        )
      },
      {
        title: '编辑具体属性',
        content: (
          <div className="model-wrapper">
            <div className="model-edit">
              <Button type="primary" onClick={() => this.handleAddTopProp()}>
                增加顶级属性
              </Button>
            </div>
            <div className="model-props">
              {!isEmpty(properties) &&
                Object.getOwnPropertyNames(properties).map((key, index) => {
                  let prop = properties[key];
                  return (
                    <PropertyRow
                      key={index}
                      prop={prop}
                      onClick={this.handleEditProp}
                      onDeleteClick={this.handleDeleteProp}
                      onPropChange={this.handlePropChange}
                      // onPropAdd={this.handleSubPropAdd}
                    />
                  );
                })}

              <Modal
                title="编辑属性"
                visible={!!this.propOnEdit}
                onOk={this.handlePopupPropOk}
                onCancel={() => this.handleEditProp(null)}
              >
                <PropertyEditor prop={this.propOnEdit} onPropChange={this.handlePropOnHoldChange} />
              </Modal>
              {/* <pre>{JSON.stringify(model, null, 2)}</pre> */}
            </div>
          </div>
        )
      },
      {
        title: '预览生成表单',
        content: (
          // <ModelForm
          //   model={this.model}
          //   value={{
          //     username: 'PeiSong',
          //     tags: ['a', 'b'],
          //     male: true,
          //     address: {
          //       unit: 24,
          //       owner: {
          //         firstName: 'PeiSong',
          //         lastName: 'Xiong'
          //       }
          //     },
          //     addresses: [
          //       {
          //         unit: 23,
          //         street: 'abcde'
          //       },
          //       {
          //         street: 'absdfsasdf'
          //       }
          //     ]
          //   }}
          //   whenChange={console.log}
          // />
          <div />
        )
      }
    ];

    if (this.currentStep === 0) {
    }

    return (
      <div>
        {title && <h1>{title}</h1>}
        <div>
          <Steps current={this.currentStep}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[this.currentStep].content}</div>
          <div className="steps-action">
            {this.currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => this.handleNext()}>
                下一步
              </Button>
            )}
            {/* {
              this.currentStep === steps.length - 1
              &&
              <Button type="primary" onClick={() => message.success('Processing complete!')}>保存</Button>
            } */}
            {this.currentStep > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.handlePrev()}>
                上一步
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  handleJsonUpdate = (data: string | object): void => {
    console.log(data);
  };

  handleNext = (): void => {
    if (++this.currentStep === 1) {
      const data = this.exampleObject;
      if (isArray(data) || isPlainObject(data)) {
        const schema = GenerateSchema.json('User', data);
        this.model = Model.parseModel(data as object, 'User');
        console.log('object updated', data, schema);
        // this.props.onModelChange(toJS(this.model), toJS(this.exampleObject));
      }
    }
  };

  handlePrev = (): void => {
    this.currentStep--;
  };

  handleAddTopProp = (prop: IModelProperty = null) => {
    const fieldName = prompt('field name');
    if (!fieldName) {
      return;
    }
    if (!prop) {
      prop = {
        field: fieldName,
        type: PropertyType.string,
        path: []
      };
    }
    this.model.properties[fieldName] = prop;
  };

  handleEditProp = (prop: IModelProperty) => {
    console.log(prop);
    this.propOnEdit = prop;
  };

  handleDeleteProp = (prop: IModelProperty) => {
    unset(this.model.properties, prop.path.slice(2));
    // this.props.onModelChange(toJS(this.model), toJS(this.exampleObject));
  };

  handlePropChange = (prop: IModelProperty) => {
    assign(this.propOnEdit, toJS(prop));
    console.log('updated prop', toJS(prop), toJS(this.propOnEdit));
    // this.props.onModelChange(toJS(this.model), toJS(this.exampleObject));
  };

  handlePropOnHoldChange = (prop: IModelProperty): void => {
    this.propOnHold = prop;
  };

  handlePopupPropOk = (): void => {
    this.handlePropChange(this.propOnHold);
    this.propOnEdit = null;
    this.propOnHold = null;
  };
}

export default observer(ModelEditor);
