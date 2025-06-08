import React from 'react';

const TextAreaInput = ({ value, onChange, placeholder = '', rows = 4, cols = 50, name = '', ...props }) => {
  return (
    <div className="textarea-input">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        name={name}
        {...props}
      />
    </div>
  );
};

export default TextAreaInput;
