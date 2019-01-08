import * as React from 'react';

import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { buildYup } from 'json-schema-to-yup';

import { JsonSchemaModel, Model, JsonSchemaType } from '../../components/ModelEditor/Model';

interface Props {}

interface State {}

@observer
class PreviewForm extends React.Component<Props, State> {
  @observable
  dynamicJsonSchema = null;
  @observable
  errorMessagesConfig = {};

  componentWillReceiveProps(nextProps: Props) {
    console.log('will receive props!');
  }

  async componentDidMount() {
    this.errorMessagesConfig = {
      errMessages: {
        age: {
          required: 'A person must have an age'
        },
        email: {
          required: 'You must enter an email address',
          format: 'Not a valid email address'
        }
      }
    };
    this.dynamicJsonSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: 'http://example.com/person.schema.json',
      title: 'Person',
      description: 'A person',
      type: 'object',
      properties: {
        name: {
          description: 'Name of the person',
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        fooorbar: {
          type: 'string',
          matches: '(foo|bar)'
        },
        age: {
          description: 'Age of person',
          type: 'number',
          exclusiveMinimum: 0,
          required: true
        },
        characterType: {
          enum: ['good', 'bad'],
          enum_titles: ['Good', 'Bad'],
          type: 'string',
          title: 'Type of people',
          propertyOrder: 3
        }
      },
      required: ['name', 'email']
    };

    const yupSchema = buildYup(this.dynamicJsonSchema, this.errorMessagesConfig);
    // const valid = await yupSchema.isValid({
    //   name: 'jimmy',
    //   age: 24
    // });

    // console.log({
    //   valid
    // });

    console.log('mounted component');
  }

  render() {
    return <div>Formik 生成</div>;
  }
}

export default PreviewForm;
