import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const PopupMenuWithoutLogic = styled(motion.div)`
  display: ${props => props.display ? 'none' : 'block'};
  position: fixed;
  top: ${props => `${props.position.top + 16}px`};
  left: ${props => `${props.position.left}px`};
  width: 6rem;
  padding: 0px 6px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 4px;
  z-index: 999;
  background-color: white;
`
export const PopupMenu = (props) => {
  return (
    <AnimatePresence>
      <PopupMenuWithoutLogic key={v4()}
        position={props.position}
        display={props.hidden}
        ref={props.innerRef}
        initial={{ opacity: 0, scaleX: 0.5, scaleY: 0.5, transformOrigin: "left" }}
        animate={{ opacity: 1, scaleX: 1, scaleY: 1, transition: { duration: 0.28, ease: "backInOut" } }}
        exit={{ opacity: 0, scaleX: 0.5, scaleY: 0.5, transformOrigin: "left", transition: { duration: 0.28, ease: "backInOut" } }}>
        <p>asdfasdfadsfasdf</p>
        <p>asdfadf</p>
      </PopupMenuWithoutLogic>
    </AnimatePresence>

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
  const refPopupMenu = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [curCaretPos, setCurCaretPos] = useState({ top: 0, left: 0 });
  const [rawText, setRawText] = useState("");

  function getPositionAfterOneChar(e) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getClientRects()[0];
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
  }

  function getPositionAtNoChar(e) {
    const rect = refPopupMenu.current?.getBoundingClientRect();
    if (!rect) {
      console.log('react is null');
      return;
    }
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
  }

  useEffect(() => {
    function determineClosePopup(e) {
      console.log(e);
      if (showPopup === false || !refPopupMenu?.current) {
        console.log(showPopup);
        console.log(refPopupMenu.current);
        console.log('somthing wrong');
        return
      }
      const curPopupPos = refPopupMenu.current?.getBoundingClientRect();
      if (!curPopupPos) {
        console.log('!curPopupPos');
        return;
      }
      if (e.offsetX < curPopupPos.left
        || e.offsetX > curPopupPos.left + getComputedStyle(refPopupMenu.current).width.split("px")[0]
        || e.offsetY < curPopupPos.top
        || e.offsetY > curPopupPos.top + getComputedStyle(refPopupMenu.current).height.split("px")[0]) {
        setShowPopup(false);
      }
    }
    document.addEventListener('click', determineClosePopup);

    return () => {
      document.removeEventListener('click', determineClosePopup);
    }
  }, [showPopup]);

  return (
    <>
      <_InputEntryWithoutLogic contentEditable onKeyDown={(e) => {
        if (rawText.length > 0) {
          getPositionAfterOneChar(e);
        } else {
          getPositionAtNoChar(e);
        }
        if (e.key === '/') {
          setShowPopup(true);
        } else {
          setShowPopup(false);
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
      <PopupMenu position={curCaretPos} innerRef={refPopupMenu} hidden={!showPopup} />
      {/* {showPopup === true ? null : null} */}
    </>
  )
}

const InputEntryWithoutLogic = styled.div`
  border: 1px solid black;
`
const InputEntry = (props) => {
  return (
    <InputEntryWithoutLogic>
      <_InputEntry />
    </InputEntryWithoutLogic>
  )
}

export default InputEntry;
