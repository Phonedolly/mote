import styled from "styled-components";
import { Noto_Sans_KR, Outfit } from 'next/font/google'
import { v4 } from "uuid";

const outfit = Outfit({ subsets: ['latin'] });
const notoSansKR = Noto_Sans_KR({ subsets: [], weight: ['400', '700'] });

export const Container = styled.div.attrs({ key: v4() })`
  font-family: ${outfit.className} ${notoSansKR.className};
  margin: 0;
`;


export const ContentContainer = styled.div.attrs({ key: v4() })`
  margin: 0 auto;
  width: 70vw;
  `;