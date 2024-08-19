import React from 'react';
import { useState } from 'react';
import { Formik, useFormik,Form,Field,ErrorMessage } from 'formik';
import "./styles.css";
import { FaAvianex } from 'react-icons/fa6';
import {validName,validPassword,validEmail,validPhone} from "../Helpers/Validation.js";

function MyForm({fields=[],initialValues,onSubmit,dropdownOptions = [],buttonText}){
    const[isDropdownOpen,setIsDropDownOpen]=useState(false);
    const toggleDropdown=()=>{
        setIsDropDownOpen(!isDropdownOpen);
    }
    return(
        <div className="container" style={{background:"red"}}>

            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                 {(props)=>(
                    <Form>

{dropdownOptions.length>0&&<div className="dropdown" style={{width:250,display:"inline-block",border:"5px solid green",marginLeft:"180px"}}>
                            <button type="button" className="btn btn-light" onClick={toggleDropdown} style={{height:40}} >
                                Select Option <span>{isDropdownOpen ? '▲' : '▼'}</span>
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu show">
                                    {dropdownOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => {
                                                props.setFieldValue('dropdown', option.value);
                                                setIsDropDownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>}
                        <ErrorMessage name="dropdown" component="div" className="alert alert-warning" />

                        {fields.map((field, index) => (
                            <fieldset key={index} className="form-group" style={{ display: 'flex', alignItems: 'center', marginLeft: 30 ,marginBottom:30}}>
                                <label style={{width:150 }}>{field.label}</label>
                                <Field
                                    type={field.type}
                                    name={field.name}
                                    className="form-control"
                                    style={{width:250}}
                                    
                                />
                                <ErrorMessage name={field.name} component="div" className="alert alert-warning" />
                            </fieldset>
                        ))}

                        <div>
                            <button className="buttonT" type="submit" style={{width:150,position:"relative",right:"-20px",background: "linear-gradient(45deg, #f321bf, #ebe1e4)",borderRadius:"20px"}}>{buttonText}</button>
                        </div>
                    </Form>
                 )}
            </Formik>
        </div>
    )

}
export default MyForm;

