import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import FindPwComplete from '../../component/login/FindPwComplete';

export default function FindPwCompletePage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <FindPwComplete/>
        </>
    );
}
