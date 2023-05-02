import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import InputEntry from "./InputEntry";

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
  const ref_InputEntry = useRef();
  const [intermediateData, setIntermediateData] = useState({ lastCurLine: 0, lastInput: "" });
  const [currentRawData, setCurrentRawData] = useState("");
  const [curLineNo, setCurLineNo] = useState(0);
  const [lastEvent, setLastEvent] = useState({});

  return (
    <ContentContainerWithoutLogic ref={refContentContainer}>
      {dom.blockData.map((rawData, i) => {
        if (i === dom.curLine.value) {
          return (
            <InputEntry
              key={v4()}
              dom={dom}
              setDom={setDom}
              lineNo={i}
              currentRawData={rawData}
              setCurrentRawData={setCurrentRawData}
              setLastEvent={setLastEvent}
              ref_InputEntry={ref_InputEntry}
            >
            </InputEntry>)
        }
        else {
          return (
            <div
              key={v4()}
              lineno={i}
              onClick={(e) => {
                /* save current input block and set new block line */
                setDom(prev => ({
                  blockData: prev.blockData.map((el, j) => (j === dom.curLine.value ? prev.blockData[i] = ref_InputEntry.current.innerText : el
                  )),
                  curLine: { value: i },
                }))
              }
              }
            >{rawData.length === 0 ? <br /> : rawData}</div>
          )
        }
      })}
    </ContentContainerWithoutLogic>
  )
}