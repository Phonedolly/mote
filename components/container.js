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

  useEffect(() => {
    const e = lastEvent?.event;
    switch (lastEvent.event?.key) {
      case "Enter":
        e.preventDefault();
        /* Save current value and generate new div, and go to it */
        setDom(prev => ({
          blockData: prev.blockData
            .map((el, i) => {
              if (i === prev.curLine.value) {
                return lastEvent.rawData
              }
              return el;
            }).concat(""),
          curLine: { value: prev.curLine.value + 1, lastArrowAction: "ENTER" }
        }));
        setCurLineNo(prev => prev + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (dom.curLine.value === 0) {
          return;
        }
        setDom(prev => ({
          blockData: prev.blockData.map((el, i) => {
            if (i === prev.curLine.value) {
              return lastEvent.rawData
            }
            return el;
          }),
          curLine: { value: prev.curLine.value - 1, lastArrowAction: "UP" }
        }));
        setCurLineNo(prev => prev - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        setDom(prev => ({
          blockData: prev.blockData.map((el, i) => {
            if (i === prev.curLine.value) {
              return lastEvent.rawData
            }
            return el;
          }),
          curLine: { value: prev.curLine.value + 1, lastArrowAction: "DOWN" }
        }));
        setCurLineNo(prev => prev + 1);
        break;
      default:
        break;
    }
  }, [lastEvent, setDom])

  useEffect(() => {

  }, [dom, curLineNo])
  return (
    <ContentContainerWithoutLogic ref={refContentContainer}>
      {dom.blockData.map((rawText, i) => {
        if (i === curLineNo) {
          return (
            <InputEntry
              key={v4()}
              dom={dom}
              setDom={setDom}
              lineNo={i}
              currentRawData={rawText}
              setCurrentRawData={setCurrentRawData}
              setLastEvent={setLastEvent}
            >
            </InputEntry>)
        }
        else {
          return (
            <div
              key={v4()}
              lineno={i}
            >{rawText.length === 0 ? <br /> : rawText}</div>
          )
        }
      })}
    </ContentContainerWithoutLogic>
  )
}