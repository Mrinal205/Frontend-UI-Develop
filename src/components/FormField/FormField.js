import React from 'react';
import { Select } from 'components/Select/Select';

const TextField = props => {
  const { meta = {} } = props;

  const inputProps = {
    type: props.type || 'text',
    className: 'form__input',
    name: props.input.name,
    id: props.input.name,
    readOnly: props.readOnly,
    autoFocus: props.autoFocus,
    autoComplete: props.autoComplete,
    placeholder: props.placeholder,
    maxLength: props.maxLength,
    value: meta.uncontrolled ? undefined : props.input.value,
    defaultValue: meta.uncontrolled ? props.defaultValue : undefined,
    onChange: props.input.onChange
  };

  return (
    <React.Fragment>
      {props.label && (
        <label htmlFor={props.input.name} className="form__label">
          {props.label}
          {props.required ? ' *' : null}
        </label>
      )}
      <input {...inputProps} />
      {meta.touched && meta.error ? <div className="form__field-error">{meta.error}</div> : null}
    </React.Fragment>
  );
};

const CheckBox = props => {
  const { meta = {} } = props;

  const checboxProps = {
    type: 'checkbox',
    className: 'form__checkbox',
    name: props.input.name,
    id: props.input.name,
    value: props.input.value ? props.input.value : props.input.name,
    defaultChecked: meta.uncontrolled ? props.defaultChecked : undefined,
    onChange: props.input.onChange,
    checked: props.input.checked
  };

  return (
    <React.Fragment>
      <input {...checboxProps} />
      <label className="form__checkbox-label" htmlFor={props.input.name}>
        {props.label}
      </label>
      {meta.touched && meta.error ? <div className="form__field-error">{meta.error}</div> : null}
    </React.Fragment>
  );
};

const SelectField = props => {
  const { meta = {} } = props;

  const selectProps = {
    ...props,
    className: 'form__select',
    name: props.input.name,
    id: props.input.name
  };

  return (
    <React.Fragment>
      {props.label && (
        <label htmlFor={props.input.name} className="form__label">
          {props.label}
          {props.required ? ' *' : null}
        </label>
      )}
      <Select {...selectProps} />
      {meta.touched && meta.error ? <div className="form__field-error">{meta.error}</div> : null}
    </React.Fragment>
  );
};

const FormField = props => {
  switch (props.type) {
    case 'checkbox':
      return <CheckBox {...props} />;
    case 'select':
      return <SelectField {...props} />;
    case 'input':
    default:
      return <TextField {...props} />;
  }
};

export { TextField, CheckBox, FormField, SelectField };
