import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./styles.css";

function MyForm({fields=[], initialValues, onSubmit, buttonText, children, layout='inline',inputStyle,buttonStyle,width=150}) {
    const [passwordVisibility, setPasswordVisibility] = useState({});

     const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    }

    const getFieldsContainerStyle = () => {
        const baseStyle = {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: 50
        };
        //Custome style for feilds
        if (layout === 'inline') {
            return {
                ...baseStyle,
                justifyContent: 'center'
            };
        } else {
            return {
                ...baseStyle,
                flexDirection: 'column',
                alignItems: 'center'
            };
        }
    };

    return (
        <div className="container">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {(props) => (
                    <Form>
                        <ErrorMessage name="dropdown" component="div" className="alert alert-warning" />

                        <div style={getFieldsContainerStyle()}>
                            {fields.map((field, index) => (
                                <fieldset key={index} className="form-group" style={{ margin: '10px', border: 'none', width: layout === 'inline' ? 'auto' : '100%', maxWidth: '250px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Field
                                            type={field.type === 'password' && passwordVisibility[field.name] ? 'text' : field.type}
                                            name={field.name}
                                            className="form-control"
                                            placeholder={`Enter ${field.label}`}
                                            style={{
                                                ...inputStyle,
                                                width: '100%',
                                                borderTop: "none",
                                                borderLeft: "none",
                                                borderRight: "none",
                                                borderBottom: "2px solid #ccc",
                                                borderRadius: "none",
                                                display: "inline-block",
                                                marginRight: "10px"
                                            }}
                                        />
                                        {field.type === 'password' && (
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility(field.name)}
                                                style={{
                                                    ...buttonStyle,
                                                    width: '10%',
                                                    borderTop: "none",
                                                    borderLeft: "none",
                                                    borderRight: "none",
                                                    borderBottom: "2px solid #ccc",
                                                    borderRadius: "none",
                                                    position:"absolute",
                                                    top:0,
                                                    right:0,
                                                    background:"none",
                                                    height:"100%",
                                                    display: "inline-block",
                                                    marginRight: "10px"
                                                }}
                                            >
                                                {passwordVisibility[field.name] ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        )}
                                    </div>
                                    <ErrorMessage name={field.name} component="div" className="alert alert-warning" />
                                </fieldset>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: "10px", marginBottom: "30px" }}>
                            <button className="buttonT" type="submit" style={{  ...buttonStyle, background: "linear-gradient(45deg, #f321bf, #ebe1e4)", borderRadius: "20px" }}>{buttonText}</button>
                            {children} 
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


export default MyForm;



