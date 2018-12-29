import { Model, IModelProperty } from './Model';
import { testModel } from './Model.data';

test('new model', () => {
  const model = new Model('User', ['User'], {}, {} as IModelProperty);
  expect(model.field).toBe('User');

  const m = Model.parseObjectProp([], testModel, 'User');
  console.log(JSON.stringify(m, null, 2));
});
