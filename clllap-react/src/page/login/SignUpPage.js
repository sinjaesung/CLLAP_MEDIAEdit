import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import SignUp from '../../component/login/SignUp';

export default function SignUpPage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <SignUp/>
        </>
    );
}
