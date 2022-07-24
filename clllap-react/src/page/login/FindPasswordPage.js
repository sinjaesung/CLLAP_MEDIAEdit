import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import FindPassword from '../../component/login/FindPassword';

export default function FindPasswordPage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <FindPassword/>
        </>
    );
}
