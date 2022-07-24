import { useEffect } from "react";

//css
import styled from "styled-components"

// component
import FindId from '../../component/login/FindId';

export default function FindIdPage() {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <>
            <FindId/>
        </>
    );
}
