import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import SignUpComplete from '../../component/login/SignUpComplete';

export default function SignUpCompletePage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <SignUpComplete/>
        </>
    );
}
