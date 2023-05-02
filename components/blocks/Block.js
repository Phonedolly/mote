import TextBlock from '@/components/blocks/TextBlock'
import getCaretPosition from '@/utils/getCaretPosition';
import { useEffect, useRef } from 'react';
import styled from "styled-components";

const BlockWithoutLogic = styled.div`
  display: flex;
  flex-direction: row;
  border: 2px solid black;
  width: 100%;
  background-color: yellow;
`
const BlockHandle = styled.div`
  background-color: red;
  width: 14px;
  height: 20px;
  border-radius: 4px;
`

const Block = ({ lineNo, block, dom, setDom }) => {
  const refBlock = useRef(null);
  let targetBlock;

  switch (block.blockType) {
    case "text":
      targetBlock = <TextBlock lineNo={lineNo} block={block} dom={dom} setDom={setDom} refBlock={refBlock} />
      break;
    case "code":
      targetBlock = <div>code</div>;
    default:
      targetBlock = <div>default</div>;
      break;
  }

  return (
    <BlockWithoutLogic ref={refBlock} onClick={() => {
      const position = getCaretPosition(refBlock.current.parentElement.childNodes[lineNo].childNodes[1].childNodes[0]);
      setDom(prev => ({
        blocks: prev.blocks.map((el, j) => (j === dom.curLine.value ? {
          blockType: prev.blocks[dom.curLine.value].blockType,
          value: refBlock.current.parentElement.childNodes[dom.curLine.value].childNodes[1].childNodes[0].textContent
        } : el)),
        curLine: { value: lineNo, lastArrowAction: "CLICK" },
        lastClickRange: position
      }))
    }}>
      <BlockHandle />
      {targetBlock}
    </BlockWithoutLogic>
  )
}

export default Block;
