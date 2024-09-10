import React, { useEffect } from "react";
import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";
import { useState } from "react";



   const getUserEmail=async(id)=>{
    try{

        const response= await axios.get(`${API_BASE_URL}user/${id}` );

        return response.data;

    }
    catch (error) {
        console.error("Role check error:", error.response ? error.response.data : error.message);
        
    }
}
   
    const GetRoles=async (token)=> {
        try {
            const roleResponse = await axios.get(
                API_BASE_URL + 'roles',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
          
         
            return roleResponse.data;

        } catch (error) {
            console.error("Role check error:", error.response ? error.response.data : error.message);
            
        }
    }

    const GetRolesById=async(token,id)=>{
        try{

            const idResponse=await axios.get(`${API_BASE_URL}roles/${id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("id response",idResponse.data);

            return idResponse.data;

        }catch(error){
            console.error("Role with id check error:", error.response ? error.response.data : error.message);
        }
    };

    const createRole=async (roleName,token)=>{
        try{
            const roleCreate=await axios.post(`${API_BASE_URL}roles`,
            roleName,
            {
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("role :",roleCreate.data);
            return roleCreate.data;

        }catch(error){
            console.error("Role Create error:", error.response ? error.response.data : error.message);
        }
    }
    const deleteRole=async(token,id)=>{
        try{

            const roleDelete=await axios.delete(`${API_BASE_URL}roles/${id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Role response:",roleDelete.data);

            return roleDelete.data;

        }catch(error){
            console.error("Role Delete error:", error.response ? error.response.data : error.message);
        }
    }
    const updateRole=async(token,id,newRole)=>{
        try{

            const roleUpdate=await axios.put(`${API_BASE_URL}roles/${id}`,
            {
                RoleId:id,
                NewRoleName:newRole
            },
            {
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("respose",roleUpdate.data)

            return roleUpdate.data;

        }catch(error){
            console.error("Role Update rror:", error.response ? error.response.data : error.message);
        }

    }


    const assignRole=async(token,id,roleName)=>{
        try{

            const roleAssign=await axios.post(`${API_BASE_URL}roles/${id}`,
            {
                UserId :id,
                leName :roleName
            },
            {
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("respose",roleAssign.data);

            return roleAssign.data;

        }catch(error){
            console.error("Role Assign error:", error.response ? error.response.data : error.message);
        }

    }


export{ GetRoles,GetRolesById,createRole,deleteRole,updateRole,assignRole,getUserEmail};

