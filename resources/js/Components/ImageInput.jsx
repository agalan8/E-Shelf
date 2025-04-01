import React, { useState, useEffect } from 'react';

const ImageInput = ({ name, label, onChange, initialImage }) => {
    const [imagePreview, setImagePreview] = useState(initialImage);

    useEffect(() => {
        setImagePreview(initialImage);
    }, [initialImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            onChange(file);
        }
    };

    return (
        <div className="image-input">
            {label && <label htmlFor={name}>{label}</label>}
            <input
                type="file"
                name={name}
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload"
            />
            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Preview" width="100" />
                </div>
            )}
        </div>
    );
};

export default ImageInput;
