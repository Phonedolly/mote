import styled from "styled-components";
import { v4 } from "uuid";
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import getCaretPosition from "@/utils/getCaretPosition";
import { textBlockInitValue } from "@/etc/initValues";

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
  background-color: green;
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
  /* width: ${props => props.width ? props.width : 'auto'}; */
  width: 100%;
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
  background-color: ${props => props.dom.curLine.value === props.lineNo ? "red" : "blue"};
  `
const _InputEntry = (props) => {
  const { lineNo, block, dom, setDom, refBlock } = props;
  const ref_InputEntry = useRef(null);
  const refPopupMenu = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [curCaretPos, setCurCaretPos] = useState({ top: 0, left: 0 });
  const [rawText, setRawText] = useState(block.value);
  const [innerText, setInnerText] = useState(block.value);

  function getPositionAfterOneChar(e) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getClientRects()[0];
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
  }

  function getPositionAtNoChar(e) {
    const rect = refBlock.current?.getBoundingClientRect();
    if (!rect) {
      console.log('rect is null');
      return;
    }
    setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
  }

  // useEffect(() => {
  //   /*
  //   https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  //   */
  //   function handleClickOutside(event) {
  //     if (refBlock.current && !refBlock.current.contains(event.target)) {
  //       // alert("You clicked outside of me!");
  //       // setIntermediateData(({ lastCurLine: lineNo, lastInput: refBlock.current.innerText }))
  //       // save();
  //       setShowPopup(false);
  //       // setCurrentRawData(rawText);
  //     }
  //   }
  //   document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   }
  // }, [])

  useEffect(() => {
    /*
    https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    */
    function handleClickOutside(event) {
      if (refPopupMenu.current && !refPopupMenu.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        // setIntermediateData(({ lastCurLine: lineNo, lastInput: refBlock.current.innerText }))
        // save();
        setShowPopup(false);
        // setCurrentRawData(rawText);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])

  useEffect(() => {
    if (lineNo !== dom.curLine.value) {
      return;
    }
    if (rawText.length === 0) {
      ref_InputEntry.current.focus();
      return;
    }
    const target = ref_InputEntry.current;
    if (!target.childNodes || !target.childNodes[0]) {
      return;
    }
    const selection = window.getSelection();
    const range = document.createRange();
    const initialCaretPosition = dom.lastClickRange;
    const correctedCaretPosition = target.childNodes[0].textContent.length < initialCaretPosition ? target.childNodes[0].textContent.length : initialCaretPosition;

    range.setStart(target.childNodes[0], correctedCaretPosition);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    target.focus();
  }, [dom.curLine.value])

  return (
    <>
      <_InputEntryWithoutLogic
        dom={dom}
        lineNo={lineNo}
        contentEditable
        suppressContentEditableWarning
        ref={ref_InputEntry}
        onKeyDown={(e) => {
          if (innerText.length > 0) {
            getPositionAfterOneChar(e);
          } else {
            getPositionAtNoChar(e);
          }
          if (e.key == '/') {
            setShowPopup(true);
            return;
          }
          setShowPopup(false);
          const caretPosition = getCaretPosition(refBlock.current);
          if (e.key == 'Enter' || e.key == "ArrowUp" || e.key == "ArrowDown") {
            setShowPopup(false);
            const curText = e.target.innerText;
            console.log(curText);
            switch (e.key) {
              case "Enter":
                e.preventDefault();
                /* Save current value and generate new div, and go to it */
                setDom(prev => ({
                  blocks: prev.blocks.map((block, i) => i === prev.curLine.value ? { blockType: "text", value: curText } : block)
                    .concat([textBlockInitValue]),
                  curLine: { value: prev.curLine.value + 1, lastArrowAction: "ENTER" },
                  lastClickRange: caretPosition
                }));
                break;
              case "ArrowUp":
                e.preventDefault();
                /* check if first line */
                if (dom.curLine.value === 0) {
                  return;
                }
                setDom(prev => ({
                  blocks: prev.blocks.map((block, i) => i === prev.curLine.value ? { blockType: "text", value: curText } : block),
                  curLine: { value: prev.curLine.value - 1, lastArrowAction: "UP" },
                  lastClickRange: caretPosition
                }));
                break;
              case "ArrowDown":
                e.preventDefault();
                /* check if last line */
                if (dom.curLine.value === dom.blocks.length - 1) {
                  return;
                }
                setDom(prev => ({
                  blocks: prev.blocks.map((block, i) => i === prev.curLine.value ? { blockType: "text", value: curText } : block),
                  curLine: { value: prev.curLine.value + 1, lastArrowAction: "DOWN" },
                  lastClickRange: caretPosition
                }));
                break;
              default:
                break;
            }
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
          setInnerText(e.target.innerText);
        }}
      >{rawText}</_InputEntryWithoutLogic >
      <PopupMenu position={curCaretPos} innerRef={refPopupMenu} showPopup={showPopup} />
    </>
  )
}

const TextBlockWithoutLogic = styled.div`
  border: 1px solid black;
  width: 100%;
`
const TextBlock = (props) => {
  return (
    <TextBlockWithoutLogic>
      <_InputEntry {...props} />
    </TextBlockWithoutLogic>
  )
}

export default TextBlock;
