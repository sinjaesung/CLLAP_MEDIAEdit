import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import Login from '../../component/login/Login';

export default function LoginPage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <Login/>
        </>
    );
}
