



import React from 'react';
import { useState } from 'react';
import { Formik, useFormik,Form,Field,ErrorMessage } from 'formik';
import * as Yup from "yup";
import { FaAvianex } from 'react-icons/fa6';
import {validName,validPassword,validEmail,validPhone} from "../Helpers/Validation.js";



function MyForm({fields=[],initialValues,onSubmit}){
    return(
        <div className="container">

            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                 {(props)=>(
                    <Form>
                        {fields.map((field, index) => (
                            <fieldset key={index} className="form-group">
                                <label>{field.label}</label>
                                <Field
                                    type={field.type}
                                    name={field.name}
                                    className="form-control"
                                    
                                />
                                <ErrorMessage name={field.name} component="div" className="alert alert-warning" />
                            </fieldset>
                        ))}
                        <div>
                            <button className="btn btn-success m-5" type="submit">Save</button>
                        </div>
                    </Form>
                 )}
            </Formik>
        </div>
    )

}
export default MyForm;

// function MyForm(){
//     const[email,setEmail]=useState("");
//     const[password,setPassword]=useState("");

//     const initialValues={
//         email:"",
//         password:"",
//         fname:"",
//         lname:""
//     }

//     function handleSubmit(values){
//         console.log("Values",values.email);
//     }

//     function validateValues(values){
//         let errors={};

//         if(!validPassword(values.password)){
//             errors.password="Enter Valid password";
//         }

//         return errors;
//     }

//     return(
//         <div className='container'>
//             <Formik 
//             initialValues={initialValues}
//             enableReinitialize={true}
//             onSubmit={handleSubmit}
//             validate={validateValues}
//             validateOnChange={false}
//             validateOnBlur={false}
//             >
               
//                 {
//                     (props)=>(
//                         <Form>
//                             <ErrorMessage
//                             name="password"
//                             component="div"
//                             className="alert alert-warning"></ErrorMessage>


//                             <fieldset className='form-group'>
//                                 <label>Email</label>
//                                 <Field type="text" className="form-control"name="email"></Field>
//                             </fieldset>

//                             <fieldset className='form-group'>
//                                 <label>Password</label>
//                                 <Field type="text" className="form-control" name="password"></Field>
//                             </fieldset>
//                             <fieldset className='form-group'>
//                                 <label>Firstname</label>
//                                 <Field type="text"  className="form-control" name="fname"></Field>
//                             </fieldset>

//                             <fieldset className='form-group'>
//                                 <label>Lastname</label>
//                                 <Field type="text" className="form-control" name="lname"></Field>
//                             </fieldset>
//                             <div> <button className="btn btn-success m-5" type="submit"> Save </button></div>
//                         </Form>
//                     )
//                 }
//             </Formik>
//         </div>
//     )

// }

// export default MyForm;
// function MyForm(){

//     const[fname,SetFName]=useState("");
//     const[lname,SetLName]=useState("");
//     const[email,setEmail]=useState("");
//     const[password,setPassword]=useState("");

//     const formik=useFormik({
//         initialValues:{
//             fname:"",
//             lname:"",
//             email:"",
//             password:""
//         },
//         validationSchema:Yup.object({
//             fname:Yup.string().max(15,"Name cannot exceed 15 characters").required("Required"),

//         })
//         ,
//         onSubmit: (values)=>{
//             console.log(values)}
    
    
//     }
    
       
        
//     );

//     console.log(formik.values);

//     console.log("Formik errors",formik.errors);
//     return (
//         <div>
//         <form onSubmit={formik.handleSubmit}>
//         <label htmlFor="Name">
//         <input type="text" id="FirstName" onChange={formik.handleChange} name="fname" value={formik.values.fname} />
//         {formik.errors.fname?<p>{formik.errors.fname}</p>:null}
//         </label>
        

//         <label htmlFor="Name">
//         <input type="text" id="LastName" onChange={formik.handleChange}name="lname" value={formik.values.lname}/>
      
//         </label>

//         <label htmlFor="Email">
//         <input type="text" id="Email" onChange={formik.handleChange} name="email"/>
        
//         </label>


//     <label htmlFor="Password">
//     <input type="text" id="Password"  onChange={formik.handleChange}name="password"/>
//     Remember me <a href=""> Forgot password</a>
//     </label>

 

//     <button type="submit">Submit</button>
//         </form>

//         </div>
//     )

      
// }
// export default MyForm;

