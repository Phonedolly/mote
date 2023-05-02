import Head from 'next/head'
import Image from 'next/image'
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { CurrentTitle, Dots, ExportButton, LastEdit, LeftTitleMenuContainer, PopupMenu, RightTitleMenuContainer, SideBar, SideBarToggleButton, Spacer, Title, TitleBar } from '@/components/basicElements'
import { Container, ContentContainer, } from '@/components/ContentContainer'
import InputBlock from '@/components/InputEntry';
import { useEffect, useRef, useState } from 'react'
import { v4 } from "uuid";
import { useAnimate } from 'framer-motion'
import TextBlock from '@/components/blocks/TextBlock';
import { textBlockInitValue } from '@/etc/initValues'

export default function Home() {
  const refContentContainer = useRef(null);
  const [showSideBar, setShowSideBar] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("Current Title");
  const [lastEdit, setLastEdit] = useState(new Date());
  const [dom, setDom] = useState({
    blocks: [textBlockInitValue],
    curLine: { value: 0, lastArrowAction: "" },
    lastClickRange: 0
  });

  return (
    <>
      <Head key={v4()}>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <TitleBar>
          <LeftTitleMenuContainer>
            {showSideBar ? <SideBar /> : <SideBarToggleButton />}
            <CurrentTitle>{currentTitle}</CurrentTitle>
          </LeftTitleMenuContainer>
          <RightTitleMenuContainer>
            <LastEdit>{`${lastEdit.getMonth() + 1}월 ${lastEdit.getDate()}일에 마지막으로 편집`}</LastEdit>
            <ExportButton />
            <Dots />
          </RightTitleMenuContainer>
        </TitleBar>
        <ContentContainer dom={dom} setDom={setDom} />
      </Container>
    </>
  )
}
