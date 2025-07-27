import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);
};
