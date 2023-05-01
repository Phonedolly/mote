import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";
import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const PopupMenuWithoutLogic = styled(motion.div)`
  display: ${props => props.show === "true" ? 'block' : 'none'};
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
        show={props.showPopup.toString()}
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
  const { dom, setDom, lineNo, setIntermediateData, children, setCurrentRawData, currentRawData, setLastEvent } = props;
  const refPopupMenu = useRef(null);
  const ref_InputEntry = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [curCaretPos, setCurCaretPos] = useState({ top: 0, left: 0 });
  const [rawText, setRawText] = useState(currentRawData);
  const [initialText, setInitialText] = useState(children);
  const [caret, setCaret] = useState(1);

  function getPositionAfterOneChar(e) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getClientRects()[0];
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
  }

  function getPositionAtNoChar(e) {
    const rect = ref_InputEntry.current?.getBoundingClientRect();
    if (!rect) {
      console.log('rect is null');
      return;
    }
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
  }

  useEffect(() => {
    function determineClosePopup(e) {
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
        setShowPopup(prev => false);
      }
    }
    document.addEventListener('click', determineClosePopup);

    return () => {
      document.removeEventListener('click', determineClosePopup);
    }
  }, [showPopup]);

  useEffect(() => {
    function save(actionType) {
      setDom(prev => ({
        rawData: prev.rawData.map((e, i) => {
          if (i === lineNo) {
            return rawText;
          }
          else {
            return e;
          }
        }),
        curLine: { value: lineNo, type: actionType },
      }))
    }
    /*
    https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    */
    function handleClickOutside(event) {
      if (ref_InputEntry.current && !ref_InputEntry.current.contains(event.target)) {
        alert("You clicked outside of me!");
        // setIntermediateData(({ lastCurLine: lineNo, lastInput: ref_InputEntry.current.innerText }))
        // save();
        setCurrentRawData(rawText);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [lineNo, setDom, rawText, setCurrentRawData])

  // useEffect(() => {
  //   ref_InputEntry.current.innerText = children
  // }, [children])


  // useEffect(() => {
  //   // ref_InputEntry.current.innerText = rawText;
  //   if (rawText.length === 0) {
  //     console.log(111);
  //     // ref_InputEntry.current.focus();
  //     return;
  //   }

  //   const target = ref_InputEntry.current;
  //   if (!target.childNodes || !target.childNodes[0]) {
  //     return;
  //   }
  //   console.log('start');
  //   const selection = window.getSelection();
  //   const range = document.createRange();

  //   // console.log(selection.anchorNode);


  //   range.setStart(target.childNodes[0], 1);
  //   range.collapse(true);
  //   selection.removeAllRanges();
  //   selection.addRange(range);
  //   console.log('worked');
  //   target.focus();
  // }, [rawText])

  return (
    <>
      <_InputEntryWithoutLogic
        contentEditable
        suppressContentEditableWarning
        ref={ref_InputEntry}
        onKeyDown={(e) => {
          if (rawText.length > 0) {
            getPositionAfterOneChar(e);
          } else {
            getPositionAtNoChar(e);
          }

          if (e.key == '/') {
            setShowPopup(prev => true);
          } else if (e.key == 'Enter' || e.key == "ArrowUp" || e.key == "ArrowDown") {
            setShowPopup(prev => false);
            setLastEvent(prev => ({ event: e, rawData: e.target.innerText }));
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
        }
        onInput={(e) => {
          console.log(e);
          setRawText(e.target.innerText);
          // console.log(e.target.innerText);
          // setRawText(e.target.innerText);
          // setIntermediateData(prev => ({ lastCurLine: lineNo, lastInput: e.target.innerText }))
        }}
      >{rawText}</_InputEntryWithoutLogic>
      < PopupMenu position={curCaretPos} innerRef={refPopupMenu} showPopup={showPopup} />
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
