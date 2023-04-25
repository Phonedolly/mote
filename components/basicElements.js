import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";
import { useEffect, useRef, useState } from 'react';

const outfit = Outfit({ subsets: ['latin'] });
const notoSansKR = Noto_Sans_KR({ subsets: [], weight: ['400', '700'] });

export const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 15rem;
  height: 100vh;
  background-color: rgb(251, 251, 250);
`;

export const TitleBar = styled.div`
  display: flex;
  height:15px;
  position: sticky;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
`;

export const CurrentTitle = styled.h1`
  font-size: 14px;
  font-weight: normal;
`

export const LeftTitleMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
`
export const RightTitleMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
`

export const LastEdit = styled.p`
  font-size: 0.8em;
  font-weight: normal;
  color: #47352F80;
`
const ExportButtonWithoutLogic = styled.button`
  font-size: 0.85em;
  font-weight: normal;
  height: 28px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  :hover {
    background-color: rgba(55, 53, 47, 0.08);
    border-radius: 4px;
  }
`

const MenuButton = styled.button`
  width: 18px;
  height: 18px;
  display: block;
  fill: rgba(55,53,47, 0.85);
  flex-shrink: 0;
  border: none;
  background-color: transparent;
  backface-visibility: hidden;
  cursor: pointer;
`

const MenuButtonWrapperWithoutLogic = styled.div`
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    background-color: rgba(55, 53, 47, 0.08);
    border-radius: 4px;
    transition: 20ms ease-in 0s;
  }
`

const MenuButtonWrapper = (props) => {
  return (
    <MenuButtonWrapperWithoutLogic>
      {props.children}
    </MenuButtonWrapperWithoutLogic>
  )
}

const SideBarToggleButtonWrapper = styled(MenuButtonWrapperWithoutLogic)`
width: 28px;
`

const SideBarToggleButtonWithoutLogic = styled(MenuButton)`
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M4 17H20M4 12H20M4 7H20' stroke='%2337352f' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
`


const DotsWithoutLogic = styled(MenuButton)`
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round' stroke='%23CCCCCC' stroke-width='2.016'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z' stroke='%2337352f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z' stroke='%2337352f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z' stroke='%2337352f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
`

export const SideBarToggleButton = () => {
  return (
    <SideBarToggleButtonWrapper>
      <SideBarToggleButtonWithoutLogic />
    </SideBarToggleButtonWrapper>
  )
}

export const Dots = () => {
  return (
    <MenuButtonWrapper>
      <DotsWithoutLogic />
    </MenuButtonWrapper>
  )
}

// rgba(35, 131, 226, 0.28)

export const Title = styled.h1`
  font-size: 2.5rem;
  color: black;
`;

export const ExportButton = () => {
  return (
    <ExportButtonWithoutLogic>
      내보내기
    </ExportButtonWithoutLogic>
  )
}

const InputEntryWithoutLogic = styled.div`
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
const InputEntry = (props) => {
  const refInputEntry = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [curCaretPos, setCurCaretPos] = useState({ top: 0, left: 0 });
  console.log('received');
  return (
    <>
      <InputEntryWithoutLogic ref={refInputEntry} contentEditable onKeyDown={(e) => {
        console.log('start');
        console.log(refInputEntry.current.selectionStart)
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);

        const rect = range.getClientRects()[0];
        console.log(rect);
        setCurCaretPos(prev => ({ ...prev, left: rect?.left || 0, top: rect?.top || 0 }))
        if (e.key == "/") {
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      }} />
      {showPopup === true ? <PopupMenu position={curCaretPos} /> : null}
    </>

  )
}

const InputEntryWrapperWithoutLogic = styled.div`
  border: 1px solid black;
`
export const InputEntryWrapper = (props) => {
  const refInputWrapper = useRef(null);




  return (
    <InputEntryWrapperWithoutLogic ref={refInputWrapper}>
      <InputEntry {...props} />
    </InputEntryWrapperWithoutLogic>
  )
}

const SpacerWithoutLogic = styled.span`
  visibility: hidden;
`
export const Spacer = (props) => {
  return (
    <SpacerWithoutLogic id="spacer" ref={props.innerRef} />
  )
}


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
    <PopupMenuWithoutLogic position={props.position}>
      asdfsdfsdfkl;askf;las;
    </PopupMenuWithoutLogic>
  );
}