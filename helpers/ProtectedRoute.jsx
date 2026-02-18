import {Navigate} from "react-router-dom";
import { useSelector } from 'react-redux';

//403 Error redirection

const ProtectedRoute=({children})=>{
    const {user}=useSelector((state)=>state.auth);
    if(!user){
        return <Navigate to="/unauthorized" replace/>;
    }
    return children;
}

export default ProtectedRoute