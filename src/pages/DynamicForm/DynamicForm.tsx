import * as React from 'react';

import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';

import { JsonSchemaModel, Model, JsonSchemaType } from '../../components/ModelEditor/Model';

interface Props {}

interface State {}

@observer
class DynamicForm extends React.Component<Props, State> {
  @observable
  inputJsonData = {};
  @observable
  dynamicJsonSchema: JsonSchemaModel = null;

  componentWillReceiveProps(nextProps: Props) {
    console.log('will receive props!');
  }

  componentDidMount() {
    console.log('mounted component');
  }

  render() {
    return <div>动态表单生成</div>;
  }
}

export default DynamicForm;
