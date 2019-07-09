import Validators from 'redux-form-validators';
import configureValidators from './configureValidators';

describe('Validators', () => {
  it('configures validators', () => {
    configureValidators();
    expect(Validators.messages.email).toEqual('Please enter valid email address');
  });
});
