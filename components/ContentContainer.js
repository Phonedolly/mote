import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import InputBlock from "./InputEntry";
import getCaretPosition from "@/utils/getCaretPosition";
import Block from "./blocks/Block";

const outfit = Outfit({ subsets: ['latin'] });
const notoSansKR = Noto_Sans_KR({ subsets: [], weight: ['400', '700'] });

export const Container = styled.div.attrs({ key: v4() })`
  font-family: ${outfit.className} ${notoSansKR.className};
  margin: 0;
`;

const ContentContainerWithoutLogic = styled.div.attrs({ key: v4() })`
  margin: 0 auto;
  width: 70vw;
  `;

export const ContentContainer = (props) => {
  const { dom, setDom } = props;
  const refContentContainer = useRef();

  return (
    <ContentContainerWithoutLogic ref={refContentContainer}>
      {dom.blocks.map((block, i) => (
        <Block lineNo={i} key={v4()} block={block} dom={dom} setDom={setDom}/>
      ))}
    </ContentContainerWithoutLogic>
  )
}