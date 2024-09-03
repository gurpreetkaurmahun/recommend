// import React from 'react';
// import { useState } from 'react';
// import { Formik, useFormik,Form,Field,ErrorMessage } from 'formik';
// import "./styles.css";
// import { FaAvianex } from 'react-icons/fa6';
// import {validName,validPassword,validEmail,validPhone} from "../Helpers/Validation.js";

// function MyForm({fields=[],initialValues,onSubmit,dropdownOptions = [],buttonText,children}){
//     const[isDropdownOpen,setIsDropDownOpen]=useState(false);
//     const toggleDropdown=()=>{
//         setIsDropDownOpen(!isDropdownOpen);
//     }
//     return(
//         <div className="container" >

//             <Formik
//                 initialValues={initialValues}
//                 onSubmit={onSubmit}
//                 validateOnBlur={false}
//                 validateOnChange={false}
//             >
//                  {(props)=>(
//                     <Form>


//                         <ErrorMessage name="dropdown" component="div" className="alert alert-warning" />

//                         <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',marginTop:50 }}>
//                             {fields.map((field, index) => (
//                                 <fieldset key={index} className="form-group" style={{ margin: '10px', border: 'none' }}>
//                                     <Field
//                                         type={field.type}
//                                         name={field.name}
//                                         className="form-control"
//                                         placeholder={`Enter ${field.label}`}
//                                         style={{
//                                             width: 250,
//                                             borderTop: "none",
//                                             borderLeft: "none",
//                                             borderRight: "none",
//                                             borderBottom: "2px solid #ccc",
//                                             borderRadius: "none",
//                                             display: "inline-block",
//                                             marginRight: "10px"
//                                         }}
//                                     />
//                                     <ErrorMessage name={field.name} component="div" className="alert alert-warning" />
//                                 </fieldset>
//                             ))}
//                         </div>


//                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',marginTop:"10px",marginBottom:"30px" }}>
//                             <button className="buttonT" type="submit" style={{ width: 150, background: "linear-gradient(45deg, #f321bf, #ebe1e4)", borderRadius: "20px" }}>{buttonText}</button>
//                             {children} 
//                         </div>
//                     </Form>
//                  )}
//             </Formik>
//         </div>
//     )

// }
// export default MyForm;
import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "./styles.css";

function MyForm({fields=[], initialValues, onSubmit, dropdownOptions=[], buttonText, children, layout='inline'}) {
    const [isDropdownOpen, setIsDropDownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropDownOpen(!isDropdownOpen);
    }

    const getFieldsContainerStyle = () => {
        const baseStyle = {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: 50
        };

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
                                    <Field
                                        type={field.type}
                                        name={field.name}
                                        className="form-control"
                                        placeholder={`Enter ${field.label}`}
                                        style={{
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
                                    <ErrorMessage name={field.name} component="div" className="alert alert-warning" />
                                </fieldset>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: "10px", marginBottom: "30px" }}>
                            <button className="buttonT" type="submit" style={{ width: 150, background: "linear-gradient(45deg, #f321bf, #ebe1e4)", borderRadius: "20px" }}>{buttonText}</button>
                            {children} 
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default MyForm;
