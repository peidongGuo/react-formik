import * as React from 'react';

import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';
import 'codemirror/mode/javascript/javascript';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { JsonSchemaModel, Model, JsonSchemaType } from '../../components/ModelEditor/Model';

interface Props {}

interface State {}

@observer
class InputJsonData extends React.Component<Props, State> {
  @observable
  inputJsonData = {};

  componentWillReceiveProps(nextProps: Props) {
    console.log('will receive props!');
  }

  componentDidMount() {
    console.log('mounted component');
  }

  render() {
    return (
      <div style={{ width: 500, height: 300, display: 'flex' }}>
        <CodeMirror
          value={this.inputJsonData.toString()}
          options={{
            mode: 'application/json',
            tabSize: 2,
            theme: 'neat',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            try {
              // this.exampleObject = hjson.parse(value);
              // console.log(`exampleObject`, toJS(this.exampleObject));
            } catch (e) {}
          }}
          onBlur={(e) => {
            //   if (this.exampleObject) {
            //     this.jsonString = JSON.stringify(this.exampleObject, null, 2);
            //   }
          }}
        />
      </div>
    );
  }
}

export default InputJsonData;
