const storeToken = (value)=>{
    localStorage.setItem('token',value)
}

const removeToken = ()=>{
    localStorage.removeItem('token')
} 

const getToken = () =>{
    
    let token = localStorage.getItem('token');
    return token;
}


export {storeToken,removeToken,getToken}