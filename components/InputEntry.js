import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";
import { useEffect, useRef, useState } from 'react';

const PopupMenuWithoutLogic = styled.div`
  position: fixed;
  top: ${props => `${props.position.top + 16}px`};
  left: ${props => `${props.position.left}px`};
  width: 6rem;
  padding: 0px 6px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`
export const PopupMenu = (props) => {
  return (
    <PopupMenuWithoutLogic position={props.position} ref={props.innerRef}>
      <p>asdfasdfadsfasdf</p>
      <p>asdfadf</p>
    </PopupMenuWithoutLogic>
  );
}

const _InputEntryWithoutLogic = styled.div`
  width: ${props => props.width ? props.width : 'auto'};
  /* width:fit-content; */
  height: 2.5rem;
  border: none;
  ::-webkit-textfield-decoration-container{
    appearance:none;
  }
  border-bottom: 1px solid black;
  font-size: 1rem;
  padding: 0px 0px;
  margin: 0px 0px;
  :focus {
    outline: none;
  }
  `
const _InputEntry = (props) => {
  const refInputEntry = useRef(null);
  const refPopupMenu = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [curCaretPos, setCurCaretPos] = useState({ top: 0, left: 0 });
  const [lastInputChar, setLastInputChar] = useState("");
  const [rawText, setRawText] = useState("");
  // console.log('received');



  function getPositionAfterOneChar(e) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);

    const rect = range.getClientRects()[0];
    // console.log(rect);
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
    setLastInputChar(e.key);
  }

  function getPositionAtNoChar(e) {
    const rect = refInputEntry.current.getBoundingClientRect();
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
    setLastInputChar(e.key);
  }

  useEffect(() => {
    function determineShowPopup(e) {
      const curPopupPos = refPopupMenu.current.getBoundingClientRect();
      console.log(e);
    }
    addEventListener('click', (e) => {
      if (showPopup === false && !refPopupMenu.current) {
        return
      }
      const curPopupPos = refPopupMenu.current?.getBoundingClientRect();
      if (!curPopupPos) {
        return;
      }
      if (e.offsetX < curPopupPos.left
        || e.offsetX > curPopupPos.left + getComputedStyle(refPopupMenu.current).width.split("px")[0]
        || e.offsetY < curPopupPos.top
        || e.offsetY > curPopupPos.top + getComputedStyle(refPopupMenu.current).height.split("px")[0]) {
        console.log('e.offsetX < curPopupPos.left');
        console.log(e.offsetX, curPopupPos.left);
        console.log(e.offsetX > curPopupPos.left + getComputedStyle(refPopupMenu.current).width.split("px")[0]);
        console.log(e.offsetY < curPopupPos.top);
        console.log(e.offsetY > curPopupPos.top + getComputedStyle(refPopupMenu.current).height.split("px")[0]);
        setShowPopup(false);
      }
      // console.log(e);
    });

    return removeEventListener('click', determineShowPopup);
  }, [showPopup])
  useEffect(() => {
    if (lastInputChar == "/") {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [lastInputChar])
  return (
    <>
      <_InputEntryWithoutLogic ref={refInputEntry} contentEditable onKeyDown={(e) => {
        if (rawText.length > 0) {
          getPositionAfterOneChar(e);
        } else {
          getPositionAtNoChar(e);
        }
      }}
        onFocus={(e) => {
          if (showPopup === true) {
            return;
          }
          if (rawText.length > 0) {
            getPositionAfterOneChar(e);
          } else {
            getPositionAtNoChar(e);
          }
        }
        } onInput={(e) => {
          setRawText(e.target.textContent);
          console.log(e.target.textContent);
        }} />
      {showPopup === true ? <PopupMenu position={curCaretPos} innerRef={refPopupMenu} /> : null}
    </>
  )
}

const InputEntryWithoutLogic = styled.div`
  border: 1px solid black;
`
const InputEntry = (props) => {
  return (
    <InputEntryWithoutLogic>
      <_InputEntry {...props} />
    </InputEntryWithoutLogic>
  )
}

export default InputEntry;
