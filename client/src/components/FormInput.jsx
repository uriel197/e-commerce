const FormInput = ({ label, name, type, value, size, accept, onChange }) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type === "file" ? "file" : type} // Handle file input type
        name={name}
        value={value}
        onChange={onChange}
        className={`input input-bordered ${size}`}
        accept={accept ? accept : undefined} // Add accept attribute for file inputs
      />
    </div>
  );
};

export default FormInput;
