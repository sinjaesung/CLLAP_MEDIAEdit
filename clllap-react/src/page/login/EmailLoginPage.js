import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import EmailLogin from '../../component/login/EmailLogin';

export default function EmailLoginPage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <EmailLogin/>
        </>
    );
}
