import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
// 마인드 인사이트 검사 관련 css
import styled from 'styled-components';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SubInfoText from './components/SubInfoText';
import DOMPurify from 'dompurify';
import { useSetRecoilState } from 'recoil';
// import { PdfProgressAtom } from './PdfDownloadAtom'
// Components
import ResultScoreTextWrap from './components/ResultScoreTextWrap';
import BalanceOfPowerWings from './components/BalanceOfPowerWings';

// Images
import { images } from './images'

import './css/App.css'

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
import icon_lang_red from './images/icon_lang_red.svg'
import icon_lang_green from './images/icon_lang_green.svg'
import icon_logic_red from './images/icon_logic_red.svg'
import icon_logic_green from './images/icon_logic_green.svg'
import icon_music_red from './images/icon_music_red.svg'
import icon_music_green from './images/icon_music_green.svg'
import icon_physical from './images/icon_physical.svg'
import icon_physical_red from './images/icon_physical_red.svg'
import icon_physical_green from './images/icon_physical_green.svg'
import icon_space from './images/icon_space.svg'
import icon_space_red from './images/icon_space_red.svg'
import icon_space_green from './images/icon_space_green.svg'
import icon_nature from './images/icon_nature.svg'
import icon_nature_red from './images/icon_nature_red.svg'
import icon_nature_green from './images/icon_nature_green.svg'
import icon_friendly from './images/icon_friendly.svg'
import icon_friendly_red from './images/icon_friendly_red.svg'
import icon_friendly_green from './images/icon_friendly_green.svg'
import icon_personal from './images/icon_personal.svg'
import icon_personal_red from './images/icon_personal_red.svg'
import icon_personal_green from './images/icon_personal_green.svg'

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// ===== chart =====
import * as d3 from 'd3';
import { Line, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.js에 필요한 요소 등록
ChartJS.register(
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartDataLabels
);
// ===== chart =====


const Container = styled.div`
position: absolute;
top: -9999px;
left: -9999px;
background-color: #fff;

& *{
   background-color: transparent;
}

.main.cover img{
  width: 100%;
}

/* 페이지 공통 */
.page-common{
  overflow: hidden;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1920px;
  /* max-width: 100%; */
  height: 2717px;
  background-color: #fff;
}
.page-5{
   .step-item-sub-title, .tip-item{
      font-size: 22px;
   }
   .step-item-list .border-dash{
      padding: 26px 0px;
   }
}
.page-25{
   .row-group{
      gap: 16px;
   }
   .default-title{
      font-size: 33px;
   }
   .default-txt{
      font-size: 22px;
   }
   .default-txt-s{
      font-size: 20px;
   }
}
.sub-info-text-wrap{
   display: flex;
   gap: 8px;
}
.sub-info-text{
   font-size: 27px; 
   line-height: 1.55em; 
   color: #9a9a9b;
}

/* 컨텐츠 공통 */
.col-group {display:flex;}
.row-group {display:flex; flex-flow: column;}
.container { margin: 0 auto; width: 100%; padding: 9.375vw; }
.yellow { color: #fee500; }
.red { color: #d7262e; }
.orange { color: #f27255; }
.green { color: #007a10; }
.blue { color: #0088ff; }
.img-container { width: 100%; position: relative; }
.img-container img { width: 100%; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; object-fit: cover; object-position: center; }
.video-container { width: 100%; padding-top: 56.25%; position: relative; }
.video-container iframe { width: 100%; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #e4e4e4; }
::-webkit-scrollbar-thumb { background: #484848; border-radius: 4px;}
.null-txt { font-size: 16px; font-weight: 300; text-align: center; color: #202020; padding: 120px 0; align-items: center; gap: 16px; }
.null-txt .icon { font-size: 32px; }

.relative { position: relative; }
.sp-bt { justify-content: space-between; }
.al-ce { align-items: center; }
.gap4 { gap: 4px; }
.gap8 { gap: 8px; }
.gap16 { gap: 16px; }
.gap24 { gap: 24px; }
.gap32 { gap: 32px; }
.gap40 { gap: 40px; }
.gap48 { gap: 48px; }
.gap56 { gap: 56px; }
.half-div { width: calc( 50% - 20px ); }

/* 페이지 공통 */
.main {  position: relative; max-width: 1560px; width:100%; height:2716px; padding: 6.5625vw 0; }
.main{
  display: flex;
    flex-direction: column;
    justify-content: center;
}
.page-num { font-size: 30px; font-weight: 500; color: #707070; position: absolute; right: 0; top: 6.5625vw; }
.main-title-wrap { margin-bottom: 64px; gap: 24px; align-items: center; }
.main-title-wrap .num { font-size: 240px; }
.main-title-group { gap: 16px; padding-bottom: 32px; position: relative; }
.main-title-group::after { content: ''; display: block; position: absolute; width: 80px; height: 4px; background: #000; left: 0; bottom: 0; }
.main-title { font-size: 64px; }
.main-sub-title { font-size: 32px; font-weight: 500; line-height: 1.25; }

.section-wrap { gap: 96px; }
.section-title-wrap { margin-bottom: 56px; gap: 32px; align-items: baseline; }
.section-title-wrap .num { width: 70px; height: 70px; background: #007a10; text-align: center; line-height: 70px; font-size: 46px; font-weight: bold; color: #fff; border-top-right-radius: 24px; border-bottom-left-radius: 24px; }
.section-title { font-size: 50px; line-height: 1.25; }
.section-title-s { font-size: 38px; }

.default-title { font-size: 40px; font-weight: bold; }
.default-txt { font-size: 30px; font-weight: 500; line-height: 1.5; }
.default-txt * { line-height: 1.5; display: inline; }
.default-txt-s { font-size: 26px; font-weight: normal; line-height: 1.35; }
.default-txt-l { font-size: 34px; font-weight: normal; line-height: 1.35; }
.default-txt-bold { font-weight: bold; }

/* cover */
.main.cover { max-width: 100%;}
.user-info-list { position: absolute; width: 700px; left: 260px; bottom: 427px; gap: 80px; }
.user-info-item { padding-bottom: 20px; border-bottom: 1px solid #fff; }
.user-info-item .item-title { width: 200px; font-size: 36px; font-weight: 600; color: #fff; }
.user-info-item .item-txt { width: calc( 100% - 174px ); font-size: 36px; font-weight: normal; color: #fff; }

/* 목차 */
.list { max-width: 1560px; margin: 0 auto; padding: 180px 0; position: relative; }
.list::after { content: ''; position: absolute; display: block; width: 100%; height: 10px; background: #007a10; top: 70px; left: 0; right: 0; }
.list-title { width: 100%; font-size: 120px; font-weight: bold; }
.list-wrap { width: 100%; gap: 80px; padding-right: 64px; }
.list-group-title .num { width: 64px; text-align: right; font-size: 36px; font-weight: bold; color: #007a10; }
.list-group-title .txt { width: calc( 100% - 64px ); font-size: 36px; font-weight: bold; color: #007a10; }
.list-sub-item .page { width: 64px; text-align: right; font-size: 30px; font-weight: bold; line-height: 1.5;}
.list-sub-item .title {width: calc( 100% - 64px ); font-size: 30px; line-height: 1.5;}

/* 융합역량지수-01-01-마인드 인사이트 소개 */
.main.bg-bottom { position: relative; }
.main.bg-bottom::after { content: ''; display: block; position: absolute; width: 1920px; height: 940px; bottom: 0; background: #D9EEE6; left: 50%; transform: translateX(-50%); z-index: -1; }
.section-top { position: relative; padding: 40px 0; padding-left: 360px; background: #eeeeee; border-radius: 32px; margin-bottom: 90px; }
.section-top .img { position: absolute; width: 232px; left: 45px; top: -27px; }
.section-top .txt { font-size: 30px; line-height: 1.6; }

.main .step-item-wrap > div { width: 100%; }
.step-item { align-items: baseline; }
.step-item.border { padding: 32px; background: #fff; border-radius: 16px; border: 3px solid #00754a; align-items: baseline; }
.step-item-num { width: 64px; height: 64px; border-radius: 50%; text-align: center; line-height: 64px; background: #CBE2DA; font-size: 26px; font-weight: bold; color: #007a10; }
.step-item-txt-wrap { width: calc( 100% - 64px - 24px ); }
.step-item-title { font-size: 40px; font-weight: bold; color: #00754a; align-items: center; }
.step-item-txt { font-size: 26px; font-weight: 500; line-height: 1.5; }
.step-item-sub-title { font-size: 30px; font-weight: bold; line-height: 1.5; }

/* 융합역량지수-02-01-감정상태 */
.result-score-container { align-items: flex-start; }
.result-score-container .result-score-wrap { width: calc( 50% - 20px ); }
.result-score-wrap { width: 100%; border-radius: 16px; background: #fff; }
.result-score-wrap.border { padding: 56px 40px; border: 3px solid #e4e4e4; }
.result-score-txt-wrap { width: 100%; }
.result-score-container .result-score-txt-wrap { width: calc( 50% - 20px ); }
.result-score-title-wrap { margin-bottom: 32px; align-items: center; }
.result-score-title { font-size: 40px; font-weight: bold; }
.result-score-num { font-size: 40px; font-weight: 500; }
.result-score-num strong { font-size: 64px; }
.result-score { position: relative; width: 100%; height: 64px; border-radius: 32px; background: #e4e4e4; margin-bottom: 48px; }
/* .result-score .line { position: absolute; width: 0; height: 64px; border-left: 2px dashed #202020; top: 50%; transform: translateY(-50%); } */
.result-score .line { position: absolute; width: 0; height: 64px; border-left: 2px dashed #202020; top: 0; }
.result-score-gauge { position: absolute; left: 0; top: 0; bottom: 0; height: 100%; border-radius: 32px; }

.result-score-item { align-items: center; }
.result-score-item:not(:last-child) { border-bottom: 1px solid #e4e4e4; padding-bottom: 24px; margin-bottom: 24px; }
.result-score-item .icon { width: 64px; height: 64px; background-repeat: no-repeat; background-size: contain; background-position: center; }
.result-score-item:nth-child(1) .icon { background-image: url(${images.icon_result_score_01}); }
.result-score-item:nth-child(2) .icon { background-image: url(${images.icon_result_score_02}); }
.result-score-item:nth-child(3) .icon { background-image: url(${images.icon_result_score_03}); }
.result-score-item:nth-child(4) .icon { background-image: url(${images.icon_result_score_04}); }
.result-score-item .txt-group { width: calc( 100% - 64px - 24px ); }
.result-score-item .title { font-size: 24px; font-weight: 600; }
.result-score-item .txt { font-size: 26px; line-height: 1.2; }

.result-score-wrap.type1 .result-score-item:nth-child(1) .title { font-size: 26px; }
.result-score-wrap.type1 .result-score-item:nth-child(1) .txt { font-size: 30px; }
.result-score-wrap.type1 .result-score-num, 
.result-score-wrap.type1 .result-score-num *,
.result-score-wrap.type1 .result-score-item:nth-child(1) .title,
.result-score-wrap.type1 .result-score-item:nth-child(1) .txt { font-weight: bold; color: #0077ff; }
.result-score-wrap.type1 .result-score-gauge { background: #0077ff; }
.result-score-wrap.type1 .result-score-item:nth-child(1) .icon { background-image: url(${images.icon_result_score_01_active}); }
.result-score-wrap.type2 .result-score-item:nth-child(2) .title { font-size: 26px; }
.result-score-wrap.type2 .result-score-item:nth-child(2) .txt { font-size: 30px; }
.result-score-wrap.type2 .result-score-num, 
.result-score-wrap.type2 .result-score-num *,
.result-score-wrap.type2 .result-score-item:nth-child(2) .title,
.result-score-wrap.type2 .result-score-item:nth-child(2) .txt { font-weight: bold; color: #fcc200; }
.result-score-wrap.type2 .result-score-gauge { background: #fcc200; }
.result-score-wrap.type2 .result-score-item:nth-child(2) .icon { background-image: url(${images.icon_result_score_02_active}); }
.result-score-wrap.type3 .result-score-item:nth-child(3) .title { font-size: 26px; }
.result-score-wrap.type3 .result-score-item:nth-child(3) .txt { font-size: 30px; }
.result-score-wrap.type3 .result-score-num, 
.result-score-wrap.type3 .result-score-num *,
.result-score-wrap.type3 .result-score-item:nth-child(3) .title,
.result-score-wrap.type3 .result-score-item:nth-child(3) .txt { font-weight: bold; color: #ff5b36; }
.result-score-wrap.type3 .result-score-gauge { background: #ff5b36; }
.result-score-wrap.type3 .result-score-item:nth-child(3) .icon { background-image: url(${images.icon_result_score_03_active}); }
.result-score-wrap.type4 .result-score-item:nth-child(4) .title { font-size: 26px; }
.result-score-wrap.type4 .result-score-item:nth-child(4) .txt { font-size: 30px; }
.result-score-wrap.type4 .result-score-num, 
.result-score-wrap.type4 .result-score-num *,
.result-score-wrap.type4 .result-score-item:nth-child(4) .title,
.result-score-wrap.type4 .result-score-item:nth-child(4) .txt { font-weight: bold; color: #d7262e; }
.result-score-wrap.type4 .result-score-gauge { background: #d7262e; }
.result-score-wrap.type4 .result-score-item:nth-child(4) .icon { background-image: url(${images.icon_result_score_04_active}); }

.result-score-txt { padding: 40px 56px; padding-right: 205px; border-radius: 16px; background: #eee; font-size: 40px; font-weight: bold; line-height: 1.4; word-break: keep-all; position: relative; }
.result-score-txt::after { content: ''; display: block; position: absolute; width: 205px; height: 100%; background-repeat: no-repeat; background-size: contain; background-position: right bottom; bottom: 0; right: 0; }
.result-score-txt-img{
display: block; 
position: absolute; 
width: auto; 
height: 100%; 
bottom: 0; 
right: 0; 
}
.result-score-txt.type1 .color { color: #0077ff; }
.result-score-txt.type2 .color { color: #fcc200; }
.result-score-txt.type3 .color { color: #ff5b36; }
.result-score-txt.type4 .color { color: #d7262e; }

.result-score-list{margin-top:48px;}

.green-border-box { width: 100%; padding: 40px; border-radius: 16px; border: 3px solid #00754a; background: #fff; }
.green-border-box.bg-green { background-color: #d9eee6; }
.red-border-box { width: 100%; padding: 40px; border-radius: 16px; border: 3px solid #d7262e; background: #fff; }

.icon-arrow-wrap { position: absolute; width: 100%; height: 100%; display: flex; justify-content: space-evenly; align-items: center; }
.icon-arrow-both { position:relative; width: 64px; height: 40px; }
.icon-arrow-both .icon-arrow-left { width: 40px; position: absolute; left: 0; }
.icon-arrow-both .icon-arrow-right { width: 40px; position: absolute; right: 0; }

/* 융합역량지수-02-02-감정상태 */
.depression-1 { position: relative; }
.depression-1 .img { position: absolute; width: 320px; height: 425px; bottom: 0; right: 0; }
.depression-2 { position: relative; padding-left: 500px; }
.depression-2 .img { position: absolute; width: 407px; height: 694px; top: 40px; left: 40px; }

/* 융합역량지수-02-03-감정상태 */
.step-item-list.border { 
   padding: 0 32px;
    border: 3px solid #00754a; 
    border-radius: 16px; 
    background-color: #ffffff; 
   }
.page-19 .step-item-list.border,
.page-19 .step-item-list.border{
   background-color: transparent; 
}
.step-item-list .border-dash { padding: 32px 0; word-break: keep-all; border-radius: 0; align-items: baseline; }
.step-item-list .border-dash:not(:last-child) { border-bottom: 2px dashed #007a10; }

.tip-wrap > div { width: 100%; justify-content: space-between; }
.tip-wrap .img-1 { max-width: 440px; margin: 0 auto; margin-bottom: -56px; }
.tip-item-wrap { padding: 32px; border-radius: 16px; background: #d9eee6; }
.tip-item-wrap .icon { width: 64px; height: 64px; text-align: center; line-height: 64px; border-radius: 50%; background: #155845; color: #fff; font-size: 26px; font-weight: bold; }
.tip-item-group { width: calc( 100% - 64px - 24px ); }
.tip-item { font-size: 30px; font-weight: bold; color: #155845; line-height: 1.5; }
.tip-item:not(:last-child) { padding-bottom: 24px; border-bottom: 2px dashed #155845; margin-bottom: 24px; word-break: keep-all; }

/* 융합역량지수-02-04-감정상태 */
.relax-title-wrap { align-items: flex-end; }
.relax-title-wrap .img { width: 200px; height: 200px; }
.relax-title-group { width: calc( 100% - 200px - 40px ); }

/* 융합역량지수-02-05-감정상태 */
.anger-img { position: absolute; padding: 30px; right: 0; top: 20px; width: 575px; height: 505px; background: #fff; border-bottom-left-radius: 210px; }

/* 융합역량지수-02-08-감정상태 */
.compare-group { width: 100%; }
.compare-title { position: relative; padding-left: 56px; height: 184px; display: flex; flex-flow: column; justify-content: center; border-radius: 16px; overflow: hidden; }
.compare-title .img { position: absolute; width: auto; height: 184px; top: 0; right: 0; }

.compare-group:nth-child(1) .compare-title { background: #CBE3CE; }
.compare-group:nth-child(2) .compare-title { background: #D0DDDA; }
.compare-group:nth-child(2) .compare-title .default-title { color: #155845; }
.compare-group:nth-child(1) .step-item-num { background: #CBE3CE; color: #007a10; }
.compare-group:nth-child(2) .step-item-num { background: #D0DDDA; color: #155845; }

/* 융합역량지수-03-01-융합역량지능 */
.meta-q-guide { width: 100%; border-radius: 16px; border: 3px solid #e4e4e4; background: #fff; }
.meta-q-guide-item { width: 100%; padding: 24px 0; padding-left: 40px; position: relative; }
.meta-q-guide-item:not(:last-child):after { content: ''; display: block; position: absolute; width: 2px; height: calc( 100% - 48px ); background: #e4e4e4; right: 0; top: 24px; }
.meta-q-guide-item .title { font-size: 24px; font-weight: 600; }
.meta-q-guide-item .txt { font-size: 24px; }

.meta-q-chart-wrap { display: flex; gap: 40px; margin-top: 16px; }
.meta-q-chart-wrap .chart-num-wrap { display: flex; flex-direction: column; height: 480px; justify-content: space-between; width: 40px; align-items: flex-end; }
.meta-q-chart-wrap .chart-num { font-size: 24px; font-weight: 600; }
.meta-q-chart-wrap .chart-graph-wrap { display: flex; width: calc( 100% - 80px ); justify-content: space-evenly; position: relative; }
.meta-q-chart-wrap .chart-graph-wrap::after { content: ''; display: block; position: absolute; width: 100%; height: 3px; background: #e4e4e4; top: 480px; }
.meta-q-chart-wrap .chart-graph-wrap::before { content: ''; display: block; position: absolute; width: 100%; height: 0; border-top: 2px dashed #000; top: 240px; z-index: 1; }
.meta-q-chart-wrap .chart-gauge { height: 480px; width: 96px; border-top-left-radius: 8px; border-top-right-radius: 8px; background: #f5f5f5; position: relative; }
.meta-q-chart-wrap .chart-gauge-core { position: absolute; width: 100%; border-top-left-radius: 8px; border-top-right-radius: 8px; bottom: 0; left: 0; right: 0; background: #aaaaaa;}
.meta-q-chart-wrap .chart-graph-item.red .chart-gauge-core { background: #d7262e; }
.meta-q-chart-wrap .chart-graph-item.green .chart-gauge-core { background: #00754a; }
.meta-q-chart-wrap .chart-gauge-num { position: absolute; font-size: 24px; font-weight: 600; left: 50%; transform: translate(-50%, -100%); top: -8px; }
.meta-q-chart-wrap .chart-txt-group { margin-top: 24px; align-items: center; }
.meta-q-chart-wrap .chart-txt-group .txt { font-size: 24px; font-weight: 600; }
.meta-q-chart-wrap .chart-graph-item.red .chart-txt-group .txt { color: #d7262e; }
.meta-q-chart-wrap .chart-graph-item.green .chart-txt-group .txt { color: #00754a; }
.meta-q-icon { background-repeat: no-repeat; width: 56px; height: 56px; background-size: contain; background-position: center; }
.meta-q-icon.lang { background-image: url(${icon_lang_red}); }
.red .meta-q-icon.lang { background-image: url(${icon_lang_red}); }
.green .meta-q-icon.lang { background-image: url(${icon_lang_green}); }
.meta-q-icon.logic { background-image: url(${icon_lang_red}); }
.red .meta-q-icon.logic { background-image: url(${icon_logic_red}); }
.green .meta-q-icon.logic { background-image: url(${icon_logic_green}); }
.meta-q-icon.music { background-image: url(${icon_lang_red}); }
.red .meta-q-icon.music { background-image: url(${icon_music_red}); }
.green .meta-q-icon.music { background-image: url(${icon_music_green}); }
.meta-q-icon.physical { background-image: url(${icon_physical}); }
.red .meta-q-icon.physical { background-image: url(${icon_physical_red}); }
.green .meta-q-icon.physical { background-image: url(${icon_physical_green}); }
.meta-q-icon.space { background-image: url(${icon_space}); }
.red .meta-q-icon.space { background-image: url(${icon_space_red}); }
.green .meta-q-icon.space { background-image: url(${icon_space_green}); }
.meta-q-icon.nature { background-image: url(${icon_nature}); }
.red .meta-q-icon.nature { background-image: url(${icon_nature_red}); }
.green .meta-q-icon.nature { background-image: url(${icon_nature_green}); }
.meta-q-icon.friendly { background-image: url(${icon_friendly}); }
.red .meta-q-icon.friendly { background-image: url(${icon_friendly_red}); }
.green .meta-q-icon.friendly { background-image: url(${icon_friendly_green}); }
.meta-q-icon.personal { background-image: url(${icon_personal}); }
.red .meta-q-icon.personal { background-image: url(${icon_personal_red}); }
.green .meta-q-icon.personal { background-image: url(${icon_personal_green}); }

.meta-q-result-group > div { width: 100%; }
.step-item-list.border.red { border: 3px solid #d7262e; }
.step-item-list.red .border-dash { border-color: #d7262e; }
.step-item-list.red .step-item-num { background: #F7D3D5; color: #d7262e; }

/* 융합역량지수-03-02 강점/약점보완영역 */
.default-title .icon { width: 56px; }

/* 융합역량지수-03-03-융합역량지능 */
.circle-chart { width: 100%; height: 674px; }
.circle-chart .label { text-anchor: middle; width: 100%; font-size: 24px; font-weight: 500; }

/* 융합역량지수-04-01 에너지 역량 */
.step-item-list.per-type> .col-group { justify-content: space-between; align-items: center; }
.step-item-list.per-type .step-item { width: 542px; }
.step-item-list.per-type .step-item:last-child .step-item-num { background: #D0DDDA; color: #155845; }
.step-item-list.per-type .step-item:last-child .green { color: #155845; }
.step-item-list.per-type .icon-arrow { font-size: 36px; color: #aeaeae; transform: rotate(-90deg); }
.default-txt.center { text-align: center; }

/* 융합역량지수-04-02 에너지 역량 */
.energy-result-wrap { display: flex; flex-flow: column; gap: 80px; }
.energy-result-top { display: flex; align-items: center; justify-content: space-between; }
.energy-result-top-title { display: flex; align-items: center; gap: 24px; }
.energy-result-top-title .num { width: 64px; height: 64px; border: 3px solid #aaaaaa; background: #fff; text-align: center; line-height: 58px; font-size: 26px; font-weight: 500; color: #aaaaaa; border-radius: 50%; }
.energy-result-top-title .title { font-size: 32px; font-weight: 600; color: #aaaaaa; text-transform: uppercase; }
.energy-guage-wrap { position: relative; width: 960px; height: 64px; border-radius: 32px; border: 3px solid #202020; background: #eee; }
.energy-guage { position: absolute; width: 50%; height: 100%; top: 0; bottom: 0; }
.energy-guage.left { right: 0; transform: translateX(-100%); }
.energy-guage.right { left: 0; transform: translateX(100%); }
.energy-guage-bar { position: absolute; height: 100%; top: 0; bottom: 0; background: #aaaaaa; }
.energy-guage.left .energy-guage-bar { right: 0; border-top-left-radius: 32px; border-bottom-left-radius: 32px; }
.energy-guage.right .energy-guage-bar { left: 0; border-top-right-radius: 32px; border-bottom-right-radius: 32px; }
.energy-guage-num-group { width: 100%; display: flex; justify-content: space-between; position: absolute; bottom: -32px; left: 0; right: 0; } 
.energy-guage-num { position: relative; font-size: 24px;  }
.energy-guage-num:not(:first-child, :last-child)::after { content: ''; display: block; position: absolute; width: 0; height: 60px; border-left: 2px dashed #202020; top: -66px; left: 50%; transform: translateX(-50%); }

.energy-result-wrap .step-item.border { border-color: #303030; }
.energy-result-wrap .step-item-num { background-color: #aeaeae; color: #202020; text-transform: uppercase; font-size: 32px; }

.energy-result-wrap.left .energy-result-top-title.left .num,
.energy-result-wrap.right .energy-result-top-title.right .num { border-color: #00754a; background-color: #00754a; color: #fff; }
.energy-result-wrap.left .energy-result-top-title.left .title,
.energy-result-wrap.right .energy-result-top-title.right .title,
.energy-result-wrap.left .step-item.left .default-title,
.energy-result-wrap.right .step-item.right .default-title { color: #00754a; }
.energy-result-wrap.left .energy-guage.left .energy-guage-bar,
.energy-result-wrap.right .energy-guage.right .energy-guage-bar { background: #007a10; }
.energy-result-wrap.left .step-item.left, 
.energy-result-wrap.right .step-item.right { border-color: #00754a; }
.energy-result-wrap.left .step-item.left .step-item-num, 
.energy-result-wrap.right .step-item.right .step-item-num { background-color: #CBE2DA; color: #00754a; }

.default-txt.dot { position: relative; padding-left: 20px; }
.default-txt.dot::after { content: ''; display: block; position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #333; left: 0; top: 19px; }
.default-txt-s.dot::after { width: 4px; height: 4px; top: 15px; }
.default-txt-l.dot::after { top: 21px; }
.default-txt.green.dot::after { background: #007a10; } 

.energy-result-top-wrap { padding: 40px; padding-top: 56px; border: 3px solid #00754a; border-radius: 16px; }
.energy-result-title-wrap { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 36px; border-bottom: 3px solid #00754a; }
.energy-result-type { font-size: 56px; font-weight: bold; color: #00754a; }
.energy-result-top-wrap .energy-result-wrap { padding: 24px 0 60px; }
.energy-result-top-wrap .energy-result-wrap:not(:last-child) { border-bottom: 1px solid #e4e4e4; }
.energy-result-top-wrap .energy-result-wrap:last-child { padding-bottom: 24px; }
.energy-result-top-wrap .energy-guage-wrap { width: 800px; }
.energy-result-top-wrap .energy-result-top-title { width: calc( ( 100% - 800px ) / 2 ); }
.energy-result-top-wrap .energy-result-top-title.right { justify-content: flex-end; }

/* 융합역량지수-04-04 에너지 역량 */
.balance-chart-wrap { position: relative; width: 100%; height: 270px; }
.balance-chart-bar { position: absolute; width: 520px; height: 84px; top: 20px; left: 50%; transform: translateX(-50%); background-repeat: no-repeat; background-size: contain; background-position: center bottom; }
.balance-chart-bar.left { background-image: url(${images.balance_left}); }
.balance-chart-bar.right { background-image: url(${images.balance_right}); }
.balance-chart-bar.center { background-image: url(${images.balance_center}); }
.balance-chart-core { position: absolute; width: 180px; height: 100%; bottom: 0; left: 50%; transform: translateX(-50%); }
.balance-chart-group { height: 100%; justify-content: space-between; align-items: flex-end; padding: 0 17px; }
.balance-chart { width: 160px; height: 160px; position: relative; border-radius: 50%; background: #bbbbbb;}
.balance-chart.active { background: #007a10; }
.balance-chart-gauge { position: absolute; width: 100%; height: 100%; border-radius: 50%; }
.balance-chart-circle { position: absolute; width: 80px; height: 80px; background: #fff; border-radius: 50%; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; line-height: 80px; font-size: 40px; font-weight: bold; color: #707070; }
.balance-chart.active .balance-chart-circle { color: #007a10; }
.balance-chart .title { font-size: 26px; font-weight: bold; color: #707070; text-align: center; position: absolute; bottom: -40px; width: 100%; }
.balance-chart.active .title { color: #007a10; }
.balance-chart-txt-wrap { padding-top: 32px; border-top: 3px solid #e4e4e4; margin-top: 90px; }

.step-item.active { position: relative; }
.step-item.active::after { content: ''; display: block; position: absolute; width: calc( 100% + 64px ); height: 100%; background: #D5E8E1; top: 0; left: -32px; z-index: -1; }
.step-item.active .step-item-num { background: #ffffff; }
.step-item.active .default-txt { font-weight: bold; }

/* 융합역량지수-05-03-힘의 균형 */
.prescription { padding-right: 480px; background-image: url(${images.prescription}); background-size: 408px; background-position: bottom right 20px; background-repeat: no-repeat; }

/* 융합역량지수-05-05-힘의 균형 */
.wing-type-section { position: relative }
.wing-type-section::after { 
   content: ''; 
   display: block; 
   width: 1920px; 
   height: calc( 100% + 104px + 6.5625vw ); 
   background: #d9eee6;
   position: absolute; 
   top: -104px; 
   z-index: -1; 
   left: -180px;
   }
.wing-type-group { padding: 24px 0; gap: 120px; position: relative; z-index: 0; }
.wing-type-group:not(:last-child) { border-bottom: 2px dashed #00754a; }
.wing-type-group:not(:last-child)::after { content: ''; display: block; position: absolute; width: 3px; height: 100%; background: #00754a; left: 50%; top: 50%; transform: translateX(-50%); z-index: -1; }
.wing-type-group .num { position: absolute; width: 64px; height: 64px; border-radius: 50%; border: 3px solid #00754a; text-align: center; line-height: 58px; background: #fff; font-size: 24px; font-weight: bold; color: #00754a; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.wing-type-item { width: calc( 50% - 60px ); }
.wing-type-item:first-child { align-items: flex-end; text-align: right; }

/* 융합역량지수-06-01 관계와 소통 분석 */
.ego-result-item { width: 100%; height: 135px; border-radius: 20px; border: 1px solid #e1e1e1; background: #fff; align-items: center; justify-content: center; }
.ego-result-item .icon { width: 64px; height: 64px; object-fit: contain; object-position: center; }
.ego-result-chart-wrap { align-items: center; }
.ego-result-chart-group { width: calc( 100% - 260px ); }
.ego-result-chart { height: 290px; }
.ego-result-score-wrap { width: 220px; border-radius: 20px; border: 3px solid #e4e4e4; background: #fff; }
.ego-result-score-item { padding: 24px 40px; }
.ego-result-score-item .title { font-size: 24px; font-weight: 600; }
.ego-result-score-item .txt { font-size: 24px; font-weight: normal; }
.ego-result-title-group { justify-content: space-between; padding-left: 132px; padding-right: 96px; }
.ego-result-title-group .default-txt { color: #707070; }
.ego-result-txt-group { justify-content: space-between; padding-left: 116px; padding-right: 74px; }
.ego-result-txt-group .default-txt-s { text-align: center; font-size: 24px; font-weight: 600;}

/* 융합역량지수-07-01 인생점수 */
.age-wrap { flex-flow: wrap; }
.age-item { width: calc( ( 100% - 16px * 3 ) / 4 ); padding: 20px 30px; border: 2px solid #dedede; background: #fff; border-radius: 20px; }
.age-item .icon { width: 130px; height: 130px; }
.default-txt-ss { font-size: 24px; font-weight: normal; line-height: 1.2; }
.default-txt.right { text-align: right; }
.age-score-wrap { gap: 2px; }
.age-score { width: calc( ( 100% - 2px * 9 ) / 10 ); height: 20px; border-radius: 10px; background: #eee; }
.age-score.active { background: #00754a; }

.life-score-section { position: relative; padding-top: 120px; padding-bottom: 710px; }
.life-score-section::after { 
   content: ''; 
   display: block; 
   width: 1920px; 
   height: calc( 100% + 6.5625vw ); 
   background-color: #d9eee6; 
   position: absolute; 
   bottom: -6.5625vw; 
   z-index: -1; 
   left: -180px
}
.life-score-section::before { 
   content: ''; 
   display: block; 
   width: calc(100% + 360px); 
   height: 645px;
   position: absolute; 
   bottom: 0px;
   left: -180px;
   z-index: 0; 
   background-size: 1920px; 
   background-repeat: no-repeat;
}
.life-score-title-wrap { margin-bottom: 40px; align-items: flex-end; }
.life-score-section.age0::before { background-image: url(${images.life_score_section_0}); }
.life-score-section.age1::before { background-image: url(${images.life_score_section_1}); }
.life-score-section.age2::before { background-image: url(${images.life_score_section_2}); }
.life-score-section.age3::before { background-image: url(${images.life_score_section_3}); }
.life-score-section.age4::before { background-image: url(${images.life_score_section_4}); }
.life-score-section.age5::before { background-image: url(${images.life_score_section_5}); }
.life-score-section.age6::before { background-image: url(${images.life_score_section_6}); }
.life-score-section.age7::before { background-image: url(${images.life_score_section_7}); }
.life-score-title-wrap .img { width: 56px; }
.life-score-title { font-size: 48px; font-weight: bold; color:#000 }
.life-score-result-wrap { padding: 72px; border-radius: 20px; background: #ffffff; }
.life-score-result-wrap> .row-group { width: calc( 100% - 480px - 56px ); }
.life-score-result-wrap .title-wrap { padding-bottom: 56px; border-bottom: 2px solid #dedede; }
.life-score-result-wrap .title-wrap .icon { width: 130px; height: 130px; background-repeat: no-repeat; background-size: contain; background-position: center; }
.life-score-section.age0 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_0_on}); }
.life-score-section.age1 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_1_on}); }
.life-score-section.age2 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_2_on}); }
.life-score-section.age3 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_3_on}); }
.life-score-section.age4 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_4_on}); }
.life-score-section.age5 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_5_on}); }
.life-score-section.age6 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_6_on}); }
.life-score-section.age7 .life-score-result-wrap .title-wrap .icon { background-image: url(${images.age_icon_7_on}); }
.life-score-result-wrap .title-wrap .score { font-size: 56px; font-weight: bold; color: #00754a; }
.life-score-result-wrap .txt-group .default-txt { position: relative; }
.life-score-result-wrap .txt-group .default-txt:not(:last-child)::after { content: ''; display: block; position: absolute; width: 1px; height: 30px; background: #bfbfbf; right: -16px; top: 50%; transform: translate(-50%, -50%); }
.life-score-result-wrap .chart { position: relative; width: 480px; height: 480px; border-radius: 50%; background: #d9eee6; }
.life-score-result-wrap .chart-txt { display: block; position: absolute; width: 320px; height: 320px; background: #fff; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 50%; text-align: center; line-height: 320px; font-size: 72px; font-weight: bold; color: #00754a; }

/* 융합역량지수-07-02 인생점수 */
.green-border-box.center { text-align: center; align-items: center; padding: 32px; }
.icon-arrow-down { width: 40px; }
.icon-arrow-right { transform: rotate(-90deg); }
.icon-arrow-left { transform: rotate(90deg); }
.green-tip-box { 
   width: 50%; 
   padding: 32px 24px; 
   background: #d9eee6; 
   border-radius: 16px; 
   align-items: baseline; 
}
.green-tip-box.center { text-align: center; align-items: center; }
.green-tip-box .icon { width: 64px; height: 64px; border-radius: 50%; background: #155845; text-align: center; line-height: 64px; font-size: 26px; font-weight: bold; color: #fff; }
.green-tip-box .default-txt { color: #155845; }
.recons-img { width: 480px; }

/* 융합역량지수-08-01 metaQ */
.result-score.number { position: relative; margin-bottom: 88px; }
.result-score-num-wrap { position: absolute; bottom: -40px; width: 100%; justify-content: space-between; }
.result-score-num-wrap .num { font-size: 24px; transform: translateX(50%); }
.result-score-num-wrap .num:last-child { transform: translateX(0); }
.result-score-item .num { width: 64px; height: 64px; border: 4px solid #aaa; background: #fff; text-align: center; line-height: 56px; font-size: 24px; font-weight: 600; color: #aaa; border-radius: 50%; }
.result-score-wrap.type1 .result-score-item:nth-child(1) .num { border-color: #0077ff; color: #fff; background: #0077ff; }
.result-score-wrap.type2 .result-score-item:nth-child(2) .num { border-color: #fcc200; color: #fff; background: #fcc200; }
.result-score-wrap.type3 .result-score-item:nth-child(3) .num { border-color: #ff5b36; color: #fff; background: #ff5b36;}
.result-score-wrap.type4 .result-score-item:nth-child(4) .num { border-color: #d7262e; color: #fff; background: #d7262e; }

/* 융합역량지수-08-02-metaQ */
/* .strategy-1 { background-image: url(${images.growth_strategy_01}); background-repeat: no-repeat; background-size: 408px; background-position: bottom right 20px; } */
.strategy-1 { position:relative; }
.strategy-1::after{
   background-image: url(${images.growth_strategy_01});
}
.strategy-2 { position:relative; }
/* .strategy-2 { background-image: url(${images.growth_strategy_02}); background-repeat: no-repeat; background-size: 408px; background-position: bottom right 20px; } */
.strategy-2::after{background-image: url(${images.growth_strategy_02});}
.strategy-1::after, .strategy-2::after{
   content: "";
   display: block;
   clear: both;
   position: absolute;
   bottom: 0px;
   right: 20px;
   width: 400px;
   height: 315px;
   background-repeat: no-repeat;
   background-size: cover;
}

/* 융합역량지수-08-03 나의 강점 */
.section-top-08 .img { width: 258px; top: unset; bottom: 0; }
.letter-wrap { width: 1120px; margin: 0 auto; background: #fff; border-radius: 20px; border: solid 3px #eee; padding: 0 104px; padding-bottom: 560px; padding-top: 95px; position: relative; }
.letter-wrap::after { content: ''; display: block; width: 1280px; height: 685px; background-image: url(${images.letter_cover}); background-repeat: no-repeat; background-size: 100% 100%; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
.letter-wrap::before { content: ''; display: block; width: 1885px; height: 905px; background-image: url(${images.letter_bg}); background-repeat: no-repeat; background-size: 100% 100%; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
.letter-title-wrap { margin-bottom: 56px; text-align: center; }
.letter-sub-title { font-size: 30px; color: #9acc9a; }
.letter-title { font-size: 56px; font-weight: bold; }
.letter-item { justify-content: space-between; padding: 16px 0; border-bottom: 2px solid #00754a; min-height: 80px; }
.letter-item.min { max-width: 1088px; }

/* 융합역량지수-08-04 강점리스트 */
.check-list { flex-flow: wrap; gap: 16px; }
.check-item { width: calc( ( ( 100% - 16px * 4 ) / 5) ); padding: 22px 0; align-items: center; }
.check-icon { width: 36px; height: 36px; border-radius: 4px; border: 1px solid #707070; background: #fff; }
.check-txt { font-size: 30px; }

.input-box { width: 100%; height: 88px; border: 2px solid #c9c9c9; background: #fff; border-radius: 4px; position: relative; }
.input-box .icon { font-size: 40px; color: #00754a; position: absolute; left: 24px; top: 50%; transform: translateY(-50%); }
.example-box { padding: 30px; border-radius: 8px; background: #f5f5f5; }
.example-box .label { width: 64px; height: 36px; border-radius: 4px; background: #202020; color: #fff; text-align: center; line-height: 36px; font-size: 24px; margin-bottom: 8px; }

/* 융합역량지수-08-05 핵심가치 리스트 */
.check-list-wrap { gap: 40px; flex-flow: wrap; }
.check-list-wrap .green-border-box { width: calc( ( 100% - 80px ) / 3 ); padding: 32px; }
.check-list-title { height: 60px; line-height: 60px; border-radius: 30px; width: fit-content; padding: 0 32px; background: #CBE2DA; font-size: 30px; font-weight: bold; margin: 0 auto; }
.check-list-wrap .check-list { gap: 24px 0; }
.check-list-wrap .check-item { width: 50%; padding: 0; }
.check-list-wrap .check-item.wide { width: 100%; }
.al-en { align-items: flex-end; }

/* 융합역량지수-08-06-셀프코칭 */
.empty-box-wrap { align-items: flex-start; }
.empty-box { width: calc( 100% - 40px ); height: 188px; }
`

function App() {

  const [resultPageData, setResultPageData] = useState({
    name: "테스트 유저",
    age: 1,
    birth: "2024-11-21",
    complete_date: "2024-11-21",
    unrest: {
      score: 70,
      addition: true
    },
    melancholy: 60,
    anger: {
      score: 70,
      addition: true
    },
    digital: 60,
    stress: 50,
    burnout: 90,
    language: 85,
    math: 85.7,
    time: 92.8,
    body: 40.2,
    music: 41.2,
    relationship: 50,
    self: 78.7,
    nature: 60,
    W: 50,
    D: 50,
    P: 50,
    I: 50,
    L: 50,
    M: 50,
    S: 50,
    C: 50,
    power_str: "ax",
    power_num: 7,
    JC: 11,
    EC: 21,
    MR: 31,
    FE: 35,
    AE: 41,
    0: 60,
    10: 0,
    20: 0,
    30: 0,
    40: 0,
    50: 0,
    60: 0,
    70: 0,
    life_average: 60,
    metaQ: 170
  });

  // 페이지 리스트
  const printPageRefs = Array.from({ length: 40 }, () => React.createRef());
  
  // pdf 저장
  const handleDownloadPdf = async () => {

    const element = printPageRefs[0].current
    if (!element) {
      return
    }
    // ========== 기본 세팅 ========== 
    const pdf = new jsPDF('p', 'mm', 'a4');

    // A4 사이즈 기준으로 캔버스를 PDF 크기에 맞추기
    const pdfWidth = 210;
    const pdfHeight = 297;
    // 캔버스 크기와 PDF 크기 비율 계산
    const ratio = Math.min(pdfWidth / element.offsetWidth, pdfHeight / element.offsetHeight);

    // 이미지의 너비와 높이를 비율에 맞게 조정
    const imgWidth = element.offsetWidth * ratio;
    const imgHeight = element.offsetHeight * ratio;


    //  ========== 페이지 추가 ========== 
    for (let i = 0;i < printPageRefs.length;i++) {
      try {
        const element = printPageRefs[i].current;
        if (!element) {
          console.log('fail, i', element, i)
          continue;
        }
        const canvas = await html2canvas(element, {
          scale: 1.0,
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage(); // 첫 페이지는 addPage 필요 없음
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

        // setPdfDownload(Math.ceil(((i + 1) / printPageRefs.length) * 100))
        console.log(Math.ceil(((i + 1) / printPageRefs.length) * 100) + '%')
      } catch (error) {
        console.log(error)
      }
    }
    pdf.save(`insight_pdf_file_1.pdf`);
  }


  // ===== Chart =====
  // chart1
  const chartRef = useRef();

  useEffect(() => {
    const width = 600;
    const height = 600;

    const data = {
      name: "root",
      children: [
        { name: "음악", value: resultPageData.music, color: "#E5F1EC", borderColor: "#0C7B53" },
        { name: "신체운동", value: resultPageData.body, color: "#E5F1EC", borderColor: "#0C7B53" },
        { name: "논리수학", value: resultPageData.math, color: "#E5F1EC", borderColor: "#0C7B53" },
        { name: "시간공간", value: resultPageData.time, color: "#F2F2F2", borderColor: "#838383" },
        { name: "언어", value: resultPageData.language, color: "#FCEDEE", borderColor: "#E0585D" },
        { name: "대인관계", value: resultPageData.relationship, color: "#F2F2F2", borderColor: "#838383" },
        { name: "자기성찰", value: resultPageData.self, color: "#F2F2F2", borderColor: "#838383" },
        { name: "자연", value: resultPageData.nature, color: "#FCEDEE", borderColor: "#E0585D" },
      ],
    };

    const pack = (data) =>
      d3
        .pack()
        .size([width - 2, height - 2])
        .padding(3)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
        );

    const root = pack(data);

    // Select the SVG container
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "width: 100%; height: 100%; display: block;");

    const node = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.data.color || "none")
      .attr("stroke", (d) => d.data.borderColor)
      .attr("stroke-width", 2);

    node
      .filter((d) => d.depth !== 0)
      .append("text")
      .attr("class", "label")
      .attr("dy", "0.3em")
      .selectAll("tspan")
      .data((d) => [d.data.name, `${d.data.value}%`] || "")
      .join("tspan")
      .attr("x", "0")
      .attr("y", "-0.2em")
      .attr("dy", (d, i) => (i === 0 ? "0em" : "1.2em")) // 첫 번째 줄은 0em, 두 번째 줄은 1.2em
      .text((d) => d);
  }, []);

  // chart 2
  const data = {
    labels: [
      '음악',
      '신체운동',
      '논리수학',
      '시간공간',
      '언어',
      '대인관계',
      '자기성찰',
      '자연',
    ],
    datasets: [
      {
        label: '',
        data: [
          resultPageData.music,
          resultPageData.body,
          resultPageData.math,
          resultPageData.time,
          resultPageData.language,
          resultPageData.relationship,
          resultPageData.self,
          resultPageData.nature
        ],
        fill: true,
        backgroundColor: 'rgba(0, 117, 74, 0.2)',
        borderColor: '#00754a',
        borderWidth: 3,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        ticks: {
          stepSize: 20,
          font: {
            size: 18,
          },
        },
        pointLabels: {
          font: {
            size: 26,
            family: 'Pretendard',
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // chart 3
  const dataValues = [resultPageData.JC, resultPageData.EC, resultPageData.MR, resultPageData.FE, resultPageData.AE];

  const colors = dataValues.map(value => {
    if (value < 20) {
      return '#0077ff';
    } else if (value > 35) {
      return '#d7262e';
    } else {
      return '#007a10';
    }
  });

  const backgroundPlugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { y } } = chart;
      ctx.save();
      ctx.fillStyle = '#eeeeee';
      ctx.fillRect(left, y.getPixelForValue(35), right - left, y.getPixelForValue(20) - y.getPixelForValue(35));
      ctx.restore();
    },
  };

  const chartData = {
    labels: ['JC\n(판단&통제)', 'EC\n(허용&보호)', 'MR\n(이성&합리)', 'FE\n(자율&표현)', 'AD\n(순응&의존)'],
    datasets: [
      {
        label: 'My Data',
        data: dataValues,
        fill: false,
        borderColor: colors,
        borderWidth: 1,
        pointRadius: 10,
        pointBackgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: true,
        ticks: {
          stepSize: 20,
          font: {
            size: 24,
            weight: 600,
            family: 'Pretendard',
          },
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 50,
        ticks: {
          stepSize: 10,
          font: {
            size: 30,
            color: '#707070',
            family: 'Pretendard',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: '#202020',
        font: {
          size: 30,
        },
        align: 'top',
      },
    },
  };

  // chart 4 
  const chartValue2 = resultPageData.life_average;
  const chartData2 = {
    datasets: [
      {
        data: [chartValue2, 100 - chartValue2],
        backgroundColor: ["#00754a", "#ffffff00"],
        borderWidth: 0,
        borderRadius: 40,
      },
    ],
  };

  const chartOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '66.67%',
    hover: { mode: null },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  // ===== chart End =====

  // 데이터 계산
  const Ref3unrestScoreType = resultPageData.unrest.score <= 30 ? 'type1' : resultPageData.unrest.score <= 40 ? 'type2' : resultPageData.unrest.score <= 50 ? 'type3' : 'type4';
  const Ref3unrestDetailText = [
    {
      title: '당신은 <span class="color">정상적인 수준의 불안</span>을 경험하고 있는 상태입니다.',
      desc: '위험이나 고통, 공포, 스트레스 상황 등에서는 누구나 일정한 정도의 불안을 경험합니다. 정상적인 불안 반응은 앞으로 일어날 일들을 대비하고, 위험 상황에 적절하게 대응하기 위해 필요한 감정입니다. <br/><br/>다만, 나는 주로 어떤 상황에서 불안을 느끼는지 의식적으로 점검해 볼 필요가 있습니다. 이번 기회에 불안과 공포, 공황의 차이를 이해하고 정상적인 불안과 병적인 불안에 대해 살펴보면서 나와 다른 주변 사람들을 조금이나마 더 잘 이해할 수 있는 계기가 되기를 바랍니다. '
    },
    {
      title: '당신은 <span class="color">가벼운 정도의 불안</span>을 경험하고 있는 상태입니다.',
      desc: '위험이나 고통, 공포, 스트레스 상황 등에서는 누구나 일정한 정도의 불안을 경험합니다. 정상적인 불안 반응은 앞으로 일어날 일들을 대비하고, 위험 상황에 적절하게 대응하기 위해 필요한 감정입니다. 다만, 나는 주로 어떤 상황에서 불안을 느끼는지 의식적으로 점검해 볼 필요가 있습니다. 불안은, 불만과 함께 유발되는 정서적 반응입니다. 자신 안에 해소되지 않은 불만의 지점을 찾아보시길 권합니다.  <br/><br/>또한, 이번 기회에 불안과 공포, 공황의 차이를 이해하고 정상적인 불안과 병적인 불안에 대해 살펴보면서 나와 다른 주변 사람들을 조금이나마 더 잘 이해할 수 있는 계기가 되기를 바랍니다.'
    },
    {
      title: '당신은 <span class="color">상당한 정도의 불안</span>을 경험하고 있는 상태입니다.',
      desc: '위험이나 고통, 공포, 스트레스 상황 등에서는 누구나 일정한 정도의 불안을 경험합니다. 정상적인 불안 반응은 앞으로 일어날 일들을 대비하고, 위험 상황에 적절하게 대응하기 위해 필요한 감정입니다. 그러나 스트레스 상황에서 불안 공포에 압도되거나 과도한 반응으로 인해 일상생활이나 업무처리에 지장이 생긴다면 병적인 상태라고 볼 수 있습니다. 전문가와의 상담을 통해 자신의 불안 정서를 점검하고 대응 방안을 찾아보시길 권합니다.'
    },
    {
      title: '당신은 <span class="color">심한 불안</span>을 경험하고 있는 상태입니다. ',
      desc: '위험이나 고통, 공포, 스트레스 상황 등에서는 누구나 일정한 정도의 불안을 경험합니다. 정상적인 불안 반응은 앞으로 일어날 일들을 대비하고, 위험 상황에 적절하게 대응하기 위해 필요한 감정입니다. <br/><br/>그러나 스트레스 상황에서 불안 공포에 압도되거나 과도한 반응으로 인해 일상생활이나 업무처리에 지장이 생긴다면 병적인 상태라고 볼 수 있습니다. 빠른 시일 내에 전문가를 찾아 도움받으시길 권합니다.'
    },
  ]
  const Ref3selectDetailText = Ref3unrestScoreType === 'type1' ? Ref3unrestDetailText[0]
    : Ref3unrestScoreType === 'type2' ? Ref3unrestDetailText[1]
      : Ref3unrestScoreType === 'type3' ? Ref3unrestDetailText[2]
        : Ref3unrestDetailText[3];
  const Ref3PagesubText = '당신은 공황발작을 경험했을 가능성이 높습니다. 갑작스럽게 호흡곤란이나 심장마비와 같은 응급상황으로 느껴지는 극심한 불안 증상이 발작(attack)처럼 경험되는 상태를 말합니다. 공황발작 증상은 보통 갑작스럽게 발생하여 10분 안에 최고조에 이릅니다. 이 증상이 한 달 이상 지속하는 경우에는 전문의의 도움을 받아야 합니다. '

  // ref[4]
  const Ref4ScoreType = resultPageData.melancholy <= 30 ? 'type1' : resultPageData.melancholy <= 40 ? 'type2' : resultPageData.melancholy <= 50 ? 'type3' : 'type4';
  const Ref4DetailText = [
    {
      title: '당신은 <span class="color">정상적인 수준의 우울</span>을 경험하고 있는 상태입니다.',
      desc: '살아가면서 누구나 위기, 실패, 상실 등을 경험하고 이때에는 좌절감을 느끼고 자신감이 떨어지는 등의 감정변화를 경험합니다. 이와 같은 우울감은 누구나 경험할 수 있는 정서적 반응 중의 하나이며 보통 수준의 우울감은 시간이 지나면 서서히 회복됩니다. <br/><br/>다만, 나는 주로 어떤 상황에서 우울을 느끼는지 의식적으로 점검해 볼 필요가 있습니다. 우울은, 신경전달물질과 호르몬, 생체 리듬 등의 변화와 관련 있는 생화학적 요인, 스트레스 상황 등과 같은 환경적 요인, 유전적 요인 등에 의해 발생할 수 있습니다. 이번 기회에 우울한 기분과 우울증의 차이에 대해 살펴보면서 나와 다른 주변 사람들을 조금이나마 더 잘 이해할 수 있는 계기가 되기를 바랍니다. '
    },
    {
      title: '당신은 <span class="color">가벼운 정도의 우울</span>을 경험하고 있는 상태입니다. ',
      desc: '살아가면서 누구나 위기, 실패, 상실 등을 경험하고 이때에는 좌절감을 느끼고 자신감이 떨어지는 등의 감정변화를 경험합니다. 이와 같은 우울감은 누구나 경험할 수 있는 정서적 반응 중의 하나이며 보통 수준의 우울감은 시간이 지나면 서서히 회복됩니다. <br/><br/>다만, 나는 주로 어떤 상황에서 우울을 느끼는지 의식적으로 점검해 볼 필요가 있습니다. 우울은, 신경전달물질과 호르몬, 생체 리듬 등의 변화와 관련 있는 생화학적 요인, 스트레스 상황 등과 같은 환경적 요인, 유전적 요인 등에 의해 발생할 수 있습니다. '
    },
    {
      title: '당신은 <span class="color">상당한 정도의 우울</span>을 경험하고 있는 상태입니다. ',
      desc: '살아가면서 누구나 위기, 실패, 상실 등을 경험하고 이때에는 좌절감을 느끼고 자신감이 떨어지는 등의 감정변화를 경험합니다. 이와 같은 우울감은 학력이나 지위, 경제적 수준 등과 관계없이 누구나 경험할 수 있는 정서적 반응 중의 하나이며 보통, 우울감은 시간이 지나면 서서히 회복됩니다. 그러나 일반적인 수준의 우울감을 넘어 우울증을 겪는 사람들은 대부분 의욕이 없고 무기력, 무감동하며 자신을 무능하고 무가치하게 느낍니다. 이런 상태가 지속 되면서 업무수행에 지장이 생기고 일상생활이 어려워집니다. 전문가와의 상담을 통해 자신의 우울 정서를 점검하고 대응 방안을 찾아보시길 권합니다. '
    },
    {
      title: '당신은 <span class="color">심한 우울</span>을 경험하고 있는 상태입니다. ',
      desc: '살아가면서 누구나 위기, 실패, 상실 등을 경험하고 이때에는 좌절감을 느끼고 자신감이 떨어지는 등의 감정변화를 경험합니다. 이와 같은 우울감은 학력이나 지위, 경제적 수준 등과 관계없이 누구나 경험할 수 있는 정서적 반응 중의 하나이며 보통, 우울감은 시간이 지나면 서서히 회복됩니다. 그러나 일반적인 수준의 우울감을 넘어 우울증을 겪는 사람들은 대부분 의욕이 없고 무기력, 무감동하며 자신을 무능하고 무가치하게 느낍니다. 이런 상태가 지속 되면서 업무수행에 지장이 생기고 일상생활이 어려워집니다. 빠른 시일 내에 전문가를 찾아 도움 받으시길 권합니다. '
    },
  ]
  const Ref4selectDetailText = Ref4ScoreType === 'type1' ? Ref4DetailText[0]
    : Ref4ScoreType === 'type2' ? Ref4DetailText[1]
      : Ref4ScoreType === 'type3' ? Ref4DetailText[2]
        : Ref4DetailText[3];

  // ref[7]
  const Ref7ScoreType = resultPageData.anger.score <= 30 ? 'type1' : resultPageData.anger.score <= 40 ? 'type2' : resultPageData.anger.score <= 50 ? 'type3' : 'type4';
  const Ref7DetailText = [
    {
      title: '당신은 <span class="color">정상적인 수준의 분노</span>를 경험하고 있는 상태입니다.',
      desc: '살아가면서 우리는 “누구 때문에 화가 났다”고 말하는 경우가 많습니다. 누군가의 행동이나 어떤 상황 때문에 화가 난 것처럼 보이지만, 실제로는 우리의 기대가 충족되지 않았을 때 분노하는 경우가 많습니다. 분노는 우리가 상황을 어떻게 해석하는지, 무엇을 기대하는지에 따라 달라질 수 있습니다. 분노 뒤에 숨겨진 진짜 이유를 이해하려고 노력한다면 보다 평화로운 마음을 가질 수 있고 안정적인 생활을 할 수 있습니다. 나의 평화를 방해하는, 쉽게 분노하는 타인을 대할 때에도 이와 같은 방식으로 분노 뒤에 숨겨진 진짜 이유를 보려는 노력이 필요합니다. '
    },
    {
      title: '당신은 <span class="color">가벼운 정도의 분노</span>를 경험하고 있는 상태입니다. ',
      desc: '살아가면서 우리는 “누구 때문에 화가 났다”고 말하는 경우가 많습니다. 누군가의 행동이나 어떤 상황 때문에 화가 난 것처럼 보이지만, 실제로는 우리의 기대가 충족되지 않았을 때 분노하는 경우가 많습니다. 분노는 우리가 상황을 어떻게 해석하는지, 무엇을 기대하는지에 따라 달라질 수 있습니다. 분노 뒤에 숨겨진 진짜 이유를 이해하려고 노력한다면 보다 평화로운 마음을 가질 수 있고 안정적인 생활을 할 수 있습니다. 나의 평화를 방해하는, 쉽게 분노하는 타인을 대할 때에도 이와 같은 방식으로 분노 뒤에 숨겨진 진짜 이유를 보려는 노력이 필요합니다.'
    },
    {
      title: '당신은 <span class="color">상당한 정도의 분노</span>를 경험하고 있는 상태입니다. ',
      desc: '살아가면서 우리는 “누구 때문에 화가 났다”고 말하는 경우가 많습니다. 누군가의 행동이나 어떤 상황 때문에 화가 난 것처럼 보이지만, 실제로는 우리의 기대가 충족되지 않았을 때 분노하는 경우가 많습니다. 분노는 우리가 상황을 어떻게 해석하는지, 무엇을 기대하는지에 따라 달라질 수 있습니다. 분노 뒤에 숨겨진 진짜 이유를 이해할 수 있어야 합니다. 분노는 보편적인 인간의 감정이지만 치미는 분노를 참지 못하고 항상 어떤 방식으로든 표출하는 사람들은 대인관계의 어려움을 겪을 가능성이 있습니다. 이를 극복하기 위해 전문가의 도움을 받는 것이 좋겠습니다. '
    },
    {
      title: '당신은 <span class="color">심한 분노</span>를 경험하고 있는 상태입니다. ',
      desc: '누군가의 행동이나 어떤 상황 때문에 화가 난 것처럼 보이지만, 실제로는 우리의 기대가 충족되지 않았을 때 분노하는 경우가 많습니다. 분노는 우리가 상황을 어떻게 해석하는지, 무엇을 기대하는지에 따라 달라질 수 있습니다. 분노 뒤에 숨겨진 진짜 이유를 이해할 수 있어야 합니다. 일반적인 수준의 분노를 넘어, 치미는 분노를 참지 못하고 항상 어떤 방식으로든 표출하는 사람들은 대인관계의 어려움을 겪을 가능성이 있습니다. 당신은 거의 항상 화가 나 있거나, 언제든 화를 낼 준비가 되어 있는 상태로 보일 수 있습니다. 이런 상태가 지속되면 업무수행에 지장이 생기고 원만한 대인관계를 통한 일상생활이 어려워집니다. 빠른 시일 내에 전문가를 찾아 도움받으시길 권합니다. '
    },
  ];
  const Ref7selectDetailText = Ref7ScoreType === 'type1' ? Ref7DetailText[0]
    : Ref7ScoreType === 'type2' ? Ref7DetailText[1]
      : Ref7ScoreType === 'type3' ? Ref7DetailText[2]
        : Ref7DetailText[3];
  const Ref7PagesubText = '폭력이 동반될 수도 있는 폭발적 분노 표현을 특징으로 하는 행동 장애로, 별로 중요하지 않은 사건에 대해서도 상황에 맞지 않게 분노를 폭발하는 증상을 보입니다. 분노를 표현하는 것을 문제해결의 가장 효과적인 방법으로 여겨 이와 같은 행동을 반복적으로 하는 특징이 있습니다. 호르몬 분비의 이상, 뇌 기능의 이상, 학대 경험 등과 같은 환경적 요인 등이 복합적으로 작용하여 발생할 수 있습니다. 정확히 진단하기 위해서는 정신건강의학 전문가의 도움이 필요합니다. '

  // ref[9]
  const Ref9ScoreType = resultPageData.digital <= 25 ? 'type1' : resultPageData.digital <= 50 ? 'type2' : 'type3';
  const Ref9DetailText = [
    {
      title: '당신은 <span class="color">일반적인 수준의 디지털 의존도</span>를 보이고 있는 상태입니다.',
      desc: '웨어러블 디지털 기기가 보편화된 사회에서 사람들이 온라인 상태에 있는 평균시간은 점차 증가하고 있습니다. 그러나 당신은 다소 장시간 온라인을 해도 마음만 먹으면 인터넷 사용을 스스로 통제할 수 있는 정도입니다. 학업이나 업무수행, 일상생활에서의 자기 행동 관리에 문제가 없습니다. 하지만 누구나 ‘실제의 나’와 ‘되고 싶은 나’의 모습을 혼동할 가능성이 있습니다. 의식적으로 나의 행동 패턴을 구체적이고 현실적인 방식으로 파악할 필요가 있습니다.'
    },
    {
      title: '당신은 <span class="color">잠재적 위험군 수준의 디지털 의존도</span>를 보이고 있는 상태입니다. ',
      desc: '웨어러블 디지털 기기가 보편화된 사회에서 사람들이 온라인 상태에 있는 평균시간은 점차 증가하고 있습니다. 당신은 인터넷 사용으로 크고 작은 문제들을 경험하고 있으며, 디지털 의존 현상이 실생활에도 부정적 영향을 미치는 상태입니다. 그러나 본인은 ‘이 정도는 문제 되지 않는다’고 생각할 수 있습니다. 지금과 같은 상황이 지속될 경우 정서적, 학습적, 업무적으로 문제가 발생할 수 있는 위험이 있으므로 새로운 생활습관 형성과 자기조절 능력 키우기에 노력해야 합니다. '
    },
    {
      title: '당신은 <span class="color">고위험군 수준의 디지털 의존도</span>를 보이고 있는 상태입니다. ',
      desc: '인터넷 사용으로 인해 수면 시간도 매우 줄어들고 현실 생활에서도 인터넷에 접속하고 있는 듯한 착각을 하기도 하며 일상생활에서 장애 증상을 보일 수 있습니다. 대게 자신이 인터넷중독이라고 느끼며, 학업 곤란, 업무수행능력 저하, 심리적 불안정감, 우울한 기분, 대인관계 어려움 등을 겪습니다. 자기조절에 심각한 어려움을 보이며 충동성도 높은 편입니다. 인터넷중독 등 디지털 의존도 관련 상담 및 회복기관의 도움이 필요한 상황입니다. '
    },
  ]
  const Ref9selectDetailText = Ref9ScoreType === 'type1' ? Ref9DetailText[0]
    : Ref9ScoreType === 'type2' ? Ref9DetailText[1]
      : Ref9DetailText[2]

  const Ref9StressScoreType = resultPageData.stress <= 35 ? 'type1' : resultPageData.stress <= 50 ? 'type2' : resultPageData.stress <= 70 ? 'type3' : 'type4';
  const Ref9StressDetailText = [
    {
      title: '당신은 <span class="color">일반적인 수준의 스트레스</span>를 경험하고 있는 상태입니다. 일상생활에서 비교적 편안하게 느끼고 있음을 나타냅니다.',
      desc: "스트레스(Stress)의 어원은 '팽팽하게 조이다'라는 뜻의 라틴어 스트링게르(Stringer)로 알려져 있습니다. 물리학 분야에서 사용하기 시작했으나 20세기 들어 인체와의 상관관계가 연구되면서 그 개념이 확장되었습니다. 일반적으로 스트레스를 일으키는 요인은 업무와 가족, 대인관계 등에서 발생하는 ‘사회적 요인’, 질병이나 노화, 호르몬 변화 등에 의해 생기는 ‘생리적 요인’, 과로나 수면 부족, 한정된 공간 등과 같은 ‘환경적 요인’, 성격적 특징이나 자존감과 의존증 등에 의한 ‘심리적 요인’ 등이 있습니다. ‘스트레스’라고 하면 주로 그 요인이 무엇인지를 찾는 데에만 집중하지만, 스트레스 요인과 이에 대한 신체적 반응까지를 합한 의미입니다. 즉, 외부 자극이나 변화에 대한 개인의 신체적, 정신적, 행동적 반응 또는 적응을 의미하는 것으로 폭넓은 이해가 필요합니다. "
    },
    {
      title: '당신은 <span class="color">초기단계 수준의 스트레스</span>를 경험하고 있는 상태입니다. ',
      desc: "스트레스(Stress)의 어원은 '팽팽하게 조이다'라는 뜻의 라틴어 스트링게르(Stringer)로 알려져 있습니다. 물리학 분야에서 사용하기 시작했으나 20세기 들어 인체와의 상관관계가 연구되면서 그 개념이 확장되었습니다. 일반적으로 스트레스를 일으키는 요인은 업무와 가족, 대인관계 등에서 발생하는 ‘사회적 요인’, 질병이나 노화, 호르몬 변화 등에 의해 생기는 ‘생리적 요인’, 과로나 수면 부족, 한정된 공간 등과 같은 ‘환경적 요인’, 성격적 특징이나 자존감과 의존증 등에 의한 ‘심리적 요인’ 등이 있습니다. 초기단계 수준의 스트레스를 경험하고 있는 당신은 일상생활에서의 지장은 없겠으나 자신의 감정과 건강을 주시하고 의식적으로 관리하시길 권합니다. "
    },
    {
      title: '당신은 <span class="color">중증 수준의 스트레스</span>를 경험하고 있는 상태입니다.',
      desc: "스트레스(Stress)의 어원은 '팽팽하게 조이다'라는 뜻의 라틴어 스트링게르(Stringer)로 알려져 있습니다. 물리학 분야에서 사용하기 시작했으나 20세기 들어 인체와의 상관관계가 연구되면서 그 개념이 확장되었습니다. ‘스트레스’라고 하면 주로 그 요인이 무엇인지를 찾는 데에만 집중하지만, 스트레스 요인과 이에 대한 신체적 반응까지를 합한 의미입니다. 즉, 외부 자극이나 변화에 대한 개인의 신체적, 정신적, 행동적 반응 또는 적응을 의미하는 것으로 폭넓은 이해가 필요합니다. 중간 정도의 지수는 일상생활에서 어느 정도의 문제를 경험하고 있음을 시사합니다. 스트레스 관리의 목표는 모든 스트레스를 없애는 것이 아닙니다. 스트레스는 때로 유용한 자극이 되어 최고의 실적을 내는데 동기부여 기능을 하기도 합니다. 삶의 질과 활력을 유지하면서 스트레스의 악영향을 제한하는 것, 즉 스트레스가 너무 많지도 적지도 않은 최적의 상태를 유지하기 위해 꾸준히 노력하고 관리하는 자세가 중요합니다."
    },
    {
      title: '당신은 <span class="color">매우 심각한 수준의 스트레스</span>를 경험하고 있는 상태입니다. ',
      desc: '높은 지수는 현재 상당한 문제적 상황을 경험하고 있음을 나타내며, 이는 신체적, 정서적 건강에 부정적인 영향을 미칠 수 있습니다. 스트레스 관리의 목표는 모든 스트레스를 없애는 것이 아닙니다. 스트레스는 때로 유용한 자극이 되어 최고의 실적을 내는데 동기부여 기능을 하기도 합니다. 삶의 질과 활력을 유지하면서 스트레스의 악영향을 제한하는 것, 즉 스트레스가 너무 많지도 적지도 않은 최적의 상태를 유지하기 위해 꾸준히 노력하고 관리하는 자세가 중요합니다. 그러나 당신은 이미 높은 수준의 스트레스를 경험하고 있습니다. 이 경우 적극적으로 전문가의 도움을 구하고, 관리 전략을 개발하여 삶의 질을 개선하시길 권합니다. '
    },
  ]
  const Ref9StressSelectDetailText = Ref9StressScoreType === 'type1' ? Ref9StressDetailText[0]
    : Ref9StressScoreType === 'type2' ? Ref9StressDetailText[1]
      : Ref9StressScoreType === 'type3' ? Ref9StressDetailText[2]
        : Ref9StressDetailText[3];

  // ref[10]
  const Ref10ScoreType = resultPageData.burnout <= 15 ? 'type1' : resultPageData.burnout <= 35 ? 'type2' : resultPageData.burnout <= 60 ? 'type3' : 'type4';
  const Ref10StressDetailText = [
    {
      title: '당신은 <span class="color">일반적인 수준의 업무집중도</span>를 보이고 있는 상태입니다.',
      desc: "일을 통해 삶의 활력을 얻고 자신의 존재 이유와 가치를 확인합니다. 새로 시작한 일 혹은 주어진 일에 최선을 다해 열정을 쏟는 정도로, 일과 삶의 균형을 적절하게 잘 유지하고 있습니다. 지금과 같은 상태가 잘 유지 관리 될 수 있도록 업무 외에 기분전환의 기회를 꾸준히 가지시길 권합니다. 다만, 이번 기회에 스트레스와 번아웃 증후군의 차이를 살펴보면서 주변에 이로 인해 어려움을 겪는 사람들을 조금이나마 가깝게 이해할 수 있게 되기를 바랍니다."
    },
    {
      title: '당신은 <span class="color">초기단계 수준의 번아웃 증후군</span>을 보이고 있는 상태입니다. ',
      desc: "나의 일에 집중도를 높여 몰두하고 성과를 내기 위해 주변인들과의 시간을 줄입니다. 때에 따라서는 본인의 식사와 휴식 시간까지도 일하는 데 집중하며, 이것이 별문제가 아니라고 생각합니다. 그러나 이와 같은 일상이 지속되는 상황에서 업무가 가중된다면 중증 수준의 번아웃 단계로 진입할 위험성이 있습니다. 정기적인 휴식 시간과 업무 외에 기분전환의 기회를 꾸준히 만들어 일과 삶이 건강한 균형을 이룰 수 있도록 의식적으로 노력하시길 권합니다. 또한, 이번 기회에 일반적인 스트레스와 번아웃 증후군의 차이에 대해 이해할 수 있기를 바랍니다. "
    },
    {
      title: '당신은 <span class="color">중증 수준의 번아웃 증후군</span>을 보이고 있는 상태입니다. ',
      desc: "일적인 면에서는 인정을 받을 수 있지만 충분한 휴식, 취미생활, 대인관계 등의 개념 없이 지속적으로 일만 생각하는 단계입니다. 주변인과의 갈등에 날카롭게 반응하며, 일에 방해가 되는 사회적인 어떤 관계도 맺지 않거나 불편함을 겪게 됩니다. 업무로 인한 스트레스를 술이나 약물, 쇼핑, 폭식 등에 의지해 해결하기도 합니다. 이상함을 감지한 주변에서 관심을 갖고 나의 상태에 대해 물어보기 시작합니다. 고민을 나눌 수 있는 가까운 친구나 동료, 또는 지인이 있다면 답답한 마음을 표출하는 것도 많은 도움이 됩니다. 다만, 혼자서 극복하기가 어렵다고 생각되면 전문가의 도움을 받아보시길 권합니다. "
    },
    {
      title: '당신은 <span class="color">매우 심각한 수준의 번아웃 증후군</span>을 보이고 있는 상태입니다. ',
      desc: "내면의 공허함이 생기기 시작하며 이 공허함을 해결하기 위하여 술이나 약물, 쇼핑, 폭식 등에 의지했을 가능성이 높습니다. 당신을 이해하지 못하는 주변인에게는 더 방어적 태도를 취하게 되며 스스로의 건강도 방치합니다. 이러한 상황이 지속되는 동안, 많은 괴로움과 심적인 피로감에 지쳐있는 상태일 수 있습니다. 더 이상 자신을 방치하지 말고, 바로 전문가의 도움을 받아보실 것을 권해드립니다."
    },
  ]
  const Ref10StressSelectDetailText = Ref10ScoreType === 'type1' ? Ref10StressDetailText[0]
    : Ref10ScoreType === 'type2' ? Ref10StressDetailText[1]
      : Ref10ScoreType === 'type3' ? Ref10StressDetailText[2]
        : Ref10StressDetailText[3];

  // ref[12]
  const ref12DataList = [
    { name: '언어', value: resultPageData.language, dataName: 'language', img: 'icon_lang' },
    { name: '논리수학', value: resultPageData.math, dataName: 'math', img: 'icon_logic' },
    { name: '시간·공간', value: resultPageData.time, dataName: 'time', img: 'icon_space' },
    { name: '신체운동감각', value: resultPageData.body, dataName: 'body', img: 'icon_physical' },
    { name: '음악', value: resultPageData.music, dataName: 'music', img: 'icon_music' },
    { name: '대인관계', value: resultPageData.relationship, dataName: 'relationship', img: 'icon_physical' },
    { name: '자기성찰', value: resultPageData.self, dataName: 'self', img: 'icon_friendly' },
    { name: '자연', value: resultPageData.nature, dataName: 'nature', img: 'icon_nature' },
  ];
  const ref12SortedList = ref12DataList.sort((a, b) => b.value - a.value);
  const ref12TopThree = ref12SortedList.slice(0, 3); // 가장 높은 거 3개
  const ref12BottomTwo = ref12SortedList.slice(-2).reverse(); // 가장 낮은 거 2개

  // ref[22]
  const ref12Text = {
    DPLC: {
      name: 'DPLC 체험형',
      desc: [
        '다양한 사람들과 교류하면서 당신을 드러내고 표현해야 합니다. ',
        '당신의 생각, 아이디어 등을 다른 사람들에게 말하는 연습을 해야 합니다.',
        '사실적인 정보 외에도 이론적이고 추상적인 개념에도 집중해야 합니다.',
        '다른 사람의 생각과 감정에 관심을 갖고, 공감을 먼저 하는 연습을 해야 합니다. ',
      ]
    },
    DPMC: {
      name: 'DPMC 인내형',
      desc: [
        '상대에 대한 당신의 마음을 말과 행동으로 표현하는 연습을 해야 합니다.',
        '당신이 성취한 일을 다른 사람들에게 이야기하고 그들의 인정을 받는 경험을 해야 합니다.',
        '자신만의 시간과 공간을 마련하여 당신의 감정과 욕구에 귀 기울여야 합니다. ',
        '당신의 기준과 이상이 현실성 있고 실현 가능한 것인지 검토해보세요.',
        '계획을 세워서 목표를 달성하고 성취감을 느껴보세요.  ',
      ]
    },
    WPLC: {
      name: 'WPLC 열정형',
      desc: [
        '구체적이고 사실적인 것뿐만 아니라, 추상적이고 이론적인 것에도 집중하는 것이 필요합니다. ',
        '일의 목표와 계획을 세울 때 다른 사람들의 의견을 반영하는 것이 좋습니다.',
        '다른 사람의 감정, 욕구, 가치관 등을 파악하고 배려해야 합니다. ',
        '빠르게 해결하기 보다는, 그 해결책이 당신과 집단에 미칠 영향을 고려해보세요.  ',
      ]
    },
    WPMC: {
      name: 'WPMC 낙천형',
      desc: [
        '객관적이고 논리적으로 상황을 판단하고 결정을 하는 연습이 필요합니다. ',
        '이론이 뒷받침되면 당신의 지식과 경험은 더 풍부해질 수 있다는 사실을 기억하세요. ',
        '다양한 관심사와 더불어, 깊이 있게 공부하는 경험도 필요합니다. ',
        '계획을 세우고 그 계획대로 일을 진행하는 연습을 해야 합니다.',
      ]
    },
    DIMC: {
      name: 'DIMC 개성형',
      desc: [
        '지금까지 자기성찰에 집중했다면, 이제 행동으로 옮겨야 할 때입니다.',
        '소진되지 않도록 당신만의 시간과 공간을 마련해서 휴식을 취하고 자신을 돌봐야 합니다. ',
        '당신의 계획이 현실적인지 검토해봐야 합니다.',
        '다른 사람들과 건강하게 비판적인 피드백을 주고 받는 연습을 해야 합니다. ',
        '당신의 아이디어, 가치관 등을 다른 사람들과 공유하고 도움을 받으세요. ',
      ]
    },
    DIMS: {
      name: 'DIMS 고뇌형',
      desc: [
        '의견을 명확하고 자신있게 표현해야 합니다.',
        '당신의 계획을 이룰 수 없다고 판단되면, 적절한 때에 포기해야 합니다. ',
        '개방적인 태도로 정보를 받아들이고 다양한 관점으로 세상을 보도록 노력해야 합니다. ',
        '당신만의 시간과 공간에서 자신의 감정과 욕구는 어떤지 살펴보세요.',
        '비판적인 피드백을 당신에 대한 공격으로 받아들이지 않는 연습이 필요합니다. ',
      ]
    },
    WIMC: {
      name: 'WIMC 재미형',
      desc: [
        '른 사람의 생각, 가치관이나 삶에 과도하게 개입하지 않는 것이 좋습니다. ',
        '목표를 세우고 계획하여 당신이 계획한 활동을 신중하게 수행하고 완료하는 것이 필요합니다. ',
        '당신이 지루함을 느낄 수 있는 세부적이고 반복되는 작업을 해보는 연습이 필요합니다.',
        '비판적인 피드백을 공격적인 것이 아니라, 성장을 위한 밑거름이라고 받아들이세요. ',
        '주위 사람들과 충분히 논의하면서 심사숙고하여 결정을 하세요.',
      ]
    },
    WIMS: {
      name: 'WIMS 격려형 ',
      desc: [
        '지나치게 충성하거나 헌신적으로 되지 않도록 신경 써야 합니다. ',
        '집단이나 대의명분에 맹목적으로 따르지 않도록 주의가 필요합니다. ',
        '사람들이 모두 나의 상식과 같지 않다는 사실을 기억하세요.',
        '사람들의 요구에 과하게 집중하는 것을 피해야 합니다. ',
        '조언이나 피드백을 할 때는 사적인 생각보다는 타인의 성장에 집중하여 객관적이고 유용한 내용을 전할 필요가 있습니다. ',
        '결정을 할때는 충분한 시간을 가져도 괜찮다는 사실을 기억하세요.',
        '발표를 할 때는 객관적인 정보를 제공하고 세부사항의 경우 초점을 유지해야 한다는 사실을 기억하세요.',
      ]
    },
    WPLS: {
      name: 'WPLS 성과형',
      desc: [
        '다른 사람에게 높은 기준을 적용하지 않도록 주의해야 합니다.',
        '다른 사람의 감정, 욕구 등을 파악하고 세심하게 반응해야 합니다. ',
        '다른 사람의 생각, 강점, 능력을 인정하고 칭찬할 수 있도록 노력해야 합니다. ',
        '맥락을 잘 파악하고 주의를 기울여야 합니다. ',
      ]
    },
    WPMS: {
      name: 'WPMS 사교형',
      desc: [
        '지나치게 많은 일을 하거나 소진되지 않도록, 분별력 있게 ‘아니오’라고 말하는 연습이 필요합니다. ',
        '공식적인 방식으로 피드백을 주고 받는 연습이 필요합니다. ',
        '시도해 보지 않은 방식을 제안받았거나 빠른 의사결정을 요구받을 때 조금 더 유연해질 필요가 있습니다. ',
        '새로운 방식으로 일을 하게 될 때 다른 사람들의 생각과 의견을 충분히 새겨들을 필요가 있습니다. ',
        '세부사항에 집착하기보다는 맥락을 파악하며 큰 그림을 살펴야 한다는 점을 기억해야 합니다. ',
      ]
    },
    DPLS: {
      name: 'DPLS 안정형',
      desc: [
        '변화와 혁신에 더욱 개방적인 태도로 재처할 필요가 있습니다. ',
        '의사결정을 할 때 감정과 가치관의 영향을 고려할 필요가 있다는 사실을 기억해야 합니다. ',
        '눈앞의 성과나 세부사항에 너무 집중한 나머지 민감한 상호작용이나 큰 그림을 놓치지 않도록 조심해야 합니다. ',
        '조직에서 규칙을 적용할 때 융통성을 발휘할 필요가 있습니다. ',
        '할 수 있는 일이라고 할지라도, 추가적인 부담이 되는 일에는 ‘아니오’라고 말할 수 있는 선택과 집중력을 키워야 합니다. ',
      ]
    },
    DPMS: {
      name: 'DPMS 양육형',
      desc: [
        '자신의 생각이나 의견을 적극적으로 표현하며 자신만의 리더십을 발휘할 필요가 있습니다.',
        '아이디어와 성과를 자주 공유하는 방법을 익히는 것이 좋습니다. ',
        '갈등이 발생할 수 있음을 기억하고, 불안한 마음을 좀 더 편안하게 받아들일 수 있도록 단련할 필요가 있습니다. ',
        '그동안 시도해보지 않았던 새로운 일들이나 방법을 실행해보고 다가오는 변화에 개방적인 태도를 취할 필요가 있습니다. ',
        '단기적이고 세부적인 일과 장기적이고 미래지향적인 일 사이에 균형을 잡을 수 있도록 노력해야 합니다. ',
      ]
    },
    WILC: {
      name: 'WILC 표현형',
      desc: [
        '감정에 더 초점을 맞추고 세심하게 반응하는 것이 중요합니다. ',
        '다른 사람을 인정하고 그들에 대한 마음을 표현하는 것이 필요합니다. ',
        '현실과 이상 사이에서 적절한 균형점을 찾아보세요. ',
        '맥락 파악과 더불어 세부적이고 구체적인 사항에도 주의를 기울여야 합니다. ',
        '계획을 이루기 위해서 일상의 규범이나 규칙을 준수하도록 노력해야 합니다. ',
      ]
    },
    WILS: {
      name: 'WILS 체계형',
      desc: [
        '당신과 관계 맺고 있는 사람들에게 관심을 갖고, 그들이 어떤 사람인지 알아가는 노력을 해야 합니다. ',
        '당신의 기준으로 다른 사람을 판단하지 말고, 그들이 가진 강점과 능력을 볼 수 있어야 합니다. ',
        '일을 빠르게 하기보다는 지금보다 여유로운 마음으로 진행해야 합니다. ',
        '동료들과 함께 논의하면서 결정을 내리는 것이 필요합니다. ',
      ]
    },
    DILC: {
      name: 'DILC 독립형',
      desc: [
        '당신의 관심 분야 외에도 열린 태도로 다양한 사람, 분야에 관심을 갖도록 노력해야 합니다. ',
        '여러 사람들과 교류하며 상호작용 하는 노력을 해야 합니다. ',
        '당신의 일에만 몰두하기보다 주변에서 벌어지는 일들에 주의를 기울이도록 해야 합니다. ',
        '아이디어를 체계적으로 정리하는 연습이 필요합니다. ',
      ]
    },
    DILS: {
      name: 'DILS 효율형',
      desc: [
        '세상과 사람에 대한 개방적이고 유연한 태도를 가져야 합니다. ',
        '다른 사람의 생각, 감정 등에 관심을 갖고 민감하게 파악하도록 노력해야 합니다. ',
        '다른 사람의 실수나 잘못을 질책하기보다 먼저 포용력 있는 태도로 받아들이는 연습을 해야 합니다. ',
        '다른 사람들과 일을 계획하고 협업하는 자세를 가져야 합니다.',
        '세부적이고 구체적인 사항에 집중하고 주의를 기울이는 연습이 필요합니다. ',
      ]
    },
  }


  // ref[33, 34]
  const Ref33DetailText = [
    {
      img: 'metaq_1',
      score: 20,
      title: '수치심의 단계',
      desc: '자기부정, 자기비하, 치욕, 죽임, 비참함, 굴욕, 잔인함, 자포자기, 존재부정',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '전통적으로 수치심은 추방을 동반하며, 원시적 사회에서 추방은 죽음과 동일합니다. 성적 학대 같은 수치심으로 이어지는 어린 시절의 경험은 치료하여 문제가 해결되지 않는다면, 종종 인생을 비관적으로 바라보는 성격을 가지게 합니다. 수치심은 동시에 신경증을 만들어냅니다. 수치심에 기반한 인격은 존재 자체를 부끄러워 하고, 고립되며 내성적입니다. 수치심은 잔인함의 도구로 사용되기도 합니다. 희생자들 자신도 때로는 잔인해지며, 수치스러운 아이들은 동물에게 잔인하고 서로에게도 잔인하게 대합니다. ',
      streamOfConsciousness:
        `
            이 의식 수준에 있는 사람들은 타인에게 비난받는 형태의 환각이 생기기 쉽고, 편집증적 성향을 가지게 됩니다. 수치심에 기반한 일부 개인은 완벽주의와 완고함으로 보상하며, 자주 강박적으로 몰리게 되고 편협해 집니다. 예를 들어 도덕적 극단주의자들은 다른 사람에게 자신의 무의식적 수치심을 투사하고, 정의에 입각해 타인을 공격하거나 죽이는 것을 정당하게 생각합니다. 극단적으로 연쇄 살인자들은 가령 성적 도덕주의자로 자처하며 이른바 ‘나쁜 여성들을 벌하는 행동이었다’라고 하며 자신의 범죄를 정당화하기도 합니다. 수치심은 사람의 인격 수준 전체를 끌어내리므로, 결과적으로 다른 부정적 감정의 원천이 되고, 거짓 자부심, 분노, 죄책감을 생성합니다.
   
            감당할 수 없는 자기(Ego)를 당면하면 자기를 부정합니다. 그것은 ‘내’가 아니라고 말합니다. 스스로를 부정하며 단죄합니다. 
            
            발달심리학자 에릭슨(Erick Erikson)에 의하면 아이들은 정신적 발달의 2단계에 수치심을 느끼기 시작합니다. 하지만 그보다 앞선 1단계에서는 반드시 기초적인 신뢰감이 있어야 하며 반드시 신뢰감이 불신감보다 더 강해야 한다고 합니다. 우리는 세상을 알기 전 먼저 신뢰감부터 갖게 됩니다. 우리가 제일 먼저 접하게 되는 세상은 바로 우리를 돌보아 주는 부모입니다. 
   
            우리는 누군가가 우리를 위해 존재하며 우리를 돌보아 준다는 것을 먼저 배워야 합니다. 그러므로 우리를 보살펴주는 사람들이 믿을 만하고 예측 가능한 행동을 하는 사람이어야 합니다. 그리고 자신의 행동을 반영해 주고 의지할 수 있어야 세상을 신뢰할 수 있는 힘을 얻게 됩니다. 부모와의 신뢰 관계는 세상으로 가는 도약의 모든 교량이 됩니다. 그리고 그 교량은 우리의 가치를 가늠할 수 있는 척도가 됩니다.
            삶의 아주 초기부터 우리는 돌보는 주된 양육자의 눈이 어떻게 거울의 역할을 하느냐를 보고 자신에 대해 알게 됩니다. 그러므로 성장하려면 먼저 우리를 돌보아주는 사람들과 신뢰 관계부터 구축해야 합니다. 아이와 아이를 돌보아 주는 사람과의 관계는 상호 간의 교류를 통해 점진적으로 발전해 갑니다. 
   
            진실로 신뢰란, 상대방의 성숙한 행위를 통해 발전합니다. 신뢰가 형성됨에 따라 감정적 연대감이 만들어집니다. 그리고 이 감정적인 연대감은 아이와 돌보아주는 사람과의 관계에서 형성된 것으로 이를 통해 아이는 위험을 무릅쓰면서도 세상으로 나가고 탐구할 수 있게 됩니다. 이 연대감은 돌보는 자와 아이 사이를 연결해 주는 교량 구실을 하게 되고, 그 교량은 이해와 성장의 기반이 됩니다. 또한, 그 교량의 힘은 자신을 돌봐주는 사람들을 얼마나 신뢰하고 기댈 수 있는가 하는 정도에 비례하여 강해지기도 하고 약해지기도 합니다. 그리고 이 힘은 다른 사람을 사랑하고 자신을 받아들이는 데에 아주 중요한 구실을 합니다. 일단 이런 1차적 신뢰 관계가 구축되어야만 아이는 건강한 수치심이든 해로운 수치심이든 수치심을 발달시킬 준비가 됩니다. 
   
            당신은 지금 자기조절능력과 타인과의 교류능력, 세상과 자연을 바라보는 방법을 전면적으로 성찰하는 기회를 가져야 합니다. 지금 이대로는 당신의 삶을 유지해 나가기가 너무나 어렵습니다. 
   
         `,
    },
    {
      img: 'metaq_2',
      score: 30,
      title: '죄의식을 가지는 단계',
      desc: '자기비하, 죄책감, 비난, 파괴, 폭력, 잔혹한, 악한, 자학, 처벌, 원한',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '죄책감은 조종하고 벌주기 위한 사회에서 흔히 사용됩니다. (예: 회한, 자기 질책, 피학증, 피해의식) 죄책감이 우세하면, 용서하지 않는 감정적 태도인 ‘죄’에 사로잡히는 결과를 낳는데 종교적 선동가들은 강요와 통제를 위해 인간의 죄의식을 악용합니다. 처벌에 사로잡혀 ‘죄와 구원’을 파는 종교 상인들은 자기 자신의 죄책감을 외부로 발산하며 행동하든지 아니면 다른 이들에게 투사합니다. 자기 학대라는 일탈 행동을 보여주는 하위문화들은 잔인함의 다른 풍토적 형태를 드러냅니다. 예를 들어, 인간이나 동물을 대중 앞에서 의례에 따라 살해합니다. 죄책감은 격노를 유발하며, 살인이 격노의 표현이 되는 경우가 흔합니다. ',
      streamOfConsciousness:
        `
            정신과 의사이자 베스트 셀러 작가인 스캇 팩(Scott Peck)은 그의 저서에서 ‘신경증과 성격장애’에 대해 기술해 놓았습니다. “신경증이란 너무 많은 책임을 지려는 것이고 성격장애는 자기가 책임을 지지 않으려는 것이다. 예를 들어, 신경증이 있는 사람들은 세상의 어려움과 문제가 자신에게 있다고 여기고, 성격장애의 사람들은 자신의 문제가 세상 탓이라고 돌려버린다.” 
   
            우리는 자신을 현실적으로 책임질 줄 알아야 합니다. 스캇 팩에 따르면 이는 ‘책임에 따르는 고통과 어려움을 기꺼이 감수하려는 의지’가 필요한 일입니다. 그리고 이 능력은 개인이 얼마나 자기 자신과 좋은 관계를 갖느냐에 달려 있습니다. 죄의식은 실제로 성격장애나 신경증을 일으키는 주된 요인입니다.
   
            죄책감은 다음과 같은 다양한 원인 때문에 발생할 수 있습니다.
   
            1. 유감스러운 행동
            후회하는 행동이나 부정적인 결과를 초래한 선택으로 인해 죄책감이 생길 수 있습니다. 과거 실수의 무게로 인해 앞으로 나아가기가 어려울 수가 있습니다. 지나친 후회와 원망, 부정적 감정은 현재의 우리 삶을 파괴하게 됩니다.
   
            2. 비현실적인 기대
            자신에 대해 비현실적으로 높은 기준을 세우는 것은 죄책감으로 이어질 수 있습니다. 이러한 기대에 미치지 못할 때, 우리는 자기 자신에 대해 부적절하다고 느끼거나 자신이나 다른 사람을 실망시킨 것처럼 느낄 수 있습니다. 
   
            죄책감을 극복하려면 적극적인 노력과 긍정적인 자기성찰이 필요합니다. 죄책감의 근본 원인에 대해 생각하는 시간을 갖는 것은 귀중한 통찰력을 가지고, 자기 인식을 확인하는 데 도움이 됩니다. 자기 성찰에 참여하면 죄책감에 기여하는 동기, 가치 등을 이해할 수 있습니다. 
   
            죄책감이 과거 행동과 관련된 경우, 그것을 수정하는 것이 그러한 행동의 결과를 다루는 중요한 방법이 됩니다. 책임을 지고, 보상을 제공하고, 과거의 실수로부터 배우는 것은 개인의 성장과 발전을 가져다줍니다. 자기 연민은 친절, 이해, 용서로 자신을 대하는 것과 관련이 있습니다. 우리의 인간성을 인정하고 불완전함을 포용함으로써 우리는 죄책감을 극복하고 더 건강한 인간관계를 발전시키고 자기 자신을 받아들일 수 있게 됩니다.
         `,
    },
    {
      img: 'metaq_3',
      score: 40,
      title: '무기력의 단계',
      desc: '의미상실, 절망, 포기, 희망 없는, 고립, 의존적, 황량함, 냉담함, 가난, 비애, 무력함',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '가난, 절망, 희망 없음이 이 단계의 특징입니다. 세상과 미래는 암울해 보이고, 비애(pathos)가 인생의 주제입니다. 무감정은 무력한 상태입니다. 무기력한 이들은 의존적입니다. 주위 사람들에게 자신이 짐처럼 느껴집니다. 자원이 부족할 뿐 아니라 이용 가능한 자원이 있어도 그것을 활용하는데 쓸 에너지가 부족합니다. 우리는 여기서 반드시 인생이 던지는 삶의 의미에 대한 질문에 답해야 합니다. 우리는 자신의 존재에 대한 책임을 가지고 있기 때문입니다. 인간에게는 의미를 찾아낼 수 있는 능력이 있고, 인생의 어떤 경우라도 아무리 그것이 불합리하고 고통스러운 것이라도, 모든 것에는 의미가  있습니다. ',
      streamOfConsciousness:
        `
            무기력과 무의미함은 스스로 극복해야 하는 것으로, 주변 인물과 사물에 의존하는 상태를 극복해야 합니다. 언제나 활력이 넘치는 사람은 없습니다. 아무것도 하기 싫다는 마음이 들 때 자신이 무기력하다는 것을 인지하고 무기력에서 벗어나기 위한 방법을 모색해야 합니다. 의미를 찾지 못하기 때문에 무기력해 지는 것입니다. 삶의 의미를 발견하기 위한 노력을 시작해야 합니다.
   
            무기력을 탈출하기 위해서는 신체, 감정, 정신 3가지 원인 중 어느 부분의 무기력인지 먼저 확인하는 것이 첫걸음입니다. 무기력한 상태에서 벗어나기 위한 방법으로, 하루 일과와 자신의 생각을 정리할 수 있는 ‘자기 쓰기(일기)’부터 시작하는 것이 좋습니다.
   
            저널링, 자기쓰기는 자신의 의식을 묶어둘 수 있는 좋은 방법입니다. 의식의 꼬리를 잡고 사유를 이어가면서 내가 지금 당면한 문제의 지점을 발견할 수 있습니다.
   
            다음으로, 운동과 예술 활동 등 실현 가능한 쉬운 일들을 시도하면서 반복적으로 작은 성공 경험을 쌓게 되면 낮아진 자존감을 회복시켜 무기력을 극복할 수 있습니다. 일단 시작하기 위해 목표와 계획을 세우고 일의 마감 시간과 쉬는 시간을 설정해야 합니다. 그리고 자신만의 루틴을 만들어 매일 같은 행위를 반복하는 것도 좋은 방법입니다. 쉴 때는 늘 하던 일과는 다른 일을 하고, 적당한 시간을 가질 필요가 있습니다. 
            또한, 자기 연민에 빠지지 말고 자신을 칭찬하며 유머감을 높여, 자기 회복력을 키워나가는 것이 중요합니다. 무기력에 의해 자기 연민에 빠지면 무책임해지며, 자신을 동정의 대상으로 전락시키고 맙니다. 
   
            자신의 옆에서 믿어주고 지지해 주는 사람이 누구인지 분명하게 인식하는 것도 무기력을 극복하는데 도움이 됩니다. ‘잘 해내지 못할까, 완벽하게 못할까’ 불안해하거나 초조해 하지 말아야 합니다. 타인과 비교하지 말고, 내가 정한 오늘 일을 하는 것이면 충분하다는 생각을 가지면 됩니다. 위기가 닥치면 잘 먹고, 운동하면서 생산적인 휴식으로 자신을 재충전하는 것이 무기력을 무력화시킬 수 있는 방법입니다.
   
            타인의 성공이나 성취를 나의 상황과 비교하면서 스스로 무기력해지거나 삶의 동력을 잃어버리지 않도록 합니다. 비교는 우리 안에 열등감이나 우월감을 만들어냅니다. ‘열등감’은 시기나 질투로 표현되며 나의 의식을 지배하고, ‘우월감’은 반대로 자아팽창이 일어나 자신의 모습을 잃어버리게 만들어 버립니다. 있는 그대로의 자기 모습, 진짜 나를 찾아 나가야 합니다. 자신을 발견하면 삶의 의미를 발견할 수 있습니다. 그러면 삶의 무기력에서 해방될 수 있습니다. 
         `,
    },
    {
      img: 'metaq_4',
      score: 50,
      title: '슬픔의 단계 ',
      desc: '상실의 두려움, 후회, 낙담, 비극적인, 한탄, 상실, 잃어버림, 애도, 과거, 패배',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '슬픔과 상실, 낙심의 수준에서는 창의적인 활동을 하기 어렵습니다. 이 수준에 있는 사람들은 끊임없는 후회와 우울이 함께하는 삶을 살아갑니다. 만성적 애통함, 애도, 과거에 대한 회한의 수준이 높고, 습관적 실패자라고 스스로 말합니다. 실패를 자신의 생활 방식의 일부로 받아들여 결과적으로 직업과 친구, 가족, 사회적인 네트워크 뿐만 아니라 자기에게 찾아온 좋은 기회, 돈과 건강도 자주 상실하게 됩니다. 어린 시절에 겪은 큰 상실은 이후에 비애(Sorrow)가 삶의 대가라는 듯이 슬픔을 수동적으로 받아들이게 만들기 쉽습니다. 슬픔(Grief) 속에 있는 사람은 모든 곳에서 슬픔(Sadness)을 바라봅니다. 어린아이의 슬픔, 세계정세의 슬픔, 삶 자체의 슬픔. 이 수준이 존재에 관한 사람의 전체 시각을 물들입니다. 특정한 것을 일반화하고, 그래서 사랑하는 이의 상실이 사랑 그 자체의 상실과 같은 것으로 여겨집니다. 이러한 감정적 상실이 심각한 우울증이나 죽음을 촉발할 수도 있습니다.',
      streamOfConsciousness:
        `
            나의 슬픔이 어디서 시작된 것인지 먼저 이해해야 합니다. 슬픔이란 부정적이거나 원하지 않았던 결과를 포함하는 모든(사람이나 사물에 대한) 상실에 대한 자연적인 반응입니다. 여기서 상실이란 사랑하는 사람의 죽음, 자신의 정체성이나 소유했던 물건을 잃어버리는 것 등이 포함됩니다. 슬픔은 이러한 상실에 대한 정상적인 반응입니다. 
      
            슬픔이라는 감정의 뿌리를 찾아보아야 합니다. 현재 가지고 있는 슬픔이 지금 지나고 있는 감정의 뿌리일 수는 없습니다. 실상 이러한 감정의 뿌리는 현재 겪고 있는 감정의 원인이 무엇인지 탐색할수 있는 기회이기도 합니다. 화를 내고 있지만, 사실은 슬픔에 잠겨있는 경우를 종종 보게 됩니다. 때로는 남 탓하기, 부끄러움, 질투 등의 감정이 슬픔과 함께 묶여 역동을 일으키기도 합니다. 이런 감정들은 슬픔을 불러일으키는 상실의 종류에 따라 달라집니다.
   
            슬픔이 우울증의 증상이긴 하지만, 슬픔과 우울증은 다르게 작동합니다. 우울증은 슬픔 같은 스트레스를 주는 요인에 대해 심신을 약화시키는 정상적이지 않은 반응을 의미합니다. 슬픔보다 증상이 훨씬 더 심각한데, 한때 좋아했던 것들에 대해 관심을 잃거나, 짜증, 불안, 성욕 감퇴, 집중력 저하, 수면 패턴 변화, 만성피로와 같은 증상으로 나타납니다. 우울증은 치료가 필요합니다. 가만 놔두면 더 악화되기 때문에 빨리 전문가의 도움을 받거나 의사를 찾아 상담하고 치료를 시작해야 합니다. 반면 슬픔은 잠깐 있을 수도 있고, 
            몇 시간 또는 며칠 동안 지속되는 감정입니다. 헤어짐, 실직 또는 사랑하는 사람의 죽음 등으로 인해 생기는 자연스러운 반응입니다. 슬픔을 느낀다 해도 괜찮습니다. 자신의 슬픔을 인식하고 거기에서 멈추지 않고 다시 일상으로 회복하려는 마음을 가지는 것이 중요합니다. 
   
            슬픔을 인식하는 것이 중요합니다. 그것을 꼭 넘어서야 한다고 생각하지 않고 내 안의 슬픔을 허락합니다. 슬픔을 두려워만 한다면, 실패에 대한 두려움 때문에 연극의 배역을 맡거나 새로운 직장에 면접 보러 가는 것을 시도조차 하지 않을 것입니다. 행동하지 않고, 숨어버립니다. 슬픔은 뭔가를 잃어버렸거나, 나의 변화가 필요하다는 것을 알려주기 위한 목적이 있음을 잊지 말아야 합니다. 
   
            자신의 감정을 존중해야 합니다. 자신의 감정을 스스로 억누르거나 다른 사람이 그것을 억누르게 하지 말아야 합니다. 슬퍼해도 된다는 사실을 기억해야 합니다. 다른 사람이 위로해줄 때 그것이 위로가 되지 않고, 오히려 자신의 감정을 억누르게 되는 경우가 있습니다. 다른 사람이 자신의 감정을 결정하게 하지 말아야 합니다. 
   
            성숙한 내면을 가진 친구나 자신의 감정을 이해해 줄 사람들, 혹은 사람의 마음을 다루는 전문가들과의 시간을 만들어봅니다. 자신의 슬픈 이야기를 털어놓을 친구나 사랑하는 사람에게 전화를 할 수도 있습니다. 나의 슬픔에 대해 이야기를 할 수도 있고 어렵다면 벗어난 다른 이야기를 하더라도 슬픔을 분산할 수 있는, 그러한 일을 잊게 해 주는 과정을 통해 친구로부터 많은 도움을 얻을 수 있습니다. 사랑하는 사람과 함께 있으면, 기분이 나아질 수 있도록 도와줄 것입니다. 친구나 동료, 그리고 가족에게 지금 슬프고 슬퍼할 시간이 필요하다고 충분히 이야기해보아야 합니다.
   
            슬픔을 표현해야 합니다. 자신의 감정을 밖으로 드러내는 방법이 있습니다. 울음은 감정적인 변화를 줄 수 있는 도구입니다. 연구에 따르면 흐르는 눈물을 통해 우리 안에 생겨난 스트레스 호르몬을 배출할 수 있다고 합니다. 우는 것 외에도 슬픔을 발산시킬 다른 방법들도 있습니다. 슬픈 음악 듣기도 좋은 방법입니다. 또 다른 연구에 따르면 슬플 때 슬픈 음악을 들으면 당신의 현재 감정과 결합이 되어 그 감정을 배출할 출구가 된다고 합니다. 자신의 감정을 다룰 준비가 되지 않았다면, 감정을 처리할 수 있는 준비가 될 때까지 음악을 통해 머리를 식혀보는 것도 방법입니다. 
   
            이야기를 써 보는 방법도 좋습니다. 고통이나 상실 때문에 슬퍼하고 있다면, 관련된 이야기를 써보는 것도 좋은 방법입니다. 매일매일 쓰는 것은 힘들겠지만 일주일에 2-3번만이라도 꾸준히 써보십시오, 그렇다면 자기성찰의 시간을 가질 수 있고, 객관적으로 상황을 바라볼 수 있게 됩니다. 또한, 글로 쓰다보면 복잡한 머릿속 생각이 정리되고, 나중에 보았을 때 인생의 커다란 자산이 될 수도 있습니다. 
   
            여러분 인생에서는 수많은 굴곡과 좌절이 있었습니다. 앞으로도 그럴 것입니다. 그러니 너무 상심하지 마세요. 우리나라에만 해도 통계적으로 100명 중 99명이 자신의 삶에 매우 만족하지 못하고 살아갑니다. 당신만 따로 그런 것은 아닙니다. 이제 당신의 반응이 매우 중요합니다. 이러한 슬픔과 좌절, 고통의 시간을 어떻게 보낼 것인가는 당신의 선택에 달려 있습니다. 
         `,
    },
    {
      img: 'metaq_5',
      score: 60,
      title: '두려움을 가진 단계',
      desc: '불안, 근심, 회피, 공포스러운(불안한), 억압, 강박적인, 질투, 스트레스, 성장 제한',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '이 수준에는 이용할 수 있는 생명 에너지가 훨씬 더 많이 있습니다. 위험에 관한 두려움은 실제로는 건강합니다. 두려움은 끝없는 활동을 자극하며, 세상의 많은 부분을 움직입니다. 나이 듦과 죽음, 거절에 관한 두려움, 그리고 아주 많은 사회적 두려움이 사람들의 삶에서 기본적인 동기 유발 요인입니다. 이 수준의 관점에선 세상이 위험해 보이고 함정과 위협으로 가득해 보입니다. 불안감은 시장을 조작하는 큰 손들이 상투적으로 쓰는 수단입니다. 매체와 광고는 시장 점유율을 높이기 위해 두려움을 이용합니다. 두려움은 어느새 상품으로 변해 우리 앞에 다가와 있습니다. ',
      streamOfConsciousness:
        `
            두려움의 증식은 끝이 없습니다. 두려움에 초점을 맞추게 되면, 세상의 끝없는 두려운 사건들이 두려움에 먹이를 줍니다. 예를 들어, 관계 상실에 대한 두려움은 질투와 만성적인 스트레스로 이어집니다. 두려워하는 사고는 편집증으로 부풀거나 신경증적 방어 구조를 만들어 낼 수 있으며, 전염성이 있어서 지배적인 사회 트렌드가 될 수도 있습니다. 두려움은 인격의 성장을 제한하며 억제로 이어집니다. 두려운 이들은 자신을 노예 상태에서 벗어나게 해줄, 두려움을 정복한 듯 보이는 강한 지도자를 찾기도 합니다. 그러나 자신의 내면에서부터 두려움을 극복해내지 못한다면 우리는 뜻밖의 엉뚱한 곳에서, 두려움의 출구를 찾을 수도 있습니다. 
   
            두려움은 언제나 존재합니다. 다만 세월의 흐름에 따라 종류가 달라질 뿐입니다. 오래된 창고방의 괴물이 무서웠던 어린 시절이 지나고 나면, 또 다른 두려움이 찾아옵니다. 막상 어른이 되고 세상을 알아갈수록 두려운 것들은 더 많아지고 복잡해집니다. 두려움은 늘 ‘이겨야 하는’ 대상처럼 여겨집니다, 모든 두려움을 극복할 필요는 없습니다. 
   
            심리학자 세스 J. 길리한 박사는, 두려움은 우리가 위험을 피하도록 동기를 부여하기 위해 생성되는 인간의 기본적인 감정이라고 말합니다. 위협으로부터 멀어지도록 생리적 각성이 발생해 에너지를 생성한다는 것입니다. 
   
            심리학자 로빈 스턴 박사 역시 “두려움은 누구나 경험하는 보편적인 감정”이라 말합니다. 다만 두려움은 공포나 불안과 동의어는 아니라고 설명합니다. 두려움이 엄습해온다면, 스스로를 객관적으로 살펴보아야
            합니다. ‘나는 이것을 두려워하는 사람’이라고 자신을 규정하는 것은 도움이 되지 않으니, 두려움을 주는 원인을 보는 방식을 있는 그대로 재구성하는 것도 도움이 됩니다. 불안은 지극히 정상적인 감정입니다. 위기상황에서의 불안은 정상적인 반응입니다. 그러나 과도한 불안은 지나치게 예민하게 만들고, 몸과 마음을 소진 시켜 면역력에 부정적인 스트레스를 줄 수 있습니다. 스트레스로 인해 두근거림, 두통, 소화불량, 불면증 같은 신체적 긴장 반응이 나타날 수 있습니다. 과도한 두려움이 지속적으로 나타난다면 전문가와 상담이 필요합니다. 불확실함과 통제할 수 없는 것에 대해 그대로 받아들이고, 스스로 통제 가능한 활동을 하는 것이 바람직합니다.
   
            두려움의 원인에 집중하기보다는 두려움에 맞서는 새로운 방법을 찾는 데 집중해야 합니다. 두려움을 주는 원인을 피하지 말고 호기심을 가지고 들여다보는 것도 새로운 경험이 될 수 있습니다. 스턴 박사는 두려움에 휩싸일 때 조급해하지말고 스스로에게 긍정적으로 대화를 걸어보라고 권합니다. ‘나는 이것을 경험해본 적 있고 아무 일도 일어나지 않았다. 충분히 마주할 수 있다’라고 주문을 거는 것입니다. 어쩌면 우리는 처음부터 알고 있을지도 모릅니다. 오래된 창고 안에는 괴물이 없다는 사실을 말입니다. 우리를 두렵게 만든 건 스스로 만들어 낸 생각의 괴물일 수도 있으니 직접 물리쳐야 합니다.
         `,
    },
    {
      img: 'metaq_6',
      score: 70,
      title: '욕망하는 단계',
      desc: '갈망, 집착, 노예화, 중독, 실망하는, 만족하지 못함, 돈, 명예, 권력, 성, 외모, 좌절',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '욕망은 방대한 영역의 인간 활동에 동기를 부여합니다. 광고주들은 본능적 충동과 연결되는 욕구로 우리를 프로그램하기 위해 욕망을 이용합니다. 욕망은 목표를 성취하거나 보상을 얻기 위해 엄청난 노력을 쏟도록 우리를 움직입니다. 돈이나 체면, 권력에 대한 욕망은 많은 이의 삶을 움직이는데, 이들은 자신을 제한하는 지배적 삶의 주제인 두려움을 넘어섭니다. 욕망은 중독의 수준이며, 거기서는 욕망이 삶 자체보다 더 중요한 갈망이 됩니다. 타인에게 인정받으려는 욕망이 화장품 산업, 패션 산업, 영화 산업 전반을 만들어 냈습니다. 욕망은 축적, 탐욕과 관련이 있습니다. 욕망은 계속 진행하는 에너지 필드이기 때문에 만족할 줄 모릅니다. 그래서 한 가지 욕망의 충족은 다른 무언가에 대한 불만족스러운 욕망으로 대체될 뿐입니다. 하지만 욕망은 확실히 무감정이나 슬픔보다는 훨씬 높은 상태입니다. TV는 억압당하는 많은 사람이 무감정에서 나와 더 좋은 삶을 추구하기 시작할 만큼 욕망에 에너지를 불어넣습니다. 따라서 욕망은 더 높은 의식 수준들을 향한 발판이 될 수도 있다는 긍정적인 측면을 바라보아야 나의 내적 힘이 상승할 수 있습니다.',
      streamOfConsciousness:
        `
            사람은 평생 돈, 명예, 권력, 사랑, 행복을 좇으며 욕망에 매달립니다. 하지만 욕망은 절대로 충족되지 않습니다. 하나의 욕망이 충족되면 더 큰 욕망이 우리를 유혹하며, 죽을 때까지 이런 과정이 반복됩니다. 우리에게 욕망은 무엇일까. 진정한 행복을 위해 우리는 욕망을 어떻게 이해하고, 어떤 태도를 취해야 하는가. 우리는 철학해야 합니다. 
   
            우리가 살고있는 자본주의 사회는 철저히 인간욕망에 기초해 움직입니다. 일찍이 애덤 스미스는 국부론에서 ‘보이지 않는 손(Invisible hand)’이 경쟁을 만들고, 시장을 형성하고, 가격을 형성해 나가는 자본주의 시스템의 기원을 설명합니다. 곧, 사람은 자신의 욕망을 위해 살며, 다른 사람과 상호작용하며 사는데, 욕망이 억압되면 고통을 겪고 다양한 병리적 증상을 표출합니다. 이것을 들여다봐야 합니다.
   
            예컨대 폭력적으로 행동하는 사람은 타고난 폭력성향이 있다고 하거나 사회 부조리의 희생물이라는 식으로 설명한다면 핵심을 놓칠 수 있습니다. 사회적 억압이라는 관점에서 물질만능주의나 경쟁적 풍토가 개인과 
            사회에 미치는 영향을 바라보고 이해해야 합니다.
   
            인간은 사회 속에서 타인과 관계를 맺으며 살아갑니다. 사회 속에서 살아간다는 것은 우리가 욕구를 모두 표출하며 살지 못한다는 것을 뜻합니다. 억압하거나 변형시켜야 할 부분이 반드시 생겨납니다. 그래서 우리는 겉으로 드러나는 모습과 내면이 다를 수 있는 것입니다. 이런 차이를 잘 조절하는 사람이 있지만 그렇지 못하는 사람은 우울증에 걸리거나 폭력적 형태로 표출할 수 있습니다. 
   
            인간과 사회를 설명하기 위해서는 욕망, 나르시시즘, 무의식을 잘 이해하고 조절하며, 사회 환경이나 사랑과 미움 같은 타인과의 감정적인 교류를 관찰해야 합니다. 욕망은 한 마디로 인간의 본질입니다. 인간은 욕망하기 때문에 현실에 안주하지 않고 자연을 정복하고 문명을 꽃피우면서 삶을 개선할 수 있었습니다. 욕망은 인간에게 발전과 풍요를 가져다주었습니다. 그런데 욕구와 욕망을 구분해야 합니다. 욕구는 먹고 마시고 잠자는 것과 같은 생물학적이고 본능적으로 필요한 것에 대한 바람입니다. 이것은 자신의 내부에서 생겨납니다, 하지만 욕망은 욕구와 달리 타자와의 관계를 전제로 발생합니다. 다른 사람에게서 인정과 평가를 받는 것이 욕망에서 중요하기 때문입니다.
   
            욕망의 억압이나 비뚤어진 욕망은 문제입니다. 정신분석학에서는 이것을 증상으로 설명합니다. 내부의 갈등은 억압하고 감춘다고 해서 사라지지 않습니다. 내부에 갈등이 있으면 신경증이나 불안증으로 나타납니다. 어떤 형태로든 드러나게 마련입니다. 물론 자기를 실현하려면 욕망이 있어야 합니다. 물질적인 것도 필요하고 남들로부터 인정도 받아야 합니다. 하지만 욕망은 사회적인 관계 속에서 비롯됩니다. 그래서 나를 돌아보기 전에 무턱대고 사회가 이상화하는 욕망을 좇다 보면 잘못된 욕망을 추구할 수 있고, 소외될 수 있습니다. 융합심리분석상담사는 증상을 통해 표출되는 욕망을 제대로 들여다보게 하고, 사회에서 길을 잃지 않고 자기 욕망의 주인이 될 수 있도록 도와주는 조력자들입니다.
   
            욕망은 완전히 채워질 수 없습니다. 그것을 알아야 합니다. 우리는 그것을 모른 채 끊임없이 욕망을 채우려고 합니다. 돈, 권력, 사회적인 성공, 남들의 인정과 사랑으로는 결코 근원적으로 비어있는 내면의 공간을 채울 수 없습니다. 욕망은 결국 자기 존재를 찾고자 하는 노력입니다. 그것을 모른 채 자꾸 다른 것으로 채우려고 하면 아무리 쌓아도 만족할 수 없습니다. 그러면 당신은 정신적으로 더욱 황폐해집니다.
         `,
    },
    {
      img: 'metaq_7',
      score: 80,
      title: '분노의 단계',
      desc: '미움, 증오, 공격성, 적대하는, 자유를 바라는, 분개, 복수, 논쟁, 호전적',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '당신이 넘어서야 할 어려움은 분노를 극복하는 것입니다. 그것은 분노를 억누르거나 부정하는 방식이 아닌 분노를 수용하는 지혜로운 방법을 찾아야 한다는 것입니다. 분노는 그 아래 수준들에 비해 죽음과 동떨어져 있습니다. 분노는 건설적인 행위 혹은 파괴적인 행위도로도 이어질 수 있습니다. 욕망은 좌절로 이어지고 차례로 분노로 이어집니다. 분노는 자주 분개나 복수로 표현되기에 격해지기 쉽고 위험합니다. 분노가 생활 방식인, 과민하게 폭발하는 사람들이 있습니다. 이들은 자신이 무시당한다고 생각하며, 지나치게 예민하고 걸핏하면 싸우는, 호전적이고 소송하기를 좋아하는 사람들입니다. 분노의 5단계(Five Stages of Grief)는 엘리자베스 퀴블러로스가 거론한 죽음과 관련된 임종 연구(Near-death Studies) 분야의 이론이며 퀴블러로스 모델(Kübler-Ross Model)이기도 합니다. 인간이 자신의 죽음을 서서히 맞이하는 데에 부정에서부터 분노, 타협, 우울, 수용의 단계들을 거치면서 이를 받아들이게 되는 심리상태를 가리킵니다. 우리는 여기에서 분노를 어떻게 단계적으로 조절해 나갈 것인지에 대한 방법을 모색해 볼 수 있습니다.',
      streamOfConsciousness:
        `
               처음으로 당면하는 분노의 역동은 부정(Denial)의 단계입니다. 대부분 모든 사람이 암과 같은 죽음의 선고를 받게 되거나 주변에서 배척당하거나 고립되는 상황이 다가오면, 처음에는 주어진 상황을 강하게 부정합니다. ‘아니야, 난 믿을 수 없어. 나에게 이런 일이 일어날 수 없어, 내가 뭘 잘못했다고, 내가 언제 화를 냈다고 그래’ 하면서 자신에게 죽음이나 고립이 다가왔음을 부인합니다. 이 단계에서는 현실적인 견해를 갖도록 시간적 여유를 주어야 합니다. 분노에게 말해야 합니다. 분노를 부정할 것이 아니라 분노하고 있는 상황을 바라보아야 합니다.
   
               이제 분노(Anger)가 내면에서 강하게 움직입니다. ‘하필 그 많은 사람 중에 나에게’ 하며 자신이나, 가족, 가까운 이들에게 분노를 표출합니다. 신을 저주하거나 주위에 화를 내고 짜증을 냅니다. 그 분노에 주변이 반응을 하면 더 심한 분노를 표현합니다. 차라리 분노를 자연스럽게 표현하도록 합니다. 그러나 분명히 말해주어야 합니다. 아직도 당신은 가치 있는 인간이고 존경과 이해와 관심을 받고 있다는 것을 느끼는 것이 필요합니다.
   
               분노를 알아채는 순간 분노와의 타협(Compromise)이 시작됩니다. 분노를 발화함으로써 나에게 오는 이득은 무엇인지, 이후에 전개될 상황에 대해 상상해 보아야 합니다. 숨을 멈추고 깊이 들숨, 멀리 날숨을 내보내며 나의 분노의 아드레날린을 조절해야 합니다.
   
               화를 내고 난 다음 깊은 우울감(Depression)에 놓일 수 있습니다. ‘이젠 도저히 이러한 상황을 변화시킬 수 없구나’라면서 심한 우울에 접어듭니다. 사랑하는 사람에게 혹은 함께 일하는 사람에게 발화시킨 나의 분노에 대해 후회하고, 화를 참지 못한 자신의 무력감에 대해 다시 화가 치밀어 오릅니다. 그냥 그렇게 분노를 바라보며 놓아두고 분노에게 말을 걸어 분노가 하고 싶은 말이 진정 무엇인지 옆에서 귀담아 들어주고 부드럽게 대해 주는 것이 필요합니다. 그 분노에게 이름을 붙여줍니다.
   
               그러면 이제 분노는 수용(Acceptance)의 단계로 접어듭니다. 분노를 이해하고 받아들입니다. 분노를 수용한 후에는 그것을 새롭게 해석하려고 합니다. 자기 분노를 받아들이고 우울해 하지도 않습니다. 마음은 극도로 피곤한 상태입니다. 혼자 있고 싶고, 언어보다 무언의 언어로 의사소통을 하고 싶습니다. 분노를 적절하게 표현하는 것으로 마쳐야 합니다. 그 이상의 행동은 자기를 파괴하고 타인을 파괴하게 합니다.
   
               분노의 심리적 역동을 잘 살펴보면, 부정, 분노, 타협, 우울, 수용이라는 단계를 거치며 서서히 에너지가 줄어듭니다. 분노는 강한 부정에서 시작됩니다. 일단 분노가 시작되는 지점에서 멈추어 무엇에, 어떻게, 얼마큼 분노하고 있는지를 인지하는 것이 중요합니다. 그리고 지금 나에게 닥쳐온 분노를 객관화 시킬 필요가 있습니다. 조절할 수 있는 가능성이 있는지도 살펴보아야 합니다. 
   
               분노하는 사람이나 상황에서 빨리 벗어나는 것도 좋은 방법일 수 있습니다. 내가 무시당하고, 억울한 일일 수도 있으나 발생한 분노가 나에게 또다시 안 좋은 영향을 미칠 수 있다는 2차 피해를 생각해야 합니다. 가령 갑자기 내가 주행하던 차선으로 끼어 들어오는 운전자를 향해 “저런 미친 자식을 봤나”라고 소리를 냈다고 가정합시다. 그 ‘미친 녀석’은 내 욕을 들을 수 없습니다. 그저 차 안에 있는 ‘나’와 동반하고 있는 가족, 혹은 연인이 그 소리를 들을 뿐입니다. 그것은 서로에게 무척 해로운 에너지를 동반합니다. 
            `,
    },
    {
      img: 'metaq_8',
      score: 90,
      title: '자존심의 단계',
      desc: '교만과 허세, 경멸, 자아팽창, 요구가 많은, 과장, 자멸, 방어적인, 분열, 파벌, 오만함, 부정부패',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '이 수준에 이르면 긍정적인 느낌이 차오릅니다. 자존감의 상승은 더 낮은 의식 수준들에서 경험되는 모든 고통을 달래주는 진통제 역할을 합니다. 자부심은 좋아 보입니다. 자부심은 삶의 행진 속에서 스스로 뽐내며 걸을 힘을 줍니다. 자부심은 수치심이나 죄책감, 두려움에서부터 충분히 떨어져 있습니다. 자부심은 대개 평판이 좋고 사회적으로 장려되지만, 우리가 <Meta Q 지수>에서 보듯이 평균 수준 100 아래 있어 그리 충분히 긍정적이지만은 않습니다. 문제는 이러한 자부심이 자아팽창과 연결된다면 “교만(Pride)이 패망의 선봉”이라는 점을 기억해야 합니다. 자부심은 방어적이고 취약한데 이는 외부 조건에 의존하고 있기 때문입니다. 외부 조건이 없다면 자부심은 갑자기 더 낮은 수준으로 되돌아갈 수 있습니다. 반면, 팽창된 에고는 공격에 취약합니다. 자부심은 약한 상태로 머무는데, 자부심이 꺾이면서 수치심으로 돌아갈 수 있기 때문입니다. 이는 자부심 상실에 관한 두려움에 불을 지피는 위협입니다. 자부심의 그늘진 면은 오만과 부인이며, 이런 특성들은 성장을 가로막습니다. 일그러진 자부심이나 교만은 진정한 내면의 힘을 획득하는데 아주 큰 장애물입니다. 진정한 힘은 진정한 자신, 참된 나, 진짜 나의 모습에서 발화됩니다. 분석심리학의 창시자인 칼 융은 ‘자아 팽창(Ego Inflation)’이란 개념을 도입했습니다. 이 말은 ‘사람 의식의 중심인 자아(ego)가 여러 가지 원인에 의해 실제 이상으로 부풀려져서, 그 사람이 우쭐대고 교만해진 상태’를 말합니다. ',
      streamOfConsciousness:
        `
            사람은 누구나 어떤 상황에서 그 상황에 어울리는 적절한 가면을 쓰고 생활합니다. 집안에서는 아버지의 가면을, 직장에서는 그 직책에 맞는 직장인으로서의 가면을, 오랜 벗들끼리 어울리는 동창회에서는 장난스러운 친구의 가면을 쓰고 생활합니다. 그것은 사회생활을 하는 이들에게는 ‘적응’이라는 측면에서 필수적인 모습이기도 합니다. 이런 가면을 융은 페르소나(Persona)라고 말했습니다. 대부분 사람은 자신이 가지고 있는 여러 개의 가면을 그 상황에 맞게 적시에 바꿔 쓰면서 무난하게 연기를 하며 살아갑니다. 
            그러나 그러지 못하는 사람도 많이 있습니다. 회사에서 착한 상사였던 사람이 집으로 돌아오면 한없이 악한 아버지로 바뀌는 위선적인 경우도 있고, 교회에서 만난 동료들을 회사의 후배직원 다루듯이 해서 욕을 먹는 일도 있습니다.
   
            평소 ‘자아팽창’ 상태에 빠져 환상 속에 살던 사람들은 팽창된 바람이 빠진 허망함을 견디기 어려울 것입니다. 풍선에 바람을 불어 넣을 때는 적절한 용량이 있습니다. 그것을 넘어 너무 빵빵하게 잔뜩 부풀어 오른 상태가 사람으로 비교하면 ‘자아팽창’ 상태입니다. 그런 상황에서는 바늘만 살짝 갖다 대도 풍선은 사정없이 터져 버리고 말 것입니다. 하지만 ‘자아팽창’에 빠지지 않고 적절하게 자기 분수를 지키며 살아온 사람들은 직책에서 물러나거나 현업에서 은퇴해도 크게 흔들리지 않습니다. 그들은 자신의 정체성을 남들의 평가, 사회적인 역할, 사회적인 이상에 맞춰 살아오지 않았기 때문입니다. 그들 삶의 기준은 남이 아닌 본연의 자신이기 때문입니다. 그래서 ‘진짜 나’를 찾는 작업은 우리에게 중요한 마음공부가 됩니다. 
   
            멜라니 클라인(1882~1960)은 아동 정신분석 연구의 선구자입니다. 그의 이론에 뿌리를 댄 정신분석 연구 결과들은 유아기 아기들이 ‘전능환상’을 품고 있음을 알려줍니다. 아기가 울거나 보채면 엄마는 아기의 욕구를 알아채 즉각 충족시켜줍니다. 이런 반응이 반복되면, 아기는 마음만 먹으면 무엇이든 할 수 있다는 환상을 품게 됩니다. 아기가 스스로 전능한 존재라고 여기면 세상은 단순해집니다. 그의 세계에는 자기 욕구 충족 법칙만 남습니다. 세상을 움직이는 다른 법칙 따위는 존재하지 않게 됩니다. 제한도 없고 의무도 없습니다. 유아기의 전능감은 보통 나이를 먹으면서 극복되는데, 뿌리가 완전히 뽑히는 경우는 드뭅니다. 성인에게 남은 전능감의 뿌리는 큰 싸움에서 승리했거나 큰 권력을 얻었을 때 ‘자아팽창’ 형식으로 드러나기도 합니다. 자아팽창이 전능환상 상태에 이르러 버린 것입니다. 
   
            우리는 ‘누군가’로 살아가려고 합니다. 사회적인 역할, 책임, 위치, 관계의 양상, 교류, 직업 등을 통해 누군가가 되어 존재합니다. 그런데 그런 모습은 진짜 내가 아닙니다. 그것은 생존을 위하여 선택한 나의 전략이고 모습입니다. 어떤 직업으로서 일하는 내가 진정한 ‘나’가 아닙니다. 누군가와의 관계로 만들어진, 어떤 조직과의 관계로 규정된 내가 ‘나’는 아닙니다. 죽을 때까지 나는 진정한 ‘나’를 찾아 여행을 떠나야 합니다.
         `,
    },
    {
      img: 'metaq_9',
      score: 100,
      title: '용기를 내는 단계',
      desc: '변화와 긍정, 힘을 얻음, 실행할 수 있는, 동기부여, 모험, 성취, 결단, 인내, 변화, 도전, 자발적, 힘이 생기는, 성장, 배우는, 생산성 ',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '처음으로 힘이 나타나며, 진정한 힘에 도달하는 일이 일어나는 구간입니다. 용기의 수준에서 삶은 흥미진진하고, 도전적이며, 자극을 주는 것으로 여겨집니다. 용기는 기꺼이 새로운 것을 시도하고, 기꺼이 삶의 부침을 다루는 자발성을 내포하게 됩니다. 이 수준에서 사람은 삶의 기회에 응하여 이를 효과적으로 처리할 수 있습니다. 예컨대, 새로운 직무 기술을 배우기 위한 에너지 수준에 이르렀다는 것입니다. 자신이나 타인의 두려움이나 성격 결함을 직면할 능력이 있고 그러한 결함에도 불구하고 ‘나’는 성장할 능력을 가지고 있습니다. 이 수준의 사람들은 자신들이 받은 만큼 세상으로 에너지를 되돌려 놓습니다. 반면 더 낮은 수준 50 이하에서는 사회로부터 에너지를 소모하며 돌려주지 않습니다. 성취가 긍정적 피드백을 낳기 때문에, 보상과 존중은 점차 자신을 강화하게 됩니다. ',
      streamOfConsciousness:
        `
            삶을 긍정하고 살아갈 힘을 가지고 있으며 실행할 수 있는 여지를 갖고 있습니다. 동기부여가 명확하기에 모험과 성취를 위한 여정을 두려워하지 않고, 자신에게 당면한 문제들과 갈등에 대해 결단을 내릴 수 있는 힘을 갖습니다. 스스로 자신을 변화시키려는 노력과 도전을 기획하며 혼자의 힘으로 전진을 위한 노력을 시작합니다. 스스로에게 말합니다. “인생을 다시 산다면 다음번에는 더 많은 실수를 저지르리라” 어제를 후회하지 않고, 자기 안에 있는 오늘의 인생을 바라봅니다. 그러기에 내일에 대한 희망도 긍정적으로 만들어 나갑니다. 
   
            당신의 용기는 매우 값진 것입니다. 그 용기로 말미암아 당신은 새로운 도전과 비약을 이루어 낼 수 있을 것입니다. 때로는 삶이 그대를 속일 때도 있을 것입니다. 그러나 슬픈 날을 참고 잘 견디어야 합니다. 즐거운 날은 성실하고 용감한 그대에게 찾아올 것이고, 미래를 희망하게 될 것입니다. 현재는 고통스러운 날들이 많이 있기도 하지만 모든 것은 지나가는 것이란 생각을 해야 합니다. 
            문제점을 찾으려 하기 보다는 해결책을 찾는 창조적인 일에 몰두해야 합니다. 비판이나 비난은 당신의 힘을 분산시킵니다. 창조적이고 생산적인 일에 집중한다면 더욱 좋은 결과를 얻게 될 것입니다. 그리고 우선 무엇이 되고자, 무엇을 얻고자, 어디로 가고자 하는가에 대해 자신에게 끊임없이 물어야 합니다. 그리고 해야 할 일을 묵묵히 해 나가는 것입니다. 당신에게는 주어진 시간이 매우 중요하니 시시비비를 가리는 일로 에너지를 소모하는 것은 피해야 합니다. 당신에게 문제는 얼마나 빨리 가느냐가 아닙니다. 그 목적지가 어디인지를 명확하게 해야 합니다. 도중에 포기하거나 망설여서는 안됩니다. 성공으로 가는 엘리베이터를 타기보다는 한 계단 한 계단 당신만의 계단을 이용하는 것이 유리합니다. 
   
            길을 잃은 것 같은 날들이 당신에게 다가올 것입니다. 그러나 그것은 오히려 길을 알게 된 것입니다. 아닌 길을 피해간 것뿐입니다. 여기에서 당신이 저지를 수 있는 실수는 ‘실수하지 않을까?’ 하는 두려움입니다. 사람을 강하게 하는 것은 사람이 ‘하는 일’이 아니라 ‘하고자 하는 노력’입니다. 실패를 걱정하지 말고 부지런히 목표를 향하여 노력하십시오, 노력한 만큼의 보상이 따를 것입니다. 어떤 일을 선택하고 집중함에 있어 그 일을 올바르게 믿고, ‘나’는 그것을 성취할 힘이 있다고 믿으며 적극적으로 그것을 이루겠다는 마음을 가져야 합니다. 
   
            선택과 집중은 당신에게 중요한 화두입니다. 너무나 많은 것들에 관심을 두기보다는 그 가운데서 가장 먼저 해야 할 일에 집중하는 것이 더욱 중요합니다. 용기는 항상 큰 소리로 목청을 높이는 것만이 아닙니다. 오히려 하루의 마지막 “내일 다시 해보자!”라고 말하는 작은 목소리일 때도 있습니다. 용기란 계속할 수 있는 힘이 아니라 아무 힘이 없을 때 계속하는 것입니다. 일이 어렵기 때문에 해낼 용기가 없는 것이 아니라, 그것을 해낼 용기가 없기 때문에 일이 어려워 지는 것입니다. 용기란, 두려움에 대한 저항이고, 두려움의 정복입니다. 두려움이 없는 것이 아닙니다. 
         `,
    },
    {
      img: 'metaq_10',
      score: 150,
      title: '중용의 단계',
      desc: '자유와 해방, 신뢰, 만족하는, 융통성, 유연함, 과정 중심, 인정, 자신감, 여유, 자유, 안전, 비분별',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '중도 상태는 유연성을 허용하며 문제에 관해 판단적이지 않은, 현실적인 평가를 허용합니다. 중립적이라는 것은 상대적으로 결과에 집착하지 않음을 의미합니다. 중도는 내적 자신감의 시작입니다. 즉, 자신의 힘을 감지하고 그리하여 쉽게 위협당하지 않습니다. 중립인 사람들에게는 평안한(Well-being) 감각이 있습니다. 이 단계의 표식은 자신감 있게 세상을 살아가는 능력입니다. ‘중도’는 모든 사물과 현상을 있는 그대로 바라보는 것입니다. 자신의 생각이나 관념이나 가치관에 따라 사실을 달리 보거나 해석하는 것이 아니라 사실을 사실 그대로 바라보는 것입니다. 이 세상의 모든 사물과 현상은 무상합니다. 이 세상의 어떤 것도 영원히 변하지 않는 것은 없습니다. 영원히 변하지 않는 자아도 없습니다. 이 세상의 모든 괴로움과 어려움은 자아에 대한 집착과 어리석음 때문입니다. 대부분의 사람들은 자신이 좋아하는 것만 추구하거나 싫어하는 것은 멀리하는 습관의 힘이 있습니다. 그래서 좋아하는 것과 싫어하는 것이 생겨나고, 갈등과 다툼이 생겨납니다. 그것은 사물에 대해서도 사람에 대해서도 마찬가지입니다. 삶의 모든 측면을 통합하고 포용하면서 평온을 찾을 수 있는 길이 중도의 길이며 평화의 길입니다. ',
      streamOfConsciousness:
        `
            중도는 우리가 흔히 말하는 변증법적 유물론도 아니고 이분법적 견해의 그 중간도 아닙니다. '너와 나', '선과 악', '옳고 그름', '진보와 보수'와 같은 이분법적 견해에 얽매이거나, 그 두 개의 견해를 알맞게 절충하거나, 아니면 두 개의 견해 사이의 그 중간을 의미하는 것도 아닙니다. 또 중도는 단순히 극단적인 길을 피하고 어느 쪽에도 치우치지 않는다는 것을 의미하는 것도 아닙니다. 중도는 이런 이분법적 사고를 넘어서는 것입니다. 
   
            중도는 '바른 견해'이고, '바른 생각'입니다. 중도는 우선 '바르다'라는 전제가 필요합니다. 그리고 '바르다'라는 것은 이 세상의 모든 사물과 현상을 있는 그대로 바라보는 것이라는 이해가 필요합니다. 있는 것을 있는 그대로 바라보는 것이 지혜의 시작입니다. 사실을 사실 그대로 바라보는 것이 바른 것입니다. 자신의 생각이나 관념이나 가치관에 따라 사실을 달리 보거나 해석하는 것은 '바르다'라고 할 수 없습니다.
   
            당신은 바른 견해를 가지고 있는 사람입니다. ‘바른 견해’는 열린 마음을 갖는 것이고, 극단적인 시각과 이분법적 사고에서 벗어나, 만물의 본성은 상호 의존적이고 서로 의존하여 생성된다는 것을 잘 알고 있는 상태라는 것입니다. 
   
            우리 사회에서 ‘중도’란 적당한 절충주의라는 인식이 지배적입니다. 그것은 근대사적으로 볼 때 일부 정치인들에 의해 중도라는 말이 정략적으로 타협의 도구가 되었고 때로는 회색적 태도로 표현되었기 때문일 것입니다. 그래서 사실 중도의 길을 간다는 것이 타인에게는 회색주의자, 기회주의자, 혹은 ‘이래도 저래도 좋다’라는 식의 유약한 ‘판단장애’ 혹은 ‘결정 장애’를 가진 줏대 없는 사람으로 보일 수도 있습니다. 그러나 원래 중도(中道)는 좌와 우, 혹은 진보와 보수의 물리적 중간을 의미하는 것이 결코 아닙니다. 더욱이 중도는 그들 사이의 물리적 차이를 뛰어넘어, 공동선이나 사회 전체의 이익이라는 한 단계 높은 차원에서의 합의와 통합을 의미합니다. 그러므로 진정한 중도는 우선 좌와 우, 진보와 보수 모두에게 마음을 열고 그들의 주장을 진솔하고 정확하게 이해하고 각각의 사상의 상대적 가치를 공정하게 포용해야 합니다. 중도는 이념분열과 갈등을 극복하기 위하여 공동체의 합의를 바탕으로, 합리적 대안을 제시함으로써 사회를 통합시키는 역할을 할 수 있습니다. 그것이 당신의 역할일 수 있습니다. 그리하여 당신은 우리 사회를 질적으로 한 단계 높은 차원으로 들어 높일 수 있는 능력을 발휘할 수 있습니다.
   
            당신은 신뢰할만한 사람이며, 자유로운 영혼입니다. 항상 삶에 만족하고, 융통성이 있으며 유연함을 가지고 살아갑니다. 특히 결과보다는 과정을 소중하게 생각하고, 타인을 긍정하고 자신을 긍정합니다. 그러한 자신감과 여유가 당신을 더 안전한 자리에 머물게 하고, 시시비비와 판단을 넘어선 자리에서 당신은 공동체에 선한 영향력을 줄 수 있는 사람입니다. 
   
            이 세상의 모든 사물은 연결되어 있고 하나입니다. 그 모든 현상들은 무상합니다. 보다 높은 차원으로 나아가기 위해 당신에게 필요한 영성은 우리가 만나게 되는 모든 사람과 사물, 원인과 결과는 긴밀하게 연결되어 있다는 진리입니다. 당신을 응원합니다. 당신은 우리 사회에 선한 영향력을 주는 아름다운 사람입니다.
         `,
    },
    {
      img: 'metaq_11',
      score: 170,
      title: '자주성의 단계',
      desc: '낙관주의, 의도와 의미를 가짐, 희망적인, 친절, 최선, 배움, 발전, 빠른 성장, 내적 저항 극복, 참여, 사회에 기여',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '이전 단계인 중도 역량의 수준에서는 일을 적절히 하는데 그치지만, 자발적이고 창의적인 수준에서는 다가오는 일들을 보다 다른 차원으로 확장시키고 변화시킬 능력을 가집니다. 이 단계에서는 변화가 빠르게 일어나며 주제들에 대한 이해의 수준이 깊어집니다. 이들은 진보하도록 선택 받았습니다. <Meta Q, 100> 미만의 수준에서 사람들은 마음이 편협한 경향이 있지만, 이 수준에 이르면 마음이 크게 열립니다. 이 수준에서 사람들은 진심으로 친근해지고 사회적, 경제적 성취와 성공은 자동으로 뒤따르는 듯 보입니다. 일해야 할 때는 어떤 일이든 할 것이며, 경력을 쌓거나 혼자서 무엇인가를 경영하면 되기 때문입니다. 이들은 자연스럽게 다른 이들에게 도움이 되고 공동선에 공헌합니다. 또한, 내적 문제를 직면하며 배우는데 큰 장애물이 없습니다. ',
      streamOfConsciousness:
        `
            자발적이고 창의적인 단계에 이른 당신은 커다란 능력을 가지고 있는 사람임에 틀림없습니다. 당신의 기획과 노력은 조직 내에서 커다란 반향을 불러일으키고 큰 성과를 낼 수 있습니다. 당신은 모든 일들에 낙관적이고, 의도와 의미를 가지고 일을 합니다. 희망이 상존하고, 친절하며, 모든 일에 최선을 다하고 열려있는 배움의 자세를 가집니다. 
   
            먼저 당신의 자발성과 창의성이 난관에 부딪히게 되는 경우를 조심해야 합니다. 당신의 창의성을 이해하지 못하는 동료들은 당신을 배척하거나 당신의 성취를 평가절하할 수 있습니다. 조직 안에서 일하는 경우, ‘나’의 생각이나 창의성이 통제되는 경우에 당신은 조직에서 오해받을 수도 있다는 점을 명심하십시오. 자발성과 창의성은 본인의 내적 성장이나 만족에는 끊임없는 동기부여와 자극을 줄 수 있지만, 반대로 변화하지 않는 당신의 동료들과 팀원들에게는 불편함이 될 수도 있습니다.
   
            트라우마에 관한 심리학 연구들에 따르면 개인이 신뢰하는 가까운 관계에서 일어난 공격이 더 깊고 해로운 후유증을 남긴다고 말합니다. 이러한 폭력은 신뢰에 대한 위반을 수반하기 때문입니다. 부모나 교사 등 내가 의지하는 혹은 나에게 보호를 제공하는 사람들이 폭력을 가할 때 피해를 입은 개인의 일차적 반응은 그러한 일이 일어났고 그게 폭력이라는 사실을 무시하는 것입니다. 가해자가 폭력을 행사한다고 해서 그 순간 칼로 자르듯이 그와 나의 관계가 가해자-피해자로 정리될 수는 없습니다. 두려움과 분노뿐 아니라 사랑과 사랑받고자 하는 욕구를 동시에 가지는 것은 안전을 위해 내가 의존하는 대상이 나를 해치는 모순되는 상황에 대한 당연한 반응입니다. 폭력이 일어났다는 사실을 인정하는 순간 중요한 관계를 잃을 수 있기에 차라리 없던 일처럼, 아무 일도 아닌 것처럼 행동합니다. 그러나 애써 무시한다고 해서 고통이 사라지는 것은 아니며 생존을 위한 적응은 대가를 치르게 됩니다. 실제 경험과 나의 이해에 괴리가 생기며 자아의 통합을 상실하게 됩니다. 자신의 내적 경험을 있는 그대로 믿기가 어렵고 스스로 의심하게 됩니다. 타인은 나에게 상처를 줄 수 있는 사람이기에 타인 또한 믿기 어려운 것도 사실입니다. 
   
            ‘보여지는 나’와 ‘진짜 나’는 간격이 발생해 있습니다. 분열되어 있다는 것입니다. 특히 사회적으로 높은 자리에 있거나, 타인들에게 기준이 되어 살아가는 사람들은 그 분열이 더욱 큰 간격을 가지고 살아갑니다. 정치인들이나, 성직자, 수도자, 혹은 조직의 책임 있는 리더들의 경우에 분열은 더더욱 심각합니다. 세상에 보여지기 위한 나의 이상적인 모습과 나의 느낌, 나의 생각, 나의 존재는 너무나 큰 괴리를 가지고 있습니다. 보여지는 나는 타인들이 봐주었으면 하는 나의 모습이고, 진짜 나는 어떤 시간이나 장소, 경험, 사물, 사람과도 떨어져 나 혼자 느끼는 시간에 시작됩니다. 그때부터 우리는 진짜 ‘나’를 만나기 시작합니다. 아무것도 하지 않고, 자신을 돌아보면 우리는 뭔가를 느끼기 시작합니다. 그것이 바로 진짜 ‘나’입니다. 
   
            내가 어떤 사람과 친구인지, 어떤 사람을 알고 있는지, 어떤 사람과 관계하고 있는지, 어떤 경험을 했는지, 어디에서 살았는지, 어떤 공부를 했는지는 중요하지 않습니다. 우리가 외부의 자극이 없이 온전히 느끼는 진짜 나는, 수치심과 분노, 죽음이나 사후에 대한 두려움, 완벽한 성취를 바라는 부모의 기대에 미치지 못했던 나, 가난한 환경과 불행한 환경에서 자라왔던 나의 열등감, 세상이 원하는 외모가 아니라는 자기비하, 이러한 느낌들이 우리가 숨기고 싶어하는 그림자들입니다. 이것이 진짜 우리의 모습이며 밖으로 투사하고 있는 이미지 뒤에 숨은 진정한 자아입니다. 
   
            우리는 이 모습을 세상에 드러내고 싶지 않아서 다른 누구인 척합니다. 특히 정체성을 형성하는 어린 시절에 이런 가면을 많이 만들어 쓰고 살아가기 시작합니다. 우리는 진짜 나의 모습을 보여주기보다는 다수가 있는 쪽을 택해 거기에 적응해 왔습니다. 왜냐하면, 세상은 복잡하고 두려운 공간이지만 많은 사람과 함께 무리지어 있으면 훨씬 덜 겁나고 단순하게 살아갈 수 있기 때문입니다. 그래서 우리는 자신이 속할 그룹을 선택하고 그 독배를 들이마시게 됩니다. 
   
            내가 선택한 정체성은 나에게 잘 어울리는 옷처럼 보입니다. 우리는 그 옷에 맞추어 성장해 나갑니다. 불안감과 함께 엄청난 자의식에 갇혀 들기 시작합니다. 의사들의 가운, 법조인들의 법복, 성직자들의 제의, 군인들의 군복, 특수한 학교의 교복, 요즘은 대학의 이름이 새겨져 있는 티나 특정한 학과의 이름이 적힌 점퍼를 입고 다니는 학생들을 많이 만나게 됩니다. 그것이 과연 진짜 ‘나’일까요? 우리는 세상에 맞서 적당한 그룹의 무리를 선택해 불안한 나를 숨기고 살아가는 것입니다.
         `,
    },
    {
      img: 'metaq_12',
      score: 180,
      title: '포용의 단계',
      desc: '용서, 초월(Transcendence), 조화로운, 책임, 창조, 차분, 평등, 평온함, 확장, 균형, 다양성',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '<Meta Q, 100> 미만 수준의 사람들은 무기력한 경향이 있고 자신을 외부세계의 삶에 휘둘리는 희생자로 규정할 수 있습니다. 이는 자기 행복의 근원 혹은 문제의 원인이 ‘저 바깥에’ 있다는 신념에서 기인합니다. 그러나 <Meta Q, 180> 수준에서는 행복의 근원이 자신의 내부에 있다는 각성과 함께, 자기 자신의 힘을 되찾는 거대한 도약이 이루어집니다. 이른바 저 밖에 있는 어떤 것도 사람을 행복하게 만들 능력이 없으며 사랑은 다른 사람이 주거나 빼앗는 것이 아닌 내면으로부터 창조되는 어떤 것이라고 이해하기 시작합니다. 받아들임은 근본적으로 균형, 조화, 적절함과 관련이 있습니다. 이 수준에서 우리는 갈등이나 대립 때문에 양극화되지는 않습니다. 즉, 다른 사람도 우리와 똑같은 권리를 가졌음을 알며 그래서 평등을 존중합니다. 낮은 수준들은 완고함을 특징으로 하지만 이 수준에서 ‘사회적 다원성’이 문제 해결의 한 형태로서 출현하기 시작합니다. 따라서 이 수준에는 차별이나 편협함이 없습니다. 즉 ‘평등이 다양성을 배제하지 않는다’는 앎이 있습니다. 받아들임은 거부하기보다 포함하고 융합합니다.',
      streamOfConsciousness:
        `
            포용(包容)력과 포옹(抱擁)력은 다른 말입니다. 포용력이란 상대방이 하는 말과 행동을 무조건 다 참고 일방적으로 받아주는 것이 아닙니다. 포용력은 상대방이 하는 말과 행동을 진심으로 이해하고 노력해서 내 안에 받아들이는 힘입니다. 그래서, 인내심이 강한 사람은 많지만, 포용력이 높은 사람은 그리 많지 않습니다. 반면에 포옹력이란 아량을 가지고 상대방을 너그럽게 품어주는 힘입니다. 어린 시절 엄마의 품에서 자란 아이는 면역력과 안정감이 높고, 건강하게 성장하지만 엄마의 품에서 벗어나 자란 아이들은 면역력도 약해지고, 불안을 기본값으로 가지고 살아갑니다. 인내심과 포용력은 대인관계의 핵심입니다. 인내심은 힘들고 어려운 상황에서도 침착하고 의연하게 평정심을 유지하는 능력입니다. 인내심에는 화를 내거나 성급하게 결론을 내는 것이 아니라, 기다리는 여유까지도 포괄합니다. 
   
            관상(Contemplation)은 바라보는 것입니다. 우리는 여기에서 관상의 의미를 조금 더 현대에 맞게 해석하려고 합니다. 양자역학에서는 바라보는 것을 통해 ‘관찰자 효과’를 설명합니다. 관찰자 효과의 의미는 실험실의 범위를 훨씬 뛰어넘습니다. 현실에 대한 고찰(Contemplating Reality), 그것은 우리에게 현실의 본질과 그것을 형성하는 관찰자의 역할에 대해 생각해 보라고 독려하는 것입니다. 우리는 단지 사건의 전개를 지켜보는 수동적인 관객인가요? 아니면 우리가 인식하는 현실의 적극적인 참여자이자 공동 창조자인 것일까요? 관찰자 효과는 후자, 즉 우리의 관찰행위 자체가 우리가 경험하는 현실에 영향을 미친다는 것을 전제하고 있는 것입니다. 
   
            진정한 행복을 관상하기 위해 우리는 ‘나’의 모습을 관상해야 합니다. 겉으로 보여지는 나와 진짜 나의 차이는 끊임없이 내면의 불안과 공허함을 불러일으킵니다. 
   
            감정적 흥분이 없는 기억을 ‘지혜’라고 합니다. 우리는 과거의 나를 제한하는 기억에서 감정이라는 창을 통과하지 않고, 사건을 객관적으로 돌아보며 자신의 상태를 바라볼 수 있습니다. 중독된 감정, 과도한 도파민 분비를 제한하기 위해서 그러한 ‘나’를 바라보는 것만으로도 충분한 변화를 시작할 수 있습니다. 과거의 불행을 내려놓고, 자신의 인생을 긍정하기 시작한다면, 새로운 관계를 맺고, 새로운 직장을 얻고, 새로운 장소를 가고, 새로운 친구들과 동료들을 얻게 된다면 우리는 과거의 ‘나’에서 벗어나 새로운 사람이 될 것입니다. 그리고 이제 지나간 나의 고통의 시간은 ‘새로운 지금의 삶을 준비하기 위해 주어졌던 역경이었다’라고 과거를 재해석하게 될 것입니다. 
   
            사람들은 어떤 인생의 위기나, 트라우마, 절망적인 상황에 직면했을 때 변화를 시도합니다. 그 삶의 위기는 사고나 질병, 파산이나 상실, 실직이나 관계의 파탄 등 무엇인가를 잃는 것에 대한 이야기들 입니다. 건강의 상실, 재산의 상실, 관계의 상실 등 무엇인가를 잃어버린 것에 대한 안타까움과 슬픔 등이 주를 이룹니다. 여기에서 우리가 가져야 할 치료의 근본적인 마음은 “계속 이런 식으로 살 수는 없다. 내가 앞으로 얼마나 힘들고, 어떤 느낌에 휩싸이던(몸), 얼마나 오래 걸릴지 알 수 없지만(시간), 내 삶에 어떤 일들이 일어난다 해도 관계없다(환경). 나는 변화할 것이고, 그렇게 해야 나는 온전히 존재할 수 있을거야.” 내 안에 스며들어 있는 무가치함, 분노, 두려움, 수치심, 자기불신, 죄책감, 죄의식 등을 지우기 시작해야 합니다. 이렇게 풀려난 에너지는 생명력의 수치를 끌어올립니다. 한동안 느끼지 못했던 기쁨과 평화를 다시 발견할 수 있을 것입니다. 몸도 나를 꽁꽁 묶어 두었던 감정의 사슬에서 벗어남으로써 새롭게 고양되고 고무되는 느낌을 받게 됩니다. 그 간격의 어두운 부분 속에 감춰 두었던 것을 고백하고 드러내야 합니다. 그것들을 밝은 빛 속으로 끌고 나와야 합니다. 
         `,
    },
    {
      img: 'metaq_13',
      score: 200,
      title: '이성의 단계',
      desc: '지혜인, 이해, 추상적, 직관적, 의미있는, 가치있는, 통찰력, 지성, 합리성, 논리, 개념, 이론, 지식',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '이성 그 자체로는 진실에 대한 지침을 제공하지 못합니다. 이성은 논리의 방법론이 두드러지는 기술 세계에서 대단히 효과적이지만 역설적으로 더 높은 의식 수준에 도달하는 데에는 중대한 장애물입니다. 세계 인구의 4%만이 초월합니다. <Meta Q, 200> 이상의 단계에서는 의미 있고, 가치 있는 일에서 활동의 동력을 찾아 나갑니다. 지식의 양이 문제가 아니라 그것을 통합적 전망으로 융합할 수 있는 능력을 가지며, 지식을 어떻게 활용하고 배치해야 하는지에 대한 안목을 가지게 된 상태입니다. 이성은 감성을 통합하여 통제할 수 있는 역할을 하지만 그것이 언제나 성공적인 것은 아닙니다. 이성과 감성의 통합은 통찰력을 강화시킬 수 있는 길이기도 합니다. 언어들에 대한 논리와 의미를 보다 깊게 이해하기 시작하고 정의와 개념에 대한 자기화를 진행 시킵니다. 객관성이라고 불리는 것을 상대적 주관성으로 새롭게 정립하며 나의 개념, 나의 영역을 만들 수 있는 힘을 가지게 됩니다. 당신만의 이론이나 체계를 정립하고 창조할 수 있는 능력에 닿아있는 것입니다. ',
      streamOfConsciousness:
        `
            ‘창조적인 삶’을 산다는 것은 ‘아무도 아닌(Nobody)’ 존재로 살아간다는 것입니다. 우리는 자꾸 무엇인가, 누군가가 되려고 합니다. 어디인가 소속되려고 하고, 무언가에 기대어 자신의 존재를 증명하려고 합니다. 무엇인가 되려는 것이, 누구인가로 존재하려는 것이 나의 스트레스의 핵심입니다. 자신을 잊어버릴 정도로 어딘가에 몰입해 있었던 경우가 있나요? 몰입의 순간에는 당신이 이미 알고 있는 세계에서 분리됩니다. 더 이상 내가 소유한 물건들, 내가 아는 사람들, 해야 하는 일들, 특정한 장소에 살았던 이런저런 장소들과 관련된 누군가가 아닙니다. 무아(無我)의 상태가 되는 것입니다. 우리가 더 이상 외부환경 속에 사람과 장소, 사물에 초점을 맞추지 않는다면 선형적인 시간을 넘어서 양자의 에너지 영역, 세상으로 들어가게 됩니다. 
   
            무엇인가 새로운 창조의 영역으로 들어갈 때 가장 활성화되는 것은 전두엽입니다. 전두엽은 가장 최근에 진화되었으며 뇌에서 적응능력이 가장 뛰어난 부분입니다. 주의집중, 인식, 관찰, 그리고 의식을 관장하는 곳으로 뇌의 CEO, CPU 또는 의사결정자라고 생각하면 됩니다. 전두엽은 가능성을 추론하고, 확고한 의도를 입증하고, 의식적인 결정을 내리고 충동적, 감정적인 행동을 조절하며 새로운 것을 배우는 곳입니다. 
   
            새로운 자아를 창조하기 위해서는 과거의 자기 모습에서 벗어나야 합니다. 전두엽의 첫 번째 기능은 자기 자신을 인식하는 것입니다. 우리는 자신의 생각과 자아를 관찰하는 ‘메타인지 능력’을 가지고 있습니다. 나의 ‘생각’을 생각할 수 있는 것이 인간입니다. 그래서 더 이상 생각하고 싶지 않은 것, 행동하고 싶지 않은 것, 느끼고 싶지 않은 것을 멈추면서 존재 상태의 역전을 결행할 수 있습니다. 
   
            ‘나’ 자신에 대한 믿음을 가져야 합니다. 내가 무엇이고, 어디에 있으며, 누구라고 믿는 그것이 바로 내 자신입니다. 내가 가지고 있는 믿음이 나를 만들어 냅니다. 진정으로 새로운 자기 자신을 바란다면 현재의 자기 자신에 대한 총체적인 점검과 관찰을 해야 합니다. 자기를 인식한다는 것의 근본적인 목적은 경험하고 싶지 않은 생각이나 행동, 감정을 더 이상 자신도 모르게 되풀이하지 않기 위함입니다. 과거의 존재 상태에서 의식적으로 벗어나려는 노력을 계속하면 과거의 성격과 관련된 오래된 신경망의 연결이 끊어지는 것은 시간문제입니다.
         `,
    },
    {
      img: 'metaq_14',
      score: 250,
      title: '사랑의 단계',
      desc: '선한 영향력, 존경, 경의, 현현(드러남), 온화함, 공존, 전체, 직관, 생명, 양육, 자기 확장, 선함',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '조건 없고 변하지 않으며 영구적인 사랑이 발달하는 것이 특징입니다. 이성은 특정한 것을 다루지만 사랑은 전체를 다룹니다. 사랑은 위치를 취하지 않고, 따라서 전체적이며 위치성의 분리를 넘어섭니다. 그러면 ‘서로 함께하는 것’이 가능한데 더 이상 서로 어떤 장벽도 없기 때문입니다. 사랑은 포괄적이고 계속해서 자아 감각을 확장해 나갑니다. 선한 영향력을 주변에 쏟아내기 시작합니다. 사람들은 당신을 존경하고, 경의를 표할 것입니다. 당신은 의도하지 않고도 당신 존재의 선함을 드러내게 된 것입니다. 온화하게 공존의 길을 찾고, 부분이 아니라 전체적인 관점에서 사람과 세상을 바라보는 직관의 능력을 가지게 된 것입니다. 사랑은 직관의 능력을 성장하게 합니다. 주변을 성장시키고, 주변은 당신으로 물들게 될 것입니다. ',
      streamOfConsciousness:
        `
            모든 외부 자극에서 벗어난 조용한 순간에 나를 붙잡고 조용히 머물러 스스로에게 질문합니다. 나는 진정 평화로운가? 만족하는가? 행복한가? 충만한가? 그러나 많은 경우 우리는 무언가 빠져있는 듯하고, 불안하고, 뭔가 잘못된 것은 아닌가? 라는 생각을 하고 있습니다. 많은 사람들이 지금 존재하는 자신의 삶에 만족하거나, 문제가 없다고 생각하지 않습니다. 우리는 많은 경우 외부세계에 지나치게 의존하며 살아갑니다. 특히 모바일 폰이 뇌의 한 부분이 되어가는 시대를 맞이해서 우리는 모바일을 통해 외부세계의 자극을 한시도 놓치지 않고 바라보며 자극됩니다. 내가 행복이라고 자각하는 것은 외부세계에서의 자극에 대한 반응일뿐이라는 것을 알아채는 순간 우리는 외부 자극에 중독되어 있음을 발견하게 됩니다.
   
            ‘보여지는 나’와 ‘진짜 나’는 간격이 발생해 있습니다. 분열되어 있다는 것입니다. 특히 사회적으로 높은 자리에 있거나, 타인들에게 기준이 되어 살아가는 사람들은 그 분열이 더욱 큰 간격을 가지고 살아갑니다. 정치인들이나, 성직자, 수도자, 혹은 조직의 책임 있는 리더들의 경우에 분열은 더더욱 심각합니다. 세상에 보여지기 위한 나의 이상적인 모습과 나의 느낌, 나의 생각, 나의 존재는 너무나 큰 괴리를 가지고 있습니다. 보여지는 나는 타인들이 봐주었으면 하는 나의 모습이고, 진짜 나는 어떤 시간이나 장소, 경험, 사물 사람과도 떨어져 나 혼자 느끼는 시간에 시작됩니다. 그때부터 우리는 진짜 ‘나’를 만나기 시작합니다. 아무것도 하지 않고, 자신을 돌아보면 우리는 뭔가를 느끼기 시작합니다. 그것이 바로 진짜 ‘나’입니다. 
   
            내가 어떤 사람과 친구인지, 어떤 사람을 알고 있는지, 어떤 사람과 관계하고 있는지, 어떤 경험을 했는지, 어디에서 살았는지, 어떤 공부를 했는지는 중요하지 않습니다. 우리가 외부의 자극이 없이 온전히 느끼는 진짜 나는, 수치심과 분노, 죽음이나 사후에 대한 두려움, 완벽한 성취를 바라는 부모의 기대에 미치지 못했던 나, 가난한 환경과 불행한 환경에서 자라왔던 나의 열등감, 세상이 원하는 외모가 아니라는 자기비하, 이러한 느낌들이 우리가 숨기고 싶어하는 그림자들입니다. 이것이 진짜 우리의 모습이며 밖으로 투사하고 있는 이미지 뒤에 숨은 진정한 자아입니다. 
   
            우리는 이 모습을 세상에 드러내고 싶지 않아서 다른 누구인 척합니다. 특히 정체성을 형성하는 어린 시절에 이런 가면을 많이 만들어 쓰고 살아가기 시작합니다. 우리는 진짜 나의 모습을 보여주기보다는 다수가 있는 쪽을 택해 거기에 적응해 왔습니다. 왜냐하면, 세상은 복잡하고 두려운 공간이지만 많은 사람과 함께 무리지어 있으면 훨씬 덜 겁나고 단순하게 살아갈 수 있기 때문입니다. 그래서 우리는 자신이 속할 그룹을 선택하고 그 독배를 들이마시게 됩니다. 
   
            내가 선택한 정체성은 나에게 잘 어울리는 옷처럼 보입니다. 우리는 그 옷에 맞추어 성장해 나갑니다. 불안감과 함께 엄청난 자의식에 갇혀 들기 시작합니다. 의사들의 가운, 법조인들의 법복, 성직자들의 제의, 군인들의 군복, 특수한 학교의 교복, 요즘은 대학의 이름이 새겨져 있는 티나 특정한 학과의 이름이 적힌 점퍼를 입고 다니는 학생들을 많이 만나게 됩니다. 그것이 과연 진짜 ‘나’일까요? 우리는 세상에 맞서 적당한 그룹의 무리를 선택해 불안한 나를 숨기고 살아가는 것입니다.
         `,
    },
    {
      img: 'metaq_16',
      score: 300,
      title: '깨달음의 단계',
      desc: '평화, 진짜나, 말로 표현할 수 없는(언어를 넘어선), 순수의식(Self), 참나(영성적 Self), 행복, 완벽한, 전 존재, 일체감, 공헌, 지각, 현존',
      detail: 'IQ와 EQ를 넘어서는 μετά Q 융합역량지수는 우리가 ‘의미’와 ‘가치’의 문제를 다루고 해결할 때 사용하는 역량이며, 우리의 행동과 삶을 광범위하고 풍부한 의미의 맥락에 자리매김할 수 있게 하는 역량입니다. 자아나 의식적인 생각을 초월하는, 자기의 깊은 부분에 존재하는 지혜와 연관된 역량이며 기존의 가치를 인식하는 데 그치지 않고 새로운 가치를 창조적으로 발견하게 하는 역량입니다. 개인의 정서지수와 다중역량지수, 그리고 에너지 방향과 의사소통 방식 등에 따른 기능지수를 통합적으로 분석한 결과입니다.',
      wayOfBeing: '사랑을 이루게 된 자는 평화의 길로 접어듭니다. 더이상 외부세계의 소리에 마음을 빼앗기지 않습니다. 이미 언어의 영역을 벗어나 있습니다. 그것은 언어를 포기했다거나 언어의 영역을 벗어나 있다는 것이 아니라 언어를 초월해 있다는 것입니다. 초월은 넘어서서 다른 차원으로 가는 것이 아니라 더욱 핵심과 본질로 나아간다는 것입니다. 순수한 의식에 가 닿은 것이며, 참 나의, 진짜 나의 발견으로 나아간 것입니다. 이제 ‘나’는 개별 존재의 영역을 내려놓고, 우주와 세상과 하나가 되어 있다는 것을 알게 되며, 나의 작은 움직임과 파동이 어떻게 세상으로 퍼져나가는지를 알아차리게 됩니다. 더이상 세상의 갈등과 소음에 반응하지 않지만, 세상이 나아가야 할 방향과 해결을 위한 조언과 제언을 할 수 있는 지혜의 영역에 머물게 됩니다. 사람들은 지혜를 얻기 위해, 문제의 해결을 위한 실마리를 찾기 위해 당신, 현자를 찾게 될 것입니다.',
      streamOfConsciousness:
        `
            관상(Contemplation)이라는 말은 라틴어 Contemplationem (주격 Contemplatio) "바라보는 행위"에서 나온, 행위를 나타내는 명사입니다. 여기에서 과거 분사의 어근 Contemplari인 "주의 깊게 바라보다, 관찰하다, 생각하다, 사색하다"라는 의미가 더해집니다. 14세기 말 '반성, 생각, 사고, 마음속에 지속적으로 아이디어를 가져오는 행위'로 인증되었고 15세기 말에 이르러 '주의 깊게 무언가를 바라보는 행위'라는 의미로 정돈되었습니다. 
   
            세상과 인간을 바라본다는 것, 양자역학의 관찰자 효과는 동일하게 발생합니다. 무의식 속에 잠재해 있는 기억들을 관찰하면서 ‘과거 자아’의 고리를 풀고 새로운 ‘나’로 다시 창조될 수 있도록 하는 데에 관상은 놀라운 효과를 가져옵니다. 명상, 관상이라는 말은 티베트어로 ‘친해지다(gom:)’는 의미를 가집니다. 명상이나 관상은 자기계발 혹은 자기관찰, 자기객관화라는 표현으로 일상 안으로 끌고 올 수 있습니다. 
   
            우리는 명상이나 관상에 대한 편견을 가지고 있습니다. 곧 그것들은 특별하게 무언가 구도를 하는 사람들, 성직자나 수도자들, 혹은 특수한 교육이나 훈련을 받은 사람들의 전유물 정도로 생각할는지 모르지만 우리들의 삶 속에서 명상과 관상은 늘 발생합니다. 우리가 그것을 그렇게 말하지 않고 나에게 일어났던 수많은 숙고의 시간을 그렇게 말하지 않았기 때문에 왠지 낯설고, 이질적으로 느껴질지 모르지만 이미 우리 가운데 누군가는 깊은 관상의 능력을 개발하고 있었을는지도 모릅니다. 
   
            먼저 자신의 과거의 자아를 돌아보아야 합니다. 나를 불행하게 만드는 생각, 고통과 슬픔, 비참함의 감정을 느끼고 있는 자아를 발견해야 합니다. 눈을 감고, 몸을 고요한 상태에 두고, 직선적인 시간에 더 이상 관심을 두지 않으며, 외부세계에서 오는 자극을 제거하면 오로지 내가 어떻게 생각하고, 어떻게 느끼는지만 인식하게 될 것입니다. 그렇게 몸과 마음을 무의식상태로 놓아두고 무의식의 상태에 주의를 기울여 우리 안의 자동프로그램이 작동하고 있는 것을 의식적으로 알아챌 수 있을 때 명상은 잘 진행되는 것입니다. ‘너 자신을 아는 것’이 바로 명상이며, 관상입니다. 예전의 나로 머무는 대신 과거의 내 모습을 여러모로 알아차리고 있다면 우리는 자기객관화를 시작하고 있는 것입니다. 
   
            어떤 생각, 어떤 행동, 어떤 느낌도 무의식적으로 과거의 패턴으로 돌아가지 않을 정도로 어제의 자아를 관찰하는 단계에 이르렀다면 새로운 자아와 친숙해져야 합니다, 내가 바라는 더 큰 나의 모습은 어떤 것일까요?
   
            이러한 과정은 새로운 신경망을 조직하기 시작하며, 신경세포들은 새로운 순서와 패턴을 가지고 신경망을 조직하기 시작합니다. 행동을 계획하고, 새로운 가능성을 찾고, 새로운 존재 방식을 떠 올리고, 몸과 마음의 새로운 상태를 꿈꾸다가는 전두엽이 스위치를 켜고 환경, 몸, 시간이라는 중요한 요소의 볼륨을 낮추는 순간이 올 것입니다. 신경계 속에는 새로운 소프트웨어와 하드웨어가 설치되며, 새로운 자아로서의 존재하는 경험이 뇌 속에서는 이미 현실이 되어 있음을 보게 될 것입니다. 
   
            요약해보면, 우리가 해야 할 일은 원치 않는 과거의 내 모습을 관찰하는 것이 전부입니다. 바꾸고 싶어하는 어제의 자아, 그 자아의 습관적인 생각, 행동, 감정을 알아채서 더이상 예전 방식으로 발화하지 않고 예전의 마음으로 연결되지 않으며 또, 같은 방식으로 유전자들에게 신호를 보내지 않는 단계에 이를 때까지 말입니다. 
         `,
    },
  ]

  // ref[29]
  const ref29ScoreType = resultPageData.life_average < 50 ? '50' : resultPageData.life_average < 61 ? '60' : resultPageData.life_average < 71 ? '70' : resultPageData.life_average < 81 ? '80' : resultPageData.life_average < 91 ? '90' : '91'

  const selectedIndex = Ref33DetailText.findIndex(item => item.score === resultPageData.metaQ);

  const selectedItem = Ref33DetailText[selectedIndex];
  const previousItem = selectedIndex > 0 ? Ref33DetailText[selectedIndex - 1] : null;
  const nextItem = selectedIndex < Ref33DetailText.length - 1 ? Ref33DetailText[selectedIndex + 1] : null;

  const jcDetail = {
    '낮음': {
      name: '낮은 JC 유형',
      desc: `
                  부모와 같은 양육자들의 생각이나 행동, 또는 느낌을 내면화한 것으로 성인이 된 현재의 나에게 계속해서 영향을 주고 있는 말이나 동작이 포함되어 있습니다. <strong class="green">이 영역은 주로 비판, 비난, 처벌, 통제와 관련이 있으며 규칙과 규율을 가르치고 양심을 심어주는 역할</span>도 합니다.
                  따라서, JC 유형 점수가 낮은 <strong class="blue">당신은 어지간해서는 남들을 비판하지 않으며 융통성이 있습니다. 타인에게 관대한 성격이라 붙임성 있고 느긋하다는 평가를 받습니다. 하지만 다소 우유부단하고 자기 주관이 부족하여 주변에서 답답함을 느끼기도 합니다. 타인에게 관대하듯이 자신에게도 관대하여 게으르고 못 미덥다는 평가를 받을 수도 있습니다.</span> 
                  <strong class="green">이 영역의 점수가 평균 이상으로 높아질수록 권위적인 태도가 나올 수 있고, 낮아질수록 소신이 없거나 무절제한 사람이 될 수 있다는 사실을 기억하고 책임감을 가지고 규칙을 지키려고 노력해야 합니다.</span> 자신의 양심에 맞게 올바른 판단을 내리고 이를 행동에 옮기는 훈련이 필요합니다. 
                  낮은 JC 유형은, 높은 MR 유형과의 소통에서 불편함을 느낄 수 있습니다. JC 영역의 점수를 높이면 이 부분도 자연스럽게 해소될 수 있습니다. 
               `,
    },
    '적당함': {
      name: '적당한 JC 유형',
      desc: `
                  부모와 같은 양육자들의 생각이나 행동, 또는 느낌을 내면화한 것으로 성인이 된 현재의 나에게 계속해서 영향을 주고 있는 말이나 동작이 포함되어 있습니다. <strong class="green">이 영역은 주로 비판, 비난, 처벌, 통제와 관련이 있으며 규칙과 규율을 가르치고 양심을 심어주는 역할</span>도 합니다.
                  따라서, JC 유형 점수가 평균적인 <strong class="blue">당신은 책임감, 정의감, 인간의 도리 등 일반적인 가치들을 중시하는 사람이며 이것을 지키는 것이 상식이라고 생각하는 건강한 사람입니다. 그러나 내가 생각하는 이상이 구현되지 않거나, 상식이 지켜지지 않는 상황에서는 타인과 조직을 부정적으로 판단하기 때문에 섣부른 단정적 판단을 경계해야 합니다. </span>
                  이 영역의 점수가 평균 이상으로 높아질수록 권위적인 태도가 나올 수 있고, 낮아질수록 소신이 없거나 무절제한 사람이 될 수 있다는 사실을 기억하고 대인관계 안에서 자신의 말이나 행동을 의식적으로 돌아보는 것이 좋습니다. 
               `,
    },
    '높음': {
      name: '높은 JC 유형',
      desc: `
                  부모와 같은 양육자들의 생각이나 행동, 또는 느낌을 내면화한 것으로 성인이 된 현재의 나에게 계속해서 영향을 주고 있는 말이나 동작이 포함되어 있습니다. <strong class="green">이 영역은 주로 비판, 비난, 처벌, 통제와 관련이 있으며 규칙과 규율을 가르치고 양심을 심어주는 역할</span>도 합니다.
                  따라서, JC 유형 점수가 높은 <strong class="blue">당신은 성실하고 책임감 있으며 자신의 이상을 주도적으로 이끌 수 있어 조직에서는 쉽게 신뢰받고 성공할 수 있습니다. 그러나 자신이나 타인에게 엄격함을 강요하거나 비판적인 경향이 있습니다. 자기주장이 강하여 타인의 의견을 잘 듣지 않거나 책임감이 강하여 결정된 일은 책임지고 끝까지 완수하려 합니다. 충고나 조언을 자주하며 타인에 대한 평가나 사물의 옳고 그름이 명확합니다. </span>
                  이 영역의 점수가 평균 이상으로 높아질수록 권위적인 태도가 나올 수 있고, 낮아질수록 소신이 없거나 무절제한 사람이 될 수 있다는 사실을 기억하고 대인관계 안에서 자신의 말이나 행동을 의식적으로 돌아보는 것이 좋습니다. 
                  높은 JC 유형은 낮은 MR 유형 또는 높은 FE 유형과의 소통에서 불편함을 느낄 수 있습니다. JC 영역의 점수를 낮추어 평균을 유지하면 이 부분도 자연스럽게 해소될 수 있습니다. 
               `,
    },
  }
  const ecDetail = {
    '낮음': {
      name: '낮은 EC 유형',
      desc: `
                  부모와 같은 양육자들의 생각이나 행동, 또는 느낌을 내면화한 것으로 성인이 된 현재의 나에게 계속해서 영향을 주고 있는 말이나 동작이 포함되어 있습니다. <strong class="green">이 영역은 주로 허용, 보호, 동정, 공감 등과 관련이 있으며 어린아이의 성장을 돕는 자상한 부모와 같은 역할을 하기도</span> 합니다.
                  따라서, EC 유형 점수가 낮은 당신은 <strong class="blue">상대에게 방임적이고 무정한 태도를 보여 사람들에게 무관심하다는 소리를 들을 수 있습니다. 반면, 정에 휩쓸리지 않고 냉정함을 유지하며, 객관적으로 일을 처리하기 때문에 똑부러진다는 평가를 받기도 합니다. 또, 자신의 처세에 따라 주변 사람을 간섭하거나 괴롭히지 않고 스스로 문제해결을 하는 자기주도적인 사람으로 보일 수도 있습니다. 하지만, 따뜻하지 않은 성격 때문에 남들과 가까워지기 어렵고, 공감하는 능력이 많이 떨어질 경우, 타인에게 불안감을 줄 수도 있습니다.</span>
                  이 영역의 점수가 평균 이상으로 높아질수록 상대방의 독립심이나 자신감을 빼앗을 수 있고, 낮아질수록 무정하거나 공감력이 떨어지는 사람이 될 수 있다는 사실을 기억하고 이 영역의 균형을 위해 노력해야 합니다. 
                  낮은 EC 유형은, 높은 FE 유형 또는 높은 AE 유형과의 소통에서 불편함을 느낄 수 있습니다. EC 영역의 점수를 높이면 이 부분도 자연스럽게 해소될 수 있습니다. 
                `,
    },
    '적당함': {
      name: '적당한 EC 유형',
      desc: `
                  부모와 같은 양육자들의 생각이나 행동, 또는 느낌을 내면화한 것으로 성인이 된 현재의 나에게 계속해서 영향을 주고 있는 말이나 동작이 포함되어 있습니다. <strong class="green">이 영역은 주로 허용, 보호, 동정, 공감 등과 관련이 있으며 어린아이의 성장을 돕는 자상한 부모와 같은 역할을 하기도 합니다.</span>
                  따라서, EC 유형 점수가 평균적인 <strong class="blue">당신은 전형적인 모성으로 표현되는 온화하고 헌신적인 면이 있습니다. 사람들에게 상냥하게 말을 건네며 ‘잘했구나’, ‘훌륭해’라고 격려합니다. 상대방의 입장에서 생각하고 상대의 장점을 발견하려 노력하며 용기를 북돋아 줍니다. 규칙에 너무 얽매이지 않고 그렇다고 느슨하지도 않으며 자신의 가치 기준에서 냉정하게 사물을 판단해, 임기응변으로 행동하는 것이 가능합니다. 사람에 대한 편견을 갖지 않으며 친절한 마음가짐으로 행동합니다. 그러나 타인이 도움을 요청하면 거절하는게 쉽지 않습니다. </span>
                  이 영역의 점수가 평균 이상으로 높아질수록 상대방의 독립심이나 자신감을 빼앗을 수 있고, 낮아질수록 무정하거나 공감력이 떨어지는 사람이 될 수 있다는 사실을 기억하고 이 영역의 균형을 위해 노력해야 합니다.
               `,
    },
    '높음': {
      name: '높은 EC 유형',
      desc: `
                  부모와 같은 양육자들의 생각이나 행동, 또는 느낌을 내면화한 것으로 성인이 된 현재의 나에게 계속해서 영향을 주고 있는 말이나 동작이 포함되어 있습니다. <strong class="green">이 영역은 주로 허용, 보호, 동정, 공감 등과 관련이 있으며 어린아이의 성장을 돕는 자상한 부모와 같은 역할을 하기도 합니다.</span>
                  따라서, EC 유형 점수가 높은 당신은 <strong class="blue">다정다감하게 행동하는 것이 최대의 장점입니다. 나이나 지위, 성별에 관계없이 많은 사람들을 공정하게 대하는 인기인 스타일로 다양한 유형의 사람들과 좋은 관계를 구축하는 것이 특기이며 모두의 중심에 있는 경우가 많습니다. 그러나 때로는 타인을 위해서 무리하는 경우가 있고, 이로 인해 관계에서 손해를 보는 경우가 생깁니다. 이 영역의 점수가 높으면 다른 사람을 과보호하거나 과하게 개입하여 상대방의 자주성과 자립성을 약하게 하며 의존적으로 만들 수 있습니다.</span> 또, 이 영역의 점수가 극단적으로 높으면, 버릇이 없거나 무절제한 상황을 용인하고 타인의 부탁을 거절하지 못하여 스트레스를 받으면서도 무리한 생황을 지속할 수 있으니 이 점을 경계해야 합니다. 
               `,
    },
  }
  const mrDetail = {
    '낮음': {
      name: '낮은 MR 유형',
      desc: `
                  성인으로서 지금 여기에 대한 직접적 반응으로서 사실을 중심으로 관찰한 행동이나 판단, 감정을 주관합니다. <strong class="green">이 영역은 주로 ‘이성’과 관련이 있으며 객관적 사고, 분석적 사고, 냉철한 판단, 정확한 계산 등과 관련된 행동적 단서들로 측정</span>됩니다.  
                  따라서, MR 유형 점수가 낮은 <strong class="blue">당신은 일관성이 없고 정확한 판단이나 이해력이 부족하며 무계획적일 때가 많습니다. 심할 경우, 감정의 기복에 따라 냉정함을 잃거나 주위를 잘 살피지 못하고 사태를 명확히 판단하지 못할 수 있습니다. 사실에 따라 객관적으로 생각하는 연습이 잘 되어 있지 않아 매우 주관적이거나 즉흥적이라는 평가를 받을 수 있습니다. 갑작스러운 감정의 변화나 감당하기 어려운 스트레스가 어디로부터 시작되었는지 깊이 있게 들여다보려는 노력이 필요합니다. 문제상황 발생시, 그 근본 원인을 찾으려는 철학적 사고가 필요함을 인식하고 이를 위한 연습이 필요</span>합니다. 
                  낮은 MR 유형은, 높은 JC 유형 또는 높은 MR 유형과의 소통에서 불편함을 느낄 수 있습니다. MR 영역의 점수를 높이면 이 부분도 자연스럽게 해소될 수 있습니다. 
               `,
    },
    '적당함': {
      name: '적당한 MR 유형',
      desc: `
                  성인으로서 지금 여기에 대한 직접적 반응으로서 사실을 중심으로 관찰한 행동이나 판단, 감정을 주관합니다. <strong class="green">이 영역은 주로 ‘이성’과 관련이 있으며 객관적 사고, 분석적 사고, 냉철한 판단, 정확한 계산 등과 관련된 행동적 단서들로 측정</span>됩니다. 
                  따라서, MR 유형 점수가 평균적인 <strong class="blue">당신은 이성적이고 합리적으로 판단하며 자신과 타인을 적절히 통제하는 기능을 갖추고 있습니다. 관계가 원만하며, 상대의 상황을 잘 파악하고 적당한 소통과 배려, 공감을 할 수 있습니다. </span>
                  이 영역의 점수가 평균 이상으로 높아질수록 냉정하거나 사무적이고 자기중심적인 태도가 나올 수 있고, 낮아질수록 불안정하고 무계획적이며 판단력이 떨어지는 사람이 될 수 있다는 사실을 기억하고 대인관계 안에서 자신의 말이나 행동을 의식적으로 돌아보는 것이 좋습니다. 
               `,
    },
    '높음': {
      name: '높은 MR 유형',
      desc: `
                  성인으로서 지금 여기에 대한 직접적 반응으로서 사실을 중심으로 관찰한 행동이나 판단, 감정을 주관합니다. <strong class="green">이 영역은 주로 ‘이성’과 관련이 있으며 객관적 사고, 분석적 사고, 냉철한 판단, 정확한 계산 등과 관련된 행동적 단서들로 측정</span>됩니다. 
                  따라서, MR 유형 점수가 높은 <strong class="blue">당신은 자신의 생각이 분명하고 스스로에게 어울리는 행동을 하는 것이 장점입니다. 계획성이 있어서 쓸데없다고 판단하는 것은 하지 않으려는 보수적인 면도 있습니다. 무관심한 사람이나 계획성이 없는 사람과 어울리기를 꺼려하고, 판단이 빠르고 냉철하여 ‘어차피 이 일은 안될 일’ ‘어차피 이 사람은 안된다’라고 생각하면 단번에 잘라버리는 경향이 있습니다. ‘언제, 어디서, 누가, 무엇을, 어떻게, 왜?’를 너무 따져 묻는 경우가 있어서 완고하고 깐깐한 사람이라는 이미지를 풍길 수 있습니다. 만사를 공평하게 대해야 한다는 생각 때문에 그 어느쪽에서도 치우치지 않아 고립을 자처하거나 양쪽 모두에게 서운함을 살 수 있습니다. </span>
                  이 영역의 점수가 평균 이상으로 높아질수록 냉정하거나 사무적이고 자기중심적인 태도가 나올 수 있고, 낮아질수록 불안정하고 무계획적이며 판단력이 떨어지는 사람이 될 수 있다는 사실을 기억하고 대인관계 안에서 자신의 말이나 행동을 의식적으로 돌아보는 것이 좋습니다. 
                  높은 MR 유형은, 낮은 JC 유형 또는 높은 FE 유형과의 소통에서 불편함을 느낄 수 있습니다. MR 영역의 점수를 낮추어 평균을 유지하면 이 부분도 자연스럽게 해소될 수 있습니다. 
               `,
    },
  }
  const feDetail = {
    '낮음': {
      name: '낮은 FE 유형',
      desc: `
                  아동기 시절부터 재연되는 행동, 사고, 감정으로 어린 시절 실제로 경험하고, 느끼거나 행동했던 것과 같은 감정이나 행동을 성인이 된 지금에도 나타내는 상태입니다. 어린시절 부모와 같은 양육자에 대응하기 위해 습관화된 반응양식을 포함합니다. <strong class="green">이 영역은 주로 감정적, 본능적, 자기중심적, 호기심, 창의성 등과 관련이 있으며 이 영역이 평균적일수록 건강한 상태라고 여깁니다. </span>
                  따라서, FE 유형 점수가 낮은 <strong class="blue">당신은 타인의 시선을 너무 의식해서 자신의 기분에 따라 솔직하게 행동하는 것이 어렵습니다. 자신의 감정을 거의 개방하지 않고 자신의 생활을 감정적으로 즐기려하지 않습니다. 표현력이 부족하며 남에게 자신의 생각을 전달하는 것이 어렵고 움츠러들어 주위를 곤란하게 할 수 있습니다. 하기 싫거나 힘든 부탁을 받아도 거절하지 못하고 자신의 기분을 억누르거나 타협해 버리는 경향이 있습니다. 또, 겉으로만 타인과 어울리는 경우가 많아 상대방이 어떻게 생각하고 있을까를 신경 쓰느라 본심을 드러내지 못하고 스스로 지치는 경우가 많습니다. 새로운 일에 대한 도전도 가능하면 피하기 때문에 인간관계에서 큰 갈등으로 연결되는 일은 거의 없습니다. 성실하고 상냥하고 곤란한 일이 있어도 참기 때문에 주위에 자신의 생각을 전하지 못하고, 소극적인 인상을 풍깁니다. 자신의 억압된 감정이 무엇인지 살펴보고, 의식적으로 표현하고 드러내는 연습이 필요</span>합니다. 
                  낮은 FE 유형은, 높은 MR 유형과의 소통에서 불편함을 느낄 수 있습니다. FE 영역의 점수를 높이면 이 부분도 자연스럽게 해소될 수 있습니다. 
               `,
    },
    '적당함': {
      name: '적당한 FE 유형',
      desc: `
                  아동기 시절부터 재연되는 행동, 사고, 감정으로 어린 시절 실제로 경험하고, 느끼거나 행동했던 것과 같은 감정이나 행동을 성인이 된 지금에도 나타내는 상태입니다. 어린 시절 부모와 같은 양육자에 대응하기 위해 습관화된 반응양식을 포함합니다. <strong class="green">이 영역은 주로 감정적, 본능적, 자기중심적, 호기심, 창의성 등과 관련이 있으며 이 영역이 평균적일수록 건강한 상태라고 여깁니다. </span>
                  따라서, FE 유형 점수가 평균적인 <strong class="blue">당신은 타인과의 관계에 어려움이 없고 솔직한 사람입니다. 적당한 호기심과 열정을 갖고 있으면서도 남을 배려할 줄 알고 자신의 일에 책임감을 갖고 있는 건전한 상태입니다. 자신의 의견을 잘 발표하며 행동이 자연스럽고 밝은 편입니다. 
                  개방적이고 솔직하며 감정표현을 잘하는 유형이지만, 자아가 억압받을 경우 스트레스를 받으면서 자기 비하를 할 수도 있습니다. 자신의 열정과 일, 공부의 즐거움을 꾸준히 유지하면서 이 영역의 균형을 위해 노력해야</span> 합니다.
               `,
    },
    '높음': {
      name: '높은 FE 유형',
      desc: `
                  아동기 시절부터 재연되는 행동, 사고, 감정으로 어린 시절 실제로 경험하고, 느끼거나 행동했던 것과 같은 감정이나 행동을 성인이 된 지금에도 나타내는 상태입니다. 어린 시절 부모와 같은 양육자에 대응하기 위해 습관화된 반응양식을 포함합니다. <strong class="green">이 영역은 주로 감정적, 본능적, 자기중심적, 호기심, 창의성 등과 관련이 있으며 이 영역이 평균적일수록 건강한 상태라고 여깁니다. </span>
                  따라서, FE 유형 점수가 높은 <strong class="blue">당신은 발랄하고 기운이 넘치기 때문에 특별한 행사에 함께 하고 싶은 존재입니다. 그러나 자신이 싫은 것이나 흥미가 없는 것은 타인에게 미뤄버리고 흥미가 있는 것에만 집중하려 합니다. 그러다가 직장에서 생각지도 못한 성과를 얻는 경우도 있지만 이로 인해 주변에 불편한 감정이 생기는 사람도 있습니다. 감정을 우선으로 내세워 돌진하지만 미워할 수 없는 캐릭터로 주위 사람들도 언제나 용서해주곤 합니다. 물어보거나 망설이기 보다는 직접 도전하는 편이며 스스럼없이 어리광을 부립니다.</span> 이 영역이 너무 강해지면, 충동적이고 자기중심적이며 무책임한 모습을 보일 수 있다는 사실을 기억하고 대인관계 안에서 자신의 말이나 행동을 의식적으로 돌아보는 것이 좋습니다. 
               `,
    },
  }
  const aeDetail = {
    '낮음': {
      name: '낮은 AE 유형',
      desc: `
                  아동기 시절부터 재연되는 행동, 사고, 감정으로 어린 시절 실제로 경험하고, 느끼거나 행동했던 것과 같은 감정이나 행동을 성인이 된 지금에도 나타내는 상태입니다. 어린 시절 부모와 같은 양육자에 대응하기 위해 습관화된 반응양식을 포함합니다. <strong class="green">이 영역은 주로 순응적, 타협적, 협조적, 억압, 자기희생 등과 관련이 있으며 부모와 같은 양육자에게 순종하려고 노력하던 어린 시절의 모습을 반영</span>합니다. 
                  따라서, AE 유형 점수가 낮은 <strong class="blue">당신은 자신감 있고 적극적인 성격이라, 자기가 하려는 일은 주도적으로 진행하는 전형적인 리더십 있는 성격입니다. 하지만 자기 주관이 뚜렷하고, 어지간해서는 굽히지 않는 성격이라서 남들과 부딪히기도 쉽고, 독불장군이라며 사람들이 멀리할 때도 있습니다. 망설이지 않고 적극적으로 일을 추진하는 과정에서 타인의 감정과 성향을 파악하지 못하여 갈등이 발생할 수 있으며 이때에도 자신만의 기준이 명확하여 관계를 신경쓰지 않고 밀어붙일 수 있습니다. 모두가 나와 같이 자신감이나 추진력이 있는 것은 아니라는 점을 기억하고 다른 사람의 감정과 성향을 존중하려는 의식적인 노력이 필요</span>합니다.
               `,
    },
    '적당함': {
      name: '적당한 AE 유형',
      desc: `
                  아동기 시절부터 재연되는 행동, 사고, 감정으로 어린 시절 실제로 경험하고, 느끼거나 행동했던 것과 같은 감정이나 행동을 성인이 된 지금에도 나타내는 상태입니다. 어린 시절 부모와 같은 양육자에 대응하기 위해 습관화된 반응양식을 포함합니다. <strong class="green">이 영역은 주로 순응적, 타협적, 협조적, 억압, 자기희생 등과 관련이 있으며 부모와 같은 양육자에게 순종하려고 노력하던 어린 시절의 모습을 반영</span>합니다. 
                  따라서, AE 유형 점수가 평균적인 <strong class="blue">당신은 자기절제와 협동심이 균형을 이룬 상태입니다. 겸손함, 협동심, 인내심을 갖추고 있기 때문에 주변으로부터 착한 사람, 좋은 사람, 무난한 사람으로 인정받을 수 있습니다. 즉, 주변을 편안하게 하거나 분위기를 쇄신하는 노력을 통해 안정감과 적당한 활력을 줄 수 있는 사람</span>입니다.
                  이 영역의 점수가 평균 이상으로 높아질수록 자기비하, 열등감 등으로 자기 억압적인 태도가 나올 수 있고, 낮아질수록 소통이 어려운 자기중심적인 사람이 될 수 있다는 사실을 기억하고 대인관계 안에서 자신의 말이나 행동을 의식적으로 돌아보는 것이 좋습니다.
               `,
    },
    '높음': {
      name: '높은 AE 유형',
      desc: `
                  아동기 시절부터 재연되는 행동, 사고, 감정으로 어린 시절 실제로 경험하고, 느끼거나 행동했던 것과 같은 감정이나 행동을 성인이 된 지금에도 나타내는 상태입니다. 어린 시절 부모와 같은 양육자에 대응하기 위해 습관화된 반응양식을 포함합니다. <strong class="green">이 영역은 주로 순응적, 타협적, 협조적, 억압, 자기희생 등과 관련이 있으며 부모와 같은 양육자에게 순종하려고 노력하던 어린 시절의 모습을 반영</span>합니다. 
                  따라서, AE 유형 점수가 높은 <strong class="blue">당신은 온화하고 겸손한 성격이라서 갈등이 거의 발생하지 않고, 남들이 시킨 일을 꼼꼼히 해내는 '모범생'의 이미지가 있습니다. 그러나 자신감이 없어서 남들에게 의존하기 쉽고, 자기감정을 억압하느라 열등감을 품거나 스트레스가 쌓이는 일도 잦습니다. 
                  항상 배려하고 타인을 의식하며 상대방의 마음에 들도록 노력합니다. 세부적인 일까지 심하게 신경을 쓰며 속으로는 불만이 있더라고 표면에 나타내지 않습니다. 생각이나 행동에 자신이 없으며 자신의 생각을 말하지 못해서 후회하는 경우가 많고, 불쾌한 감정을 웃는 얼굴로 표현할 때가 있습니다. </span>
                  이 영역의 점수가 평균 이상으로 높아질수록 자기비하, 열등감 등으로 자기 억압적인 태도가 나올 수 있고, 낮아질수록 소통이 어려운 자기중심적인 사람이 될 수 있다는 사실을 기억하고 자신의 감정과 생각을 자유롭게 표현하는 연습을 의식적으로 해야 합니다.
               `,
    },
  }

  // ref[13]
  const ref13Data = {
    language: {
      desc: '단어를 효과적으로 사용하는 능력과 언어를 이해하고 실용적 영역을 조작하는 능력을 말합니다. 단어의 소리, 리듬, 의미에 대한 감수성이나 언어의 다른 기능에 대한 민감성 등과 관련된 능력입니다. 토론 학습 시간에 두각을 나타내며, 유머나 말 잇기 게임, 낱말 맞추기 등을 잘합니다. 다양한 단어를 잘 활용하여 말을 잘하는 달변가가 많으며, 똑같은 글을 써도 심금을 울리기도 하고, 웃음을 자아내기도 합니다. 강의력, 설득력, 이야기 창조능력 등이 뛰어납니다.',
    },
    math: {
      desc: '숫자를 효과적으로 사용하는 능력, 사물 사이의 논리적 계열성을 이해하고 유사성과 차이점을 측정하는 능력을 말합니다. 논리적 과정에 대한 문제들을 보통 사람들보다 빠른 속도로 해결할 수 있습니다. 추론을 잘 이끌어내며, 체계적이고 과학적인 방법을 동원해서 문제를 파악합니다. 숫자에 강하고, 차량번호나 전화번호, 기념일 등도 남들에 비해 잘 기억하는 경우가 많습니다.'
    },
    time: {
      desc: '대상을 시각화하는 능력, 내적인 이미지나 사진과 영상을 창출하는 능력, 시공간적 세계를 정확하게 인지하는 능력과 3차원의 세계를 잘 변형시키는 능력을 말합니다. 공간적 지능은 색깔, 선, 모양, 형태, 공간 등과 그 관계에 대한 민감성과 관련 있습니다. 밤하늘의 별을 보고 방향을 잘 찾아내며, 처음 방문한 곳도 다시 찾아가는 데 어려움을 느끼지 않습니다. 또, 시공간적 아이디어들을 도표, 지도, 그림 등으로 잘 나타내고, 시각적으로 표현하는 디자인, 그림 그리기, 만들기 등을 좋아합니다.',
    },
    body: {
      desc: '신체의 운동을 손쉽게 조절하는 능력, 손을 사용하여 사물을 만들어내고 변형시키는 능력을 말합니다. 생각이나 느낌을 글이나 그림보다는 몸동작으로 표현하는 능력이 뛰어납니다. 율동이나 레크리에이션, 무용, 연극 등을 잘하며 손재주가 좋다는 말을 많이 듣습니다. 자동차 운전, 스케이트, 스키 등을 다른 사람보다 쉽게 배운다든지 나무를 잘 타고 오르는 능력이 있습니다. 즉 몸의 균형 감각과 촉각이 다른 사람들에 비해 발달 되어 있습니다.',
    },
    music: {
      desc: '음악에 대한 직관적 이해와 분석적이고 기능적인 능력을 말합니다. 소리, 리듬, 진동과 같은 음의 세계에 민감하고, 사람의 목소리와 같은 언어적 형태의 소리뿐만 아니라 비언어적 소리에도 예민합니다. 음악의 형태를 잘 감지하고, 음악적 유형을 잘 구별할 뿐만 아니라 다른 음악 형태로 변형시키기도 잘할 수 있습니다. 소리 전체를 다루는 능력이기 때문에 청각-진동적인 지능이라고 부르기도 합니다.',
    },
    relationship: {
      desc: '다른 사람들과 교류하고, 이해하며, 그들의 행동을 해석하는 능력을 말합니다. 다른 사람들의 기분, 감정, 의향, 동기 등을 인식하고 구분할 수 있는 능력과 표정, 음성, 몸짓 등에 대한 감수성, 대인관계에서 나타나는 여러 가지 다양한 힌트, 신호, 단서, 암시 등을 변별하는 역량, 또 이들에 효율적으로 대처하는 능력이 높습니다. 친구가 많고 집단에서 중앙에 위치하는 경우가 많습니다. 유능한 정치인, 지도자, 또는 성직자들은 대인관계 지능이 우수한 사람들이 많습니다.',
    },
    self: {
      desc: '대인관계 지능과 유사한 특성이며, 자신을 이해하고, 느낄 수 있는 인지적 능력을 말합니다. 자신을 잘 아는 능력, 자신의 장단점을 인식하고 스스로 의사결정을 내리는 능력, 자신의 감정, 기분을 잘 조절하는 능력, 자신을 잘 표현하고 행동을 규제하는 능력이 발달되어 있습니다. ‘나는 누구인가?, 나는 어떤 감정을 가졌는가?, 왜 이렇게 행동하는가?’ 등과 같은 자기 존재에 대해 이해하는 것으로 자기 존중감이 높고, 자신의 문제를 스스로 해결하기 위해 노력합니다. 이 지능이 낮은 사람들은 자신을 주변환경으로부터 독립된 존재로서 인식하는데 어려움을 겪습니다. ',
    },
    nature: {
      desc: '사물을 구별하고 분류하는 능력과 환경의 특징을 사용하는 능력, 사물과 인간의 관계를 설정하는 능력 등 자연 현상에 대한 유형을 규정하고 분류하는 능력을 말합니다. 원시 사회에서는 먹을 수 있는 것과 없는 것을 그들의 자연탐구 지능에 의존하여 알아냈습니다. 현대 사회에서는 기후 형태의 변화에 대한 감수성과 같은 능력으로 나타납니다. 이 역량이 높은 사람들은 자연 친화적이고, 꽃이나 풀, 식물, 광물, 동물을 잘 분류하고 인식합니다. 동식물의 모양, 크기, 지형 등에 관심이 많고 자연 현상에 민감하며 정확하게 탐구합니다. ',
    }
  }

  // ref[29]
  const ref29ScoreResult = {
    50: {
      review: '당신은 지금 인생에 대한 총체적인 점검과 성찰을 해야 하는 시간입니다. 당신 내면의 ‘불만’은 ‘불안’을 만들고, 불안은 ‘분노’ 또는 ‘우울’로 표현됩니다.',
      remember: '<strong className="green">변화는 반응이 아니라 이제 선택해야 하는 현실이 되었습니다.</span> 우리는 삶의 위기, 트라우마, 상실, 비극, 질병 등을 경험하고 나서야 변화의 길을 모색합니다. 사람은 잘 변하지 않습니다. 그래서 ‘사람이 변하면 죽을 때가 되었나’ 라고들 말하기도 합니다. 사람은 인생의 커다란 위기의 순간, 내가 누구인지, 내가 무엇을 하고 있는지, 어떻게 살아가는지, 어떤 것을 의지하고, 믿고 따르고 있는지, 어떤 생각과 감정을 느끼고 있는지 성찰(Reflection)하게 됩니다. 마음을 바꾸고자 하지만 그것이 쉽지는 않습니다. 내가 가지고 있는 믿음의 뿌리는 나를 둘러싸고 있던 종교, 문화, 사회, 교육, 가족, 매스미디어 등 과거에 주입되거나 학습된 수많은 패러다임들입니다. 시대가 변하고 있습니다. 우리가 알고 있는 것보다 현실은 더 넓고 깊고 빠르게 변화하고 있습니다. 그럼에도 ‘자신만이 옳다’라고 생각하면 당신은 변화할 수 없습니다. 내가 가지고 있는 생각이 편협할 수도 있고, 나의 판단이 잘못될 수도 있습니다. <strong className="green">‘내가 틀릴 수도 있다’라는 생각이 당신 변화의 시작이어야 합니다.</strong>',
      reinterpretation: '마음의 5%만이 의식적이며 나머지 95%는 무의식적인 프로그램, 기억된 행동, 습관적 감정 반응에서 나온다고 합니다. <strong className="green">우리는 하루에 95%가량을 무의식적인 상태로 보내는 것입니다. 겉으로는 깨어있는 것 같지만, 무의식이 나를 움직이고 있는 것입니다.</strong> 내가 무슨 생각을 하고, 무슨 행동을 하며, 어떤 감정을 느끼는지 더이상 알아차리지 못한다면 잘못된 삶은 습관이 되어버립니다. <strong className="green">우리가 깨야 하는 가장 큰 것은 우리 자신이 되어버린 습관이라는 무서운 ‘틀’, 자동적 사고입니다.</strong> 진짜 주인인 의식은 잠들어 버리고 무의식이 몸을 지배합니다. 무의식은 기억된 감정들과 일치하는 결정을 내리도록 명령하고 있는 몸입니다. 몸이 마음을 지배하고 있는 것입니다. 중독이 되어버린 몸이 마음을 지배해버립니다. 이제 우리는 이 과정을 통해 잠재의식(무의식) 안으로 들어가 그것을 새롭게 하는 프로그래밍 작업을 해야합니다. <strong className="green">낡은 생각과 느낌의 패턴을 찾아 끊어 버리고, 우리가 되고자 하는 모습에 맞추어 새로운 생각과 감정의 패턴을 재학습 혹은 재연결해야 합니다.</strong> 몸은 새로운 마음에 길들이면 더 이상 반대로 작용하지 않고 조화를 이루게 됩니다. 이것이 변화의 핵심이자 자기 창조(Recreation)의 핵심이며 재해석의 포인트입니다. ',
      refresh: '그동안 내가 불안하고, 우울하고, 분노했던 기억들을 톺아보면 대부분 지나간 시간에 대한 후회와 원망, 일어나지도 않은 미래의 일에 대한 걱정과 불안이 지배적이었다는 것을 깨닫게 됩니다. 존재하지 않는 과거와 다가오지 않은 미래가 소중한 현재, 지금 여기를 병들에 하고, 멈추게 하고, 좌절하게 만들거나 포기하게 만들었던 것입니다. 그래서 중요한 방법이 <strong className="green">‘지금여기’에 집중하는 것, 몰입하는 것입니다.</strong> 내가 행복해 하는 시간은 부쩍 빨리 지나가 버립니다. 운전을 하거나, 영화를 보거나, 좋은 사람과 좋은 시간을 보내는 것에 몰입하면 시간을 잊어버립니다. 자연 속에 고요히 앉아 있거나, 조용하고 쾌적한 공간에서 명상하는 시간 등의 몰입은 지금 여기의 소중한 가치를 일깨워줍니다. <strong className="green">현재에 몰입하는 체험은 우리의 과거를 내려놓고, 미래의 새로운 마음을 창조할 수 있는 좋은 기회가 될 수 있습니다.</span>',
      reformation: [
        {
          name: '마음 읽기(독심술)',
          content: '다른 사람에 대한 충분한 근거 없이, ‘저 사람은 이러저러한 생각을 할 것이다’라고 가정한다. ',
          result: '“그는 내가 실패자라고 생각할 것이다.”',
          tip: '혹시 당신은 다른 사람들의 마음을 먼저 이렇게 생각하지는 않는가요?',
        },
        {
          name: '점치기(예언)',
          content: '미래를 예측한다. ‘미래에 어떤 위험이나 재앙이 있을 것이다’라고 생각한다.',
          result: '“나는 분명 이번 시험에 떨어질 것이다.”',
          tip: '이러한 생각의 고리들이 당신을 자꾸 수렁으로 밀어 넣고 있는 것입니다. 내 안에서 만들어 놓은 타인과 자신에 대한 부정적인 생각의 고리들을 끊어내야 합니다. 그래야 다시 시작할 수 있습니다. 용기를 내어 인생재건축을 시작해봅니다. 정확한 자기분석은 인생을 변화하는 첫걸음이 될 것입니다. ',
        },
      ],
      reconstruction: '나도 모르게 ‘나는 부적합한 사람이며 타인에게 거절당할 지도 모른다’는 두려움을 갖게 됩니다. 이와 동시에 ‘실패’에 대한 두려움에 내 능력을 제대로 발휘하지도 못하고, 창피당할 것이 두려워 감정을 숨기는 일이 많았습니다. 이 점은 스스로에 대한 과도한 기대 때문에 시작된 것일 수 있습니다. <strong className="green">더 잘해야 하고, 더 유능해 보여야 하고, 더 완벽해야 한다는 기대가 타인과 나를 비교하고 자꾸만 외부 시선을 의식하게 합니다.</strong> 다른 사람의 칭찬을 얻기 위해 나 자신의 모습을 저버리는 일을 그만두어야 합니다. 그리고 용기를 내어 <strong className="green">‘내 모든 감정은 나의 것이며 나의 생각과 말과 행동은 타인의 인정과 감사를 받기 위해서가 아니라 내가 진정 원하기 때문’임을 선언해야 합니다.</strong>'
    },
    60: {
      review: '당신은 일부러라도 시간을 내어 인생에 대한 점검을 해야하는 시기입니다. 당신 내면의 ‘불만’은 ‘불안’을 만들고, 불안은 ‘분노’ 또는 ‘우울’로 표현됩니다.',
      remember: '당신의 기억 속에 있는 부정적인 감정들을 이해하는 작업을 해야 합니다. 누구에게나 삶의 기회는 단 한 번 주어지지만, 그 삶을 바라보는 각자의 방식에 따라 서로 다른 길을 가게 됩니다. 삶에 대한 긍정과 낙관은 다가오는 일들에 대한 희망과 신뢰를 가지고 나의 에너지를 결집하여 효과적인 일처리와 성공적인 결과를 만들어 낼 수 있습니다. 그러나 부정적인 인식과 그릇된 믿음은 당신을 더욱 더 난처한 상황으로 이끌어 갈 것입니다. 변화는 당신에게 선택의 문제가 아니라 ‘용기’의 문제입니다. 과거 불편한 일들이나 불편했던 사람들에 대한 기억을 해결하지 않은 채 그대로 지나고서는 현재의 ‘나’를 충만하게 살아갈 수 없습니다. 현재의 ‘나’를 변화시키지 못한다면 미래의 ‘나’ 역시 다르지 않은 그대로의 모습일 것입니다. 먼저 당신이 해야 할 일은 지난 기억 속에 있는 부정적인 ‘나’의 모습을 발견하고 생각을 변화시킬 수 있는 프로그램에 참여하거나, 스스로 자신을 분석하고 치유하는 마음돌봄 작업을 시작하는 것입니다. ',
      reinterpretation: '당신에게 있는 수치심, 죄의식, 무기력과 슬픔, 두려움에 대해 점검해 보아야 합니다. 나에게 일어났던 비참했던 기억들, 억울했던 사건이나, 나에게 해를 입힌 가해자에 대한 원망들을 돌아보세요. 당신이 이루지 못했던 것들로 인해 가지게 된 무기력과 슬픔을 기억하세요. 절망하고, 포기하고, 희망이 없었던 시간을 생각해 보세요. 심한 무기력과 우울감에 무력해지고, 움직이기조차 어려웠던 시간이 있었나요? 아무도 나를 이해 해주지 않는 것 같아서 답답하고 괴로웠던 시간이 있었나요? 그것은 당신 탓이 아닙니다. 당신만의 문제는 아닙니다. 당신 인생의 ‘불만’은 ‘불안’을 야기합니다. 그 불안이 밖으로 터져 오르면 ‘분노’가 되고, 안으로 묶어두면 ‘우울’이 됩니다. 이제 지난 시간의 부정적인 기억을 정돈하는 작업이 필요합니다. 당신 감정의 균형을 되찾기 위해 노력해야 하는데 그 시작은 부정적인 과거의 사슬에서 벗어나려는 노력일 것입니다. 그래서 인생을 재해석(Reinterpretation)하는 작업이 필요합니다. ',
      refresh: '그동안 내가 불안하고, 우울하고, 분노했던 기억들을 톺아보면 대부분 지나간 시간에 대한 후회와 원망, 일어나지도 않은 미래의 일에 대한 걱정과 불안이 지배적이었다는 것을 깨닫게 됩니다. 존재하지 않는 과거와 다가오지 않은 미래가 소중한 현재, 지금 여기를 병들게 하고, 멈추게 하고, 좌절하게 만들거나 포기하게 만들었던 것입니다. 그래서 중요한 방법이 ‘지금여기’에 집중하는 것, 몰입하는 것입니다. 내가 행복해 하는 시간은 부쩍 빨리 지나가 버립니다. 운전을 하거나, 영화를 보거나, 좋은 사람과 좋은 시간을 보내는 것에 몰입하면 시간을 잊어버립니다. 자연 속에 고요히 앉아 있거나, 조용하고 쾌적한 공간에서 명상하는 시간 등의 몰입은 지금 여기의 소중한 가치를 일깨워줍니다. 현재에 몰입하는 체험은 우리의 과거를 내려놓고, 미래의 새로운 마음을 창조할 수 있는 좋은 기회가 될 수 있습니다. ',
      reformation: [
        {
          name: '마음 읽기(독심술)',
          content: '다른 사람에 대한 충분한 근거 없이, ‘저 사람은 이러저러한 생각을 할 것이다’라고 가정한다. ',
          result: '“그는 내가 실패자라고 생각할 것이다.”',
          tip: '혹시 당신은 다른 사람들의 마음을 먼저 이렇게 생각하지는 않는가요?',
        },
        {
          name: '점치기(예언)',
          content: '미래를 예측한다. ‘미래에 어떤 위험이나 재앙이 있을 것이다’라고 생각한다.',
          result: '“나는 분명 이번 시험에 떨어질 것이다.”',
          tip: '이러한 생각의 고리들이 당신을 자꾸 수렁으로 밀어 넣고 있는 것입니다. 내 안에서 만들어 놓은 타인과 자신에 대한 부정적인 생각의 고리들을 끊어내야 합니다. 그래야 다시 시작할 수 있습니다. 용기를 내어 인생재건축을 시작해봅니다. 정확한 자기분석은 인생을 변화하는 첫걸음이 될 것입니다. ',
        },
      ],
      reconstruction: '나도 모르게 ‘나는 부적합한 사람이며 타인에게 거절당할 지도 모른다’는 두려움을 갖게 됩니다. 이와 동시에 ‘실패’에 대한 두려움에 내 능력을 제대로 발휘하지도 못하고, 창피당할 것이 두려워 감정을 숨기는 일이 많았습니다. 이 점은 스스로에 대한 과도한 기대 때문에 시작된 것일 수 있습니다. 더 잘해야 하고, 더 유능해 보여야 하고, 더 완벽해야 한다는 기대가 타인과 나를 비교하고 자꾸만 외부 시선을 의식하게 합니다. 다른 사람의 칭찬을 얻기 위해 나 자신의 모습을 저버리는 일을 그만두어야 합니다. 그리고 용기를 내어 ‘내 모든 감정은 나의 것이며 나의 생각과 말과 행동은 타인의 인정과 감사를 받기 위해서가 아니라 내가 진정 원하기 때문’임을 선언해야 합니다. '
    },
    70: {
      review: '당신은 지금 ‘변화’가 필요한, 인생의 중요한 변곡점에 서 있습니다. 변화는 당신에게 선택의 문제가 아니라 ‘용기’의 문제입니다. ',
      remember: '당신은 삶에 대한 만족도가 그리 높지 않습니다. 돈과 명예, 권력, 외모 등 밖으로 보여지는 ‘나’를 위해 많은 힘을 쓰고 살아왔습니다. 남들은 눈치채지 못했을지라도, 자신은 스스로에 대해 만족하지 못하고 실망도 많았을 것입니다. 자칫 존재에 대한 공허함으로 무언가에 중독될 수 있는 가능성이 있습니다. 내면에 채워지지 않은 나의 갈망을 ‘재소환’해서 기억해야 합니다. 내가 원했던 것, 바라고 지향하며 살았던 것, 나의 인생의 목표와 방향에 대한 총체적인 점검을 해야 할 시간입니다. 내가 할 수 있는 것과 할 수 없는 것을 잘 구별하여, 할 수 없는 것들은 ‘나를 위해’ 내려놓고, 할 수 있는 것 가운데에서 무엇에 집중할지를 선택해야 합니다. 자신에 대한 불안이 타인에 대한 증오나 공격성을 표출하는 방향으로 나아가서는 안 됩니다. 상대와의 논쟁을 멈추고, 진짜 ‘나’를 찾아 나가는 작업을 시작해야 합니다. 다시 숨을 고르고 인생의 지향과 목표를 점검하는 시간이 필요합니다.',
      reinterpretation: '심리학자 융(C.G.Jung)이 집단 심리의 한 측면으로 설명하는 개념이 ‘페르소나(가면)’입니다. 페르소나는 사회가 그 사람에게 기대하는 역할로, 우리는 그 가면을 쓰고 배우처럼 연기합니다. 그것은 부정적인 것만이 아닌 게, 사회생활을 하는데 어쩔 수 없는 요소이기 때문입니다. 바깥세상은 멋진 페르소나, 가령 ‘친절한’, ‘유능한’, ‘명랑한’, ‘가정적인’ 가면을 가진 사람들을 특별히 우대하기 때문에 우리는 페르소나와 자신을 동일시하고 싶은 유혹에 빠지게 됩니다. 하지만 인생의 위기상황에 이르면 우리는 그 ‘가짜’에 한계를 느끼고 부담스럽게 생각합니다. 참된 자신의 모습, 진정한 ‘자기’를 만나고자 합니다. 인생의 어려운 순간 “나는 누구인가?”라는 핵심 질문을 비로소 던지게 됩니다. 당신을 해석하는 중요한 지점은 ‘내가 다른 사람들에게 보이고자 했던 모습’을 성찰하는 데서부터 시작합니다. 타인의 좋은 평판을 얻기 위해 나는 어떤 노력을 했었는지 기억해 내는 것이 출발점이 되면 좋겠습니다. 진짜 ‘나’에서 벗어나 있는 가짜 ‘나’를 찾아내는 작업이 잘 된다면 당신은 성공적인 자기 변화를 이룰 수 있게 될 것입니다. ',
      refresh: 'Self Imagination Training 자기 이미지 훈련이 필요합니다. 새로운 무엇인가를 창조하기 위해서는 일상적으로 생각하고 느끼는 방식을 변화시켜야 합니다. 매일 동일한 방식으로 생각하고 느낀다면 계속해서 동일한 상황을 만들어 낼 수밖에 없을 것입니다. 이미 ‘자신’이 되어버린 삶에서 벗어나기 위해서는 삶의 환경보다 더 크게 생각하고, 몸에 기억된 느낌보다 더 커져야 하며 새로운 시간선(영원)을 만들어야 합니다. 변화하고자 하는 이상적인 ‘나’를 이미지화해야 합니다. 뇌가 과거의 완전한 기록이고 마음이 의식의 산물이라고 할 때, 어떤 의미에서 우리는 항상 과거 속에서 생각하고 있다고 할 수 있습니다. 기억에 상응하는 뇌의 어떤 부분이 반응함으로써 우리는 과거와 동일한 수준의 마음을 만들어 내고 있는 것입니다. 무의식적인 행동을 하면서 우리는 과거의 자아와 연결되어 있습니다. 만족스럽지 못한 나의 모습을 변화시키고자 하지만 나는 오늘도 이전과 다르지 않은 똑같은 생각, 똑같은 행동, 똑같은 감정을 매일 경험하고 있습니다. 과연 이렇게 과거의 에너지에 묶여 우리의 미래 인생을 변화시킬 수 있을까요? 변화된 나의 이상적인 모습을 그려내야 합니다. 그것이 시작입니다.',
      reformation: [
        {
          name: '낙인찍기',
          content: '당신이나 타인에 대해 전반적으로 부정적으로 평가하거나 단정 짓는다.',
          result: '“나는 어차피 안 될 놈이다.” “그는 무책임한 사람이다.”',
          tip: '당신이 바라보는 것이 현실이 됩니다. 누구에게나 동일하게 펼쳐지는 세상임을 인식하며 당신의 초점이 어디, 어느 지점에 가 있는지 성찰해 보아야 합니다. ',
        },
        {
          name: '부정적 필터링',
          content: '부정적인 것에만 초점을 두어 바라본다.',
          result: '“어차피 그 사람은 나를 떠날거예요.” “그 일을 하지 말았어야 했어요.”',
          tip: '‘낙인찍기’는 직관을 가장한 선입견일 수 있습니다. 세상에 대한 무분별한 부정적인 렌즈를 내려놓아야 합니다. 내가 가진, 부정적 인식의 회로를 인식하는 것에서부터 새로운 세상이 시작될 것입니다. 내가 할 수 있는 일과 없는 일을 잘 구별해야 합니다. 나의 부정적 인식에 실체가 있는지, 무엇이 현실이고 무엇이 추측이고 가정인지 분별할 수 있어야 합니다. 가치 있고, 의미 있는 일에 힘을 싣고 살아야 나의 남은 인생이 더욱 빛날 것입니다. 용기를 내십시오, 이제 진짜 내 삶을 시작해야 하는 시간이 왔습니다.',
        },
      ],
      reconstruction: '우리는 스스로 포기하지 못하는 것들에 묶여 더 중요한 것을 놓치는 경우들이 많습니다. 우선, 나의 능력을 과장하려는 욕구를 포기해야 합니다. 나에 대한 과도한 기대를 내려놓는 것부터 시작해야 할 것이고, 이것은 나를 다른 사람과 비교하려고 하는 마음을 멈출 수 있도록 도와줄 것입니다. 나 자신이 아닌, 다른 사람의 칭찬을 얻기 위해 자신의 모습을 저버리는 일을 이제는 그만두어야 합니다. 나의 내면에는 내가 인정하지 않아 발현되지 않은 강력한 힘이 있습니다. 두려움 없이 내 모습 그대로를 누구에게나 보여 줄 수 있는 힘이 있고, 누구보다 강하고 독립적인 존재임을 믿어야 합니다. 뿐만 아니라, 나는 타인을 잘 돌보고, 배려하며 선한 마음을 가지고 있음을 믿어야 합니다. 다른 사람의 성취와 성공을 내 일처럼 기뻐할 줄 알며, 타인과의 비교나 경쟁이 의미 없음을 알고 있습니다. 누구도 대신 채워줄 수 없는 ‘나에 대한 확신’을 나 스스로 바로 세워야 합니다. '
    },
    80: {
      review: '당신의 인생은 지금 용기를 내야 하는 시점에 이르렀습니다. 변화는 당신에게 선택의 문제가 아니라 ‘용기’의 문제입니다. ',
      remember: '당신은 지금 변화해야 하는 시간에 이르렀습니다. 당신은 어떤 것이든 실행할 수 있는 힘을 가지고 있고, 동기부여도 충만합니다. 모험과 성취, 결단과 인내, 변화와 도전을 받아들일 힘이 있습니다. 그러나 아직 많이 배워야 하는 시간이고 경험해야 하는 시간입니다. 당신이 지금 생의 순간에 기억해야 할 것은 ‘중용’의 가치입니다. 주어진 삶에 만족하면서도 유연함과 융통성을 가져야 성공하고 성취하고 앞으로 나아갈 수 있습니다. 주어진 것들에서 해방되어 자유를 체험하지만 스스로에게 온전히 만족하지 못하고 있습니다. 내 삶과 인생에 대해 내면으로부터 온전히 만족하지 못하면 삶에는 늘 ‘불안’이라는 구름이 끼어 듭니다. 그 불안은 때로는 나를 ‘우울’하게 하기도 하고 나를 ‘분노’하게 만들기도 합니다. 그래서 정확한 자기분석(Self Analysis)이 필요한 것입니다.',
      reinterpretation: '심리학자 융(C.G.Jung)이 집단 심리의 한 측면으로 설명하는 개념이 ‘페르소나(가면)’입니다. 페르소나는 사회가 그 사람에게 기대하는 역할로, 우리는 그 가면을 쓰고 배우처럼 연기합니다. 그것은 부정적인 것만이 아닌 게, 사회생활을 하는데 어쩔 수 없는 요소이기 때문입니다. 바깥세상은 멋진 페르소나, 가령 ‘친절한’, ‘유능한’, ‘명랑한’, ‘가정적인’ 가면을 가진 사람들을 특별히 우대하기 때문에 우리는 페르소나와 자신을 동일시하고 싶은 유혹에 빠지게 됩니다. 하지만 인생의 위기상황에 이르면 우리는 그 ‘가짜’에 한계를 느끼고 부담스럽게 생각합니다. 참된 자신의 모습, 진정한 ‘자기’를 만나고자 합니다. 인생의 어려운 순간 “나는 누구인가?”라는 핵심 질문을 비로소 던지게 됩니다. 당신을 해석하는 중요한 지점은 ‘내가 다른 사람들에게 보이고자 했던 모습’을 성찰하는 데서부터 시작합니다. 타인의 좋은 평판을 얻기 위해 나는 어떤 노력을 했었는지 기억해 내는 것이 출발점이 되면 좋겠습니다. 진짜 ‘나’에서 벗어나 있는 가짜 ‘나’를 찾아내는 작업이 잘 된다면 당신은 성공적인 자기 변화를 이룰 수 있게 될 것입니다.',
      refresh: 'Self Imagination Training 자기 이미지 훈련이 필요합니다. 새로운 무엇인가를 창조하기 위해서는 일상적으로 생각하고 느끼는 방식을 변화시켜야 합니다. 매일 동일한 방식으로 생각하고 느낀다면 계속해서 동일한 상황을 만들어 낼 수밖에 없을 것입니다. 이미 ‘자신’이 되어버린 삶에서 벗어나기 위해서는 삶의 환경보다 더 크게 생각하고, 몸에 기억된 느낌보다 더 커져야 하며 새로운 시간선(영원)을 만들어야 합니다. 변화하고자 하는 이상적인 ‘나’를 이미지화해야 합니다. 뇌가 과거의 완전한 기록이고 마음이 의식의 산물이라고 할 때, 어떤 의미에서 우리는 항상 과거 속에서 생각하고 있다고 할 수 있습니다. 기억에 상응하는 뇌의 어떤 부분이 반응함으로써 우리는 과거와 동일한 수준의 마음을 만들어 내고 있는 것입니다. 무의식적인 행동을 하면서 우리는 과거의 자아와 연결되어 있습니다. 만족스럽지 못한 나의 모습을 변화시키고자 하지만 나는 오늘도 이전과 다르지 않은 똑같은 생각, 똑같은 행동, 똑같은 감정을 매일 경험하고 있습니다. 과연 이렇게 과거의 에너지에 묶여 우리의 미래 인생을 변화시킬 수 있을까요? 변화된 나의 이상적인 모습을 그려내야 합니다. 그것이 시작입니다.',
      reformation: [
        {
          name: '이분법적 사고',
          content: '전부 아니면 전무, 빛과 어둠, 정의-불의로 나누어 생각한다. ',
          result: '“나는 모두에게 거부당한다.” “공무원들은 부정, 부패하다.”',
          tip: '반드시 해야만 하는 것은 없습니다. 그저 하는 것입니다. 때로 우리는 이러한 당위에 묶여 스스로를 세상의 가장 좁은 감옥에 집어넣습니다. 그것은 바로 ‘나’라고 하는 감옥입니다.',
        },
        {
          name: '당위적 사고',
          content: '모든 것들을 ‘~해야만 한다’라는 관점에서 해석한다.',
          result: '“이겨야만 한다.” “정직해야 한다.” “한 우물을 파야 한다.”',
          tip: '',
        },
      ],
      reconstruction: '우리는 스스로 포기하지 못하는 것들에 묶여 더 중요한 것을 놓치는 경우들이 많습니다. 우선, 나의 능력을 과장하려는 욕구를 포기해야 합니다. 나에 대한 과도한 기대를 내려놓는 것부터 시작해야 할 것이고, 이것은 나를 다른 사람과 비교하려고 하는 마음을 멈출 수 있도록 도와줄 것입니다. 나 자신이 아닌, 다른 사람의 칭찬을 얻기 위해 자신의 모습을 저버리는 일을 이제는 그만두어야 합니다. 내 안에는 나약하고 부족한 모습이 있지만, 스스로 전체성과 완전성을 실현할 수 있는 ‘성장하는 인간’, 특별한 사람입니다. 나의 내면에는 내가 인정하지 않아 발현되지 않은 강력한 힘이 있습니다. 두려움 없이 내 모습 그대로를 누구에게나 보여 줄 수 있는 힘이 있고, 누구보다 강하고 독립적인 존재임을 믿어야 합니다. 뿐만 아니라, 나는 타인을 잘 돌보고, 배려하며 선한 마음을 가지고 있음을 믿어야 합니다. 다른 사람의 성취와 성공을 내 일처럼 기뻐할 줄 알며, 타인과의 비교나 경쟁이 의미 없음을 알고 있습니다. 나와 타인의 성장을 위해 나 자신을 확장시킬 의지가 내 안에 있습니다. 누구도 대신 채워줄 수 없는 ‘나에 대한 확신’을 나 스스로 바로 세워야 합니다. '
    },
    90: {
      review: '당신은 바른 견해를 가지고 있는 사람입니다. 열린 마음을 가지고 있습니다.당신 안에는 ‘나와 타인의 성장을 위해 나를 확장시키려는 의지’가 있습니다. 이제 이 의지를 구체적으로 실현해야 할 때입니다. ',
      remember: '당신은 지금 통합해야 하는 시간에 이르렀습니다. 당신은 어떤 것이든 실행할 수 있는 힘을 가지고 있고, 동기부여도 충만합니다. 모험과 성취, 결단과 인내, 변화와 도전을 받아들일 힘이 있습니다. 아직 많이 배워야 하는 시간이고 경험해야 하는 시간입니다. 당신이 지금 생의 순간에 기억해야 할 것은 ‘중용’의 가치입니다. 주어진 삶에 만족하면서도 유연함과 융통성을 가져야 성공하고 성취하고 앞으로 나아갈 수 있습니다. 주어진 것들에서 해방되어 자유를 체험하지만 스스로에 대한 확신이 흔들릴 때가 있습니다. 내 삶과 인생에 대해 내면으로부터 온전히 만족하지 못하면 삶에는 늘 ‘불안’이라는 구름이 끼어 듭니다. 그 불안은 때로는 나를 ‘우울’하게 하기도 하고 나를 ‘분노’하게 만들기도 합니다. 그래서 정확한 자기분석(Self Analysis)이 필요한 것입니다.',
      reinterpretation: '당신은 신뢰할만한 사람이며, 자유로운 영혼입니다. 항상 삶에 만족하고, 융통성이 있으며 유연함을 가지고 살아갑니다. 특히, 결과보다는 과정을 소중하게 생각하고, 타인을 긍정하고 자신을 인정합니다. 그러한 자신감과 여유가 당신을 더 안전한 자리에 머물게 하고, 시시비비와 판단을 넘어선 자리에서 당신은 공동체에 선한 영향력을 줄 수 있는 사람입니다. 당신은 Meta-Q점수로 ‘중도’ 역량의 수준에 있을 가능성이 높습니다. 이 단계에서는 일을 적절히 하는데 그치지만, 그 다음 단계 자발적이고 창의적인 수준에서는 다가오는 일들을 보다 다른 차원으로 확장시키고 변화시킬 능력을 가집니다. 이 단계에서는 변화가 빠르게 일어나며 주제들에 대한 이해의 수준이 깊어집니다. 이들은 자연스럽게 다른 이들에게 도움이 되고, ‘공동선’에 공헌합니다. 또한, 내적 문제를 직면하며 배우는데 큰 장애물이 없습니다. 당신에게는 이 단계로 나아갈 내면의 힘이 있음을 믿고 실현해야 합니다. ',
      refresh: 'Retreat_피정 피정(避靜)은 피세정념(避世靜念)의 줄임말입니다. 세상을 피해 마음을 모아들인다는 말입니다. ‘Retreat’는 전쟁 중에 후퇴한다는 의미도 있습니다. 세상은 온통 전쟁터 같습니다. 날마다 벌어지는 많은 일들이 우리 마음을 혼란하게 합니다. 집을 떠나 작고 고요한 자리에 머물러 그동안 살아온 인생을 돌아보고 성찰하며 새로운 삶을 다짐하고 자신을 변화시킬 수 있는 시간이 필요합니다. Walking Meditation_걷기명상 인생은 피정의 연속입니다. 걷기 명상은 걷기의 신체적 효과에, 정신적 건강을 위해 ‘명상의 마음챙김’을 합친 개념입니다. 걸으면서 자신을 돌아봅니다. 몸을 관찰하면서 주변 세상과 ‘혼연일체’가 되어야 합니다. 소리를 듣고, 냄새를 맡고, 사물을 바로 보아야 합니다. 발이 땅에 어떻게 닿는지도 유심히 관찰하고 생각해 봅니다. 이런 감각에 완전히 몰입하려고 애써야 합니다. 다른 생각을 과감히 떨쳐내야 합니다. 서서히 삶을 새롭게 자각할 수 있는 단순한 행동을 취하며 복잡한 마음을 정돈합니다. 걷기 명상을 통해 우리는 자기 자신에게 더 친절해지고, 자신의 정체성과 행위에 대한 섣부른 판단을 줄이고 집중력을 높일 수 있었다는 고백을 듣게 됩니다.',
      reformation: [
        {
          name: '개인화',
          content: '부정적인 사건에 대해 자신을 탓하거나 비난한다. ',
          result: '“나 때문에 죽었다.” “나 때문에 일이 잘못됐다.” ',
          tip: '지나간 일에 대한 후회나 원망도 이제는 모두 내려놓아야 합니다. 당신은 그때 나름의 최선을 다했던 것입니다. 당신이 다른 어떤 선택을 했었더라도 지금과 크게 달라지진 않았을 것입니다. 그저 지나간 일은 우리에게 늘 교훈이었음을 명심해야 합니다.',
        },
        {
          name: '후회하는 태도',
          content: '과거에 ‘더 잘했어야 했는데’라고 생각한다.',
          result: '“그런 말을 해서는 안 되는 것이었는데.” “공부를 좀 더 열심히 했어야 했는데.”',
          tip: '피정이나, 걷기명상 등의 방법으로 내 안에 묶여있는 해결되지 않는 감정을 분명히 하고 떠나보내는 연습을 해야 합니다. 일상 중에 연습할 수도 있고, 특별히 시간을 내어 차분히 정돈하는 시간을 갖는 것도 중요합니다. ',
        },
      ],
      reconstruction: '‘창조적인 삶’을 산다는 것은 ‘아무도 아닌(nobody)’ 존재로 산다는 것입니다. 우리는 자꾸 무엇인가, 누군가가 되려고 합니다. 어디인가 소속되려고 하고, 무언가에 기대어 자신의 존재를 증명하려고 합니다. 무엇인가 되려는 것이, 누구인가로 존재하려는 것이 나의 스트레스의 핵심입니다. 자신을 잊어버릴 정도로 어딘가에 몰입해 있었던 경우가 있습니까? 몰입의 순간에는 당신이 이미 알고 있는 세계에서 분리됩니다. 더이상 내가 소유한 물건들, 내가 아는 사람들, 해야 하는 일들, 특정한 장소에 살았던 이런저런 장소들과 관련된 누군가가 아닙니다. 무아(無我)의 상태가 되는 것입니다. 우리가 더 이상 외부환경 속에 사람과 장소, 사물에 초점을 맞추지 않는다면 우리는 인생을 새롭게 재건축할 수 있을 것입니다. 당신의 변화를 응원하고 지지합니다.'
    },
    91: {
      review: '감성에서 이성으로, 이성에서 영성으로. 당신 안에는 ‘나와 타인의 성장을 위해 나를 확장시키려는 의지’가 가득하고 바위도 움직일만큼의 힘이 있습니다. ',
      remember: '이성 그 자체로는 진실에 대한 지침을 제공하지 못합니다. 이성은 논리의 방법론이 두드러지는 기술 세계에서 대단히 효과적이지만 역설적으로 더 높은 의식 수준에 도달하는 데에는 중대한 장애물입니다. 이성은 특정한 것을 다루지만 사랑은 전체를 다룹니다. 사랑은 위치를 취하지 않고, 따라서 전체적이며 위치성의 분리를 넘어섭니다. 그러면 ‘서로 함께하는 것’이 가능한데 어떤 장벽도 없기 때문입니다. 사랑은 포괄적이고 계속해서 자아 감각을 확장합니다. 사랑이 점점 더 무조건적이게 되면서, 내면의 기쁨으로 경험되기 시작합니다. 기쁨이 모든 활동에 끊임없이 동반됩니다. 기쁨은 어떤 외부적 근원에서가 아니라 존재의 매 순간 내면에서 발생합니다. 91점 이상은 치유의 수준이며. 영적인 것에 기반하는 자조 그룹의 수준입니다. ',
      reinterpretation: '주관과 객관 사이의 구별이 사라지며 지각의 특정한 중심점이 없습니다. 이 수준에 있는 개인들은 흔히 스스로 세상에서 물러납니다. 어떤 이들은 영적 스승이 되고 어떤 이들은 인류의 향상을 위해 익명으로 일합니다. 몇몇은 각자의 분야에서 위대한 천재가 되어 사회에 크게 이바지합니다. 보통 공식 종교는 초월 되고 모든 종교의 기원이 되는 순수 영성으로 대체됩니다. 이 수준에서 보는 세상은 의의와 근원이 압도적인, 절묘하게 조율된 진화적 춤 속에서 계속해서 흐르고 진화하게 되었습니다. 이 놀라운 드러남은 마음에 무한한 침묵이 자리하며 개념화를 중단시켰습니다. 바위처럼 굳건한 힘의 현존 때문에 모든 것이 다른 모든 것과 연결됩니다. 위대한 미술 작품과 음악, 건축물은 우리를 일시적으로 더 높은 의식 수준들로 데려갈 수 있으며 또한 영감을 주고 시대를 초월하는 것으로 널리 인정받습니다. ',
      refresh: '마인드 리허설(Mind Rehearsal) : 생각이 경험이 된다. 마음을 신경과학에서는 ‘활동 중인 뇌’라고 말합니다. 생각을 달리하는 것만으로도 뇌를 변화시킬 수 있습니다. 생각만으로 나의 행동과 태도, 믿음을 바꿀 수 있습니다. 머릿속에서 시연함으로써(Mind Rehearsal) 뇌의 회로를 변경하는 것입니다. 이제 생각을 바꾸면 뇌가 바뀝니다. 뇌를 변화시키기 위해서는 몇 가지 전제가 필요합니다. 첫째, 새로운 지식을 학습해야 합니다. 둘째, 직접 코칭을 받는 것이 중요합니다. 셋째, 주의를 기울이며 의식해야 합니다. 마지막으로, 반복하면서 뇌의 시냅스를 활성화시켜야 합니다. 계속되는 학습은 시냅스의 연결을 만들어 냅니다. 오랫동안 홀로 변하고자 했는데 그러지 못한 사람에게 도움을 주고자 한다면 이와 같은 과정을 안내할 수 있습니다. 익숙한 수련자의 지도에 따라 마음을 훈련시켜 새로운 경험이 뇌의 시냅스 연결을 더욱 강화시킬 수 있다면 뇌의 연결 회로는 변하고, 나는 변화할 수 있습니다. 결국 ‘뇌’를 바꾸는 노력을 해야 ‘나’를 변화시킬 수 있는 것입니다. ‘뇌’가 변해야 ‘내’가 변합니다.',
      reformation: [
        {
          name: '후회하는 태도',
          content: '과거에 ‘더 잘했어야 했는데’라고 생각한다.',
          result: '“그런 말을 해서는 안 되는 것이었는데.” “그때 공부를 좀 더 열심히 했어야 했는데.”',
          tip: '스스로 자신을 비난하는 영역은 없는지 체크해 보세요.',
        },
        {
          name: '후회하는 태도',
          content: '과거에 ‘더 잘했어야 했는데’라고 생각한다.',
          result: '“그런 말을 해서는 안 되는 것이었는데.” “공부를 좀 더 열심히 했어야 했는데.”',
          tip: '피정이나, 걷기명상 등의 방법으로 내 안에 묶여있는 해결되지 않는 감정을 분명히 하고 떠나보내는 연습을 해야 합니다. 일상 중에 연습할 수도 있고, 특별히 시간을 내어 차분히 정돈하는 시간을 갖는 것도 중요합니다. ',
        },
      ],
      reconstruction: '우리는 ‘누군가’로 살아가려고 합니다. 사회적인 역할, 책임, 위치, 관계의 양상, 교류, 직업 등을 통해 누군가가 되어 존재합니다. 그런데 그런 모습은 진짜 내가 아닙니다. 그것은 생존을 위하여 선택한 나의 전략이고 모습입니다. 어떤 직업으로서 일하는 내가 진정한 ‘나’는 아닙니다. 누군가와의 관계로 만들어진, 어떤 조직과의 관계로 규정된 내가 ‘나’는 아닙니다. 우리는 무엇인가를 내어 맡긴다는 것을 어려워합니다. 다른 누구에게 나에 대한 통제권을 준다는 것인데 이러한 것을 허용하는 관념을 받아들이기 어려워하는 것입니다. 그러나 무한한 힘, 신성한 능력을 가진 무한한 지혜에 자신을 내맡긴다는 것은 조금 더 수월할 것입니다. 에고의 통제를 이제 내려놓아야 한다는 것입니다. 눈에 보이지 않는 힘은 실재하며, 나의 에고가 잠잠해질 때 최고의 해결책이 흘러나올 수 있습니다. 내려놓으면서 가져야 할 감정은 진실, 성실, 겸손, 정직, 확신, 명료함, 열정, 신뢰입니다.'
    }
  }

  // ref[34]
  const ref34ToGrowth = {
    1: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '너무 엄격한 기준으로 나와 타인을 구속하는 것을',
          '나의 노력과 행동에 대해 꼭 공정하게 보상받아야 한다는 생각을',
          '자제심을 잃고 비이성적으로 행동할지도 모른다는 두려움을',
          '내 잘못에 대해 비난을 받을지 모른다는 두려움을',
          '나 자신의 행동을 합리화하려는 성격을',
          '내가 변화시킬 수 없는 것들에 대한 집착을',
          '내가 다른 사람을 판단할 수 있는 위치에 있다고 믿는 것을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '나의 감정에 더 귀기울일 것을',
          '긴장을 풀고 주어진 삶을 즐길 것을 ',
          '매사에 최선을 다한 것으로 충분하다는 것을 ',
          '타인에게 배울 점이 많다는 것에 감사함을 ',
          '타인에게 부드러움과 존경심으로 너그럽게 대할 것을 ',
          '나의 감정은 정당한 것이며, 나도 감정을 가질 권리가 있음을 ',
          '내 실수에 대해 나 자신을 비난하지 않을 것을 ',
          '나 자신과 타인에 대해 부드럽고 관대해질 것을 ',
          '평온한 마음으로 관용적이고 인내하는 모습을 ',
          '흑백논리에서 벗어나 진행형, 과정으로 생각해보는 연습을 ',
        ]
      },
    ],
    2: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '다른 사람을 향한 나의 분노와 원망을',
          '사랑하는 사람들을 독점하려는 마음을',
          '나를 사랑하게 만들려고 아첨하는 것을',
          '내가 타인을 위해 한 일로 그들의 관심을 불러일으키려는 생각을',
          '내 요구에 충분히 응해주지 못한 것에 대해 상대방이 죄책감을 느끼게 만들려는 마음을',
          '아무도 나를 원하지 않고 사랑하지 않을 것이라는 두려움을',
          '다른 사람도 내가 원하는 방식으로 내 도움에 보답해야 한다는 기대감을',
          '나의 모든 신체적인 병, 아픔 그리고 불평을',
          '내 자신이 희생되었다는 느낌, 혹사당했다는 느낌에 사로잡히는 것을',
          '다른 사람이 나를 필요로 하게 만들려는 욕심을',
          '나의 부정적인 감정을 인정하지 않으려는 습성을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '나 자신을 사랑할 것을',
          '나 자신의 성장과 발전에 힘쓸 것을',
          '내 모든 감정은 나의 것임을 두려워 하지 않고 받아들일 것을',
          '나는 내 행동 동기에 대해 분명한 의식을 갖고 있음을',
          '나의 행복이 타인을 기쁘게 하는데 있는 것이 아님을',
          '사랑하는 사람을 소유하려 하지 않을 것을',
          '아무 조건 없이 타인을 사랑할 것을',
          '다른 사람이 내게 베풀어 준 모든 것에 대해 감사함을',
        ]
      }
    ],
    3: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '나는 부적합한 사람이며 타인에게 거절당할지도 모른다는 두려움을',
          '실패와 창피를 당하는 것에 대한 두려움을',
          '내 능력을 발휘하기 위해 자신의 감정을 숨기는 것을',
          '최고가 되기 위해 가혹하게 자신을 몰고 가는 성격을',
          '나 자신과 나의 능력을 과장하려는 욕구를',
          '나를 다른 사람과 비교하려고 하는 성격을',
          '지속적인 타인의 주목과 칭찬에 대한 갈망을',
          '불안정한 나 자신을 보상하기 위해 교만해지는 것을',
          '나의 실수와 부족함을 감춰야 한다는 생각을',
          '다른 사람을 훼방하는 것이 자신을 더 낫게 만들 수 있다는 믿음을',
          '다른 사람들과 그들의 행운을 시기하는 감정을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '성공과 관계없이 내 자신은 가치 있는 존재임을',
          '내 중심은 나이며 건강한 정서를 가졌음을',
          '두려움 없이 나의 참모습을 보여 줄 수 있음을',
          '나는 타인을 잘 돌보고, 선한 마음을 가지고 있음을',
          '다른 사람들이 내게 주는 사랑을 있는 그대로 받아들일 것임을',
          '다른 사람의 행복과 복지를 위해 기꺼이 일할 것을',
          '나를 존중해주는 사람들에 대해 책임이 있음을',
          '다른 사람의 성취와 성공을 내 일처럼 기뻐할 것을',
        ]
      }
    ],
    4: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '자기 파괴적인 모든 생각과 행동을',
          '내 멋대로인 나의 정서와 행동을',
          '내가 하찮은 존재이며 바람직하지 못한 존재라는 생각을',
          '자신에 대해 절망하고 실망하는 모든 감정을',
          '자신에 대한 모든 의심과 정서적 취약성을',
          '우울함, 피로감 그리고 내성적인 성격을',
          '나 자신과 타인에 대한 모든 비현실적인 기대를',
          '나는 타인과 다른 대우를 받아야 한다는 생각을',
          '다른 사람들로부터 도망쳐 나 자신을 보호하려는 생각을',
          '내 감정에 연연해하며 과거에 사로잡히는 일을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '내 감정에 따라 내가 누구임이 결정되는 것이 아님을',
          '내가 표현하는 감정만이 내가 누구인지 보여준다는 사실을',
          '내 자신을 있는 그대로 열어 보일 것을',
          '내가 경험한 모든 것을 내 성장에 사용할 것을',
          '나의 삶, 나의 친구들 그리고 나 자신은 선하다는 것을',
          '나 자신을 사랑하고 부드럽게 대할 것을',
          '나의 삶이 더 고상한 삶으로 변하고 있음을',
          '내가 이 세상에 선함과 아름다움을 가져오고 있음을',
          '과거의 상처로부터 자유로울 수 있다는 것을',
        ]
      }
    ],
    5: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '나를 둘러싼 세상에 대한 모든 두려움을',
          '내 마음의 무력감과 절망감 그리고 불안과 동요를',
          '나의 신체적 건강과 외모를 무시하는 일을',
          '냉소적이며 다른 사람의 평범함을 경멸하는 것을',
          '세상에는 의지할 사람이 아무도 없다는 생각을',
          '사람들에게서 숨어버리고 싶고, 숨기고 싶은 마음을',
          '정신세계로 도피함으로써 현실을 회피하려는 마음을',
          '타인을 파괴하고 그들의 평화가 깨지기를 바라는 생각을',
          '타인이 나를 부당하게 이용할지도 모른다는 두려움을',
          '무엇을 하기 전에 항상 좀 더 알아야 한다는 생각을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '불확실하고 모호한 것들도 수용할 것을',
          '나는 안전하며, 나의 삶은 현실에 기초하고 있음을',
          '나의 삶과 나의 노력은 의미 있고 가치 있는 일임을',
          '나의 창조성의 가치를 알며 유머감각을 가지고 있음을',
          '내 몸의 강인함과 신비함을',
          '나의 미래와 인류에 대한 믿음을',
          '대등한 입장에서 자신감을 가지고 다른 사람에게 다가갈 것을',
          '타인에게 자비로운 마음을 가질 때 마음의 평정을 찾을 수 있음을',
          '진심을 다해 타인을 지지하고 후원할 것을',
        ]
      }
    ],
    6: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '타인에게 버림 받게 될지도 모른다는 두려움을',
          '실패를 자초하며 자신을 벌하는 나의 성격을',
          '나 자신에 대한 열등감과 미래에 대한 심한 공포를',
          '나의 문제에 과잉반응하고 지나치게 과장하는 행동을',
          '나 자신의 불안정을 감추기 위해 \'거친 행동\'을 하는 것을',
          '나의 두려움과 불안을 다른 사람에게 투사하는 습관을',
          '처벌 당하고 함정에 빠질 것 같은 느낌에 사로잡혀 자포자기하는 심정을',
          '나와는 다른 성격의 사람을 두려워하고 싫어하는 것을',
          '내 자신의 문제와 실수에 대해 타인을 비난하는 성격을',
          '나 자신의 안전을 위해 다른 사람을 필요로 하는 성격을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '나는 독립적이며 능력 있는 존재임을',
          '그룹이나 관계 속에서 나의 정체성을 가질 수 있음을',
          '나 자신과 재능, 나의 미래에 대한 믿음이 있음을',
          '확신과 마음의 평정을 갖고 고난에 대응할 수 있음을',
          '안심하며 무슨 일이든 최선을 다할 수 있음을',
          '어떤 상황에서도 용기 있게 행동할 수 있음을',
          '내 안에 진정한 권위가 있다는 것을 알게 되었음을',
          '모든 사람들과 친밀한 관계를 가질 수 있음을',
          '나를 필요로하는 모든 사람에게 넉넉하며 관대하게 대할 수 있음을',
        ]
      }
    ],
    7: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '내가 충분하지 않을 것이라는 두려움을',
          '무모하고 파괴적인 충동들, 그리고 모든 강박관념과 탐닉들을',
          '일시적인 만족을 위해 나의 건강과 행복을 희생하는 일을',
          '자기수양 부족으로 내게 온 기회를 망쳐버리는 일을',
          '내 행동의 결과로부터 도망치려는 것을',
          '끊임없이 주의 산만한 행동으로 자기 자신을 회피하려는 것을',
          '나 자신이 할 수 있는 것 이상으로 자신을 부풀리는 성격을',
          '외적인 것들이 나를 행복하게 해줄 수 있다는 믿음을',
          '나의 불안함 때문에 자신을 위험한 상황이나 행동으로 몰아가는 것을',
          '나의 좌절감을 토로하기 위해 타인을 창피주거나 악용하는 일을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '조용히 내면에 집중할 때 가장 행복하다는 것을',
          '박탈감을 느끼지 않고 자신에게 \'아니오\'라고 말할 수 있음을',
          '내가 필요한 것을 충분히 가지고 있다는 사실을',
          '나는 어려움 속에서 더 강하다는 사실을',
          '내 일상적인 삶에 만족할 수 있음을',
          '내가 맡은 기획들을 끝까지 완성시킬 수 있음을',
          '나의 삶에 영적 차원이 있음을',
          '살아 있다는 것에 진심으로 감사함을',
          '진심으로 사람들을 돌보며 그들의 안녕과 행복을 위해 일할 것을',
        ]
      }
    ],
    8: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '패배하는 것에 대한 두려움을',
          '결코 모든 일에 두려워하지 말아야 한다는 생각을',
          '내 자신이 연약해지거나 나약해지는 것에 대한 두려움을',
          '타인이 나를 지배하게 될 것이라는 두려움을',
          '내가 내 삶의 모든 일들을 통제해야만 한다는 생각을',
          '타인을 위협해서라도 그들이 나의 길을 따라와야 한다는 믿음을',
          '내 삶에서 다른 사람은 필요 없다는 믿음을',
          '건강과 대인관계를 파괴시키더라도 나의 자존심을 지키려는 것을',
          '나에게 동의하지 않은 사람은 나를 적대하는 사람이라고 생각하는 것을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '나는 훌륭하며, 존중받을 자격이 있는 존재임을',
          '내 안에 부드러운 감정과 선한 충동이 존재함을',
          '나는 타인에게 두려운 사람이 아닌 온화한 사람이 될 수 있음을',
          '나는 내 자신을 잘 다스리고 내 욕망을 길들일 수 있음을',
          '타인을 믿으며 그들의 행복과 평안을 진심으로 바랄 것을',
          '넓은 마음으로 내가 얻은 영광을 다른 이들과 나눌 것을',
          '나보다 더 훌륭한 권위자가 존재함을',
          '타인을 옹호함으로써 내게 만족함을',
          '나는 타인을 사랑하며 그 사랑을 돌려달라고 말할 수 있음을',
        ]
      }
    ],
    9: [
      {
        name: '“나는 내려놓습니다.”',
        items: [
          '나의 모든 태만함과 건망증 그리고 일을 쉽게 포기하는 성격을',
          '나 자신의 삶에 대해 적극적으로 관심 갖지 않으려는 생각을',
          '유쾌하지 않거나 어려운 일들은 무엇이든 피하려는 생각을',
          '문제가 압도적으로 커질 때까지 그것을 무시하려는 습관을',
          '나 자신을 바라보는 것에 대한 두려움을',
          '감각을 잃고 정서적으로 무감각한 상태에 빠지려는 성격을',
          '몸에 밴 습관이나 정해진 일상 속에서 자신을 잃어버리는 것을',
          '나의 공격성을 직시하지 않으려는 것을',
          '평화를 유지하기 위해 어떤 사람과도 잘 지내려는 습관을',
          '자신의 발전을 위해 노력하기보다 타인의 도움으로 살려는 생각을',
        ]
      },
      {
        name: '“나는 받아들입니다.”',
        items: [
          '나는 이제 확신이 있으며 강하고 독립적인 존재임을',
          '나의 생각을 발전시키고, 이를 통해 사고할 수 있음을',
          '내 자신과 나의 능력에 대해 자랑스럽게 여길 것을',
          '나는 어려울 때도 충실하며 믿음직한 사람임을',
          '깨어나 기민한 눈으로 주변 세계를 볼 것을',
          '두려움 없이 나 자신을 깊이 성찰할 수 있음을',
          '나의 미래에 대해 흥미와 열정을 가지고 있음을',
          '삶이 내게 주는 모든 것을 적극적으로 수용할 것을',
          '내 안에 강력한 치유의 힘이 있음을',
        ]
      }
    ]
  }

  // 성격 유형 결과
  const PersonalityType = () => {
    const WD = resultPageData.W > resultPageData.D ? 'W' : 'D';
    const PI = resultPageData.P > resultPageData.I ? 'P' : 'I';
    const LM = resultPageData.L > resultPageData.M ? 'L' : 'M';
    const SC = resultPageData.S > resultPageData.C ? 'S' : 'C';

    return WD + PI + LM + SC
  };
  const PersonalityTypeValue = PersonalityType();

  const PersonalityTypeText = {
    DPLC: '조용하고 말이 없으며, 논리적·분석적·객관적으로 인생을 관찰하는 유형입니다. 사실적인 정보를 조직하기 좋아합니다. 일과 관계 되지 않는 이상 자신을 개방하지 않으며, 가까운 친구들 외에는 대체로 사람들을 사귀지 않습니다. 일상생활에 있어 매우 적응력이 강하며, 과학분야·기계계통·엔지니어링 분야에 관심이 많습니다. 만약 이 유형이 기계나 기술 분야에 흥미가 없다면, 그 대신 비조직화된 사실들을 조직화하는 재능이 많으므로 법률·경제·마케팅·판매·통계 분야에 관심이 많을 수 있습니다.',
    DPMC: '말보다는 행동으로 따뜻함을 나타내며, 동정적입니다. 그러나 상대방을 잘 알게 될 때까지 이 따뜻함을 잘 드러내지 않습니다. 내적인 이상향과 개인적인 가치에 준하여 사람이나 일을 대하며, 말로써 잘 표현하지 않습니다. 자신의 주관이나 가치를 타인에게 요구하지 않으며 매우 겸손합니다. 적응력이 높고 관용적이며, 지금 여기를 즐깁니다. 자연에 대한 사랑과 미적 감각, 균형(비례) 감각이 뛰어납니다. 일의 목표 달성에 연연하지 않으며 여유로운 태도를 보입니다.',
    WPLC: '관대하고 느긋합니다. 사람이나 사건에 대해서 선입견을 갖지 않으며 개방적입니다. 자신과 타인에게 관용적이며, 일을 있는 그대로 보고 받아들이므로 갈등이나 긴장이 일어나는 상황을 잘 무마하는 능력이 있습니다. ‘꼭 이렇게 되어야 한다’는 규범을 적용하기 보다 누구나 만족할 수 있는 해결책을 모색하고 타협하며 적응하는 힘이 있습니다. 현재 상황에 주의집중을 하고, 현실을 있는 그대로 보는 자연스러운 경향은 현실적 문제 해결에 뛰어난 능력으로 발휘되기도 합니다.',
    WPMC: '친절하고 수용적이며 어떤 상황에도 잘 적응하고 타협적입니다. 선입견이 별로 없으며 개방적이고 관용적입니다. 다른 사람의 일이나 활동에 관심이 많으며, 새로운 사건 혹은 물건에도 관심과 호기심이 많습니다. 이론이나 책을 통해 배우기보다 실생활을 통해 배우는 것을 선호합니다. 추상적 관념이나 이론보다는 구체적 사실들을 잘 기억하는 편입니다. 논리적 분석보다는 인간중심의 가치에 따라 결정을 내립니다. 그러므로 동정적이고 사람들에게 관심이 많으며, 때로 재치가 있고 꾀와 끼가 많습니다. 특히 사람들을 접하는 일에 능숙합니다. 사람과 사물을 다루는 상식이 풍부합니다. ',
    DIMC: '조화로운 관계를 중요시해서 분쟁을 회피하고 화를 잘 참는 편입니다. 칭찬과 인정에 약하며, 정에 얽매여서 거절을 잘 하지 못합니다. 내면세계에 관심이 많고, 말하기 보다는 명상을 하며 자신의 세계에 머무릅니다. 내면에 갈등이 많고 복잡하기도 합니다. 평소 계획을 잘 세우지 않는 편이며, 세우더라도 계획대로 잘 진행하지 못합니다. 창의적이고 개성이 있으며 예술 방면에 관심이 많은 편입니다. 하고 싶은 일에는 열정적이며 반복되는 일에 쉽게 지루함을 느낍니다. 현실감각이 없는 편이며, 공상가나 이상주의자라는 말을 듣습니다. 낭만적인 사람으로서 자기만의 이상향이 있지만 모든 사람들에게 이상향을 적용하기는 어렵습니다.',
    DIMS: '창의력과 통찰력이 뛰어납니다. 강한 직관력으로 의미와 진실된 관계를 추구합니다. 뛰어난 영감으로 말없이 타인에게 영향력을 행사합니다. 독창성과 독립심이 강하며, 확고한 신념과 뚜렷한 원리원칙을 가지고 있습니다. 공동의 이익을 가져오는 일에 심혈을 기울이고 동료애를 중시하는 경향이 있으며 사람들로부터 존경을 받습니다. 열정으로 자신들의 신념을 구현시켜 나가는 정신적 지도자들이 이 유형에 속합니다. 남에게 강요하기보다 행동과 권유로 사람들의 마음을 움직여 따르게 만드는 지도력이 있습니다.',
    WIMC: '열성적이고 창의적입니다. 풍부한 상상력과 영감을 가지고 새로운 프로젝트를 잘 시작합니다. 충동적 에너지가 넘쳐 즉흥적으로 일을 빠르게 해결하는 능력이 있습니다. 관심이 있는 일이면 무엇이든 척척 해내는 열성파입니다. 뛰어난 통찰력으로 그 사람 안에 있는 성장 가능성을 봅니다. 자신이 가진 열성으로 다른 사람들도 프로젝트에 흥미를 가지고 참여하게 하며, 다른 사람을 잘 도와줍니다.',
    WIMS: '동정심과 동료애가 많습니다. 친절하고 재치 있으며 화합을 아주 중요하게 여깁니다. 민첩하고 참을성이 많고 성실합니다. 다른 사람들의 의견을 존중하고 그 가치를 봅니다. 공동선을 위해 대체로 상대방 의견에 동의하고, 새로운 아이디어에 대한 호기심이 많습니다. 글로 쓰기보다는 말로써 생각을 잘 표현합니다. 편안하고 능수능란하게 계획을 제시하거나 조직을 이끌어 가는 능력이 있습니다.',
    WPLS: '일을 조직하고 프로젝트를 계획하고 실행시키는 능력이 있습니다. 현실적이고 사실적이며 체계적·논리적으로 사업이나 조직체를 이끌어가는 타고난 재능을 가졌습니다. 혼란스러운 상태나 불분명한 상태 또는 실용성이 없는 분야에는 크게 흥미를 느끼지 못하지만, 필요에 따라 응용하는 힘이 있습니다. 분명한 규칙을 중요시하며, 그에 따라 행동하면서 일을 추진하고 완성합니다. 어떤 계획이나 결정을 내릴 때 확고한 사실에 바탕을 두고 이행합니다. 대체로 결과를 바로 볼 수 있는 일을 즐기는 편입니다. 기업체·조직체를 이끌며, 행정관리 및 생산건축 분야의 일을 잘 합니다.',
    WPMS: '친절하고 재치가 있습니다. 동정심과 동료애가 많습니다. 다른 사람들에게 관심을 쏟고 화합을 도모하는 일을 중요하게 여깁니다. 양심적이고 정리정돈을 잘하며 참을성이 많습니다. 다른 사람을 잘 돕고, 다른 사람들의 지지를 받으면 일에 더욱 열중하는 편입니다. 그러나 다른 사람들의 무관심한 태도에 민감합니다.',
    DPLS: '실제 사실에 대하여 정확하고 체계적으로 기억하며, 일 처리에 있어서도 신중하며 책임감이 강합니다. 집중력이 높으며 강한 현실감각으로 일을 조직적으로 처리한다. 위기 상황에서도 쉽게 흥분하지 않으며 일관성 있고 보수적인 입장을 취합니다. 개인의 감정을 잘 드러내지 않으나 심적으로는 개인적 취향이 확고합니다. 현재의 문제를 해결할 때 과거의 경험을 잘 적용하며, 반복되는 일상적인 일에 대한 인내력이 강합니다. 때로 일의 세부사항에 집착하는 경향이 있으나 업무수행이나 문제해결에 매우 확고하고 분별력 있는 태도를 보입니다.',
    DPMS: '책임감이 강하고 온정적이며 헌신적입니다. 치밀성과 반복을 요하는 일을 끝까지 해나가는 인내력이 있습니다. 이들이 가진 침착성과 인내력은 가정이나 집단에 안정성을 가져다 줍니다. 다른 사람의 사정을 고려하며, 자신과 타인의 감정 흐름에 민감한 편입니다. 일 처리에 있어 현실감각을 가지고 실제적이고 조직적으로 이행합니다. 경험을 통해서 자신이 틀렸다고 인정하기까지 어떠한 난관이 있어도 꾸준히 밀고 나갑니다.',
    WILC: '재빠르고 영리하며, 활기차고 기민합니다. 새롭고 도전적인 문제를 해결하는데 있어 수완이 좋고, 거리낌이 없습니다. 개념적 가능성을 창출하고 그 후에 전략적으로 이를 분석합니다. 타인을 파악하는데 능숙합니다. 일상적인 일을 지루해하며, 똑같은 일을 동일한 방식으로 처리하는 경우가 드물고 흥미가 계속해서 바뀌는 경향이 있습니다. 어떤 의견이나 사람에 반대하는 일을 두려워하지 않으며, 논란이 될 만한 주제에 대해 격렬하게 논쟁하는 일을 즐깁니다. 그렇다고 반론을 제기하는 데만 관심이 있거나 악의를 지닌 것은 아닙니다. 지식이 풍부하고 호기심이 넘치며 활기찬 유머 감각으로 다른 사람을 즐겁게 할 수 있는 성격이지만, 논쟁에서 즐거움을 찾는 성향이 있을 뿐입니다.',
    WILS: '활동적입니다. 행정적인 일과 장기계획을 선호하며 논리적이고 분석적입니다. 사전 준비를 철저히 하며, 계획하고 조직하고 체계적으로 목표달성을 추진하는 지도자들이 많습니다. 비능률적이거나 불확실한 상황에서는 인내심이 없습니다. 솔직하고 결정력과 통솔력이 있으며 거시적 안목으로 일을 밀고 나갑니다. 관념 자체에 집중하는 경향이 있으며 관념 이면의 사람에는 관심이 별로 없습니다.',
    DILC: '조용하고 과묵하나 관심이 있는 분야에 대해서는 말을 잘합니다. 매우 분석적·논리적·객관적이며 비평을 잘합니다. 일의 원리와 아이디어에 관심이 많으며, 실체보다는 실체가 안고 있는 가능성에 관심이 많습니다. 이해가 빠르고 높은 직관력으로 상황을 깊이 있게 보는 능력이 있습니다. 개인적인 인간관계나 파티 혹은 잡담에는 흥미가 별로 없습니다. 아이디어를 깊이 있게 나눌 수 있는 사람들과의 관계를 좋아하며, 때로 어떤 아이디어에 몰입하여 주위에서 돌아가고 있는 일에 둔할 때가 있습니다.',
    DILS: '행동과 사고가 독창적입니다. 내적인 신념과 비전은 산이라도 움직일 만큼 강합니다. 16가지 유형 중에서 가장 독립적이고 단호하며, 때로는 고집이 강합니다. 자신이 가진 영감과 목적을 실현시키려는 의지와 결단력과 인내심을 가지고 있습니다. 자신과 타인의 능력을 중요시하며, 목적달성을 위하여 온 시간과 노력을 바쳐 일합니다. 직관력과 통찰력이 활용되는 분야에서 능력을 발휘합니다. 과학, 엔지니어링, 발명, 정치, 철학 분야 등에 강합니다. ',
  }

  // 힘의 균형과 날개
  const BalanceOfPowerWingsData = {
    1: {
      title: '완벽을 추구하는 올곧은 사람',
      contents: [
        {
          desc: '자신만의 분명한 기준이 있어서 타인에게 비판을 받거나 상대방의 일 처리가 엉성할 때 갈등이 생기기 쉽습니다. 침묵을 지키거나 방어적인 태도를 취하고 경직된 자세나 강한 시선을 보내는 방식 등으로 분노를 드러냅니다. 스스로 책임감이 강하여 누구든 자기가 맡은 일은 책임지고 완수할 것을 기대합니다. 이 과정에서 감시하거나 통제하는 태도를 보이게 되면서 갈등이 발생합니다. 실수나 잘못에 대한 책임관계 기준이 명확하여 자신의 책임이 아닐 때는 선을 긋습니다. 때로는 자신의 일에만 몰두하여 다른 사람의 일에는 신경을 쓰지 않으며 도와주는 것 자체가 바람직하지 않다고 생각하는 경향이 있습니다. 이로 인해 이기주의, 냉정한 사람이라는 평가를 받고 대인관계 안에서 갈등이 발생할 수 있습니다.',
          descType: 'p',
        },
        {
          desc: [
            '누군가의 이름이나 기념일, 작은 변화 등 사소한 일을 중요하게 여깁니다. ',
            '점잖은 농담이나 유머를 사용합니다.',
            '반대보다는 ‘~하면 어떨까?’라는 완곡한 표현을 사용합니다. ',
            '내가 틀렸을 수도 있다는 생각으로 타인의 이야기를 듣고 입장을 헤아려 봅니다. ',
            '상대방이 불평할 때 부드럽게 대하고 잘 들어줍니다.',
          ],
          descType: 'list',
        },
        {
          desc: [
            '비판하거나 못마땅해하지 말고, 모범을 보임으로써 본받게 합니다.',
            '감시나 통제가 아니라, 상황을 체크하며 안내자로서 역할합니다.',
            '스스로 약속한 것을 지키고, 자신의 기준을 낮추어 봅니다. ',
            '실수한 사람을 관대하게 대하고 용기를 줍니다. ',
            '단순하게 생각하고 느긋하게 현재를 즐겨봅니다. ',
          ],
          descType: 'list',
        }
      ]
    },
    2: {
      title: '친절한 조력가',
      contents: [
        {
          desc: '사랑하고 사랑받는 일에서 원동력을 얻는 이 유형의 사람들은 호의를 무시당했다고 느껴질 때 갈등이 생깁니다. 감정을 오랫동안 억누르다가 한순간 폭발적으로 표현합니다. 내가 베푼 친절과 배려에 상응하는 반응을 기대하기 때문에 상대방이 자신을 존중하지 않거나 무관심할 때 자존심이 상하게 됩니다. 그러나 상대방이 자신의 잘못을 인정하고 사과하거나 다시 특별한 관심을 보이면 쉽게 잊고 용서합니다. 개인적인 일로 인해 생긴 감정을 조직이나 공적인 일에까지 영향을 주는 경향이 있습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '충고나 평가를 할 때는 긍정적인 면을 먼저 말한 후에 합니다. ',
            '투덜대는 투나, 간접적으로 불만을 표시하지 말고 직접적으로 원하는 바를 말합니다. ',
            '나서서 도움을 주기보다는 스스로 창조적인 활동을 할 수 있도록 협조합니다. ',
            '물질적인 것이든 정서적인 것이든 균형감 있게 주고 받도록 합니다. ',
            '타인을 위한 행동에 나서기 전에 상대가 정확히 원하는 바가 무엇인지 확인합니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '자신의 감정과 숨겨진 욕망 등을 의식적으로 인식해봅니다.',
            '관계와 일을 구분하여, 관계 때문에 업무에 객관성이 떨어지지 않도록 합니다. ',
            '다른 사람들의 칭찬을 있는 그대로 받아들입니다. ',
            '나의 욕구를 충족하기 위해 은근히 다른 사람을 조종하지 말고 내 욕구를 정직하게 다룹니다. ',
            '부담스러운 부탁이나, 하고싶지 않은 일에는 명확하게 ‘아니오’라고 말합니다.',
          ],
          descType: 'list',
        },
      ]
    },
    3: {
      title: '성공을 향해가는 열정적 야심가',
      contents: [
        {
          desc: '목표를 달성하는 것이 매우 중요한 가치이기 때문에 이를 방해하거나 자신이 유능한 사람으로 보이지 않을 때 갈등이 발생합니다. 목표달성을 위해 다른 사람보다 더 빠르게, 더 많이 일하기 때문에 이 과정에서 다른 사람에게 부담을 주거나 시기심을 유발할 수 있습니다. 불편한 감정을 숨기려고 하지만 목소리나 말투, 어조에서 분명히 느껴집니다. 논리적인 방식으로 문제를 해결하고 명확한 말투를 씁니다. 자신이 잘 모르는 주제나 관심이 없는 주제 또는 자신에게 도움이 되지 않는 주제는 피하려는 경향이 있습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '바쁜 하루에 잠시 시간을 내어 소중한 사람과 진정으로 소통해봅니다. ',
            '일상의 중간중간 의식적으로 휴식을 취합니다. ',
            '세상이 원하는 사람이 되기 보다, 자신이 원하는 것이 무엇인지 생각해봅니다.',
            '다른 사람들의 관심사, 잘하는 것, 취미 등에 관심을 가져봅니다. ',
            '불쑥 찾아오는 사람과 대화하고, 불필요해 보이는 대화에도 함께 해 귀 기울여 봅니다.',
          ],
          descType: 'list',
        },
        {
          desc: [
            '나와 내가 하는 일의 성과는 동일하지 않으며 구분되는 것임을 인식합니다. ',
            '‘일’과 ‘관계’의 균형을 잡기 위해 시간적 여유를 허락합니다.',
            '바로 행동에 돌입하려는 마음을 다스리면서 자신의 감정에 귀 기울입니다. ',
            '요가나 명상, 일기쓰기나 산책 등의 시간을 가지며 자신을 돌아봅니다. ',
            '어떤 일의 성공을 혼자 이루었다고 생각하거나 혼자 이루어야 한다고 생각하는 마음을 경계합니다.',
          ],
          descType: 'list',
        },
      ]
    },
    4: {
      title: '특별함을 지향하는 예술가',
      contents: [
        {
          desc: '자신의 가치관에 어긋나는 일을 할 때 갈등이 발생합니다. 새롭고 자극적인 것을 추구하면서 자신이 특별한 존재로 인정받는 것에 만족감을 느끼기 때문에 이를 이해하지 못하는 사람들과 갈등이 생깁니다. 나에게 관심을 두지 않는 사람에게 관심받기 위해 노력하고 정작 관심을 얻어 낸 후 관계가 가까워지면 스스로 멀어지며 거리를 두기 때문에 이 과정에서 갈등이 발생하기도 합니다. 예술적이며 감정적으로 예민하기 때문에 무던한 사람들은 이를 이해하기 어렵습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '삶의 긍정적인 측면에 대해 생각해보는 시간을 갖습니다.',
            '감정이 행동을 결정하지 않도록 노력합니다. ',
            '압도감을 느끼는 상황에선 복식호흡 같은 평온을 찾는 호흡법을 익힙니다. ',
            '긍정적이든 부정적이든 타인의 피드백에 관대한 태도로 받아들이는 연습을 합니다. ',
            '함께 일하는 부분에서 자신의 책임을 분명히 인식하고 노력합니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '감정적으로 흔들릴 때는 왜 그런지 스스로에게 묻고 생각해봅니다. ',
            '평범하고 사소한 것에도 위대한 힘이 있음을 인정합니다. ',
            '일을 시작한 후 중간에 포기하고 싶은 마음이 들 때 시간을 두고 다시 시작할 힘을 키웁니다. ',
            '협력하고 협조하는 일은 더 강한 결과를 낼 수 있음을 기억합니다. ',
            '내가 있는 지금 이 순간을 즐기고 그 순간에 최선을 다합니다. ',
            '조바심을 잠재우고 몸을 움직여 운동하거나 에너지를 발산합니다. ',
          ],
          descType: 'list',
        },
      ]
    },
    5: {
      title: '관찰력이 뛰어난 연구가',
      contents: [
        {
          desc: '다른 사람과 함께 협력하며 일하는 것에 서툴기 때문에 이 과정에서 갈등이 발생합니다. 혼자 생각하고 자신만의 방식으로 분석하며 결정하기 때문에 함께 일하는 사람들의 의견을 종합하는 데 미숙할 수 있습니다. 조직 안에서 관찰자의 모습으로 보일 때가 많아서 소극적인 인상을 주기 쉽습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '타인의 이야기를 경청하고 공감하는 연습을 합니다. ',
            '주변 사람들의 도움이 나의 성장에 큰 영향을 줄 수 있다는 사실을 믿고 노력합니다. ',
            '함께 즐길 수 있는 책이나 영화, 전시장, 토론 등의 화제를 찾아서 함께 해 봅니다. ',
            '혼자만의 시간과 공간이 필요할 때는 양해를 구하고 충분한 시간을 갖되 이 시간이 자신에게 주는 의미에 대해 사람들과 함께 나눕니다. ',
            '집중하고, 빠져들어 주변 상황을 인지하지 못할 때가 있음을 기억하고 불필요한 오해가 생길 때는 부드러운 말로 설명합니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '조직에서 일을 할 때는 협력이 필수적임을 기억합니다. ',
            '함께 일할 때나 대화할 때는 항상 상대방을 존중하는 태도를 취합니다. ',
            '팀의 목표달성을 위해 동참하고 있음을 적극적으로 표현합니다. ',
            '나의 감정을 존중하며 몸과 마음이 연결되어 있음을 기억합니다. ',
            '안전만을 도모하지 말고 과감하게 뛰어들 때는 용기를 내어 실행합니다. ',
            '언어적 의사소통에서 어감과 어투, 태도 등이 중요하다는 사실을 인정합니다. ',
          ],
          descType: 'list',
        },
      ]
    },
    6: {
      title: '충직한 보안관',
      contents: [
        {
          desc: '신뢰할 수 있는 관계에서 충실하게 다른 사람을 돕는 일에 가치를 두는 이 유형의 사람들은 상대방이 권위를 남용할 때 갈등이 생깁니다. 한 발짝 뒤로 물러서는 태도를 취하면서도 집요하게 분석하고 민감하게 반응합니다. 안전과 안정감을 추구하는 이들에게는 조심성과 의심이 많다보니 다른 사람들에게 부정적 태도로 보이기 쉽습니다. 함께 진취적으로 나아가고자 할 때 문제를 제기하거나 부정적 감정으로 전체적인 분위기를 침체시킴으로써 갈등이 발생할 수 있습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '사람들이 지레짐작하게 내버려 두지 말고, 진짜 의도를 솔직하고 분명하게 말합니다. ',
            '누군가의 의견이 궁금할 때는 집요하게 파고들지 말고, 친근하게 궁금증을 표현합니다. ',
            '걱정과 불안으로 불편한 마음이 올라올 때 그것을 반드시 겉으로 표현해야 하는 것은 아님을 깨닫고, 불편함이 다른 사람에게 전염되지 않도록 경계합니다. ',
            '약속을 지키지 않는 사람을 단번에 제외시키지 말고, 관계의 가능성을 열어둡니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '실패를 예상하기 보다는 잘한 것에 더 집중하려 노력합니다. ',
            '만반의 준비를 해도 통제 불가능한 영역이 있다는 것을 이해합니다. ',
            '스스로의 감정을 인정해주고, 실제 일어난 일과 상상으로 만들어낸 불안을 구분합니다. ',
            '스스로 결정할 수 있는 능력과 권한이 있음을 믿고 용기를 냅니다. ',
            '성공이 보장되지 않은 일에 도전하고 결과에 연연하지 않는 연습을 합니다. ',
          ],
          descType: 'list',
        },
      ]
    },
    7: {
      title: '즐거운 모험가',
      contents: [
        {
          desc: '항상 즐거움을 추구하는 이 유형의 사람들은 지루하거나 평범한 일을 해야 할 때 갈등이 생깁니다. 일상에서 발생하는 작은 갈등상황을 회피하고 자신의 행동을 정당화하기 위해 타인을 비난할 수 있습니다. 유연하고 즉흥적인 사고방식으로 인해 안전과 안정을 추구하는 사람들에게는 부담스러운 존재로 인식될 수 있습니다. 큰 그림을 보려 하기 때문에 작고 세세한 면을 놓치기 쉽고, 지나친 낙관으로 다른 사람들을 불안하게 할 수 있습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '나와 함께 있는 것이 모두에게 즐거움일 수 없다는 사실을 기억합니다. ',
            '나에게 자유가 중요한 만큼 상대의 자유도 존중해 주어야 합니다. ',
            '직설적이고 솔직한 표현이 항상 좋지만은 않다는 사실을 기억합니다.',
            '하기 싫은 일을 해야할 때도 있고 조직 안에서 감수해야 하는 부분이 있을 수 있음을 인식합니다. ',
            '듣기 싫은 말을 하는 상대의 말을 차단하지 않고 끝까지 들어본 후 상대의 입장에서 생각하기 위해 노력합니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '명상이나 산책, 일기쓰기 등 자신과 보내는 시간을 만들어 자신에 대해 깊이 있게 알아가는 시간을 갖습니다. ',
            '다른 사람과 의견을 나눌 때는 끝까지 경청하고, 상대를 존중하며 격려해줍니다. ',
            '충동성이 나를 지배하지 않도록 조절하기 위해 노력합니다. ',
            '계획을 구체적으로 세우고 일을 끝까지 해냅니다. ',
            '모든 아이디어를 표현하거나 실현해야 하는 것은 아님을 기억합니다. ',
          ],
          descType: 'list',
        },
      ]
    },
    8: {
      title: '자신감 넘치는 도전가',
      contents: [
        {
          desc: '자기주장이 강한 이 유형의 사람들은 누군가 자신의 행동에 책임지지 않을 때나 상대방이 진실하지 않을 때 갈등이 생깁니다. 단호한 태도를 취하고 감정의 변화를 공개적으로 표출하므로 다른 사람들과 충돌하기 쉽습니다. 그러나 이들은 나름의 방식으로 감정을 통제하고 있기 때문에 공격적이라는 말을 들을 때 당황하거나 더 거친 표현이 나올 수 있습니다. 옳다 그르다는 기준이 명확하고 이분법적 사고방식에 익숙하기 때문에 상황에 유연하게 대응하는 사람들에게는 부담스럽게 느껴지기도 합니다. 모호함과 부정확함을 견디기 힘들어 하기 때문에 이를 짚고 넘어가는 과정에서 갈등이 생기는 경우가 많습니다. ',
          descType: 'p',
        },
        {
          desc: [
            '내가 권한을 인정받고 싶듯이 타인도 그러함을 알고 인정해줍니다. ',
            '감정이 격하게 일어날 때 한 발 물러서 생각하고 잠시라도 혼자만의 시간을 갖습니다. ',
            '세상의 이치를 이분법으로 모두 설명할 수 없음을 인정합니다. ',
            '의견을 내세우거나 주장할 때 상대가 압박감을 느낄 수 있음을 기억하고 이를 경계합니다. ',
            '타인에게 책임과 통제를 온전히 맡겨봅니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '어느 부분에 취약한 것이 약점이 아님을 이해합니다. ',
            '체력적으로 한계가 있음을 깨닫고 자신을 돌보는 자세가 필요합니다. ',
            '타인과 소통하는 방법은 매우 다양하다는 것을 인식합니다. ',
            '타인을 비난하거나 지배하려는 마음은 불안감에서 시작된다는 것을 기억합니다. ',
            '다른 사람들에게도 나와 같은 격한 감정이 있고 불안감이 있다는 사실을 기억합니다.',
          ],
          descType: 'list',
        },
      ]
    },
    9: {
      title: '조화를 이루는 평화주의자',
      contents: [
        {
          desc: '조화와 평화를 최우선 가치로 두는 이 유형의 사람들은 불가피하게 다른 사람과 맞서야 할 때 갈등이 생깁니다. 맞서지 않기 위해 갈등을 피하다보니 진정한 속마음을 드러내지 않으려 하고 이 과정에서 속을 알 수 없는 사람이라는 평가를 받기도 합니다. 결정적인 상황에서 어느 편도 들지 않으려다 보니 양쪽 모두에게 소외감을 느끼게 하고, 불필요한 오해를 만들기도 합니다. 타인을 수용하는 폭이 넓은 반면, 한계에 이르면 감정이 폭발하거나 완전히 돌아서게 됩니다. 이 경우, 아주 사무적인 태도를 보이거나 계산적인 태도로 수동적 공격을 하기도 합니다. ',
          descType: 'p',
        },
        {
          desc: [
            '나의 침묵이 때로는 동의로 인식될 수 있음을 기억합니다. ',
            '결정하기 어려울 때는 시간적 여유를 달라고 양해를 구한 후 어떤 방식으로든 최종 결정하여 매듭을 짓습니다. ',
            '화합과 일치도 중요하지만 명확한 평가 기준이 이를 더 효과적으로 만들고 불필요한 감정 소모를 줄여줄 수 있음을 기억합니다. ',
            '먼저 할 일과 다음에 할 일을 구분하고 정확한 목표를 세웁니다. ',
          ],
          descType: 'list',
        },
        {
          desc: [
            '자신의 욕구와 필요를 의식적으로 인식하는 시간이 필요합니다. ',
            '갈등이 좋은 것은 아니지만, 나쁜것만도 아님을 이해합니다. ',
            '직접적으로 단호하게 표현하는 방법을 연습합니다. ',
            '그동안 시도하지 않았던 색다른 경험이나 도전이 삶에 활력을 준다는 사실을 인지합니다. ',
            '평화나 안정감이 깨진다고 느껴질때면, 그 문제를 회피하려 한다는 사실을 기억하고 경계합니다. ',
            '어떤 문제든 그냥 사라지지 않음을 기억하고 문제에 직면합니다.',
          ],
          descType: 'list',
        },
      ]
    },
  }

  const wingsTypeData = {
    1: [
      {
        name: '1w9',
        desc: '평화롭고 이상적인 사회를 추구하며 실현하고자 합니다. 침착하고 차분하며 다른 사람들과 조화를 이루며 살기 위해 노력합니다. 다른 사람을 신뢰하고 수용하며, 함께 협력하여 행동합니다. 또한 이성적이며 상황에 유연하게 대처합니다. ',
        advantage: [
          '물질적인 욕심보다는 더 나은 세상을 만들려고 합니다. ',
          '완벽주의 성향으로 근면, 성실합니다.',
          '개인적인 소신과 가치가 강합니다. ',
          '논리적이면서 감성적인 면도 있습니다. ',
          '문제를 세세하게 처리하고 해결합니다. ',
        ],
        reflection: [
          '이상이 높아서 자신의 기준대로 세상이 변해야 한다고 생각합니다. ',
          '자신에 대한 높은 기준으로 자기비판적입니다. ',
          '화를 직접 표출하지는 않지만 수동공격적입니다.',
          '관계를 중시하느라 판단력이 약해지기도 합니다. ',
          '다른 사람의 부탁을 쉽게 거절하지 못합니다. ',
        ]
      },
      {
        name: '1w2',
        desc: '사회 변화를 추구하며, 사회 변화를 위해 힘을 보탭니다. 큰 가치와 원칙을 가지고 있습니다. 자신의 삶에 대한 원대한 꿈을 안고 공동체에서 적극적으로 역할을 합니다. 자신보다는 다른 사람들의 요구를 우선하는 경향이 있습니다. ',
        advantage: [
          '정의감이 높습니다. ',
          '지역 사회에 봉사하고 문제를 개선합니다. ',
          '문제에 대한 창의적인 아이디어와 해결책을 제시합니다. ',
          '다른 사람을 위해 헌신합니다. ',
          '다른 사람에게 필요한 것을 잘 파악합니다. ',
        ],
        reflection: [
          '의도하지 않았지만 다른 사람을 통제할 수도 있습니다. ',
          '편향된 신념과 가치를 가질 수 있습니다. ',
          '대인관계에서 쉽게 좌절할 수 있습니다.  ',
          '자신과 타인을 비판적으로 바라봅니다.  ',
          '자기중심적이고 경직되어 보일 수 있습니다. ',
        ]
      },
    ],
    2: [
      {
        name: '2w1',
        desc: '다른 사람을 위해 봉사할 줄 아는 사람입니다. 문제를 해결하고 목적을 달성하는 것이 원동력이 됩니다. 또한 다른 사람을 도우며, 상대가 자신을 필요로 하는 것을 보면서 원동력을 얻습니다. ',
        advantage: [
          '다른 사람을 아낌없이 지원하고 격려합니다. ',
          '다른 사람에게 필요한게 무엇인지 파악합니다. ',
          '선입견 없이 다른 사람을 대합니다. ',
          '잘하고 싶어서 열심히 일합니다. ',
        ],
        reflection: [
          '스트레스 받는 상황에선, 자기비판적이고 불안정합니다. ',
          '다른 사람의 칭찬과 인정을 갈망합니다. ',
          '자신의 욕구는 무시하고 다른 사람을 위해 헌신합니다. ',
          '나를 위한 비판을 받아들이기 어려워합니다. ',
        ]
      },
      {
        name: '2w3',
        desc: '다른 사람들을 잘 도우며 목표 달성을 위해 노력합니다. 이들에게는 자신을 돌보는 시간, 새로운 사람을 만나고 관계 맺는 것, 팀을 조직하고 이끄는 일이 원동력이 될 수 있습니다. 이들에게는 다른 사람보다 자신에게 필요한 것이 무엇인지를 먼저 찾고, 자신에게 충분한 휴식을 주는 일이 필요합니다. ',
        advantage: [
          '상황에 잘 적응하고 유연하게 대처합니다.',
          '낙관적이고 긍정적인 면에 집중합니다.',
          '사람들이 신뢰하고 인기가 많습니다.',
          '효과적인 의사소통 기술을 지니고 있습니다.',
        ],
        reflection: [
          '스트레스 받는 상황에선 일에 몰두하거나 자신을 잘 돌보지 않을 수 있습니다.',
          '타인에게 비춰지는 자신의 모습에 신경을 많이 씁니다.',
          '선의의 거짓말을 지나치게 하는 경우가 있습니다.',
          '잘못된 부분에 대한 지적을 받아들이기 어려워합니다.',
        ]
      },
    ],
    3: [
      {
        name: '3w2',
        desc: '외향적이고 친절하며, 매력적인 사람입니다. 사람들과 잘 어우러지고 사회적인 기술이 좋습니다. 다른 사람들이 성장할 수 있도록 지원하고 영감을 불어넣습니다. 자신과 타인의 감정을 잘 알아차립니다. ',
        advantage: [
          '일과 관계의 균형을 잘 맞추고 있습니다.',
          '사교적이며 다른 사람들과 잘 어울립니다. ',
          '다른 사람들의 감정, 욕구를 잘 알아차립니다.',
        ],
        reflection: [
          '다른 사람의 인정을 강하게 바랄 수 있습니다.',
          '인정을 받지 못하면 공격적인 모습을 보일 수 있습니다.',
          '다른 사람의 기대에 부응하기 위해 무리합니다. ',
          '다른 사람에게 맞추느라 자신의 욕구를 잘 알아차리지 못합니다.',
        ]
      },
      {
        name: '3w4',
        desc: '체계적이고 조직적인 전문가입니다. 업무를 잘 완수하기 위해 끊임없이 노력하며 헌신합니다. 성공을 위해 타인과는 다른 특별함을 추구합니다. 자신의 감정과 욕구를 알아차리고, 외적인 성공보다는 자신이 진정으로 원하는 것은 무엇인지를 고민해보는 시간이 필요합니다. ',
        advantage: [
          '개인과 일의 균형을 잘 맞추고 있습니다.',
          '자신의 내면에 집중합니다. ',
          '관계를 소중히 여기고 사람들과 상호작용합니다.',
        ],
        reflection: [
          '변덕스럽고 자신에게만 몰두할 수 있습니다. ',
          '사회적인 활동을 피할 수 있습니다.',
          '스트레스 받는 상황에선 피상적인 대인관계를 맺을 수 있습니다.',
          '지나친 우월감을 가질 수 있습니다. ',
        ]
      },
    ],
    4: [
      {
        name: '4w3',
        desc: '창의적이고 활력이 넘치며, 추진력이 있습니다. 체계적이고 효율적으로 일을 처리합니다. 자신의 매력과 스타일을 찾기 위해 노력하며, 자신의 스타일에 자부심이 있습니다. ',
        advantage: [
          '다른 사람의 감정을 잘 이해합니다.',
          '자신에 대해 잘 알고 있습니다. ',
          '창의적이며 효율적인 아이디어를 제시합니다.',
          '일관되며 진정성이 있습니다.',
          '열심히 일하며 근면합니다.',
        ],
        reflection: [
          '스트레스 받는 상황에서 감정적이며, 자기비판적입니다.',
          '과도하게 자신에게 몰두합니다. ',
          '타인이 보는 자신의 모습에 신경을 많이 씁니다.',
          '타인의 삶을 부러워 합니다. ',
        ]
      },
      {
        name: '4w5',
        desc: '높은 호기심과 통찰력을 갖고 있습니다. 창의적인 것에 관심이 많으며 독서를 좋아합니다. 자유로운 영혼이며, 사람들과 어울리기보다 자신의 삶에 집중합니다. ',
        advantage: [
          '자신이 누구인지 알기 위해 성찰합니다.',
          '호기심과 탐구심, 창의성이 있습니다.',
          '열정적이며 높은 집중력을 보입니다.',
          '진정성 있는 대화를 할 수 있습니다.',
          '자신만의 멋을 내는 감각이 있습니다.',
        ],
        reflection: [
          '자신에게 너무 몰두하여 스스로 고립될 수 있습니다.',
          '규칙, 명령 등을 지키기 위해 지나치게 노력합니다.',
          '생각은 많지만 실천력이 약합니다.',
          '스트레스를 받는 상황에선 쉽게 물러서는 모습을 보일 수 있습니다. ',
        ]
      },
    ],
    5: [
      {
        name: '5w4',
        desc: '호기심이 강하고 창의성이 있으며, 철학적인 사고를 하는 사람입니다. 가치 있는 새로운 기술을 습득하는 일에 흥미를 보입니다. 자기를 성찰하며, 다른 사람들의 인정과 존경을 받는 것이 이들에게 원동력이 됩니다. ',
        advantage: [
          '예술감각과 지식에 대한 열정으로 독창적인 작품을 만듭니다.   ',
          '세심하게 일을 처리합니다.  ',
          '집중력이 좋고 일을 끝까지 완수합니다.  ',
          '독립적으로 일을 합니다. ',
        ],
        reflection: [
          '자신의 지식과 성취감에 지나친 자부심을 가집니다. ',
          '다른 사람과 거리를 두며 고립될 수 있습니다. ',
          '현실성이 없어보이기도 합니다. ',
          '예민하며 사회적인 상황에 약합니다.',
        ]
      },
      {
        name: '5w6',
        desc: '사람들과 잘 협력하고, 자신이 가진 지식을 적극적으로 활용해 문제를 해결합니다. 상황을 잘 분석하고 논리적입니다. 문제를 해결할 때, 사회에 기여할 때, 흥미로운 지식을 습득하고 활용하는 것, 자신만의 시간을 가지며 재충전하는 것이 이들의 원동력이 됩니다.  ',
        advantage: [
          '문제를 분석하고 해결하는 능력이 뛰어납니다. ',
          '어려운 문제도 침착하게 해결합니다.',
          '집중력이 높습니다. ',
          '배움에 대한 열정이 강합니다.',
        ],
        reflection: [
          '자신만의 세계에 빠져있을 수 있습니다. ',
          '다른 사람에게 차가운 인상을 줄 수 있습니다. ',
          '동기부여가 되지 않으면 행동하기 어려워합니다. ',
          '스트레스 받는 상황에선 방어적인 태도를 보일 수 있습니다.  ',
        ]
      },
    ],
    6: [
      {
        name: '6w5',
        desc: '논리적이고 분석적인 유형입니다. 안전감을 중요시하고, 친밀하고 안정적인 관계를 추구합니다. 신뢰할만한 직업이나 대인관계를 맺는 것, 다른 사람의 인정, 복잡한 문제 해결이 원동력이 될 수 있습니다. 또한 정서적으로 불안정할 때 스스로를 고립시키지 않는 것, 문제가 발생하면 신뢰할 수 있는 사람과 상의하는 연습이 필요합니다. 혼자만의 시간을 가지며 재충전할 수 있는 시간과 공간을 마련해야 합니다. ',
        advantage: [
          '지적 호기심과 열정이 강합니다.',
          '실용적이며 효율적으로 문제를 해결합니다. ',
          '섬세하고 세부사항을 잘 파악합니다. ',
          '독립적으로 일을 잘 처리합니다. ',
          '갈등이 생겼을 때 논리적으로 잘 표현합니다. ',
        ],
        reflection: [
          '감정 표현을 잘 하지 못합니다. ',
          '냉소적이고 차가운 사람으로 보일 수 있습니다.',
          '사담을 좋아하지 않고, 명확하고 간결한 대화를 선호합니다.',
          '부정적인 생각을 하지 않기 위해 많은 노력을 기울입니다. ',
          '다른 사람과 거리를 두고 멀어지는 경향이 있습니다. ',
        ]
      },
      {
        name: '6w7',
        desc: '안전을 추구하는 한편, 재미와 즐거움을 선호합니다. 매력적인 사람이며, 사람 사이의 신뢰를 중요시합니다. 상대를 통제하려고 하지 않습니다. 또한 새롭고 재밌는 경험, 새로운 사람과의 관계, 가족·친구와 친밀한 관계 유지, 어려운 문제를 해결하는 일이 이들의 원동력이 됩니다. ',
        advantage: [
          '약속을 잘 지키고 신뢰할 수 있습니다.  ',
          '문제가 발생해도 침착하게 대응합니다. ',
          '실용적이며 효율적으로 문제를 해결합니다.',
          '다른 사람들을 잘 살피며 일을 처리합니다.  ',
        ],
        reflection: [
          '스트레스 받는 상황에서 감정 조절이 어렵습니다. ',
          '결정을 해야 할 때 우유부단해질 수 있습니다. ',
          '신뢰를 쌓아가는데 시간이 걸립니다.  ',
          '물질적인 소유욕이 강합니다.',
          '특정 문제에 지나치게 몰두합니다.  ',
        ]
      },
    ],
    7: [
      {
        name: '7w6',
        desc: '낙천적이며 작은 것에서도 기쁨을 찾습니다. 행복을 중요하게 생각하고 성취감을 얻기를 원합니다. 기회를 놓치는 것을 두려워합니다. 새로운 아이디어 제시와 경험, 창의성, 다양한 선택, 새로운 사람과의 관계가 이들에게 원동력이 될 수 있습니다. 그리고 부정적인 생각과 마주하는 것, 자신에 대한 비판을 통해 성장하는 것, 모든 순간이 흥미롭지 않다는 것을 받아들여야 합니다. ',
        advantage: [
          '상대를 기꺼이 도와주며 협조적입니다.  ',
          '다른 사람에 대한 공감과 이해를 잘합니다.',
          '스트레스 받는 상황에서도 침착함을 유지합니다. ',
          '상황 파악을 빠르게 하고 해결합니다.',
        ],
        reflection: [
          '일과 관계에서 쉽게 지루함을 느낍니다. ',
          '자신을 의심하며 결정을 못 미더워합니다.',
          '다른 사람들의 의견에 쉽게 영향을 받습니다.',
          '불안해지면 생각이 잘 정리되지 않습니다. ',
        ]
      },
      {
        name: '7w8',
        desc: '다른 사람들과의 상호작용을 선호하며 현실주의자입니다. 인상적이고 흥미로운 경험을 하기를 원합니다. 관심의 중심이 되는 것, 새로운 목표를 달성하는 것, 다른 사람들과 친밀한 관계를 맺는 것, 재미있는 경험이 이들에게 원동력이 됩니다. ',
        advantage: [
          '자신감과 매력을 갖고 있습니다.',
          '긍정적이고 낙천적입니다.',
          '에너지가 많고 열정적입니다.',
          '논리적이며 자기 의견을 잘 표현합니다. ',
          '위기가 발생해도 침착하게 행동합니다.',
        ],
        reflection: [
          '자기중심적입니다.',
          '물질적인 소유욕이 있습니다. ',
          '충동적이며 무뚝뚝한 인상을 줄 수 있습니다. ',
          '다른 사람에게 거만하게 행동합니다.',
          '실패에 대한 불안을 느낍니다. ',
        ]
      },
    ],
    8: [
      {
        name: '8w7',
        desc: '독립적인 성향이 강하며 통제 받는 것을 싫어합니다. 인간중심적이며 낙관적으로 삶을 살아갑니다. 실용적이고 창의적인 생각을 합니다. 사람들과 함께 시간을 보내고, 억눌린 에너지를 발휘하는 것이 이들에게 원동력이 됩니다. ',
        advantage: [
          '다른 사람들에게 영감을 주고 효과적으로 이끕니다.',
          '논리적이고 공정함을 바탕으로 결정합니다.',
          '자신의 생각과 의견을 명확하게 전달합니다. ',
          '낙관적이며 혁신적으로 일합니다. ',
          '가족, 친구들과 친밀한 관계를 잘 유지합니다.',
        ],
        reflection: [
          '모든 일에 지나치게 열정적입니다.  ',
          '단조로운 일상을 지루하게 여깁니다. ',
          '종종 다른 사람을 자신보다 아래로 보기도 합니다. ',
          '권위적인 말을 잘 받아들이지 못합니다.',
          '감정적인 부분에서 인내심이 낮습니다.  ',
        ]
      },
      {
        name: '8w9',
        desc: '든든하고 편안한 사람입니다. 차분하며 다른 사람을 잘 수용합니다. 자율적이고 독립적인 모습을 추구합니다. 다른 사람을 잘 이끄는 리더의 자질을 가지고 있습니다. 자율적이고 독립적인 환경에서 리더로서의 면모가 빛을 발합니다. ',
        advantage: [
          '대담하고 자신감 있습니다. ',
          '의지력이 강합니다.',
          '다양한 사람들과 잘 어울립니다.  ',
          '근면 성실하고 신뢰할 수 있습니다. ',
        ],
        reflection: [
          '도움을 거부하고 스스로 해결하려고 합니다. ',
          '통제 당하는 것을 꺼려해서 자신이 규칙을 만듭니다',
          '감정 표현을 어려워합니다.  ',
          '관계에서 욕구가 채워지지 않으면 감정적인 모습을 보입니다. ',
        ]
      },
    ],
    9: [
      {
        name: '9w8',
        desc: '삶의 균형과 평화를 추구하며 중재할 힘이 있는 사람입니다. 독립적이고 모험가 같은 면모가 있습니다. 침착함을 유지하면서 자신의 감정을 잘 표현합니다. 그리고 가까운 사람과의 갈등을 피하지 않고, 대인관계는 개인의 노력만으로 되지 않음을 받아들이는 것이 필요합니다.',
        advantage: [
          '여러 집단을 잘 연결하고 이끕니다. ',
          '다양한 관점으로 상황을 바라봅니다. ',
          '협상을 잘하고 자신의 의견을 잘 표현합니다. ',
          '사람들을 잘 격려하고 지원합니다. ',
        ],
        reflection: [
          '평화를 위해 자신보단 상대를 위한 결정을 합니다. ',
          '어려운 상황을 회피하려고 합니다. ',
          '통제 받는 느낌이 들면 고집스러운 모습을 보입니다. ',
        ]
      },
      {
        name: '9w1',
        desc: '진지하며 원대한 이상을 갖고 있습니다. 낙관적이며 내면의 평화를 추구합니다. 신중하고 재치가 있으며, 질서정연한 것을 좋아합니다. 사람들에게 친절하고 이해심이 많습니다. 평화로운 일상과 여러 조직의 화합, 격려와 지지를 받는 것이 원동력이 될 수 있습니다. ',
        advantage: [
          '다른 사람을 돕고 지원합니다. ',
          '다양한 관점으로 상황을 바라봅니다. ',
          '의지력이 강하고 자신의 신념과 원칙이 있습니다. ',
          '자신의 감정을 잘 표현합니다.  ',
        ],
        reflection: [
          '갈등을 피하려고 합니다.  ',
          '자신에게 비판적인 경우가 있습니다.  ',
          '몽상가적인 모습을 보일 때가 있습니다.',
          '자신에게 필요한 것들을 놓칠 수 있습니다.',
        ]
      },
    ],
  }

  // 관계와 소통 분석  
  const aboutJC = resultPageData.JC >= 0 && resultPageData.JC <= 19 ? '낮음' :
    resultPageData.JC >= 20 && resultPageData.JC <= 35 ? '적당함' :
      resultPageData.JC >= 36 && resultPageData.JC <= 50 ? '높음' :
        '범위를 벗어남';
  const aboutEC = resultPageData.EC >= 0 && resultPageData.EC <= 19 ? '낮음' :
    resultPageData.EC >= 20 && resultPageData.EC <= 35 ? '적당함' :
      resultPageData.EC >= 36 && resultPageData.EC <= 50 ? '높음' :
        '범위를 벗어남';

  const aboutMR = resultPageData.MR >= 0 && resultPageData.MR <= 19 ? '낮음' :
    resultPageData.MR >= 20 && resultPageData.MR <= 35 ? '적당함' :
      resultPageData.MR >= 36 && resultPageData.MR <= 50 ? '높음' :
        '범위를 벗어남';
  const aboutFE = resultPageData.FE >= 0 && resultPageData.FE <= 19 ? '낮음' :
    resultPageData.FE >= 20 && resultPageData.FE <= 35 ? '적당함' :
      resultPageData.FE >= 36 && resultPageData.FE <= 50 ? '높음' :
        '범위를 벗어남';
  const aboutAE = resultPageData.AE >= 0 && resultPageData.AE <= 19 ? '낮음' :
    resultPageData.AE >= 20 && resultPageData.AE <= 35 ? '적당함' :
      resultPageData.AE >= 36 && resultPageData.AE <= 50 ? '높음' :
        '범위를 벗어남';


  if (!ref29ScoreType || !images || !resultPageData || !ref29ScoreResult || !ref12BottomTwo[0].img || !PersonalityTypeValue) return;
  if (!ref29ScoreResult)
    console.log('ref29ScoreResult:', ref29ScoreResult);


  if (!resultPageData) return;

  return (
    <div className="App">
      <button onClick={handleDownloadPdf}>PDf 다운로드</button>
      {resultPageData && <Container >
        <div className='page-common' ref={printPageRefs[0]}>
          <main className="main cover">
            <img src={images.index_cover} alt="" className="cover-img" />
            <div className="user-info-list row-group">
              <div className="user-info-item col-group">
                <div className="item-title">
                  이름
                </div>
                <div className="item-txt">{resultPageData.name}</div>
              </div>
              <div className="user-info-item col-group">
                <div className="item-title">
                  생년월일
                </div>
                <div className="item-txt">{resultPageData.birth}</div>
              </div>
              <div className="user-info-item col-group">
                <div className="item-title">
                  검사 완료일
                </div>
                <div className="item-txt">{resultPageData.complete_date}</div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[1]}>
          <main className="list">
            <div className="col-group">
              <h2 className="list-title green">
                목차
              </h2>
              <div className="list-wrap row-group">
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅰ.
                    </div>
                    <div className="txt">
                      마인드 인사이트
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        04
                      </div>
                      <div className="title">
                        소개
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅱ.
                    </div>
                    <div className="txt">
                      감정상태 - 내 몸과 마음의 연결
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        07
                      </div>
                      <div className="title">
                        불안 / 우울 / 분노 지수
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        08
                      </div>
                      <div className="title">
                        디지털 의존도 / 스트레스 정도 / 번아웃 증후군
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅲ.
                    </div>
                    <div className="txt">
                      융합역량지능
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        12
                      </div>
                      <div className="title">
                        강점 영역 / 약점 보완 영역
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        13
                      </div>
                      <div className="title">
                        다각형 분석
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        14
                      </div>
                      <div className="title">
                        전체 비율 분포 분석
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅳ.
                    </div>
                    <div className="txt">
                      에너지 역량 및 방향
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        16
                      </div>
                      <div className="title">
                        에너지 역량 / 에너지의 균형 분포
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        17
                      </div>
                      <div className="title">
                        에너지 유형 / 균형분포 정도
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        18
                      </div>
                      <div className="title">
                        에너지 방향에 따른 유형과 기질적 특성
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅴ.
                    </div>
                    <div className="txt">
                      힘의 균형
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        20
                      </div>
                      <div className="title">
                        힘의 균형 결과 / 성장을 위한 질문
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        21
                      </div>
                      <div className="title">
                        유형별 관계 전략 / 성장을 위한 처방
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        22
                      </div>
                      <div className="title">
                        힘의 균형과 날개 & 화살
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅵ.
                    </div>
                    <div className="txt">
                      관계와 소통 분석
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        26
                      </div>
                      <div className="title">
                        자아상태 결과
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        27
                      </div>
                      <div className="title">
                        의사소통 방식과 리더십
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅶ.
                    </div>
                    <div className="txt">
                      인생 점수
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        28
                      </div>
                      <div className="title">
                        인생 점수 결과
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        30
                      </div>
                      <div className="title">
                        Remember / Reinterpretation / Refresh /
                        Reformation / Reconstruction
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-group row-group gap32">
                  <div className="list-group-title col-group gap32">
                    <div className="num">
                      Ⅷ.
                    </div>
                    <div className="txt">
                      융합역량지수 Meta-q
                    </div>
                  </div>
                  <div className="list-sub-group row-group gap16">
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        34
                      </div>
                      <div className="title">
                        Meta-Q 지수 결과
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        35
                      </div>
                      <div className="title">
                        성장을 위한 전략
                      </div>
                    </div>
                    <div className="list-sub-item col-group gap32">
                      <div className="page">
                        36
                      </div>
                      <div className="title">
                        R약 처방전
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[2]}>
          <main className="main bg-bottom">
            <p className="page-num">1</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">01</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  마인드 인사이트
                </h2>
                <p className="main-sub-title">
                  01. 마인드 인사이트 소개
                </p>
              </div>
            </div>

            <div className="section-top">
              <img src={images.section_top} alt="" className="img" />
              <p className="txt">
                몸과 마음의 중심은 가장 아픈 곳입니다. 아픈 곳은 성장과 변화가 있는 곳입니다. <br />
                사람의 아픈 곳과 세상의 아픈 곳을 치유하며, 더불어 행복한 세상을 향해 나아갑니다.
              </p>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    마인드 인사이트란?
                  </h3>
                </div>
                <p className="default-txt">
                  ‘마인드 인사이트’는, 인간의 깊숙한 내면으로 들어가 마음을 점검하고 분석하며 치유하는 과정입니다. <br />
                  인사이트(insight)는 '통찰', 곧 본질을 꿰뚫어 본다는 것을 의미합니다. 사람들은 나를 잘 모르며, 나조차 나를 설명하기 어렵습니다. <br />
                  내가 내 마음대로 되질 않습니다. 마인드 인사이트는 내 안의 ‘진짜 나’를 알아가고 발견하는 과정을 담은 ‘나’에 관한 진단과 분석, 해석과 상담, 치유와 회복의 과정에 함께 합니다. 나를 바르게 분석하고 알고 있어야 인생의 위기를 피해가고, 삶의 위기를 극복할 수 있습니다.
                </p>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    진행과정
                  </h3>
                </div>
                <div className="step-item-wrap col-group gap40">
                  <div className="step-item-list row-group gap16">
                    <div className="step-item border col-group gap24">
                      <div className="step-item-num">01</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <div className="step-item-title-wrap col-group gap16">
                          <p className="step-item-title">Mind Check</p>
                          <p className="step-item-txt">마음진단</p>
                        </div>
                        <p className="step-item-sub-title">
                          개인의 정서상태를 체크합니다.
                        </p>
                        <p className="step-item-txt">
                          불안, 우울, 분노, 디지털 의존도, 번아웃증후군, 공황장애,
                          스트레스 지수 등 체크하여 내 몸과 마음의 상관관계를
                          파악합니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border col-group gap24">
                      <div className="step-item-num">02</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <div className="step-item-title-wrap col-group gap16">
                          <p className="step-item-title">Mind Analysis</p>
                          <p className="step-item-txt">마음분석</p>
                        </div>
                        <p className="step-item-sub-title">
                          나의 방식과 역량을 분석합니다.
                        </p>
                        <p className="step-item-txt">
                          내 안에 숨겨진 역량을 분석하고, 내가 사용하는 에너지의
                          방향과 힘의 균형을 파악합니다. 또, 내가 자주 사용하는
                          자아상태를 파악하여 타인과 의사소통하고 관계 맺는
                          방식을 분석합니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border col-group gap24">
                      <div className="step-item-num">03</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <div className="step-item-title-wrap col-group gap16">
                          <p className="step-item-title">Mind Report</p>
                          <p className="step-item-txt">마음 리포트</p>
                        </div>
                        <p className="step-item-sub-title">
                          나에 대한 보고서를 출력합니다.
                        </p>
                        <p className="step-item-txt">
                          ‘건강한 미래의 나를 위한 처방전’과 같은 나의 인생보고서
                          일 수 있습니다. 개인의 인생점수(Life Cycle Score)에
                          정서지수와 다중지능지수, 그리고 에너지 방향과 의사소통
                          방식 등에 따른 기능지수를 통합적으로 분석한 <strong>Meta-Q</strong>
                          (융합역량지수)가 표시되며 이를 근거로 갈등회피 전략,
                          관계 전략, 셀프코칭 질문 등의 성장비전을 제시합니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border col-group gap24">
                      <div className="step-item-num">04</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <div className="step-item-title-wrap col-group gap16">
                          <p className="step-item-title">Mind Therapy</p>
                          <p className="step-item-txt">훈련</p>
                        </div>
                        <p className="step-item-sub-title">
                          자기객관화를 진행하고 치유합니다.
                        </p>
                        <p className="step-item-txt">
                          선택에 따라 현재의 나를 이해하는 해석 상담을 받을 수 있고 마인드테라피 훈련과정을 통해, 미래의 나를 위한 변화의 처방전, ‘상담코칭 서비스’를 제공받습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row-group sp-bt">
                    <p className="default-txt">
                      마인드 인사이트는 Mind Check (마음진단), Mind Analysis (마음분석), Mind Report (마음보고서 해석) , Mind Therapy (훈련)과정을 통해 과거의 나를 돌아보며 자기객관화를 진행합니다. <br />
                      <br />
                      선택에 따라 현재의 나를 이해하는 해석 상담을 받을 수 있고 마인드테라피 훈련과정을 통해, 미래의 나를 위한 변화의 처방전, ‘상담코칭 서비스’를 제공받습니다
                    </p>
                    <div className="row-group gap40">
                      <p className="default-title green">
                        우리 모두 당신을 응원하고 지지합니다.
                      </p>
                      <p className="default-txt">
                        우리는 타인과의 관계 속에서 상처 입고, 아파하면서 성장합니다.
                        부모의 언어와 사고체계가 나에게 많은 영향을 주어 물들고, 사회적 정의로 포장된 수많은 구호들이 나의 선택을
                        왜곡합니다. 이 과정에서 입게 되는 상처는 나 혼자만의 문제가 아니며 혼자서는 해결하기도 힘듭니다. <br />
                        <br />
                        마인드 인사이트는 일상에서 넘어지고 상처받고 주저앉아 울면서도, 포기하지 않고 주어진 인생을 살아가는 ‘나’를 응원하고 지지합니다. 무엇인가에 가려져 보여지는 ‘나’가 아니라 침묵 가운데서, 조용하고 고요한 곳에서 속삭이고 있는 <strong className="orange">‘진짜 나’를 발견하여, 자신만의 길을 자신 있게 걸어나가는 것이 우리 프로그램의 존재이유 입니다. 우리 모두 당신을 응원하고 지지합니다.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[3]}>
          <main className="main">
            <p className="page-num">2</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">02</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  감정상태 - 내 몸과 마음의 연결
                </h2>
                <p className="main-sub-title">
                  01. 불안 / 우울 / 분노 지수
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    불안검사 결과
                  </h3>
                </div>
                <div className="result-score-container col-group gap40">
                  <div
                    className={`result-score-wrap ${Ref3unrestScoreType}`}
                  >
                    <div className="result-score-title-wrap col-group sp-bt">
                      <p className="result-score-title">
                        나의 불안검사 결과
                      </p>
                      <div className="result-score-num">
                        <strong>{resultPageData.unrest.score}</strong>
                        점
                      </div>
                    </div>
                    <div className="result-score">
                      <div className="result-score-gauge" style={{ width: `${resultPageData.unrest.score}%` }}></div>
                      <div className="line" style={{ left: '30%' }}></div>
                      <div className="line" style={{ left: '40%' }}></div>
                      <div className="line" style={{ left: '50%' }}></div>
                    </div>
                    <div className="result-score-list row-group">
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            0점 - 30점
                          </p>
                          <p className="txt">
                            정상적인 수준의 불안을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            31점 - 40점
                          </p>
                          <p className="txt">
                            가벼운 정도의 불안을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            41점 - 50점
                          </p>
                          <p className="txt">
                            상당한 정도의 불안을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            51점 - 100점
                          </p>
                          <p className="txt">
                            심한 불안을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="result-score-txt-wrap row-group gap40">
                    <div className={`result-score-txt ${Ref3unrestScoreType}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref3selectDetailText.title) }} />
                    <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref3selectDetailText.desc) }} />
                  </div>
                </div>
              </div>
              {resultPageData.unrest.addition &&
                <SubInfoText subText={Ref3PagesubText} />
              }
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    불안과 공포의 개념
                  </h3>
                </div>
                <div className="row-group gap40">
                  <p className="default-txt">
                    불안과 공포는 일상생활에서는 혼동해서 쓰는 단어이지만 구분되는 개념입니다. <br />
                    마음이 불편하고 조마조마한 상태가 불안과 공포에서 모두 나타납니다.
                  </p>
                  <div className="col-group gap40 relative">
                    <div className="icon-arrow-wrap">
                      <div className="icon-arrow-both">
                        <img src={images.icon_arrow_bold_down} className="icon-arrow-left" />
                        <img src={images.icon_arrow_bold_down} className="icon-arrow-right" />
                      </div>
                      <div className="icon-arrow-both">
                        <img src={images.icon_arrow_bold_down} className="icon-arrow-left" />
                        <img src={images.icon_arrow_bold_down} className="icon-arrow-right" />
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <p className="default-title green">불안</p>
                      <p className="default-txt default-txt-bold">
                        스트레스, 위험, 고통, 공포 등이 예상되는 상황이나, 예상하지 못한 일이 발생한 상황에서의 감정입니다.
                      </p>
                      <p className="default-txt default-txt-s">
                        신체적인 반응으로 숨 가쁨, 가슴 두근거림, 근육의 긴장, 식은땀, 두통, 소화불량 등이 나타나며, 정서적 반응으로 불쾌하고 모호한 두려움, 긴장, 불면, 우울감 등이 나타납니다.
                      </p>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <p className="default-title green">공포</p>
                      <p className="default-txt default-txt-bold">
                        특별한 이유 없이 경험하는 불안과 다르게 대상이 명확하고 구체적인 경우에 발생하는 감정입니다.
                      </p>
                      <p className="default-txt default-txt-s">
                        예를 들어 길에서 갑자기 사나운 개를 만났다거나 산길을 걷다가 뱀과 마주쳤을 때 경험하는 감정을 공포라고 할 수 있습니다.
                      </p>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <p className="default-title green">공황</p>
                      <p className="default-txt default-txt-bold">
                        응급상황으로 느껴지는 극심한 불안 증상이 발작(Attack)처럼 경험되는 상태를 말합니다.
                      </p>
                      <p className="default-txt default-txt-s">
                        갑작스럽게 호흡곤란이나 심장마비, 질식과 같이 뚜렷한 신체 증상이 동반되는 것이 특징이며 그 증상은 보통 갑작스럽게 발생하여 10분 안에 최고조에 이릅니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">3</div>
                  <h3 className="section-title">
                    정상적인 불안과 병적인 불안
                  </h3>
                </div>
                <p className="default-txt">
                  정상적인 불안 반응은 앞으로 일어날 일들을 대비하고, 공포 반응은 위협적인 상황에서 자신을 지키기 위해 필요한 정서적 반응입니다.
                  그러나 <strong>불안한 감정이 통제할 수가 없이 지나치게 나타나고, 불안 증상으로 인해 업무수행이 어렵거나 일상생활을 유지하는 것이 어렵다면 병적인 불안</strong>일 수 있습니다. 불안장애로 정확히 진단하기 위해서는 정신건강의학 전문가의 도움이 필요합니다.
                </p>
              </div>
            </div>
          </main>
        </div >
        <div className='page-common' ref={printPageRefs[4]}>
          <main className="main">
            <p className="page-num">3</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">4</div>
                  <h3 className="section-title">
                    우울검사 결과
                  </h3>
                </div>
                <div className="result-score-container col-group gap40">
                  <div className={`result-score-wrap ${Ref4ScoreType}`}>
                    <div className="result-score-title-wrap col-group sp-bt">
                      <p className="result-score-title">
                        나의 우울검사 결과
                      </p>
                      <div className="result-score-num">
                        <strong>{resultPageData.melancholy}</strong>
                        점
                      </div>
                    </div>
                    <div className="result-score">
                      <div className="result-score-gauge" style={{ width: `${resultPageData.melancholy}%` }}></div>
                      <div className="line" style={{ left: '30%' }}></div>
                      <div className="line" style={{ left: '40%' }}></div>
                      <div className="line" style={{ left: '50%' }}></div>
                    </div>
                    <div className="result-score-list row-group">
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            0점 - 30점
                          </p>
                          <p className="txt">
                            정상적인 수준의 우울을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            31점 - 40점
                          </p>
                          <p className="txt">
                            가벼운 정도의 우울을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            41점 - 50점
                          </p>
                          <p className="txt">
                            상당한 정도의 우울을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            51점 - 100점
                          </p>
                          <p className="txt">
                            심한 우울을 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="result-score-txt-wrap row-group gap40">
                    <div className={`result-score-txt ${Ref4ScoreType}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref4selectDetailText.title) }} />
                    <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref4selectDetailText.desc) }} />
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">5</div>
                  <h3 className="section-title">
                    우울한 기분과 우울증
                  </h3>
                </div>
                <div className="row-group gap32">
                  <div className="green-border-box row-group gap32 depression-1">
                    <img src={images.depression_01} alt="" className="img" />
                    <p className="default-title green">우울한 기분</p>
                    <p className="default-txt default-txt-bold">
                      누구나 경험할 수 있는 정서적 반응 중의 하나이며 <br />
                      보통, 우울감은 시간이 지나면 서서히 회복됩니다.
                    </p>
                    <p className="default-txt">
                      살아가면서 누구나 위기, 실패, 소외, 상실 등을 경험하고 이때에는 좌절감을 느끼고 <br />
                      자신감이 떨어지는 등의 감정변화를 경험합니다. <br />
                      <br />
                      그러나 일반적인 수준의 우울감을 넘어 우울증을 겪는 사람들은 대부분 의욕이 없고 <br />
                      무기력, 무감동하며 자신을 무능하고 무가치하게 느낍니다.
                    </p>
                  </div>
                  <div className="green-border-box row-group gap32 depression-2">
                    <img src={images.depression_02} alt="" className="img" />
                    <p className="default-title green">우울증</p>
                    <p className="default-txt default-txt-bold">
                      우울증은 ‘불안’에 이어 두 번째로 일반적인 정신건강 장애입니다. <br />
                      우울감과 삶에 대한 흥미와 관심을 잃는 것이 우울증의 핵심 증상입니다.
                    </p>
                    <p className="default-txt">
                      1차 진료 의료인을 찾는 사람의 약 30%가 우울증 증상을 경험하지만, <br />
                      주요 우울증이 있는 사람은 이 중 10% 미만입니다. <br />
                      <br />
                      우울증의 가장 심각한 증상은 자살 사고로, 우울증 환자의 60% 이상이 자살을 생각하고 10~15%가
                      실제로 자살을 시행합니다. 일부 우울증 환자는 자신이 우울증인 것을 인지하지 못하고
                      일상생활 기능이 떨어질 때까지도 자신의 상태에 대해 호소하지 않습니다. <br />
                      <br />
                      대부분의 우울증 환자는 삶에 대한 에너지 상실을 호소하는데 과업을 끝까지 마치는 데에 상당한 어려움을 느끼고,
                      학업 및 직장에서 정상적인 업무수행에 장애를 느끼고 새로운 과업을 실행할 동기를 찾지 못합니다.
                      우울장애로 정확히 진단하기 위해서는 정신건강의학 전문가의 도움이 필요합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-5 page-common' ref={printPageRefs[5]}>
          <main className="main">
            <p className="page-num">4</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">6</div>
                  <h3 className="section-title">
                    긴장 완화, 불면 해소에 도움 되는 안정화 기법
                  </h3>
                </div>
                <div className="section-wrap row-group">
                  <div className="row-group gap32">
                    <p className="default-title">
                      <span className="green">복식호흡</span>
                    </p>
                    <p className="default-txt">
                      복식호흡은 배 근육과 횡격막을 사용하는 호흡방식으로, 긴장을 완화시키고 몸과 마음을 편안하게 합니다. <br />
                      또한 불면, 스트레스를 해소하고 집중력을 높이는데 효과가 있습니다.
                    </p>
                    <div className="tip-wrap col-group gap40">
                      <div className="row-group gap40">
                        <img src={images.relax_tip_01} alt="" className="img-1" />
                        <div className="tip-item-wrap col-group gap24">
                          <div className="icon">TIP</div>
                          <div className="tip-item-group row-group">
                            <div className="tip-item">
                              스트레스를 받거나 화가 날 때, 불안할 때 등 호흡이 얕고 빨라지는 경우에 실시하면 효과가 좋습니다.
                            </div>
                            <div className="tip-item">
                              숨을 들이마시는 것보다 천천히 내쉬도록 합니다.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              편안한 자세를 취하고 몸을 이완시킵니다. 손은 가슴에, 다른 손은 배 위에 놓고 가슴과 배의 움직임을 느낍니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              코로 천천히 숨을 들이마시며, 배가 점점 부풀어오르는 것을 느낍니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              숨을 다 들이마시고 잠시 숨을 멈춥니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">04</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              입으로 천천히 숨을 내쉬며, 배가 홀쭉해지는 것을 느낍니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">05</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              처음에는 짧게 시작하고, 점차 시간을 늘려가면서 연습해보세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-group gap32">
                    <p className="default-title">
                      <span className="green">점진적 근육이완</span>
                    </p>
                    <p className="default-txt">
                      점진적 근육이완은 신체의 근육을 긴장시키고 이완하는 기법으로, 스트레스, 불안 등을 감소시키고 긴장을 완화하는데 효과가 있습니다.
                    </p>
                    <div className="tip-wrap col-group gap40">
                      <div className="row-group gap40">
                        <img src={images.relax_tip_02} alt="" className="img" />
                        <div className="tip-item-wrap col-group gap24">
                          <div className="icon">TIP</div>
                          <div className="tip-item-group row-group">
                            <div className="tip-item">
                              편안하고 조용한 장소에서 합니다. 불편한 자세나 옷 등은 피합니다.
                            </div>
                            <div className="tip-item">
                              근육에 과도하게 힘을 주거나 갑자기 힘을 풀지 마세요. 불편하지 않도록 천천히 부드럽게 하는 것이 좋습니다.
                            </div>
                            <div className="tip-item">
                              근육이 긴장하고 이완하는 감각과 그 차이를 느껴보세요. 꾸준히 연습하면 그 감각이 더 좋아집니다.
                            </div>
                            <div className="tip-item">
                              근육·관절에 통증이나 부상, 심혈관 질환이나 고혈압이 있는 경우는 주의해주세요.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              다리를 쭉 뻗고 발끝을 몸쪽으로 당겨 <span className="green">종아리</span>에 힘을 줍니다. 그 다음 천천히 힘을 풀며 종아리를 이완합니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              <span className="green">배</span>를 집어넣으며 힘을 줍니다. 그 다음 천천히 힘을 풀며 배를 이완합니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              깊게 숨을 들이마십니다. <span className="green">가슴</span>이 부풀어오르는 것을 느낍니다. 그 다음 숨을 천천히 내뱉으며 가슴을 이완합니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">04</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              주먹을 쥐고 손과 팔에 힘을 줍니다. 그 다음 천천히 힘을 풀며 <span className="green">손</span>을 이완합니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">05</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              <span className="green">팔</span>을 굽히며 팔뚝에 힘을 줍니다. 그 다음 천천히 힘을 풀며 팔을 이완합니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">06</div>
                          <div className="step-item-txt-wrap">
                            <div className="row-group gap8">
                              <p className="step-item-sub-title">
                                양 <span className="green">어깨</span>를 귀쪽으로 들어올립니다. 그 다음 천천히 어깨를 내리며 이완합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">07</div>
                          <div className="step-item-txt-wrap">
                            <div className="row-group gap8">
                              <p className="step-item-sub-title">
                                <span className="green">턱</span>을 가슴쪽으로 붙이며 목 뒤를 최대한 당깁니다. 그 다음 천천히 목을 이완합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">08</div>
                          <div className="step-item-txt-wrap">
                            <div className="row-group gap8">
                              <p className="step-item-sub-title">
                                입술을 다물고 눈을 감으며 <span className="green">얼굴</span> 전체에 힘을 줍니다. 그 다음 천천히 얼굴을 이완합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[6]}>
          <main className="main">
            <p className="page-num">5</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">6</div>
                  <h3 className="section-title">
                    긴장 완화, 불면 해소에 도움 되는 안정화 기법
                  </h3>
                </div>
                <div className="col-group gap40">
                  <div className="section-wrap row-group half-div">
                    <div className="row-group gap40">
                      <div className="relax-title-wrap col-group gap40">
                        <div className="relax-title-group row-group gap32">
                          <p className="default-title green">
                            나비포옹법
                          </p>
                          <p className="default-txt">
                            이 기법은 괴로운 기억이 반복해서 떠오를 때 시행하면 효과적으로 심리적외상으로 차단된 좌뇌, 우뇌의 정보처리 과정을 촉진합니다.
                          </p>
                        </div>
                        <img src={images.relax_item_01} alt="" className="img" />
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              양손을 X자로 교차시켜서 가슴 위에 올려둡니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              좌우로 번갈아가며 자신의 팔뚝을 토닥여줍니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap40">
                      <div className="relax-title-wrap col-group gap40">
                        <div className="relax-title-group row-group gap32">
                          <p className="default-title green">
                            착지연습
                          </p>
                          <p className="default-txt">
                            착지연습은 재난 경험자가 해리나 침습의 영향에서 스스로 벗어날 수 있도록 돕는 기법으로 위험한 과거가 아닌 안전한 현재에 있음을 인지하도록 돕는 역할을 합니다.
                          </p>
                        </div>
                        <img src={images.relax_item_02} alt="" className="img" />
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              먼저 심호흡을 하고, 앉거나 서있는 상태에서 발이 바닥에 닿아있는 느낌에 집중하며 느껴봅니다
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              발가락을 움직여보기도 하고, <br />
                              발뒤꿈치를 들었다가 쿵! 내려놓으세요.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              뒤꿈치에 힘을 주면서 바닥을 느껴봅니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">04</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              지금 내 주변에 무엇이 있는지 관찰해보고 <br />
                              만져보면서 그 감각을 느껴봅니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap40">
                      <div className="relax-title-wrap col-group gap40">
                        <div className="relax-title-group row-group gap32">
                          <p className="default-title green">
                            안전지대연습
                          </p>
                          <p className="default-txt">
                            편안하고 안전한 장소를 구체적으로 <br />
                            상상하며 몸과 마음을 이완하는 기법입니다. <br />
                            마음이 불편해질 때 시행하면 마음을<br />
                            안정시킬 수 있습니다.
                          </p>
                        </div>
                        <img src={images.relax_item_03} alt="" className="img" />
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              눈을 감고 가장 편안하고 안전하다고 느끼는 장소(실제 가본 곳,  가상의 장소)를 떠올립니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              풍경, 소리, 냄새, 몸에서 느껴지는 감각들을 생생하게 느끼며 머물러 봅니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="section-wrap row-group half-div">
                    <div className="row-group gap40">
                      <div className="relax-title-wrap col-group gap40">
                        <div className="relax-title-group row-group gap32">
                          <p className="default-title green">
                            봉인연습
                          </p>
                          <p className="default-txt">
                            봉인연습은 심리적 불편감을 조절하는 능력을 기르는 기법으로 안정화 단계에서 치료자가 가르쳐야 할 가장 기본적이고 중요한 기술 중 하나입니다.
                          </p>
                        </div>
                        <img src={images.relax_item_04} alt="" className="img" />
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              나를 힘들게 하는 기억이나 생각, 감정을 떠올리고 한 장의 사진으로 만들어 봅니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              기억을 담아둘 아주 단단하고 새지 않는 상자(금고, 철제상자 등)를 떠올려봅니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              이 상자를 봉인할 방법(자물쇠, 열쇠, 쇠사슬 등)을 정해봅니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">04</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              힘든 기억, 생각, 감정을 상자에 넣고 입구를 봉인합니다. 심호흡 후 현재 기분, 느낌, 감각을 느껴보세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap40">
                      <div className="relax-title-wrap col-group gap40">
                        <div className="relax-title-group row-group gap32">
                          <p className="default-title green">
                            정서자유기법
                          </p>
                          <p className="default-txt">
                            정서자유기법은 해결하고 싶은 문제나 감정을 신체 부위를 두드려 해소하는 기법입니다.
                          </p>
                        </div>
                        <img src={images.relax_item_05} alt="" className="img" />
                      </div>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              해결하고 싶은 문제나 감정을 구체적으로 떠올려봅니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              정수리를 시작으로 눈썹 위, 눈 측면, 눈밑 뼈, 인중, 턱, 쇄골 아래, 가슴 측면을 손가락으로 5~10회 부드럽게 두드리며 내려옵니다. 마지막에는 두 손목 안쪽을 서로 맞대고 두드립니다.
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap">
                            <p className="step-item-sub-title">
                              두드리면서 “나는 ＿＿＿ 이지만, 나 자신을 온전히 사랑하고 받아들입니다”라고 말합니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[7]}>
          <main className="main">
            <p className="page-num">6</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">7</div>
                  <h3 className="section-title">
                    분노검사 결과
                  </h3>
                </div>
                <div className="result-score-container col-group gap40">
                  <div className={`result-score-wrap ${Ref7ScoreType}`}>
                    <div className="result-score-title-wrap col-group sp-bt">
                      <p className="result-score-title">
                        나의 분노검사 결과
                      </p>
                      <div className="result-score-num">
                        <strong>{resultPageData.anger.score}</strong>
                        점
                      </div>
                    </div>
                    <div className="result-score">
                      <div className="result-score-gauge" style={{ width: `${resultPageData.anger.score}%` }}></div>
                      <div className="line" style={{ left: '30%' }}></div>
                      <div className="line" style={{ left: '40%' }}></div>
                      <div className="line" style={{ left: '50%' }}></div>
                    </div>
                    <div className="result-score-list row-group">
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            0점 - 30점
                          </p>
                          <p className="txt">
                            정상적인 수준의 분노를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            31점 - 40점
                          </p>
                          <p className="txt">
                            가벼운 정도의 분노를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            41점 - 50점
                          </p>
                          <p className="txt">
                            상당한 정도의 분노를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            51점 - 100점
                          </p>
                          <p className="txt">
                            심한 분노를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="result-score-txt-wrap row-group gap40">
                    <div className={`result-score-txt ${Ref7ScoreType}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref7selectDetailText.title) }} />
                    <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref7selectDetailText.desc) }} />
                  </div>
                </div>
              </div>
              {resultPageData.anger.addition &&
                <SubInfoText subText={Ref7PagesubText} />
              }
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">8</div>
                  <h3 className="section-title">
                    화에 대처하는 방법
                  </h3>
                </div>
                <div className="step-item-list border relative">
                  <img src={images.anger} alt="" className="anger-img" />
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">01</div>
                    <div className="step-item-txt-wrap row-group gap8">
                      <p className="step-item-sub-title">
                        자기 자신과 대화 나누며 나의 생각을 살펴보는 연습하기
                      </p>
                      <p className="step-item-txt">
                        ‘내가 기대한 것은 무엇이었나’, ‘나의 기대는 정당한 것이었나’ 등을 생각해보기
                      </p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">02</div>
                    <div className="step-item-txt-wrap">
                      <p className="step-item-sub-title">
                        상황을 객관적으로 생각하고, 구체적으로 표현하기
                      </p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">03</div>
                    <div className="step-item-txt-wrap">
                      <p className="step-item-sub-title">
                        생각한 뒤에 말하거나, 진정된 후에 표현하기
                      </p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">04</div>
                    <div className="step-item-txt-wrap row-group gap8">
                      <p className="step-item-sub-title">
                        화내는 모습을 거울로 들여다 보거나, 화 내는 말투와 목소리를 녹음해서 들어보기
                      </p>
                      <p className="step-item-txt">
                        모습과 목소리를 관찰할 수 있도록, 자주 갈등하는 상대에게 부탁을 해도 좋습니다.
                      </p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">04</div>
                    <div className="step-item-txt-wrap row-group gap8">
                      <p className="step-item-sub-title">
                        분노에 반응하는 자신만의 자동반응체계 바꾸기
                      </p>
                      <p className="step-item-txt green">
                        (자신만의 반응체계를 구체적으로 떠올리며 적어봅니다. 본 검사지의 맨 뒷부분에 설명된 **&#60;인지행동치료&#62; 부분 참고)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[8]}>
          <main className="main">
            <p className="page-num">7</p>
            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">9</div>
                  <h3 className="section-title">
                    폭발 순간 긴급조치
                  </h3>
                </div>
                <div className="row-group gap40">
                  <div className="row-group gap8">
                    <p className="default-txt default-txt-bold">
                      1 Step - Stop 전략
                    </p>
                    <p className="default-title green">
                      Time-out  일단 그 상황에서 벗어나기
                    </p>
                  </div>
                  <div className="col-group gap40">
                    <div className="row-group gap24">
                      <img src={images.measure_item_01} alt="" className="img" />
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            물리적 거리두기
                          </p>
                          <p className="step-item-txt">
                            다른방, 혹은 밖으로 나가 그 상황에서 벗어나세요.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap24">
                      <img src={images.measure_item_02} alt="" className="img" />
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            심리적 시간 벌기
                          </p>
                          <p className="step-item-txt">
                            숫자를 세거나 심호흡을 해보세요.  물을 마시는 방법도 좋습니다.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <div className="row-group gap8">
                    <p className="default-txt default-txt-bold">
                      2 Step - Think 전략
                    </p>
                    <p className="default-title green">
                      감정 정리하고 이성 찾기
                    </p>
                  </div>
                  <div className="col-group gap40">
                    <div className="row-group gap24">
                      <img src={images.measure_item_03} alt="" className="img" />
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            자신과의 공감 대화
                          </p>
                          <p className="step-item-txt">
                            왜 화가 나는지, 내가 바라는 것은 무엇인지 생각해보세요.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap24">
                      <img src={images.measure_item_04} alt="" className="img" />
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            상대와 공감
                          </p>
                          <p className="step-item-txt">
                            상대방의 상태나 왜 그렇게 행동하는지 생각해보세요.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <div className="row-group gap8">
                    <p className="default-txt default-txt-bold">
                      3 Step - Choose 전략
                    </p>
                    <p className="default-title green">
                      어떻게 해야 할까? 여러 가지 대안 찾기
                    </p>
                  </div>
                  <div className="row-group gap24">
                    <img src={images.measure_item_05} alt="" className="img" />
                    <div className="col-group sp-bt">
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            객관적이고 구체적으로 말하기
                          </p>
                        </div>
                      </div>
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            천천히 솔직하게 표현하기
                          </p>
                        </div>
                      </div>
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            원하는 것을 직접 말로 부탁하기
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[9]}>
          <main className="main">
            <p className="page-num">8</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">02</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  감정상태 - 내 몸과 마음의 연결
                </h2>
                <p className="main-sub-title">
                  02. 디지털 의존도 / 스트레스 정도 / 번아웃 증후군
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    디지털 의존도
                  </h3>
                </div>
                <div className="result-score-container col-group gap40">
                  <div className={`result-score-wrap ${Ref9ScoreType}`}>
                    <div className="result-score-title-wrap col-group sp-bt">
                      <p className="result-score-title">
                        디지털 의존도 결과
                      </p>
                      <div className="result-score-num">
                        <strong>{resultPageData.digital}</strong>
                        점
                      </div>
                    </div>
                    <div className="result-score">
                      <div className="result-score-gauge" style={{ width: `${resultPageData.digital}%` }}></div>
                      <div className="line" style={{ left: '25%' }}></div>
                      <div className="line" style={{ left: '50%' }}></div>
                    </div>
                    <div className="result-score-list row-group">
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            0점 - 30점
                          </p>
                          <p className="txt">
                            일반적인 수준의 디지털 의존도를 보이고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            26점 - 50점
                          </p>
                          <p className="txt">
                            잠재적 위험군 수준의 디지털 의존도를 보이고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            51점 이상
                          </p>
                          <p className="txt">
                            고위험군 수준의 디지털 의존도를 보이고 있는 상태
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="result-score-txt-wrap row-group gap40">
                    <div className={`result-score-txt ${Ref9ScoreType}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref9selectDetailText.title) }} />
                    <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref9selectDetailText.desc) }} />
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    스트레스
                  </h3>
                </div>
                <div className="result-score-container col-group gap40">
                  <div className={`result-score-wrap ${Ref9StressScoreType}`}>
                    <div className="result-score-title-wrap col-group sp-bt">
                      <p className="result-score-title">
                        스트레스 정도 결과
                      </p>
                      <div className="result-score-num">
                        <strong>{resultPageData.stress}</strong>
                        점
                      </div>
                    </div>
                    <div className="result-score">
                      <div className="result-score-gauge" style={{ width: `${resultPageData.stress}%` }}></div>
                      <div className="line" style={{ left: '35%' }}></div>
                      <div className="line" style={{ left: '50%' }}></div>
                      <div className="line" style={{ left: '70%' }}></div>
                    </div>
                    <div className="result-score-list row-group">
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            0점 - 35점
                          </p>
                          <p className="txt">
                            일반적인 수준의 스트레스를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            36점 - 50점
                          </p>
                          <p className="txt">
                            초기단계 수준의 스트레스를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            51점 - 70점
                          </p>
                          <p className="txt">
                            중증 수준의 스트레스를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="icon"></div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            71점 이상
                          </p>
                          <p className="txt">
                            매우 심각한 수준의 스트레스를 경험하고 있는 상태
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="result-score-txt-wrap row-group gap40">
                    <div className={`result-score-txt ${Ref9StressScoreType}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref9StressSelectDetailText.title) }} />
                    <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Ref9StressSelectDetailText.desc) }} />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[10]}>
          <main className="main">
            <p className="page-num">9</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">3</div>
                  <h3 className="section-title">
                    번아웃 증후군
                  </h3>
                </div>
                <div className="row-group gap56">
                  <div className="row-group gap32">
                    <p className="default-title">
                      <span className="green">번아웃 증후군</span>이란,
                    </p>
                    <p className="default-txt">
                      <strong>'번아웃(burnout: 극도의 피로, 연료 소진)'</strong>과 <strong>'증후군(Syndrome)'</strong>의 합성어로, <br />
                      어떤 일에몰두하여 모든 에너지를 쏟은 사람이 극도의 피로를 느끼며 일상생활에서 무기력한 상태가 지속되는 것을 말합니다.
                    </p>
                  </div>
                  <div className="result-score-container col-group gap40">
                    <div className={`result-score-wrap ${Ref10ScoreType}`}>
                      <div className="result-score-title-wrap col-group sp-bt">
                        <p className="result-score-title">
                          번아웃 증후군 결과
                        </p>
                        <div className="result-score-num">
                          <strong>{resultPageData.burnout}</strong>
                          점
                        </div>
                      </div>
                      <div className="result-score">
                        <div className="result-score-gauge" style={{ width: `${resultPageData.burnout}%` }}></div>
                        <div className="line" style={{ left: '15%' }}></div>
                        <div className="line" style={{ left: '35%' }}></div>
                        <div className="line" style={{ left: '60%' }}></div>
                      </div>
                      <div className="result-score-list row-group">
                        <div className="result-score-item col-group gap24">
                          <div className="icon"></div>
                          <div className="txt-group row-group gap8">
                            <p className="title">
                              0점 - 15점
                            </p>
                            <p className="txt">
                              일반적인 수준의 업무집중도를 보이고 있는 상태
                            </p>
                          </div>
                        </div>
                        <div className="result-score-item col-group gap24">
                          <div className="icon"></div>
                          <div className="txt-group row-group gap8">
                            <p className="title">
                              16점 - 35점
                            </p>
                            <p className="txt">
                              초기단계 수준의 번아웃 증후군을 보이고 있는 상태
                            </p>
                          </div>
                        </div>
                        <div className="result-score-item col-group gap24">
                          <div className="icon"></div>
                          <div className="txt-group row-group gap8">
                            <p className="title">
                              36점 - 60점
                            </p>
                            <p className="txt">
                              중증 수준의 번아웃 증후군을 보이고 있는 상태
                            </p>
                          </div>
                        </div>
                        <div className="result-score-item col-group gap24">
                          <div className="icon"></div>
                          <div className="txt-group row-group gap8">
                            <p className="title">
                              61점 이상
                            </p>
                            <p className="txt">
                              매우 심각한 수준의 번아웃 증후군을 보이고 있는 상태
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ResultScoreTextWrap
                      scoreType={Ref10ScoreType}
                      DetailText={Ref10StressSelectDetailText}
                    />
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">4</div>
                  <h3 className="section-title">
                    일반적 스트레스와 번아웃 증후군의 차이
                  </h3>
                </div>
                <div className="green-border-box col-group gap40">
                  <div className="compare-group row-group gap40">
                    <div className="compare-title">
                      <p className="default-title green">
                        스트레스 (Stress)
                      </p>
                      <img src={images.compare_title_item_01} alt="" className="img" />
                    </div>
                    <div className="step-item-list">
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            지나치게 일에 몰입해서 생긴다
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            감정 반응이 격해진다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            행동이 많아지거나 급해진다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            에너지가 점차 소진된다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">05</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            불안에 이를 가능성이 높다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">06</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            신체 증상(두통, 소화불량 등)이 심해진다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="compare-group row-group gap40">
                    <div className="compare-title">
                      <p className="default-title green">
                        번아웃(Burnout)
                      </p>
                      <img src={images.compare_title_item_02} alt="" className="img" />
                    </div>
                    <div className="step-item-list">
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            일에 몰입할 수가 없다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            감정 반응이 둔해진다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap">
                          <p className="step-item-sub-title">
                            좌절감이나 무기력으로 행동이 줄어든다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            의욕, 희망, 생각이 사라진다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">05</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            혼자라는 생각이나 우울감에 빠지기 쉽다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">06</div>
                        <div className="step-item-txt-wrap row-group gap8">
                          <p className="step-item-sub-title">
                            정서적 증상(우울감, 무기력 등)이 심해진다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[11]}>
          <main className="main">
            <p className="page-num">10</p>
            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">5</div>
                  <h3 className="section-title">
                    번아웃 증후군 대처법
                  </h3>
                </div>
                <div className="row-group gap40">
                  <p className="default-title">
                    1. 혼자 고민하지 말고 주변 사람에게 상담하기
                  </p>
                  <div className="row-group gap32">
                    <img src={images.measure_item_06} alt="" className="img" />
                    <p className="default-txt default-txt-l">
                      해결하기 위해서는 자신의 현재 상태를 제대로 인지하는 것이 중요합니다. 이미 우울감, 자기혐오에 빠져있는 상태이기 때문에 혼자 해결하려고 하기보다는 친구나 가족, 회사 사람들에게 솔직하게 털어놓고 상담하는 것이 좋습니다
                    </p>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <p className="default-title">
                    2. 실현 가능한 목표를 세우고 일의 강도 줄이기
                  </p>
                  <div className="row-group gap32">
                    <img src={images.measure_item_07} alt="" className="img" />
                    <p className="default-txt default-txt-l">
                      과한 목표를 세우거나, 할 수 없는 부분까지 일을 맡기 보다는 실현 가능한 목표를 세우고 일의 강도를 줄이면서 여유를 가지는 것이 좋습니다. 일에 대한 집착과, 완벽주의를 버리고 우선순위를 정해 중요한 것부터 해결해나가도록 해야 합니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <p className="default-title">
                    3. 운동, 취미생활 등 휴식 시간 갖기
                  </p>
                  <div className="row-group gap32">
                    <img src={images.measure_item_08} alt="" className="img" />
                    <p className="default-txt default-txt-l">
                      스트레스를 풀 수 있는 방법을 찾아 충분한 휴식을 하는 것이 중요합니다. 일주일에 하루 이상은 업무에서 완전히 벗어나 자신만의 시간을 갖는 것을 습관화 하는 것이 좋습니다. 또, 자신을 재정비 할 수 있도록 휴가를 내는 것도 중요합니다. 휴가 시간을 통해 일과 직장 사람들과의 거리를 두고 세상을 바라보며 주의를 환기하고 스스로의 마음을 돌아보는 시간을 갖는 것이 좋습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[12]}>
          <main className="main">
            <p className="page-num">11</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">03</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  융합역량지능
                </h2>
                <p className="main-sub-title">
                  01. 강점 영역 / 약점 보완 영역
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    융합역량지능 결과
                  </h3>
                </div>
                <div className="row-group gap40">
                  <p className="default-txt">
                    하워드 가드너(Howard Gardner) 박사의 다중지능 이론을 근거로 하여 개인의 다차원적 지능을 측정하고, 새로운 가치를 창조적으로 발견하는 잠재적 역량을 파악합니다. 이 지능은, 본 검사의 최종결과수치인 융합역량지수(Meta-Q)의 분석지표 가운데 하나에 해당합니다.
                  </p>
                  <div className="meta-q-guide col-group">
                    <div className="meta-q-guide-item row-group gap8">
                      <p className="title">
                        0점 - 10점
                      </p>
                      <p className="txt">
                        매우 낮음
                      </p>
                    </div>
                    <div className="meta-q-guide-item row-group gap8">
                      <p className="title">
                        11점 - 30점
                      </p>
                      <p className="txt">
                        낮음
                      </p>
                    </div>
                    <div className="meta-q-guide-item row-group gap8">
                      <p className="title">
                        31점 - 50점
                      </p>
                      <p className="txt">
                        보통
                      </p>
                    </div>
                    <div className="meta-q-guide-item row-group gap8">
                      <p className="title">
                        51점 - 80점
                      </p>
                      <p className="txt">
                        약간 높음
                      </p>
                    </div>
                    <div className="meta-q-guide-item row-group gap8">
                      <p className="title">
                        81점 - 90점
                      </p>
                      <p className="txt">
                        높음
                      </p>
                    </div>
                    <div className="meta-q-guide-item row-group gap8">
                      <p className="title">
                        91점 이상
                      </p>
                      <p className="txt">
                        매우 높음
                      </p>
                    </div>
                  </div>
                  <div className="meta-q-chart-wrap">
                    <div className="chart-num-wrap row-group">
                      <p className="chart-num">100</p>
                      <p className="chart-num">50</p>
                      <p className="chart-num">0</p>
                    </div>
                    <div className="chart-graph-wrap">
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '언어') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '언어') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.language}%` }}>
                            <div className="chart-gauge-num">{resultPageData.language}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon lang"></div>
                          <p className="txt">
                            언어
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '논리수학') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '논리수학') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.math}%` }}>
                            <div className="chart-gauge-num">{resultPageData.math}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon logic"></div>
                          <p className="txt">
                            논리수학
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '시간·공간') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '시간·공간') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.time}%` }}>
                            <div className="chart-gauge-num">{resultPageData.time}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon space"></div>
                          <p className="txt">
                            시간·공간
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '신체운동감각') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '신체운동감각') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.body}%` }}>
                            <div className="chart-gauge-num">{resultPageData.body}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon physical"></div>
                          <p className="txt">
                            신체운동감각
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                     ${ref12TopThree.some((item) => item.name === '음악') ? 'green' : ''}
                                     ${ref12BottomTwo.some((item) => item.name === '음악') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.music}%` }}>
                            <div className="chart-gauge-num">{resultPageData.music}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon music"></div>
                          <p className="txt">
                            음악
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '대인관계') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '대인관계') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.relationship}%` }}>
                            <div className="chart-gauge-num">{resultPageData.relationship}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon friendly"></div>
                          <p className="txt">
                            대인관계
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '자기성찰') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '자기성찰') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.self}%` }}>
                            <div className="chart-gauge-num">{resultPageData.self}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon personal"></div>
                          <p className="txt">
                            자기성찰
                          </p>
                        </div>
                      </div>
                      <div
                        className={`
                                    chart-graph-item 
                                    ${ref12TopThree.some((item) => item.name === '자연') ? 'green' : ''}
                                    ${ref12BottomTwo.some((item) => item.name === '자연') ? 'red' : ''}
                                 `}
                      >
                        <div className="chart-gauge">
                          <div className="chart-gauge-core" style={{ height: `${resultPageData.nature}%` }}>
                            <div className="chart-gauge-num">{resultPageData.nature}</div>
                          </div>
                        </div>
                        <div className="chart-txt-group row-group gap8">
                          <div className="meta-q-icon nature"></div>
                          <p className="txt">
                            자연
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="meta-q-result-group col-group gap40">
                  <div className="row-group gap32">
                    <p className="default-title green">
                      강점 영역
                    </p>
                    <p className="default-txt">
                      자신이 잘 수행하고 자신있어 하는 영역이므로 이를 정확히 인지하고 꾸준하게 성장, 발달 시키는 것이 좋습니다.
                    </p>
                    <div className="step-item-list border">
                      {ref12TopThree.map((item, index) => (
                        <div className="step-item border-dash col-group gap24" key={index}>
                          <div className="step-item-num">0{index + 1}</div>
                          <div className="step-item-txt-wrap row-group gap8">
                            <p className="step-item-sub-title"> {item.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row-group gap32">
                    <p className="default-title red">
                      약점 보완 영역
                    </p>
                    <p className="default-txt">
                      자신이 어려워하고 그 능력개발에 있어서도 소홀했을 가능성이
                      높은 영역이므로 이 부분을 보완하는 것이 필요합니다.
                      특히, 그동안 신경쓰지 않았던 약점영역을 새롭게 개발하여 강점영역과 함께 기능할 수 있도록 노력한다면 보다 통합적인 균형발달을 이룰 수 있고, 융합지능 상승에도 영향을 줄 수 있습니다.
                    </p>
                    <div className="step-item-list border red">
                      {ref12BottomTwo.map((item, index) => (
                        <div className="step-item border-dash col-group gap24" key={index}>
                          <div className="step-item-num">0{index + 1}</div>
                          <div className="step-item-txt-wrap row-group gap8">
                            <p className="step-item-sub-title">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[13]}>
          <main className="main">
            <p className="page-num">12</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    강점영역
                  </h3>
                </div>
                <div className="row-group gap24">
                  {ref12TopThree.map((item, index) => (
                    <div className="green-border-box row-group gap32" key={index}>
                      <p className="default-title green col-group gap24 al-ce">
                        <img data-test={item.img}
                          src={images[item.img + '_green'].default} alt="" className="icon" />
                        {item.name}
                      </p>
                      <p className="default-txt">
                        {ref13Data[item.dataName].desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">3</div>
                  <h3 className="section-title">
                    약점 보완 영역
                  </h3>
                </div>
                <div className="row-group gap24">
                  {ref12BottomTwo.map((item, index) => (
                    <div className="red-border-box row-group gap32" key={index}>
                      <p className="default-title red col-group gap24 al-ce">
                        <img src={images[item.img + '_red'].default} alt="" className="icon" />
                        {item.name}
                      </p>
                      <p className="default-txt">
                        {ref13Data[item.dataName].desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common has-chart' ref={printPageRefs[14]}>
          <main className="main">
            <p className="page-num">13</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">03</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  융합역량지능
                </h2>
                <p className="main-sub-title">
                  02. 다각형 분석 / 03. 전체비율 분포 분석
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    다각형 분석
                  </h3>
                </div>
                <div className="row-group gap40">
                  <p className="default-txt">
                    자신의 각 지능이 영역별로 어떻게 발달되어 있는지를 다각형으로 표시하여 그 분포 정도를 파악해봅니다. 다각형 분포도는 각 영역에 대한 절대적인 평가 뿐만 아니라, 개인 내적으로 영역별 상대적 분포를 평가할 수 있습니다.
                  </p>
                  <div className="step-item-list border">
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">01</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          다각형이 고른 형태
                        </p>
                        <p className="default-txt">
                          전 영역의 점수가 비슷하게 형성되어 고른 발달 분포를 보이는 형태입니다. 전체적으로 넓은 형태로서 각각의 점수가 높으면, 우수한 발달 역량을 보유하고 있는 경우일 수도 있으나 상대적으로 두각을 나타내는 강점역량이 형성되지 않은 경우일 수도 있습니다. 점수를 매기는 기준은 개인마다 차이가 있으므로 다각형이 넓고 고르게 분포되어 있다고 하여 다른 사람들에 비해 평균적으로 우수하다는 의미는 아니라는 점을 기억해야 합니다
                        </p>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">02</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          다각형이 작은 형태
                        </p>
                        <p className="default-txt">
                          전체적으로 좁은 형태로서 상대적으로 강점역량과 약점역량이 뚜렷하게 구분되지 않는 경우로 각 영역이 고른 발달을 이루지 못한 경우일 수 있습니다. 점수를 매기는 기준은 개인마다 차이가 있으므로 다각형이 좁게 분포되어 있다고 하여 다른 사람들에 비해 평균적으로 미숙하다는 의미는 아니라는 점을 기억해야 합니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">03</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          다각형이 한쪽 방향으로 쏠려있거나, 양쪽 방향으로 퍼져있는 형태
                        </p>
                        <p className="default-txt">
                          특정 영역에서 우수한 발달 역량을 보유하고 있는 경우일 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    전체비율 분포 분석
                  </h3>
                </div>
                <div className="row-group gap40">
                  <p className="default-txt">
                    전체 영역을 상대적 비율로 나타낸 표입니다. 자신의 각 지능이 영역별로 어떻게 발달되어 있는지를 영역비율로 확인해볼 수 있습니다.
                  </p>
                  <div className="col-group gap40">
                    <div className="row-group gap24 half-div">
                      <p className="default-title green">
                        전체 비율 분석 그래프
                      </p>
                      <div className="green-border-box">
                        <div className="meta-q-chart">
                          <Radar data={data} options={options} />
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap24 half-div">
                      <p className="default-title green">
                        전체 분포 그래프
                      </p>
                      <div className="green-border-box">
                        <div id="chart_2" className="circle-chart">
                          <svg ref={chartRef} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[15]}>
          <main className="main">
            <p className="page-num">14</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">04</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  에너지 역량 및 방향
                </h2>
                <p className="main-sub-title">
                  01. 에너지 역량 / 에너지의 균형 분포
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    에너지 역량
                  </h3>
                </div>
                <div className="row-group gap40">
                  <p className="default-txt">
                    당신은 살아가면서 수많은 사람을 만나고 다양한 사건을 경험하면서 고유한 존재 방식을 만들어 냈습니다. 이렇게 형성된 성격(personality)은 당신이 한 명의 고유한 개인으로서 어떤 존재인지를 설명해줍니다. 성격은 당신이 하는 말, 자신에 대한 감정, 행동 양식 및 의사결정 방식에 반영됩니다. 성격적 특성을 잘 이해하면 자신의 행동, 감정 및 타인과의 관계에 대해 더 잘 이해하고 지혜롭게 살아갈 수 있도록 도와줍니다. <br />
                    <br />
                    사람들은 주로 다음의 4가지 차원들 가운데 한 가지 측면을 더욱 선호합니다. <br />
                    <br />
                    무엇을 선호하는지 지표를 파악하는 것은 당신의 성격 특성을 분석해 나가는 과정에서 중요한 이해의 시작입니다. 하나의 측면 또는 다른 측면을 선호하는 것이 옳거나 그른 것 또는 좋거나 나쁜 것이 아니라는 점을 기억하세요. 오히려 이러한 선호도는 자신에게 가장 자연스러운 행동 방식임을 나타냅니다. 우리는 서로 다른 차원의 힘이 융합되는 것을 지향합니다. 유년기, 청소년기, 청년기를 지나며 선택했던 심리적 선호를 이제는 반대편의 에너지와 통합해 나가는 것이 마인드 인사이트의 지향이며, 당신의 성장 비결이기 때문입니다.
                  </p>
                  <p className="default-title green">
                    성격유형의 4가지 차원
                  </p>
                  <div className="step-item-list per-type border">
                    <div className="col-group border-dash">
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">폭넓은 W</span>ide
                          </p>
                          <p className="default-txt default-txt-s">
                            에너지의 방향이 외부의 사람과 사물을 향하며 관계의 폭이 넓고 다양하다.
                          </p>
                        </div>
                      </div>
                      <div className="col-group gap32 al-ce">
                        <i className="icon-arrow"></i>
                        <p className="default-txt center">
                          <strong>에너지</strong>의 방향이 <br />
                          어디를 향하는가?
                        </p>
                        <i className="icon-arrow"></i>
                      </div>
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">깊이있는 D</span>epth
                          </p>
                          <p className="default-txt default-txt-s">
                            에너지의 방향이 내부를 향하며 사람과 사물을 깊이 있게 대하고 평온하다.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-group border-dash">
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">실용적 P</span>ractical
                          </p>
                          <p className="default-txt default-txt-s">
                            정보를 있는 그대로 정확하고 상세하게 처리하며 실용적이고 세부적으로 인식한다.
                          </p>
                        </div>
                      </div>
                      <div className="col-group gap32 al-ce">
                        <i className="icon-arrow"></i>
                        <p className="default-txt center">
                          <strong>정보를</strong> 어떻게 <br />
                          인식하는가?
                        </p>
                        <i className="icon-arrow"></i>
                      </div>
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">통찰적 I</span>nsight
                          </p>
                          <p className="default-txt default-txt-s">
                            정보를 상징적이고 비판적으로 처리하며 예리하게 관찰하여 꿰뚫어 인식한다.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-group border-dash">
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">논리중심 L</span>ogical
                          </p>
                          <p className="default-txt default-txt-s">
                            논리와 합리성을 따지며 명백한 사실을 중심으로 객관적 의사결정을 추구한다.
                          </p>
                        </div>
                      </div>
                      <div className="col-group gap32 al-ce">
                        <i className="icon-arrow"></i>
                        <p className="default-txt center">
                          어떤 방식으로 <br />
                          <strong>의사결정</strong> 하는가?
                        </p>
                        <i className="icon-arrow"></i>
                      </div>
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">의미중심 M</span>eaning
                          </p>
                          <p className="default-txt default-txt-s">
                            정서적 공감과 가치공유를 중심으로 감정적 의사결정을 추구한다.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-group border-dash">
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">체계적 S</span>ystematic
                          </p>
                          <p className="default-txt default-txt-s">
                            계획적이고 규칙적이며 효율을 중심으로 체계적인 생활양식을 선호한다.
                          </p>
                        </div>
                      </div>
                      <div className="col-group gap32 al-ce">
                        <i className="icon-arrow"></i>
                        <p className="default-txt center">
                          어떤 <strong>생활양식</strong>을 <br />
                          선호하는가?
                        </p>
                        <i className="icon-arrow"></i>
                      </div>
                      <div className="step-item col-group gap24">
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            <span className="green">포용적</span> In<span className="green">C</span>lusive
                          </p>
                          <p className="default-txt default-txt-s">
                            유연하고 개방적이며 새로움에 열린 태도로 포용적인 생활양식을 선호한다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    에너지 균형 분포
                  </h3>
                </div>
                <p className="default-txt">
                  에너지의 방향은 개인의 선호도에 따라 어느 한쪽으로 쏠리거나 균형 잡힌 상태일 수 있습니다. 어느 한 측면을 선호하는 것이 맞거나 틀림, 좋거나 나쁨, 또는 우월하거나 열등한 것이 아니라는 점을 기억해야 합니다. <br />
                  <br />
                  그러나 자신이 사용하는 에너지의 배분을 파악하는 일은, 통합적이고 균형 잡힌 삶을 위한 체크 포인트가 될 수 있습니다.
                </p>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[16]}>
          <main className="main">
            <p className="page-num">15</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">3</div>
                  <h3 className="section-title">
                    {resultPageData.name}님의 에너지 유형
                  </h3>
                </div>
                <div className="energy-result-top-wrap">
                  <div className="energy-result-title-wrap">
                    <p className="default-title">
                      {resultPageData.name}님의 에너지 유형
                    </p>
                    {/* <div className="energy-result-type">{PersonalityType()}</div> */}
                  </div>
                  <div className="energy-result-top-list row-group">
                    <div className={`energy-result-wrap ${resultPageData.D > resultPageData.W ? 'right' : resultPageData.D < resultPageData.W ? 'left' : 'right left'}`}> {/* d의 점수가 높으면 right / w의 점수가 높으면 left */}
                      <div className="energy-result-top">
                        <div className="energy-result-top-title left">
                          <div className="num">{resultPageData.W}</div>
                          <p className="title">폭넓은(w)</p>
                        </div>
                        <div className="energy-guage-wrap">
                          <div className="energy-guage left">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.W}%` }}></div>
                          </div>
                          <div className="energy-guage right">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.D}%` }}></div>
                          </div>
                          <div className="energy-guage-num-group">
                            <p className="energy-guage-num">100</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">0</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">100</p>
                          </div>
                        </div>
                        <div className="energy-result-top-title right">
                          <p className="title">깊이 있는(d)</p>
                          <div className="num">{resultPageData.D}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`energy-result-wrap ${resultPageData.I > resultPageData.P ? 'right' : resultPageData.I < resultPageData.P ? 'left' : 'right left'}`}> {/* i의 점수가 높으면 right / p의 점수가 높으면 left */}
                      <div className="energy-result-top">
                        <div className="energy-result-top-title left">
                          <div className="num">{resultPageData.P}</div>
                          <p className="title">실용적(P)</p>
                        </div>
                        <div className="energy-guage-wrap">
                          <div className="energy-guage left">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.P}%` }}></div>
                          </div>
                          <div className="energy-guage right">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.I}%` }}></div>
                          </div>
                          <div className="energy-guage-num-group">
                            <p className="energy-guage-num">100</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">0</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">100</p>
                          </div>
                        </div>
                        <div className="energy-result-top-title right">
                          <p className="title">통찰적(I)</p>
                          <div className="num">{resultPageData.I}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`energy-result-wrap ${resultPageData.M > resultPageData.L ? 'right' : resultPageData.M < resultPageData.L ? 'left' : 'right left'}`}> {/* m의 점수가 높으면 right / l의 점수가 높으면 left */}
                      <div className="energy-result-top">
                        <div className="energy-result-top-title left">
                          <div className="num">{resultPageData.L}</div>
                          <p className="title">논리 중심(L)</p>
                        </div>
                        <div className="energy-guage-wrap">
                          <div className="energy-guage left">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.L}%` }}></div>
                          </div>
                          <div className="energy-guage right">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.M}%` }}></div>
                          </div>
                          <div className="energy-guage-num-group">
                            <p className="energy-guage-num">100</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">0</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">100</p>
                          </div>
                        </div>
                        <div className="energy-result-top-title right">
                          <p className="title">의미 중심(M)</p>
                          <div className="num">{resultPageData.M}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`energy-result-wrap ${resultPageData.C > resultPageData.S ? 'right' : resultPageData.C < resultPageData.S ? 'left' : 'right left'}`}> {/* c의 점수가 높으면 right / s의 점수가 높으면 left */}
                      <div className="energy-result-top">
                        <div className="energy-result-top-title left">
                          <div className="num">{resultPageData.S}</div>
                          <p className="title">체계적(S)</p>
                        </div>
                        <div className="energy-guage-wrap">
                          <div className="energy-guage left">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.S}%` }}></div>
                          </div>
                          <div className="energy-guage right">
                            <div className="energy-guage-bar" style={{ width: `${resultPageData.C}%` }}></div>
                          </div>
                          <div className="energy-guage-num-group">
                            <p className="energy-guage-num">100</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">0</p>
                            <p className="energy-guage-num">50</p>
                            <p className="energy-guage-num">100</p>
                          </div>
                        </div>
                        <div className="energy-result-top-title right">
                          <p className="title">포용적(C)</p>
                          <div className="num">{resultPageData.C}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 통 사진이라 불가 */}
              {/* <div className="section">
                     <img src={images.personality_type} alt="" />
                  </div> */}
              <div className="section">
                <div className="row-group gap40">
                  <p className="default-title green">
                    에너지 방향
                  </p>
                  <div className={`energy-result-wrap ${resultPageData.D > resultPageData.W ? 'right' : resultPageData.D < resultPageData.W ? 'left' : 'right left'}`}> {/* d의 점수가 높으면 right / w의 점수가 높으면 left */}
                    <div className="energy-result-top">
                      <div className="energy-result-top-title left">
                        <div className="num">{resultPageData.W}</div>
                        <p className="title">폭넓은(w)</p>
                      </div>
                      <div className="energy-guage-wrap">
                        <div className="energy-guage left">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.W}%` }}></div>
                        </div>
                        <div className="energy-guage right">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.D}%` }}></div>
                        </div>
                        <div className="energy-guage-num-group">
                          <p className="energy-guage-num">100</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">0</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">100</p>
                        </div>
                      </div>
                      <div className="energy-result-top-title right">
                        <p className="title">깊이 있는(d)</p>
                        <div className="num">{resultPageData.D}</div>
                      </div>
                    </div>
                    <div className="col-group gap40">
                      <div className="step-item border col-group gap24 half-div left">
                        <div className="step-item-num">W</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            폭넓은
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              외부의 사람, 사물, 사건에 흥미가 높고 민감하다.
                            </p>
                            <p className="default-txt dot">
                              사교적이고 활동적이다.
                            </p>
                            <p className="default-txt dot">
                              다양한 사람들과 넓은 대인관계를 맺는다.
                            </p>
                            <p className="default-txt dot">
                              여러 사람들과의 상호작용을 즐긴다.
                            </p>
                            <p className="default-txt dot">
                              개방적이고 대담하며 자신을 드러내고 싶어한다.
                            </p>
                            <p className="default-txt dot">
                              깊이 생각하기 보다는 적극적으로 참여한다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="step-item border col-group gap24 half-div right">
                        <div className="step-item-num">D</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            깊이 있는
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              자신의 생각, 내면세계에 집중한다.
                            </p>
                            <p className="default-txt dot">
                              조용하고 신중하다.
                            </p>
                            <p className="default-txt dot">
                              소수의 사람들과 친밀한 관계를 맺는다.
                            </p>
                            <p className="default-txt dot">
                              자신의 생각이나 감정을 잘 드러내지 않는다.
                            </p>
                            <p className="default-txt dot">
                              자신의 생각을 드러내기 전에 충분히 숙고한다.
                            </p>
                            <p className="default-txt dot">
                              편안한 곳을 좋아하며, 자신을 돌아보는 시간을 갖는다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <p className="default-title green">
                    정보 인식 체계
                  </p>
                  <div className={`energy-result-wrap ${resultPageData.I > resultPageData.P ? 'right' : resultPageData.I < resultPageData.P ? 'left' : 'right left'}`}> {/* i의 점수가 높으면 right / p의 점수가 높으면 left */}
                    <div className="energy-result-top">
                      <div className="energy-result-top-title left">
                        <div className="num">{resultPageData.P}</div>
                        <p className="title">실용적(P)</p>
                      </div>
                      <div className="energy-guage-wrap">
                        <div className="energy-guage left">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.P}%` }}></div>
                        </div>
                        <div className="energy-guage right">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.I}%` }}></div>
                        </div>
                        <div className="energy-guage-num-group">
                          <p className="energy-guage-num">100</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">0</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">100</p>
                        </div>
                      </div>
                      <div className="energy-result-top-title right">
                        <p className="title">통찰적(I)</p>
                        <div className="num">{resultPageData.I}</div>
                      </div>
                    </div>
                    <div className="col-group gap40">
                      <div className="step-item border col-group gap24 half-div left">
                        <div className="step-item-num">p</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            실용적
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              실제 경험을 중시하며 현재에 집중한다.
                            </p>
                            <p className="default-txt dot">
                              구체적이며 정확하고 검증된 사실에 따라 일을 처리한다.
                            </p>
                            <p className="default-txt dot">
                              새로운 시도보다는 기존의 방식을 선호한다.
                            </p>
                            <p className="default-txt dot">
                              예측 가능하고 정해진 패턴을 따른다.
                            </p>
                            <p className="default-txt dot">
                              가능성 보다는 구체적인 목표에 따른다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="step-item border col-group gap24 half-div right">
                        <div className="step-item-num">i</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            통찰적
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              가능성과 의미를 추구한다.
                            </p>
                            <p className="default-txt dot">
                              혁신적인 아이디어를 고안해내고 적용하는 것을 즐긴다.
                            </p>
                            <p className="default-txt dot">
                              독창적이고 영감을 중요시하며, 미래지향적이다.
                            </p>
                            <p className="default-txt dot">
                              변화에 민감하고 빠르게 적응한다
                            </p>
                            <p className="default-txt dot">
                              새로운 시도를 즐긴다
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[17]}>
          <main className="main">
            <p className="page-num">16</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="row-group gap40">
                  <p className="default-title green">
                    의사결정 방식
                  </p>
                  <div className={`energy-result-wrap ${resultPageData.M > resultPageData.L ? 'right' : resultPageData.M < resultPageData.L ? 'left' : 'right left'}`}> {/* m의 점수가 높으면 right / l의 점수가 높으면 left */}
                    <div className="energy-result-top">
                      <div className="energy-result-top-title left">
                        <div className="num">{resultPageData.L}</div>
                        <p className="title">논리 중심(L)</p>
                      </div>
                      <div className="energy-guage-wrap">
                        <div className="energy-guage left">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.L}%` }}></div>
                        </div>
                        <div className="energy-guage right">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.M}%` }}></div>
                        </div>
                        <div className="energy-guage-num-group">
                          <p className="energy-guage-num">100</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">0</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">100</p>
                        </div>
                      </div>
                      <div className="energy-result-top-title right">
                        <p className="title">의미 중심(M)</p>
                        <div className="num">{resultPageData.M}</div>
                      </div>
                    </div>
                    <div className="col-group gap40">
                      <div className="step-item border col-group gap24 half-div left">
                        <div className="step-item-num">L</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            논리 중심
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              이성적이고 논리적이며 객관적인 자료를 근거로 판단 한다.
                            </p>
                            <p className="default-txt dot">
                              원리와 원칙을 중시하며 상대를 공정한 태도로 대한다.
                            </p>
                            <p className="default-txt dot">
                              독립적이고 객관적이며,
                              다른 사람들에게 영향을 잘 받지 않는다.
                            </p>
                            <p className="default-txt dot">
                              사람들과 토론을 즐기며, 비판적 사고를 한다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="step-item border col-group gap24 half-div right">
                        <div className="step-item-num">m</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            의미 중심
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              관계중심적이며, 상대에게 미칠 영향을 고려하면서
                              판단한다.
                            </p>
                            <p className="default-txt dot">
                              이성적인 판단보다는 공감을 먼저 한다.
                            </p>
                            <p className="default-txt dot">
                              과업보다는 관계에 더 비중을 둔다.
                            </p>
                            <p className="default-txt dot">
                              상대의 생각과 감정에 집중하며,
                              조화로운 관계를 추구한다.
                            </p>
                            <p className="default-txt dot">
                              다른 사람들을 잘 수용하고 순응하는 편이다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <p className="default-title green">
                    정보 인식 체계
                  </p>
                  <div className={`energy-result-wrap ${resultPageData.C > resultPageData.S ? 'right' : resultPageData.C < resultPageData.S ? 'left' : 'right left'}`}> {/* c의 점수가 높으면 right / s의 점수가 높으면 left */}
                    <div className="energy-result-top">
                      <div className="energy-result-top-title left">
                        <div className="num">{resultPageData.S}</div>
                        <p className="title">체계적(S)</p>
                      </div>
                      <div className="energy-guage-wrap">
                        <div className="energy-guage left">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.S}%` }}></div>
                        </div>
                        <div className="energy-guage right">
                          <div className="energy-guage-bar" style={{ width: `${resultPageData.C}%` }}></div>
                        </div>
                        <div className="energy-guage-num-group">
                          <p className="energy-guage-num">100</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">0</p>
                          <p className="energy-guage-num">50</p>
                          <p className="energy-guage-num">100</p>
                        </div>
                      </div>
                      <div className="energy-result-top-title right">
                        <p className="title">포용적(C)</p>
                        <div className="num">{resultPageData.C}</div>
                      </div>
                    </div>
                    <div className="col-group gap40">
                      <div className="step-item border col-group gap24 half-div left">
                        <div className="step-item-num">S</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            체계적
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              계획을 세우고 계획대로 하는 것을 선호한다.
                            </p>
                            <p className="default-txt dot">
                              시간과 규칙을 잘 지키고 책임감 있다.
                            </p>
                            <p className="default-txt dot">
                              꼼꼼하고 신중하며 안정적인 환경을 좋아한다.
                            </p>
                            <p className="default-txt dot">
                              충동적으로 행동하지 않으며 행동하기 전에 심사숙고한다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="step-item border col-group gap24 half-div right">
                        <div className="step-item-num">C</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title">
                            포용적
                          </p>
                          <div className="row-group gap8">
                            <p className="default-txt dot">
                              융통성이 있으며 임기응변에 능하다.
                            </p>
                            <p className="default-txt dot">
                              상황에 따라 유연하게 일을 처리한다.
                            </p>
                            <p className="default-txt dot">
                              여러 가지 일을 동시에 하며, 뒷심이 있다.
                            </p>
                            <p className="default-txt dot">
                              자유분방하며 자신만의 규칙과 목표를 만들어간다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[18]}>
          <main className="main">
            <p className="page-num">17</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">04</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  에너지 역량 및 방향
                </h2>
                <p className="main-sub-title">
                  02. 에너지 유형 / 균형분포 정도
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    성격 유형적 특징
                  </h3>
                </div>
                <div className="row-group gap32">
                  <p className="default-title green">
                    {resultPageData.name}님의 성격 유형적 특징
                  </p>
                  <p className="default-txt">{PersonalityTypeText[PersonalityTypeValue]}</p>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    균형분포 정도
                  </h3>
                </div>
                <div className="row-group gap32">
                  <p className="default-title green">
                    {resultPageData.name}님의 균형분포 정도
                  </p>
                  <div className="row-group gap40">
                    <div className="col-group gap40">
                      <div className="green-border-box half-div">
                        <div className="balance-chart-wrap">
                          <div className={`balance-chart-bar ${resultPageData.W > resultPageData.D ? 'left' : resultPageData.W < resultPageData.D ? 'right' : 'center'}`}>
                            {/* 오른쪽 점수가 더 높으면 right/왼쪽 점수가 높으면 left/10점 내 차이일 경우 center */}
                          </div>
                          <img src={images.balance_core} alt="" className="balance-chart-core" />
                          <div className="balance-chart-group col-group">
                            <div className={`balance-chart ${resultPageData.W > resultPageData.D || resultPageData.W === resultPageData.D ? 'active' : ''}`}>
                              <div className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.W}% ), transparent calc( 100% - ${resultPageData.W}% ) 100% )` }} />
                              <div className="balance-chart-circle">
                                {resultPageData.W}
                              </div>
                              <p className="title">
                                폭넓은
                              </p>
                            </div>
                            <div className={`balance-chart ${resultPageData.W < resultPageData.D || resultPageData.W === resultPageData.D ? 'active' : ''}`}> {/* 점수가 더 높은 쪽에 active */}
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.D}% ), transparent calc( 100%  - ${resultPageData.D}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.D}
                              </div>
                              <p className="title">
                                깊이 있는
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="balance-chart-txt-wrap row-group gap16">
                          <p className="default-title">
                            에너지 방향 : {resultPageData.W > resultPageData.D ? '폭넓은' : '깊이있는'}
                          </p>
                          {resultPageData.W > resultPageData.D ? (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님은, 에너지의 방향이 <strong className="green">외부의 사람과 사물을 향하며 관계의 폭이 넓고 다양한 측면으로 {resultPageData.W}% 치우쳐져 있습니다.</strong> ‘깊이있는’ 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          ) : (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님은, 에너지의 방향이 <strong className="green">내부를 향하며 사람과 사물을 깊이 있게 대하고 평온한</strong> 측면으로 {resultPageData.D}% 치우쳐져 있습니다. ‘폭넓은’ 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="green-border-box half-div">
                        <div className="balance-chart-wrap">
                          <div className={`balance-chart-bar ${resultPageData.P > resultPageData.I ? 'left' : resultPageData.P < resultPageData.I ? 'right' : 'center'}`}>
                            {/* 오른쪽 점수가 더 높으면 right/왼쪽 점수가 높으면 left/10점 내 차이일 경우 center */}
                          </div>
                          <img src={images.balance_core} alt="" className="balance-chart-core" />
                          <div className="balance-chart-group col-group">
                            <div className={`balance-chart ${resultPageData.P > resultPageData.I || resultPageData.P === resultPageData.I ? 'active' : ''}`}> {/* 점수가 더 높은 쪽에 active */}
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.P}% ), transparent calc( 100%  - ${resultPageData.I}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.P}
                              </div>
                              <p className="title">
                                실용적
                              </p>
                            </div>
                            <div className={`balance-chart ${resultPageData.P < resultPageData.I || resultPageData.P === resultPageData.I ? 'active' : ''}`}>
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.I}% ), transparent calc( 100%  - ${resultPageData.I}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.I}
                              </div>
                              <p className="title">
                                통찰적
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="balance-chart-txt-wrap row-group gap16">
                          <p className="default-title">
                            정보 인식 체계 : {resultPageData.P > resultPageData.I ? '실용적' : '통찰적'}
                          </p>
                          {resultPageData.P > resultPageData.I ? (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님은, 정보의 인식체계가 <strong className="green">정보를 있는 그대로 정확하고 상세하게 처리하며 실용적이고 세부적으로 인식하는 측면으로 {resultPageData.P}% 치우쳐져 있습니다.</strong> ‘통찰적’인 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          ) : (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님은, 정보의 인식체계가 <strong className="green">정보를 상징적이고 비판적으로 처리하며 예리하게 관찰하여 꿰뚫어 인식하는 측면으로 {resultPageData.I}% 치우쳐져 있습니다.</strong> ‘실용적’인 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-group gap40">
                      <div className="green-border-box half-div">
                        <div className="balance-chart-wrap">
                          <div className={`balance-chart-bar ${resultPageData.L > resultPageData.M ? 'left' : resultPageData.L < resultPageData.M ? 'right' : 'center'}`}>
                            {/* 오른쪽 점수가 더 높으면 right/왼쪽 점수가 높으면 left/10점 내 차이일 경우 center */}
                          </div>
                          <img src={images.balance_core} alt="" className="balance-chart-core" />
                          <div className="balance-chart-group col-group">
                            <div className={`balance-chart ${resultPageData.L > resultPageData.M || resultPageData.L === resultPageData.M ? 'active' : ''}`}>
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.L}% ), transparent calc( 100%  - ${resultPageData.L}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.L}
                              </div>
                              <p className="title">
                                논리중심
                              </p>
                            </div>
                            <div className={`balance-chart ${resultPageData.L < resultPageData.M || resultPageData.L === resultPageData.M ? 'active' : ''}`}> {/* 점수가 더 높은 쪽에 active */}
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.M}% ), transparent calc( 100%  - ${resultPageData.M}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.M}
                              </div>
                              <p className="title">
                                의미중심
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="balance-chart-txt-wrap row-group gap16">
                          <p className="default-title">
                            의사결정 방식 : {resultPageData.L > resultPageData.M ? '논리 중심' : '의미 중심('}
                          </p>
                          {resultPageData.L > resultPageData.M ? (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님의 의사결정 방식은 <strong className="green">논리와 합리성을 따지며 명백한 사실을 중심으로 객관적 의사결정을 추구하는 측면으로 {resultPageData.L}% 치우쳐져 있습니다.</strong> ‘의미 중심’ 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          ) : (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님의 의사결정 방식은 <strong className="green">정서적 공감과 가치공유를 중심으로 감정적 의사결정을 추구하는 측면으로 {resultPageData.M}% 치우쳐져 있습니다.</strong> ‘논리 중심’ 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="green-border-box half-div">
                        <div className="balance-chart-wrap">
                          <div className={`balance-chart-bar ${resultPageData.S > resultPageData.C ? 'left' : resultPageData.S < resultPageData.C ? 'right' : 'center'}`}>
                            {/* 오른쪽 점수가 더 높으면 right/왼쪽 점수가 높으면 left/10점 내 차이일 경우 center */}
                          </div>
                          <img src={images.balance_core} alt="" className="balance-chart-core" />
                          <div className="balance-chart-group col-group">
                            <div className={`balance-chart ${resultPageData.S > resultPageData.C || resultPageData.S === resultPageData.C ? 'active' : ''}`}> {/* 점수가 더 높은 쪽에 active */}
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.S}% ), transparent calc( 100%  - ${resultPageData.S}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.S}
                              </div>
                              <p className="title">
                                체계적
                              </p>
                            </div>
                            <div className={`balance-chart ${resultPageData.S < resultPageData.C || resultPageData.S === resultPageData.C ? 'active' : ''}`}>
                              <div
                                className="balance-chart-gauge"
                                style={{ background: `conic-gradient(#eeeeee 0% calc( 100% - ${resultPageData.C}% ), transparent calc( 100%  - ${resultPageData.C}% ) 100%)` }}
                              />
                              <div className="balance-chart-circle">
                                {resultPageData.C}
                              </div>
                              <p className="title">
                                포용적
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="balance-chart-txt-wrap row-group gap16">
                          <p className="default-title">
                            생활 양식 : {resultPageData.S > resultPageData.C ? '체계적' : '포용적'}
                          </p>
                          {resultPageData.S > resultPageData.C ? (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님의 생활양식은 <strong className="green">계획적이고 규칙적이며 효율을 중심으로 체계적인 측면으로 {resultPageData.S}% 치우쳐져 있습니다.</strong> ‘포용적’인 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          ) : (
                            <p className="default-txt default-txt-s">
                              {resultPageData.name}님의 생활양식은 <strong className="green">유연하고 개방적이며 새로움에 열린 태도로 포용적인 측면으로 {resultPageData.C}% 치우쳐져 있습니다.</strong> ‘체계적’인 형태로의 의식적인 노력이 필요합니다.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common page-19' ref={printPageRefs[19]}>
          <main className="main">
            <p className="page-num">18</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">04</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  에너지 역량 및 방향
                </h2>
                <p className="main-sub-title">
                  03. 에너지 방향에 따른 유형과 기질적 특성
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    에너지 방향에 따른 유형과 기질적 특성
                  </h3>
                </div>
                <div className="col-group gap40">
                  <div className="half-div row-group gap32">
                    <p className="default-title green">
                      실용적이면서 포용력 있는 PC
                    </p>
                    <div className="step-item-list border">
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DPLC' ? 'active' : ''}`}>
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DPLC 체험형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              조용하며 상황을 예리하게 관찰한다.
                            </p>
                            <p className="default-txt dot">
                              차가운 인상이지만 알고 나면 따뜻하다.
                            </p>
                            <p className="default-txt dot">
                              상황판단이 빠르고 논리적이다.
                            </p>
                            <p className="default-txt dot">
                              계획을 잘 세우지만 결과물에 연연하지 않는다.
                            </p>
                            <p className="default-txt dot">
                              방법과 이유에 관심이 많다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DPMC' ? 'active' : ''}`}>
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DPMC 인내형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              섬세하고 예술적 감각이 발달했다.
                            </p>
                            <p className="default-txt dot">
                              자유롭고 모험적이다.
                            </p>
                            <p className="default-txt dot">
                              주변에 사람은 많지만 쉽게 외로움과 고독을 느낀다.
                            </p>
                            <p className="default-txt dot">
                              생각은 많지만 추진력이 부족하다.
                            </p>
                            <p className="default-txt dot">
                              아군과 적군을 구분하지 못한다.
                            </p>
                            <p className="default-txt dot">
                              타인을 잘 이해하는 편이지만 분위기에 휩쓸리는 경향이 있다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WPLC' ? 'active' : ''}`}>
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WPLC 열정형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              남과 다르게 표현한다.
                            </p>
                            <p className="default-txt dot">
                              다양한 분야에 관심을 가진다.
                            </p>
                            <p className="default-txt dot">
                              모임이나 회의를 할 때 주도한다.
                            </p>
                            <p className="default-txt dot">
                              구속되기 싫어하고 자유로운 것을 좋아하며
                              미래 지향적이다.
                            </p>
                            <p className="default-txt dot">
                              매사에 밝고 긍정적이며 표정이 밝다.
                            </p>
                            <p className="default-txt dot">
                              감성이 풍부하고 열정적이다.
                            </p>
                            <p className="default-txt dot">
                              자극적인 일을 즐긴다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WPMC' ? 'active' : ''}`}>
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WPMC 낙천형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              작은 일에도 감동한다.
                            </p>
                            <p className="default-txt dot">
                              삶 자체를 즐기고 행복하며 낙천적이다.
                            </p>
                            <p className="default-txt dot">
                              다른 사람을 잘 도와준다.
                            </p>
                            <p className="default-txt dot">
                              일을 끝까지 미루지만 중요한 일은 즉시 처리한다.
                            </p>
                            <p className="default-txt dot">
                              주목받는 것을 즐긴다.
                            </p>
                            <p className="default-txt dot">
                              쉽게 흥분하고 감동하며 열정이 넘친다.
                            </p>
                            <p className="default-txt dot">
                              털털하다는 소리를 많이 듣고, 쉽게 거절하지 못한다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="half-div row-group gap32">
                    <p className="default-title green">
                      의미를 생각하며 통찰하는 IM
                    </p>
                    <div className="step-item-list border">
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DIMC' ? 'active' : ''}`}>
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DIMC 개성형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              조화로운 관계를 중시한다.
                            </p>
                            <p className="default-txt dot">
                              내면세계에 관심이 많다.
                            </p>
                            <p className="default-txt dot">
                              조용하며 성실하고 책임감이 강하다.
                            </p>
                            <p className="default-txt dot">
                              지향하는 바에 대한 신념이 강하다.
                            </p>
                            <p className="default-txt dot">
                              대체로 관대하고 개방적이다.
                            </p>
                            <p className="default-txt dot">
                              자신과 타인의 감정을 잘 파악하지만 속마음을 잘 표현하지 않는다.
                            </p>
                            <p className="default-txt dot">
                              반복되는 일에는 쉽게 지루함을 느낀다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DIMS' ? 'active' : ''}`}>
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DIMS 고뇌형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              자기 안에 갈등이 많고 복잡하다.
                            </p>
                            <p className="default-txt dot">
                              완벽주의 성향이 있어서 종종 예민하다.
                            </p>
                            <p className="default-txt dot">
                              행동하기 전에 시뮬레이션을 반복한다.
                            </p>
                            <p className="default-txt dot">
                              관심받는 것은 좋아하지만 나서는 것을 싫어한다.
                            </p>
                            <p className="default-txt dot">
                              비유로 표현하고 추상적으로 생각한다.
                            </p>
                            <p className="default-txt dot">
                              사람의 실존에 대해서 고민하며, 때론 현실감각이 부족하고 이상을 추구한다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WIMC' ? 'active' : ''}`}>
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WIMC 재미형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              계획을 세우기보다 자신의 방식대로 일을 처리한다.
                            </p>
                            <p className="default-txt dot">
                              창의적이고 기발한 아이디어를 잘 낸다.
                            </p>
                            <p className="default-txt dot">
                              돌발상황에 대처하는 능력이 강하다.
                            </p>
                            <p className="default-txt dot">
                              상처받은 사람을 위로한다.
                            </p>
                            <p className="default-txt dot">
                              감정기복이 겉으로 드러난다.
                            </p>
                            <p className="default-txt dot">
                              정서적, 인지적 공감능력이 뛰어나다.
                            </p>
                            <p className="default-txt dot">
                              느긋하게 기다려 주기보다, 먼저 말을 하거나
                              주도해 나가는 편이다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WIMS' ? 'active' : ''}`}>
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WIMS 격려형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              비전을 제시하고, 책임감이 있다.
                            </p>
                            <p className="default-txt dot">
                              제안은 많이하지만 실천이 약하고 현실적인
                              부분에 약하다.
                            </p>
                            <p className="default-txt dot">
                              사람을 좋아하고 다정하다.
                            </p>
                            <p className="default-txt dot">
                              신념이 강하고, 상황을 통찰하는 능력이 있다.
                            </p>
                            <p className="default-txt dot">
                              가치중심적인 일을 좋아하며 좋은 영향력을
                              해아하고 싶어한다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common page-20' ref={printPageRefs[20]}>
          <main className="main">
            <p className="page-num">19</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="col-group gap40">
                  <div className="half-div row-group gap32">
                    <p className="default-title green">
                      체계적이면서 현실적인 PS
                    </p>
                    <div className="step-item-list border">
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WPLS' ? 'active' : ''}`}>
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WPLS 성과형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              주로 행정, 총무, 회계업무를 맡는다.
                            </p>
                            <p className="default-txt dot">
                              주변 사람들에게 입바른 소리를 한다.
                            </p>
                            <p className="default-txt dot">
                              대인관계가 폭넓고 오지랖이 넓다.
                            </p>
                            <p className="default-txt dot">
                              계획 후 실행하며 치밀하고 정확하다.
                            </p>
                            <p className="default-txt dot">
                              솔직하고 직설적이며 뒤끝이 없다.
                            </p>
                            <p className="default-txt dot">
                              규칙적이고 결단력이 있다.
                            </p>
                            <p className="default-txt dot">
                              남들을 잘 챙기고 보살펴준다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WPMS' ? 'active' : ''}`}>
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WPMS 사교형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              성격이 활발하며 말하는 것을 좋아한다.
                            </p>
                            <p className="default-txt dot">
                              자신감이 넘치고, 문제를 스스로 해결하려 한다.
                            </p>
                            <p className="default-txt dot">
                              관계는 다양하고 원만하지만, 깊은 속마음을
                              털어놓는 상대는 극소수다.
                            </p>
                            <p className="default-txt dot">
                              주변 환경의 영향을 많이 받는다.
                            </p>
                            <p className="default-txt dot">
                              헌신적으로 남을 도우면서 인정받는 것을 좋아한다.
                            </p>
                            <p className="default-txt dot">
                              옳고 그름을 명확하게 구분하고 전통적인
                              가치관을 선호한다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DPLS' ? 'active' : ''}`}>
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DPLS 안정형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              성실하고,근면하며 책임감이 강하다.
                            </p>
                            <p className="default-txt dot">
                              진지하고 전통적이며 조직을 지킨다.
                            </p>
                            <p className="default-txt dot">
                              과업 중심적이며 허튼소리를 않는다.
                            </p>
                            <p className="default-txt dot">
                              약속을 잘 지키며 최선을 다한다.
                            </p>
                            <p className="default-txt dot">
                              정서적 표현을 많이 하지 않는다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DPMS' ? 'active' : ''}`}>
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DPMS 양육형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              배려심이 많아 대인관계가 원만하다.
                            </p>
                            <p className="default-txt dot">
                              생각이 많고 신중하다.
                            </p>
                            <p className="default-txt dot">
                              겸손과 예의를 중시한다.
                            </p>
                            <p className="default-txt dot">
                              유행을 따르지 않는다.
                            </p>
                            <p className="default-txt dot">
                              참을성이 강하며 뒷심이 강하다.
                            </p>
                            <p className="default-txt dot">
                              싫은 소리를 잘 못한다.
                            </p>
                            <p className="default-txt dot">
                              결정을 잘 못하지만 주관은 뚜렷하다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="half-div row-group gap32">
                    <p className="default-title green">
                      유능하면서 통찰력있는 IL
                    </p>
                    <div className="step-item-list border">
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WILC' ? 'active' : ''}`}>
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WILC 표현형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              감정에 솔직하고 표현을 잘한다.
                            </p>
                            <p className="default-txt dot">
                              에너지가 넘치고 활동 범위가 넓다.
                            </p>
                            <p className="default-txt dot">
                              두뇌회전이 빠르고, 사람이나 조직의 문제점을
                              쉽게 해결한다.
                            </p>
                            <p className="default-txt dot">
                              처음 보는 사람과도 쉽게 대화한다.
                            </p>
                            <p className="default-txt dot">
                              추진력과 실행력이 높고, 임기응변에 강해서 일의 성공 가능성도 높다.
                            </p>
                            <p className="default-txt dot">
                              위험을 감수하며 새로운 시도를 한다.
                            </p>
                            <p className="default-txt dot">
                              직설적이며, 이유를 잘 묻는다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'WILS' ? 'active' : ''}`}>
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            WILS 체계형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              관계의 폭이 넓고 리더 역할을 한다.
                            </p>
                            <p className="default-txt dot">
                              객관적 사실 중심으로 대안을 제시한다.
                            </p>
                            <p className="default-txt dot">
                              열정적이고 완벽을 추구한다.
                            </p>
                            <p className="default-txt dot">
                              갈등 상황에서 감정보다는 논리적으로 해결한다.
                            </p>
                            <p className="default-txt dot">
                              스스로 해냈을 때 성취감이 높다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DILC' ? 'active' : ''}`}>
                        <div className="step-item-num">03</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DILC 독립형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              아이디어가 많아서 머릿속이 복잡하다.
                            </p>
                            <p className="default-txt dot">
                              관심사가 매우 분명하다.
                            </p>
                            <p className="default-txt dot">
                              논리중심적이며 주관이 뚜렷하다.
                            </p>
                            <p className="default-txt dot">
                              최소한의 노력으로 최대의 이익을 추구하므로 일의 효율성이 높다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`step-item border-dash col-group gap24 ${PersonalityTypeValue === 'DILS' ? 'active' : ''}`}>
                        <div className="step-item-num">04</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            DILS 효율형
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt dot">
                              책임감이 강하고 모범생이라는 평가를 받는다.
                            </p>
                            <p className="default-txt dot">
                              헌신적이며 신뢰를 받는다.
                            </p>
                            <p className="default-txt dot">
                              전략적인 사고와 냉철한 논리력으로 문제를 해결한다.
                            </p>
                            <p className="default-txt dot">
                              일을 체계적이고 효율적으로 처리한다.
                            </p>
                            <p className="default-txt dot">
                              논리중심적인 사고에 익숙해 정서적 공감이 어렵다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[21]}>
          <main className="main">
            <p className="page-num">20</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">05</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  힘의 균형과 날개
                </h2>
                <p className="main-sub-title">
                  01. 힘의 균형 결과 / 성장을 위한 질문
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    힘의 균형
                  </h3>
                </div>
                <p className="default-txt default-txt-l">
                  <strong className="green">우리가 삶을 살아나가는데 필요한 에너지를 얻는 원천</strong>을 말합니다. 힘의 중심은 우리의 신체 기관 가운데 대표적으로 <strong className="green">‘머리’, ‘가슴(심장)’, ‘장’</strong>과 깊은 관련이 있으며 <strong className="green">어디를 중심에 두느냐에 따라 문제를 해결하는 방식이 달라집니다.</strong> <br />
                  보편적으로 머리형은 ‘사고’에, 가슴(심장)형은 ‘감정’에, 장형은 ‘본능’에 기초하여 그 기능을 주로 사용합니다. <br />
                  자신의 에너지가 시작되는 지점을 알게 된다는 것은 인생을 살아가면서 만나게 되는 수많은 문제 상황에서 그 해결방식의 흐름을 파악하는 실마리가 될 수 있습니다.
                </p>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    3가지 힘의 중심
                  </h3>
                </div>
                <div className="row-group gap56">
                  <img src={images.balance_of_power} alt="" />
                  <div className="col-group gap40 relative">
                    <div className="icon-arrow-wrap">
                      <div className="icon-arrow-both">
                        <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-left" />
                        <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-right" />
                      </div>
                      <div className="icon-arrow-both">
                        <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-left" />
                        <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-right" />
                      </div>
                    </div>
                    <div className="green-border-box row-group gap24">

                      <p className="default-title green">
                        머리 중심(5, 6 ,7번 유형)
                      </p>
                      <div className="row-group gap4">
                        <p className="default-txt default-txt-s dot">
                          힘의 원천 : 사고(Thinking)
                        </p>
                        <p className="default-txt default-txt-s dot">
                          내부감정 : 두려움
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관계양식 : 일정한 거리를 유지함
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관심과 의사결정 : 논리, 정보, 근거 등에 의한 객관적 의사결정
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관심주제 : 상황파악, 신념과 전략
                        </p>
                        <p className="default-txt default-txt-s dot">
                          발달기관 : 시각
                        </p>
                        <p className="default-txt default-txt-s dot">
                          선호하는 일 : 연구
                        </p>
                        <p className="default-txt default-txt-s dot">
                          추구 : 안전
                        </p>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap24">
                      <p className="default-title green">
                        가슴 중심(2, 3, 4번 유형)
                      </p>
                      <div className="row-group gap4">
                        <p className="default-txt default-txt-s dot">
                          힘의 원천 : 감정(emotion)
                        </p>
                        <p className="default-txt default-txt-s dot">
                          내부감정 : 수치심, 불안
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관계양식 : 친밀감을 확인, 표현함
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관심과 의사결정 : 정서적인 관계에 따라 의사결정
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관심주제 : 사람, 자아와 사랑
                        </p>
                        <p className="default-txt default-txt-s dot">
                          발달기관 : 촉각, 미각
                        </p>
                        <p className="default-txt default-txt-s dot">
                          선호하는 일 : 봉사, 서비스
                        </p>
                        <p className="default-txt default-txt-s dot">
                          추구 : 이해와 공감
                        </p>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap24">
                      <p className="default-title green">
                        장 중심(8, 9, 1번 유형)
                      </p>
                      <div className="row-group gap4">
                        <p className="default-txt default-txt-s dot">
                          힘의 원천 : 행동(behavior)
                        </p>
                        <p className="default-txt default-txt-s dot">
                          내부감정 : 분노
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관계양식 : 책임과 의무, 의리를 중시
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관심과 의사결정 : 규율과 정도에 맞는 도덕적 의사결정
                        </p>
                        <p className="default-txt default-txt-s dot">
                          관심주제 : 의지와 힘, 저항과 통제
                        </p>
                        <p className="default-txt default-txt-s dot">
                          발달기관 : 청각, 후각
                        </p>
                        <p className="default-txt default-txt-s dot">
                          선호하는 일 : 지도, 리더
                        </p>
                        <p className="default-txt default-txt-s dot">
                          추구 : 독립성
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[22]}>
          <main className="main">
            <p className="page-num">21</p>

            <div className="section-wrap row-group">
              {resultPageData.power_num === 1
                ? (<div className="section">
                  <div className="section-title-wrap col-group">
                    <div className="num">3</div>
                    <h3 className="section-title">
                      {resultPageData.name}님은 {resultPageData.power_num} [완벽을 추구하는 올곧은 사람], 장(본능) 중심입니다.
                    </h3>
                  </div>
                  <div className="row-group gap32">
                    <div className="step-item-list border">
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            특징
                          </p>
                          <div className="row-group gap32">
                            <p className="default-txt default-txt-s">
                              매사에 완벽함을 추구하며 완전무결하게 해내기 위해 노력하고, 주위에도 그렇게 하기를 요구하고 기대합니다. 자신이 수행한 행동에 대해 완벽함의 정도를 평가하는 내적 기준을 가지고 맞추려 노력합니다. 다른 사람에 대해 매우 비판적이며 자신의 주장대로 고집하려는 성향이 있습니다. 근면하고 성실한 자세로 일하고 일을 정확히 처리하는 편입니다. 시간을 건설적으로 이용합니다. 인상이 깔끔하고 항상 말과 행동을 자제하며 '~해야 한다'는 말을 자주 합니다. 자신은 '올바른 길을 걷고 있다', '매사를 정확하게 파악하고 있다'는 생각에 만족감을 느낍니다.
                            </p>
                          </div>
                          <div className="col-group gap40">
                            <div className="half-div row-group gap4">
                              <p className="default-txt default-txt-s dot">
                                이상적이고 원칙적입니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                정리정돈을 잘하고 부지런합니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                근면 성실하고 일을 정확하게 처리하여 신뢰를 얻습니다.
                              </p>
                            </div>
                            <div className="half-div row-group gap4">
                              <p className="default-txt default-txt-s dot">
                                말과 행동에 일관성이 있는 정직한 사람입니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                양심적이고 공정하며, 개인적인 이득 때문에 일하지 않습니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                세상에 대한 개선의 의지가 강하며 윤리 도덕적입니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-dash col-group gap40">
                        <div className="step-item col-group gap24 half-div">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              원동력
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s dot">
                                자원봉사와 소외된 이웃 돕기
                              </p>
                              <p className="default-txt default-txt-s dot">
                                문제에 대한 올바른 해결 방안 제시
                              </p>
                              <p className="default-txt default-txt-s dot">
                                타인을 포함한 개인의 성장
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="step-item col-group gap24 half-div">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              적성
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s">
                                가르치거나 분석하는 일 또는 정확성이 요구되는 분야 - 교사, 의사, 성직자, 품질관리, 반도체, 회계사, 전문직 종사자
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-dash col-group gap40">
                        <div className="step-item col-group gap24 half-div">
                          <div className="step-item-num">04</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              장점
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s dot">
                                매우 높은 도덕적 성향과 정직함을 지니고 있습니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                이상주의적이고 낙관적인 세계관을 가집니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                개인적인 가치에 대해 깊은 동기 부여를 합니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                커뮤니티에 연결하고 돌볼 수 있는 능력이 있습니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                개선하고 변화시키는 방법을 찾는 능력이 있습니다.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="step-item col-group gap24 half-div">
                          <div className="step-item-num">05</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              단점
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s dot">
                                자신과 타인 모두에게 비판적인 성향이 있습니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                완벽주의 성향이 타인을 힘들게 할 수 있습니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                어려운 현실을 쉽게 받아들이지 못합니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                강박관념에 사로잡히거나 독선적일 가능성이 있습니다.
                              </p>
                              <p className="default-txt default-txt-s dot">
                                타인의 무능력에 쉽게 화가 납니다.
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">06</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            회피하는 것 - 분노
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt default-txt-s">
                              분노는 숨겨져 있고 억제되어 있습니다. 이 유형이 스스로 만들어 놓은 이상화 된 이미지는 ‘나는 항상 모범을 보여야 한다’, ‘나는 공정하다’, ‘나는 착하다’입니다. 이로 인해 자신을 화를 내서는 안 된다고 감정을 억제합니다. 만약, 분노를 억제할 수 없다면 그 분노를 합리화하여 당시 상황은 자신이 화를 낼 수밖에 없는 상황이었음을 증명하려고 합니다. 분노의 책임이 자신에게 돌아오는 것을 회피합니다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">07</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            성장의 포인트 (전환 방법)
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt default-txt-s">
                              전환해야 할 부분은 비판적이고 일방적인 습관들입니다. 살아가는 동안 우리는 완벽할 수 없으며 어떤 것도 완벽할 수 없음을 깨닫고 내가 처한 현실과 나 자신을 인정해야 합니다.
                              자신의 경계를 늦추고 발전을 위한 끊임없는 욕망을 쉬게 해줄 필요가 있습니다.
                              무엇보다도 나 자신을 용납하고 완벽에 대한 집착을 인정하며 판단하고 비평하는 삶의 자세를 변화시킬 필요가 있습니다.
                              동시에, 항상 틀린 점에 주목하는 나의 태도는 어떤 상황에서도 발전을 꾀할 수 있는 직관적인 본능과 정확하고 예민한 비판력으로 발전될 수 있음을 기억하는 것이 좋습니다.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">08</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            성장을 위한 질문 던지기
                          </p>
                          <div className="row-group gap4">
                            <p className="default-txt default-txt-s green default-txt-bold dot">
                              완벽을 추구하며 올곧게 살아온 당신. 열심히 노력하느라 내면의 목소리에는 소홀하지 않았나요? 지금 당신의 내면에 귀 기울여보세요. 어떤 목소리가 들려오고 있나요?
                            </p>
                            <p className="default-txt default-txt-s green default-txt-bold dot">
                              지금까지 걸어온 길을 되돌아보며, 스스로에게 어떤 말을 해주고 싶은가요?
                            </p>
                            <p className="default-txt default-txt-s green default-txt-bold dot">
                              당신이 정해놓은 기준과 규칙은 무엇인가요? 그 기준을 벗어난다면 어떤 일이 벌어질까요?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)
                : resultPageData.power_num === 2
                  ? (<div className="section">
                    <div className="section-title-wrap col-group">
                      <div className="num">3</div>
                      <h3 className="section-title">
                        {resultPageData.name}님은 {resultPageData.power_num} [친절한 조력가], 가슴(감정) 중심입니다.
                      </h3>
                    </div>
                    <div className="row-group gap32">
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              특징
                            </p>
                            <div className="row-group gap32">
                              <p className="default-txt default-txt-s">
                                정이 많고 어려움에 처한 사람들에게 도움의 손길을 내밀며 주변 사람들에게 도움이 되는 일을 마다하지 않습니다. 타인이 필요로 하는 것에 몰두하지만 타인의 도움을 필요로 하고 있는 자신에 대해서는 자각하지 못합니다. 상대의 욕구를 충족시켜 주는 것 자체가 본래의 목적은 아니며 타인으로부터 애정과 호감을 받길 원합니다. 이러한 행동의 바탕에는 타인이 자신을 인정해 주기를 바라는 마음과 보답을 받고 싶은 욕구가 있습니다. 예리한 직감을 갖고 있고 주위 사람들의 기분을 이해하기 때문에 적응력이 뛰어납니다. 또한, 다양한 자기 모습을 갖고 있어 상대방에 따라 다른 모습을 연출할 수 있습니다.
                              </p>
                            </div>
                            <div className="col-group gap40">
                              <div className="half-div row-group gap4">
                                <p className="default-txt default-txt-s dot">
                                  사람과의 정서적인 교류를 잘하고 자기를 희생할 줄 압니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  공감을 잘하고 모성적인 성향이 강하여 타인의 기분을
                                  맞추려고 노력합니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  부탁을 받으면 거절하지 못하고 부탁하지 않은 일도
                                  앞장서 도와줍니다.
                                </p>
                              </div>
                              <div className="half-div row-group gap4">
                                <p className="default-txt default-txt-s dot">
                                  베푼 만큼 그것에 상응하는 감사를 받고 싶어합니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  타인중심이며 감정이 과할 때가 있습니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  모든 친구들에게 특별히 중요한 사람이 되기를 바랍니다.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-dash col-group gap40">
                          <div className="step-item col-group gap24 half-div">
                            <div className="step-item-num">02</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                원동력
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s dot">
                                  사랑하고 사랑받는 일
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  감정표현
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  감사와 보상
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  반응과 인정
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="step-item col-group gap24 half-div">
                            <div className="step-item-num">03</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                적성
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s">
                                  공감하고 도움을 주는 일 또는 정서적 지지가 요구되는 분야
                                  간호사, 사회복지사, 상담가, 가이드 등
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-dash col-group gap40">
                          <div className="step-item col-group gap24 half-div">
                            <div className="step-item-num">04</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                장점
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s dot">
                                  따뜻한 도움의 손길을 자주 내밉니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  공감을 잘하고 눈치가 빠릅니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  사람들 사이를 연결하는 다리 역할을 합니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  친절하고 상냥합니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  칭찬과 격려를 잘합니다.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="step-item col-group gap24 half-div">
                            <div className="step-item-num">05</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                단점
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s dot">
                                  남을 잘 보살피지만 소유하려는 경향이 있습니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  감정이 과하며 신경질적인 면이 있습니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  시선이 주로 타인과 외부를 향해 있습니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  은근히 불평하고 요구가 많습니다.
                                </p>
                                <p className="default-txt default-txt-s dot">
                                  대항해서 맞서지는 않으나 간섭합니다.
                                </p>
                              </div>
                            </div>
                          </div>

                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">06</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              회피하는 것 - 나에게 필요한 점에 대한 인식
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s">
                                남들에게 필요한 것에 대해 매우 잘 알고 있지만, 정작 자신을 도와달라고 요청하지 못하며 도움을 받는데에 불편함을 느낍니다. 내가 주는 사랑은 철저하게 일방적입니다. 나에게 필요한 것을 간접적으로 표현하거나 내가 말하기 전에 남들이 알아서 걱정해주기를 바랍니다. 심하면 일종의 메시아 콤플렉스를 가진 사람이 됩니다. 사람들에게 나의 도움이 필요하지만, 내가 줄 수 있는 도움에는 한계가 있다는 점을 인정하지 못할 수 있습니다.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">07</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              성장의 포인트 (전환 방법)
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s">
                                내가 주는 사랑과 도움이 얼마나 일방적인지 그것이 얼마나 잘못되어 있는 것인지 인식하는 데서 출발합니다. 나는 남들의 도움을 거리낌 없이 받을 수 있고 그것에 대해 불편함을 느끼지 않아야 합니다. 남에게 도움을 줌으로 인해 느꼈던 자부심에서부터 벗어나야 하고 나도 도움이 필요한 부분이 있음을 인정해야 합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">08</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              성장을 위한 질문 던지기
                            </p>
                            <div className="row-group gap4">
                              <p className="default-txt default-txt-s green default-txt-bold dot">
                                정이 많고 따뜻한 마음을 가진 당신. 다른 사람을 돌보느라 정작 자신에게 소홀하지는 않은가요? 앞으로 누구보다 먼저
                                당신 자신을 잘 돌보기 위해서는 무엇을 해야 할까요?
                              </p>
                              <p className="default-txt default-txt-s green default-txt-bold dot">
                                당신에게 다른 사람의 애정과 인정이 중요한 이유는 무엇인가요?
                              </p>
                              <p className="default-txt default-txt-s green default-txt-bold dot">
                                정말 상대방을 위한 일은 어떤 것일까요? 구체적으로 떠올려보세요.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)
                  : resultPageData.power_num === 3
                    ? (<div className="section">
                      <div className="section-title-wrap col-group">
                        <div className="num">3</div>
                        <h3 className="section-title">
                          {resultPageData.name}님은 {resultPageData.power_num} [성공을 향해가는 열정적 야심가], 가슴(감정) 중심입니다.
                        </h3>
                      </div>
                      <div className="row-group gap32">
                        <div className="step-item-list border">
                          <div className="step-item border-dash col-group gap24">
                            <div className="step-item-num">01</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                특징
                              </p>
                              <div className="row-group gap32">
                                <p className="default-txt default-txt-s">
                                  효율을 중시하며 성공을 향해 매진하고, 침체에 빠지는 것을 두려워 합니다. 자부심이 강하면서도 꺾이기 쉬운 면이 있습니다. 실패를 극도로 두려워해 실패할 가능성이 있는 일에는 관여하려 들지 않습니다. 실적이나 지위를 잃어버리면 자존심이 무너지기 쉬워 성공에 걸림돌이 되는 무능력한 사람이나 비생산적인 사람을 싫어합니다. 또한, 팀원이나 주위 사람들을 자기 뜻대로 움직이려 합니다.
                                </p>
                              </div>
                              <div className="col-group gap40">
                                <div className="half-div row-group gap4">
                                  <p className="default-txt default-txt-s dot">
                                    부지런하고 낙관적이며 상황에 따라 유연하게 대처합니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    카리스마 있고 문제를 쉽게 해결하며 훌륭한 동기유발자 역할을 합니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    열정적이고 유능하며 경쟁에 강한 모습을 보입니다.
                                  </p>
                                </div>
                                <div className="half-div row-group gap4">
                                  <p className="default-txt default-txt-s dot">
                                    목표를 가지고 성취하는 것을 좋아하며, 효율성을 강조하는 경향이 있습니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    자기 확신이 있고, 자기 관리를 잘하며 기회를 잘 포착합니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="border-dash col-group gap40">
                            <div className="step-item col-group gap24 half-div">
                              <div className="step-item-num">02</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  원동력
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s dot">
                                    성공, 인정받고 있다는 느낌
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    실패에 대한 두려움
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    개인 개발과 결과적 보상
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    목표 설정과 달성을 통한 만족감
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="step-item col-group gap24 half-div">
                              <div className="step-item-num">03</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  적성
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s">
                                    달성목표와 성과가 구체적으로 드러나는 분야 - 배우, 홈쇼핑, 영업, 대중강연 등
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="border-dash col-group gap40">
                            <div className="step-item col-group gap24 half-div">
                              <div className="step-item-num">04</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  장점
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s dot">
                                    성취를 위한 추진 능력이 있습니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    주변 사람들을 향한 격려와 동기부여가 탁월합니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    타인을 이해하며 소통하는 능력이 있습니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    자신감 넘치는 성향으로 카리스마가 있습니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    실용적으로 생각하며 효율적으로 업무를 처리합니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="step-item col-group gap24 half-div">
                              <div className="step-item-num">05</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  단점
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s dot">
                                    타인이 자신을 보는 이미지에 지나치게 집중합니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    목표를 달성하지 못할 때 받아들이기 어려워합니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    지나친 경쟁 심리를 보일 때가 있습니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    감정을 무시하고 과하게 활동할 때가 있습니다.
                                  </p>
                                  <p className="default-txt default-txt-s dot">
                                    자기 과시적이며 정치적으로 보일 때가 있습니다.
                                  </p>
                                </div>
                              </div>
                            </div>

                          </div>
                          <div className="step-item border-dash col-group gap24">
                            <div className="step-item-num">06</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                회피하는 것 - 실패
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s">
                                  실패의 경험이 있으면 그것을 숨기고, 부인하는 경향이 있습니다. 자신이 하는 일에 따라 스스로를 강하게 정의했다는 것은 어떤 일에서의 실패를 ‘나의 실패’로 인식한다는 의미를 지닙니다. 자신에게는 성공 외에는 선택이 없기 때문에 과거의 성공은 기억하지만 실패의 기억은 거의 지니지 않습니다. 어떠한 실패라도 부분적으로는 성공이라고 기억합니다.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="step-item border-dash col-group gap24">
                            <div className="step-item-num">07</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                성장의 포인트 (전환 방법)
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s">
                                  전환은 자신이 스스로에게 주어진 좋은 것들을 어떤 방법으로 왜곡했는지 구체적으로 파악하는 것에서 시작합니다. 우선, 내가 이상화해 놓은 나의 모습은 모두 실제 나의 모습이 아니라는 점을 인식해야 합니다. 이를 위해서는 자신이 스스로에 대해 만들어 놓은 이미지보다 실제 자신은 더 좋은 사람이 될 수 있는 잠재력이 있음을 아는 것이 중요합니다. 이는 바로 자신의 실패들을 인정하는 것으로, 어떤 방법을 사용해서라도 성공하려는 목마름으로부터의 탈출을 의미합니다. 가장 중요한 점은, 나는 내가 하는 일 때문에 사랑받는 것이 아니라 ‘내가 바로 나 자신이기 때문에’ 사랑받는다는 점을 기억하는 것입니다.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="step-item border-dash col-group gap24">
                            <div className="step-item-num">08</div>
                            <div className="step-item-txt-wrap row-group gap16">
                              <p className="default-title green">
                                성장을 위한 질문 던지기
                              </p>
                              <div className="row-group gap4">
                                <p className="default-txt default-txt-s green default-txt-bold dot">
                                  성공을 향해 열정적으로 달리는 당신. 당신에게 성공이란 어떤 의미인가요?
                                </p>
                                <p className="default-txt default-txt-s green default-txt-bold dot">
                                  당신은 실패를 무척 두려워합니다. 만약, 어떤 일에 실패한다면 자신이 어떻게 느껴질 것 같은가요?
                                </p>
                                <p className="default-txt default-txt-s green default-txt-bold dot">
                                  다른 사람이 보는 자신의 이미지가 아닌, 당신은 자신을 어떤 사람이라고 생각하나요?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)
                    : resultPageData.power_num === 4
                      ? (<div className="section">
                        <div className="section-title-wrap col-group">
                          <div className="num">3</div>
                          <h3 className="section-title">
                            {resultPageData.name}님은 {resultPageData.power_num} [특별함을 지향하는 예술가], 가슴(감정) 중심입니다.
                          </h3>
                        </div>
                        <div className="row-group gap32">
                          <div className="step-item-list border">
                            <div className="step-item border-dash col-group gap24">
                              <div className="step-item-num">01</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  특징
                                </p>
                                <div className="row-group gap32">
                                  <p className="default-txt default-txt-s">
                                    자신의 개성을 표현하고자 합니다. 아름다운 세상을 창출하려고 하며, 어떤 감정이나 느낌을 유지하려고 합니다. 자신의 이미지를 보호하기 위해 현실에서 물러나 있고 자신의 감정적 욕구를 먼저 다루고자 하는 경향이 있습니다. 자신은 특별한 사람이라고 자부하고 있으며 무엇보다도 감동을 중시하고 평범함을 싫어합니다. 다른 사람들보다 슬픔이나 고독 등도 진하게 느끼며 타인에 대한 이해심이 많고 사람들을 격려하는 것을 좋아합니다. 겉으로 드러난 것보다는 그 속에 숨어있는 의미를 탐색하여 관심 분야에 지극히 몰두하는 경향이 있습니다.
                                  </p>
                                </div>
                                <div className="col-group gap40">
                                  <div className="half-div row-group gap4">
                                    <p className="default-txt default-txt-s dot">
                                      자신의 감정을 예술로 표현합니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      민감하고 직관적이며 독창적입니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      즉흥적이며 감정이 들쑥날쑥하여 지나치게 예민할 때가 있습니다.
                                    </p>
                                  </div>
                                  <div className="half-div row-group gap4">
                                    <p className="default-txt default-txt-s dot">
                                      관심을 요구하며 소유욕이 강합니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      자신의 감정의 깊이를 과장하려는 경향이 있습니다.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-dash col-group gap40">
                              <div className="step-item col-group gap24 half-div">
                                <div className="step-item-num">02</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    원동력
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s dot">
                                      자신의 개성, 감정, 느낌을 유지하고 표현
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      아름다운 세상 만들기
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      창의성
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="step-item col-group gap24 half-div">
                                <div className="step-item-num">03</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    적성
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s">
                                      예술적이거나 직관력을 필요로 하는 분야 - 배우, 작가, 디자이너, 트레이너, 비평가, 심리학자, 상담사
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-dash col-group gap40">
                              <div className="step-item col-group gap24 half-div">
                                <div className="step-item-num">04</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    장점
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s dot">
                                      매우 솔직하고 정직합니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      상상력이 풍부하고 창의적으로 깊이 생각합니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      공감능력이 뛰어나고 감정적으로 사람들과 잘 소통하는 방법을 알고 있습니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      예술적 능력 뛰어납니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      평범한 것을 독특한 것으로 바꾸는 능력이 있습니다.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="step-item col-group gap24 half-div">
                                <div className="step-item-num">05</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    단점
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s dot">
                                      자신에게 없는 것에 집착하는 경향이 있습니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      자신에게 너무 집중하는 경향이 있습니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      다른 사람이 시키는 일에 저항감을 느낍니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      정체성이 부족하고 성취감을 못 느낄 때 자존감이 낮아지는 경향이 있습니다.
                                    </p>
                                    <p className="default-txt default-txt-s dot">
                                      획일적이고 얽매이는 공동체 생활을 힘들어합니다.
                                    </p>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div className="step-item border-dash col-group gap24">
                              <div className="step-item-num">06</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  회피하는 것 - 눈물과 웃음을 주는 평범한 일상
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s">
                                    ‘평범한 감정들의 평탄함’과 ‘평범한 사람들’에 대해 불만족스러워합니다. 자신은 모든 것을 강렬하게 해야 하며 드라마틱하고 과장되게 하려고 합니다. 격렬하지 않으면 감정은 현실적이지 않고 진실하지 못하다고 여기며 남들과 똑같아지는 것에 공포를 느끼기도 합니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="step-item border-dash col-group gap24">
                              <div className="step-item-num">07</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  성장의 포인트 (전환 방법)
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s">
                                    자신과 주위의 모든 평범함은 인생의 다양한 경험만큼이나 현실적이고 중요한 부분이라는 사실을 인정함으로써 전환은 시작됩니다.
                                    진정한 자아를 찾는 유일한 방법은, 스스로 잘나 보인다고 생각하는 부분뿐만 아니라 그것을 포함한 나의 모든 부분을 포용하는 방법밖에 없다는 것을 배워야 합니다. 특별해지기 위해 리허설 하거나 힘들게 노력하지 않아도 됩니다. 남들과 비교하는 행위를 멈추고 자신을 있는 그대로 내버려 두는 일부터 시작합니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="step-item border-dash col-group gap24">
                              <div className="step-item-num">08</div>
                              <div className="step-item-txt-wrap row-group gap16">
                                <p className="default-title green">
                                  성장을 위한 질문 던지기
                                </p>
                                <div className="row-group gap4">
                                  <p className="default-txt default-txt-s green default-txt-bold dot">
                                    창의적이고 남들과 다른 개성을 지닌 당신. 때로는 자신에게 지나치게 몰입합니다. 이러한 몰입에서 벗어나 외부에 관심을 둔다면 가장 끌리는 분야는 무엇인가요?
                                  </p>
                                  <p className="default-txt default-txt-s green default-txt-bold dot">
                                    당신에게 없다고 생각하는 것은 무엇인가요? 그것이 없는 당신의 삶이 어떻게 느껴지나요?
                                  </p>
                                  <p className="default-txt default-txt-s green default-txt-bold dot">
                                    당신이 갖고 있는 능력, 자원은 무엇인가요? 이러한 것들이 당신의 삶을 어떻게 만들고 있나요?
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>)
                      : resultPageData.power_num === 5
                        ? (<div className="section">
                          <div className="section-title-wrap col-group">
                            <div className="num">3</div>
                            <h3 className="section-title">
                              {resultPageData.name}님은 {resultPageData.power_num} [관찰력이 뛰어난 연구가], 머리(사고) 중심입니다.
                            </h3>
                          </div>
                          <div className="row-group gap32">
                            <div className="step-item-list border">
                              <div className="step-item border-dash col-group gap24">
                                <div className="step-item-num">01</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    특징
                                  </p>
                                  <div className="row-group gap32">
                                    <p className="default-txt default-txt-s">
                                      독립적이고 논리적이며, 현실을 파악하는 관찰력이 뛰어납니다. 지적 호기심이 많고 분석에 능해 독창적인 이론을 세우기도 합니다. 충분히 관찰하고 정보를 수집하여 상황을 정확하게 파악하고 판단하려고 합니다. 공정함과 정의를 바탕으로 한 정직하고 신뢰할 수 있는 성품이며, 자신의 윤리관에 자신을 갖고 있습니다. 사려가 깊으며 말이 많지 않고 태도가 조심스럽습니다. 고독을 즐기는 편이며, 자신만의 시간과 공간을 갖는 것을 매우 중요하게 여깁니다. ‘현명한 사람’이나 ‘지혜로운 사람’이라는 평가를 받을 때 만족합니다.
                                    </p>
                                  </div>
                                  <div className="col-group gap40">
                                    <div className="half-div row-group gap4">
                                      <p className="default-txt default-txt-s dot">
                                        혁신적이고 독창적이며, 종종 시대를 앞서갑니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        완전히 새로운 방식으로 세상을 보는 편입니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        호기심이 많아 지식과 정보 수집을 끊임없이 합니다.
                                      </p>
                                    </div>
                                    <div className="half-div row-group gap4">
                                      <p className="default-txt default-txt-s dot">
                                        감정에 방해받지 않고 집중력을 발휘합니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        직접 체험하지 않고 관찰력으로 습득할 수 있습니다.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="border-dash col-group gap40">
                                <div className="step-item col-group gap24 half-div">
                                  <div className="step-item-num">02</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      원동력
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s dot">
                                        지식 습득과 주변 환경 이해
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        세상에 대한 새로운 발견
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        혼자 생각하는 시간
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        능력 있고 인정받는 느낌
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="step-item col-group gap24 half-div">
                                  <div className="step-item-num">03</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      적성
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s">
                                        지속적인 탐구가 가능하고 지적 호기심을 유발할 수 있는 분야 - 컴퓨터 전문가, 작가, 애널리스트, 학자, 기술자
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="border-dash col-group gap40">
                                <div className="step-item col-group gap24 half-div">
                                  <div className="step-item-num">04</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      장점
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s dot">
                                        신뢰할 수 있으며 비밀유지에 능숙합니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        서로의 경계를 존중하는데 문제가 없습니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        위기상황에 침착하며 객관적인 태도를 유지합니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        복잡한 문제를 풀어내는 것에 수월합니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        생각이 많으며 깊고 관찰적입니다.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="step-item col-group gap24 half-div">
                                  <div className="step-item-num">05</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      단점
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s dot">
                                        지식을 습득하고 저장하는데 능숙하지만 실제로 행동하는 것은 어려워합니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        타인에게 오만하게 보일 때가 있습니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        차갑고 완고하여 감정 소통이 어려울 때가 있습니다.
                                      </p>
                                      <p className="default-txt default-txt-s dot">
                                        사람들로부터 스스로를 고립시키곤 합니다.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                              </div>
                              <div className="step-item border-dash col-group gap24">
                                <div className="step-item-num">06</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    회피하는 것 - 공허함
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s">
                                      스스로 가장 두려워하고 피하고 싶어 하는 것은 공허함입니다. 인생의 모든 면을 이해해야 하는데 그렇게 하지 못 할까 봐 두려움을 느낍니다. 이점 때문에 자신을 항상 새로운 지식과 통찰력으로 채워 넣으려 하고 이미 가지고 있는 지식을 놓치지 않으려 합니다.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="step-item border-dash col-group gap24">
                                <div className="step-item-num">07</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    성장의 포인트 (전환 방법)
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s">
                                      우선, 무엇보다도 자신 내면에 있는 공허함을 있는 그대로 경험하고, 그것을 없애려 했던 모든 행위들이 오히려 스스로에게 해가 됨을 경험하는 것이 중요합니다.
                                      자신의 두려움을 직시하는 것은, 내가 느끼는 공허함이 지식으로 채워질 수 있는 것이 아니라 오직 삶 안에서 타인과의 활발한 교류를 통해 채워질 수 있는 것임을 깨닫게 해줍니다. 내가 갈망하는 지혜는 이처럼 삶 안에 있는 것임을 배워야 합니다.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="step-item border-dash col-group gap24">
                                <div className="step-item-num">08</div>
                                <div className="step-item-txt-wrap row-group gap16">
                                  <p className="default-title green">
                                    성장을 위한 질문 던지기
                                  </p>
                                  <div className="row-group gap4">
                                    <p className="default-txt default-txt-s green default-txt-bold dot">
                                      분석적이고 관찰력이 뛰어난 당신. 당신의 능력이 세상을 위해 쓰인다면, 어떤 식으로 쓸 수 있을까요?
                                    </p>
                                    <p className="default-txt default-txt-s green default-txt-bold dot">
                                      지식을 습득하고 저장하는 것뿐만 아니라, 행동으로 실천하기 위해서는 무엇을 해야 할까요?
                                    </p>
                                    <p className="default-txt default-txt-s green default-txt-bold dot">
                                      다른 사람과 갈등이 생겼을 때 어떤 식으로 갈등을 풀어나갈 수 있을까요?
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>)
                        : resultPageData.power_num === 6
                          ? (<div className="section">
                            <div className="section-title-wrap col-group">
                              <div className="num">3</div>
                              <h3 className="section-title">
                                {resultPageData.name}님은 {resultPageData.power_num} [충직한 보안관], 머리(사고) 중심입니다.
                              </h3>
                            </div>
                            <div className="row-group gap32">
                              <div className="step-item-list border">
                                <div className="step-item border-dash col-group gap24">
                                  <div className="step-item-num">01</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      특징
                                    </p>
                                    <div className="row-group gap32">
                                      <p className="default-txt default-txt-s">
                                        책임감이 강하며 충직하고 신뢰할 수 있습니다. 안전함과 확실함을 추구하며 체계적이고 조직적인 일에 능합니다. 의무와 규칙을 잘 지키고 자신이 신뢰하는 조직이나 사람에 충실합니다. 다른 사람의 명예와 권위를 존중하고 조직 안에서 자신을 드러내지 않고 일합니다. 자신의 울타리 안에 있는 사람들을 돌보며, 그 외의 사람들에게는 조심스러운 태도를 보입니다. 안전을 추구하여 발생 가능한 문제들을 예측하고 준비하며, 신중하게 행동합니다. 분별력이 있고 성실하게 노력하는 사람입니다. 삶을 안정되게 유지하는 것을 매우 중요하게 생각합니다.
                                      </p>
                                    </div>
                                    <div className="col-group gap40">
                                      <div className="half-div row-group gap4">
                                        <p className="default-txt default-txt-s dot">
                                          안전을 추구하며 안정감을 얻기 위해 노력합니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          다른 사람들의 지지를 원합니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          다른 사람들이 자신을 어떻게 생각하는지 관심이 많습니다.
                                        </p>
                                      </div>
                                      <div className="half-div row-group gap4">
                                        <p className="default-txt default-txt-s dot">
                                          꾸준하고 성실하게 노력하며 항상 준비되어 있습니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          남을 존중하고 배려하며 용감합니다.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="border-dash col-group gap40">
                                  <div className="step-item col-group gap24 half-div">
                                    <div className="step-item-num">02</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        원동력
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s dot">
                                          일관되고 신뢰할 수 있는 관계
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          다른 사람을 돕는 일
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          사랑하는 사람들과 함께 보내는 시간
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="step-item col-group gap24 half-div">
                                    <div className="step-item-num">03</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        적성
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s">
                                          명확한 지침이 있고 분명한 결과를 도출할 수 있는 분야 - 교사, 세무사, 공무원, 과학자, 건축기사
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="border-dash col-group gap40">
                                  <div className="step-item col-group gap24 half-div">
                                    <div className="step-item-num">04</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        장점
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s dot">
                                          책임감이 있으며 실용적인 선택을 할 수 있습니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          계획, 약속을 존중하고 지키려고 합니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          타인을 잘 보호하고 돌봅니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          다른 관점에서 바라보고 생각하는 능력이 있습니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          논리적이고 감정적인 모습을 균형있게 지니고 있습니다.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="step-item col-group gap24 half-div">
                                    <div className="step-item-num">05</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        단점
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s dot">
                                          불안감이 들기 시작하면 생각을 통제하기 어렵습니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          최악의 상황을 생각하거나 비관적으로 생각하는 경향이 있습니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          중요한 순간 결정 내리는 것을 두려워합니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          우유부단한 면이 있으며 자기 의심과 불안이 높습니다.
                                        </p>
                                        <p className="default-txt default-txt-s dot">
                                          소심하고 초조해하며 경계심이 많습니다.
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                                <div className="step-item border-dash col-group gap24">
                                  <div className="step-item-num">06</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      회피하는 것 - 권력에 대한 반항심, 두려움
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s">
                                        외부에서 해답을 찾을 수 없는 의심과 질문들, 그리고 두려움에 노출되는 것을 피하기 위해 무슨 행동이든 합니다. 그러나 나의 이런 행동들은 나를 더 완고하게 만듭니다.
                                        불확실성, 특별함, 단체에서의 일탈을 피하며 조직이나 틀, 사람들 안에 있을 때 안정감을 느낍니다. 상황이 달라졌음에도 이미 한 약속은 지켜야 하고, 인적이 없는 한밤중에도 횡단보도의 신호를 지키는 것이 당연합니다.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="step-item border-dash col-group gap24">
                                  <div className="step-item-num">07</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      성장의 포인트 (전환 방법)
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s">
                                        우선, 나의 의심과 공포를 직시하고 자신에게 한 발자국 다가서서 자신의 내면에 귀를 기울이고 믿음을 가지는 것이 중요합니다. 외부의 지원과 정의에 의존하기보다는 나 스스로 책임을 지기 시작할 필요가 있습니다.
                                        내가 가진 의심과 공포들을 인정하기 시작할 때 비로소 자신을 더 믿을 수 있게 되며 감추어진 내면의 힘을 인지할 수 있습니다. 또, 나의 두려움과 의심을 소리 내어 이야기할 수 있게 되면 자신의 위치에 대해 더 확실한 믿음을 가질 수 있게 되며 내가 속한 집단이나 팀에서 중요한 역할을 할 수 있게 될 것입니다.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="step-item border-dash col-group gap24">
                                  <div className="step-item-num">08</div>
                                  <div className="step-item-txt-wrap row-group gap16">
                                    <p className="default-title green">
                                      성장을 위한 질문 던지기
                                    </p>
                                    <div className="row-group gap4">
                                      <p className="default-txt default-txt-s green default-txt-bold dot">
                                        충직하고 안정감을 추구하는 당신. 안정감을 위해 당신이 포기했던 새로운 도전이나 모험에는 어떤 것들이 있었나요?
                                      </p>
                                      <p className="default-txt default-txt-s green default-txt-bold dot">
                                        그 새로운 도전이나 모험을 위해 당신이 가진 능력 중 어떤 능력을 쓸 수 있나요?
                                      </p>
                                      <p className="default-txt default-txt-s green default-txt-bold dot">
                                        당신은 걱정을 하고 최악의 상황을 상상하는데 에너지를 쓰고 있습니다. 이 에너지를 긍정적인 방향으로 쓴다면 어떻게 쓸 수 있을까요?
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>)
                          : resultPageData.power_num === 7
                            ? (<div className="section">
                              <div className="section-title-wrap col-group">
                                <div className="num">3</div>
                                <h3 className="section-title">
                                  {resultPageData.name}님은 {resultPageData.power_num} [즐거운 모험가], 머리(사고) 중심입니다.
                                </h3>
                              </div>
                              <div className="row-group gap32">
                                <div className="step-item-list border">
                                  <div className="step-item border-dash col-group gap24">
                                    <div className="step-item-num">01</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        특징
                                      </p>
                                      <div className="row-group gap32">
                                        <p className="default-txt default-txt-s">
                                          새롭고 재미있는 일을 생각하거나 실행하기를 좋아합니다. 모든 일에서 긍정적인 면을 잘 발견하며 기발한 아이디어를 잘 생각해냅니다. 새로운 상황에도 잘 적응하고 문제해결 능력이 뛰어납니다. 활기차고 재치가 넘치며 낙관적입니다. 이러한 모습들로 주위 사람들의 의욕을 높이는 역할을 합니다. 다양한 분야에 관심이 많고 폭넓은 대인관계를 맺습니다. 짧게 집중할 수 있는 단기 프로젝트를 선호하는 반면, 단조롭고 변화가 없는 반복적인 일을 어려워합니다.
                                        </p>
                                      </div>
                                      <div className="col-group gap40">
                                        <div className="half-div row-group gap4">
                                          <p className="default-txt default-txt-s dot">
                                            낙관적이고 우호적이며 모임을 좋아합니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            상상력이 풍부하고 열정적입니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            충동적이고 자기중심적일 때가 있습니다.
                                          </p>
                                        </div>
                                        <div className="half-div row-group gap4">
                                          <p className="default-txt default-txt-s dot">
                                            삶이 즐겁고 기쁨으로 채워져야 합니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            고통에서 해방되고 싶어 합니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-dash col-group gap40">
                                    <div className="step-item col-group gap24 half-div">
                                      <div className="step-item-num">02</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          원동력
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s dot">
                                            새로운 아이디어들을 떠올리고 실행하는 일
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            창의적이거나 트렌디한 것
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            다양한 선택지가 주어졌을 때
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            새로운 사람들을 만나고 알아가는 일
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="step-item col-group gap24 half-div">
                                      <div className="step-item-num">03</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          적성
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s">
                                            빠른 전환과 순발력이 요구되는 분야 - 이벤트 플래너, 분장전문가, 개그맨, 광고기획자
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-dash col-group gap40">
                                    <div className="step-item col-group gap24 half-div">
                                      <div className="step-item-num">04</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          장점
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s dot">
                                            카리스마 있으며 인기가 많습니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            빠른 생각과 창의적 능력이 있습니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            많은 옵션과 문제 해결책을 떠올리는 능력이 있습니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            변화에 쉽게 적응하거나 대응합니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            새로운 기술을 빠르게 습득합니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="step-item col-group gap24 half-div">
                                      <div className="step-item-num">05</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          단점
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s dot">
                                            미리 계획을 세우는 일에 약합니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            쉽게 지루함을 느낍니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            자신에게 중요하지 않다고 생각되는 일에는 게으름을 피웁니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            충동적이며 성급하게 결정을 내리곤 합니다.
                                          </p>
                                          <p className="default-txt default-txt-s dot">
                                            무책임하고 산만하며 일관성 없는 모습을 보일 때가 있습니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                  <div className="step-item border-dash col-group gap24">
                                    <div className="step-item-num">06</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        회피하는 것 - 고통과 시련
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s">
                                          고통과 시련을 주는, 즐겁지 않은 일과는 관계 맺고 싶지 않습니다. 이러한 일들을 삶에서 없애기 위해 노력하며 알고 싶어 하지도 않습니다.
                                          언제나 유쾌하고 다른 이들을 행복하게 해주려고 노력합니다. 다른 이들이 슬프거나 우울해할 때 불편한 감정을 느끼며 농담을 던지거나 다른 이야기를 함으로써 분위기를 가볍게 만들려고 합니다. 이처럼 부정적인 감정이나 분노를 회피하면서 나도 모르게 나오는 표현들이 오해를 불러일으키곤 합니다.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="step-item border-dash col-group gap24">
                                    <div className="step-item-num">07</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        성장의 포인트 (전환 방법)
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s">
                                          나 자신, 그리고 다른 이들의 아픔을 피하지 않는 것에서부터 시작됩니다. 불편한 감정이 올라올 때 애써 누그러뜨리거나 어영부영 넘어가려 하지 않고 있는 그대로 인정하면 나는 고통과 시련이 삶의 한 부분임을 알게 됩니다.
                                          인생은 항상 웃음으로만 가득 차 있을 수 없습니다. 내가 좋아하는 부분만 선택적으로 즐길 수 없으며 그래서는 성장이 있을 수 없다는 사실을 배워야 합니다.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="step-item border-dash col-group gap24">
                                    <div className="step-item-num">08</div>
                                    <div className="step-item-txt-wrap row-group gap16">
                                      <p className="default-title green">
                                        성장을 위한 질문 던지기
                                      </p>
                                      <div className="row-group gap4">
                                        <p className="default-txt default-txt-s green default-txt-bold dot">
                                          삶을 즐기며 기쁘게 살아가는 당신. 즐거움과 기쁨에 집중하느라 당신의 삶에서 무언가 놓치고 있다면 그것은 무엇일까요?
                                        </p>
                                        <p className="default-txt default-txt-s green default-txt-bold dot">
                                          앞으로 삶을 즐겁게 살려면 지금 당신에게서 무엇을 보완해야 할까요?
                                        </p>
                                        <p className="default-txt default-txt-s green default-txt-bold dot">
                                          당신은 종종 성급하게 결정을 합니다. 어떤 결정을 하는데 있어서 충분히 심사숙고하려면 어떻게 해야 할까요?
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>)
                            : resultPageData.power_num === 8
                              ? (<div className="section">
                                <div className="section-title-wrap col-group">
                                  <div className="num">3</div>
                                  <h3 className="section-title">
                                    {resultPageData.name}님은 {resultPageData.power_num} [자신감 넘치는 도전가], 장(본능) 중심입니다.
                                  </h3>
                                </div>
                                <div className="row-group gap32">
                                  <div className="step-item-list border">
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">01</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          특징
                                        </p>
                                        <div className="row-group gap32">
                                          <p className="default-txt default-txt-s">
                                            힘 있는 사람이 되고자 합니다. 대범하고 결단력이 있으며, 리더 성향을 타고 났습니다. 자신감이 넘치고 모험과 역경을 두려워하지 않고 도전합니다. 자신의 의견을 주저 없이 표현하며 주도권을 갖고 일을 추진합니다. 자기 확신이 강하여 주위 사람들에게 영향력이 있는 사람입니다. 솔직하고 관대하며 어떠한 어려움도 이겨낼 수 있는 용기를 지니고 있습니다. 직관에 따라 경정하는 경향이 있으며 위험을 감수하려 합니다. 다른 사람들에게 통제당하는 상황을 어려워하며 스스로 강하고 존경받는 사람이 되기를 원합니다.
                                          </p>
                                        </div>
                                        <div className="col-group gap40">
                                          <div className="half-div row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              자신감 넘치고 정직하며 솔직합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              단호하며 공정하고 관대합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              강한 의지와 활동력이 있습니다.
                                            </p>
                                          </div>
                                          <div className="half-div row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              정열적이고 현실적이며 리더십이 있습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              결단력이 있고 약자를 끝까지 보살핍니다.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-dash col-group gap40">
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">02</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            원동력
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              자신의 약점을 이겨내고 강점을 증명하는 상황
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              책임지고 다른 사람을 이끌기
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              다른 사람들에게 도움이 되는 결정 내리기
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              논리적이고 실용적인 아이디어와 솔루션
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">03</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            적성
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s">
                                              조직체를 통솔하거나 자율적인 권한이 주어지는 분야 - 감독, 스턴트맨, 농장경영자, 노동조합 지도자
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-dash col-group gap40">
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">04</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            장점
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              강한 의지력을 갖추어 마음먹은 것은 해냅니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              자신의 능력에 대한 확고한 자신감이 있습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              조직을 이끄는 리더 자질이 있습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              자급자족하는 능력과 독립적 기질이 강합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              자신의 울타리 안에 있는 사람들을 적극적으로 보호합니다.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">05</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            단점
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              의견 대립 시 거칠어 보일 수 있습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              단순한 규칙은 중요시하지 않고 현실성을 중요시합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              강한 자신감이 허세로 보일 수 있습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              감성적 공감이 어려울 때가 있습니다.
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">06</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          회피하는 것 - 나약함
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s">
                                            남들이 나를 이용할까 봐 언제나 경계를 하며 나의 나약함과 남들의 순수함을 부정합니다. 나의 나약함을 인정하지 않기 때문에 힘이 없고 나약한 사람들을 경멸하고 무시합니다.
                                            내게는 나약함이나 자비, 동정심 등이 자리 잡을 곳이 없다고 생각하므로 그런 감정들을 유발할 수 있는 상황들을 어떻게든 피하려고 합니다.
                                            이러한 이유로, ‘부드러움 감정과 그 필요성’, ‘남들에게 다가가기’, ‘따뜻함이나 호감, 친절 베풀기’ 등에 어려움을 느끼는데 이러한 것들이 나약함을 보여준다고 믿기 때문입니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">07</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          성장의 포인트 (전환 방법)
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s">
                                            자신 스스로 안에서 또는 타인에게서, 자신이 가장 두려워하는 감정들을 인식하고 받아들이는 행동이 필요합니다.
                                            의식적으로 내 자신과 남들에게 더 친절한 태도를 보이고 체화함으로써 자신의 진짜 힘을 찾아가며 진정으로 자신에게 주어진 힘은, 자비와 친절 그리고 동정심에 있다는 사실을 깨달아갑니다. 솔직함을 추구하는 나의 의지는 그대로 간직한 채로, 타인과 교류할 때 그의 입장이 되어 생각해보고 내가 그들과 어떻게 교류하고 있는지를 객관적으로 바라볼 수 있도록 노력합니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">08</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          성장을 위한 질문 던지기
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s green default-txt-bold dot">
                                            대범하고 도전 정신이 있는 당신은 다른 사람들을 이끌어가는 리더십을 발휘합니다. 반대로 당신이 다른 사람을 의지하고 그 의견에 따른다면 어떨 것 같은가요?
                                          </p>
                                          <p className="default-txt default-txt-s green default-txt-bold dot">
                                            당신이 생각하는 약점은 무엇인가요? 그 약점을 받아들인다면 당신에게 어떤 변화가 있을까요?
                                          </p>
                                          <p className="default-txt default-txt-s green default-txt-bold dot">
                                            당신이 다른 사람의 의견을 수용하고 협업하기 위해서는 무엇이 필요할까요?
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>)
                              : (<div className="section">
                                <div className="section-title-wrap col-group">
                                  <div className="num">3</div>
                                  <h3 className="section-title">
                                    {resultPageData.name}님은 {resultPageData.power_num} [조화를 이루는 평화주의자], 장(본능) 중심입니다.
                                  </h3>
                                </div>
                                <div className="row-group gap32">
                                  <div className="step-item-list border">
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">01</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          특징
                                        </p>
                                        <div className="row-group gap32">
                                          <p className="default-txt default-txt-s">
                                            사람들과의 조화를 중시합니다. 어떠한 상황에서도 좋은 점을 찾아내 화합하고 일치시킵니다. 다른 사람들의 말에 귀 기울이고 이해하는 능력이 있습니다. 상대를 넓게 받아들이는 수용적이고 포용적인 사람입니다. 그러나 고집이 세고 완고한 면이 있어서 동의되지 않는 일에는 겉으로 드러내고 반대하지 않으면서도 결국은 자신이 원하는 대로 하는 경향이 있습니다. 대체로 다른 사람에게 상냥하고 위안을 주어 다른 사람들이 안정과 편안함을 느낄 수 있도록 합니다. 인내심이 강하고 겸손하며 스스로 만족할 줄 아는 사람입니다.
                                          </p>
                                        </div>
                                        <div className="col-group gap40">
                                          <div className="half-div row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              평화적이고 공정한 중재자 역할을 합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              침착하고 편안하며 겸손합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              폭넓게 받아들이는 수용성을 지니고 있습니다.
                                            </p>
                                          </div>
                                          <div className="half-div row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              누구에게나 위안을 줍니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              어떤 상황에서도 좋은 점을 찾아내어 화합하고 일치시킵니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              인내심이 강하고 온순하며 스스로 만족합니다.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-dash col-group gap40">
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">02</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            원동력
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              분열된 팀을 하나로 모으는 일
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              사람들 사이의 오래된 상처를 중재하거나 치유하는 일
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              일관되고 안정감 있는 생활
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">03</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            적성
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s">
                                              조직 간의 조화나 중재, 수용이 필요한 분야 - 사회복지사, 성직자, 외교관, 행정관료, 상담자
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-dash col-group gap40">
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">04</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            장점
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              타인의 갈등 조절에 탁월합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              도움이 필요한 상황에서 적극적으로 격려하고 지원합니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              다양한 관점의 시각으로 문제를 바라보는 능력이 있습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              뛰어난 적응력과 융통성이 있습니다.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="step-item col-group gap24 half-div">
                                        <div className="step-item-num">05</div>
                                        <div className="step-item-txt-wrap row-group gap16">
                                          <p className="default-title green">
                                            단점
                                          </p>
                                          <div className="row-group gap4">
                                            <p className="default-txt default-txt-s dot">
                                              본인 스스로 다른 사람과의 갈등에 직면하는 게 어렵습니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              문제를 자꾸 덮어 최소화 하려는 모습을 보입니다.
                                            </p>
                                            <p className="default-txt default-txt-s dot">
                                              모든 사람을 조화롭게 하려 애씁니다.
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">06</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          회피하는 것 - 분쟁
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s">
                                            문제가 생길 것 같은 모든 상황을 빠르게 파악합니다. 이는 분쟁이나 논쟁, 불쾌함을 줄 수 있는 모든 경우를 말하며 만약 미리 방지하지 못했다면 자신이 그 일과 연관이 없음을 확실히 합니다. 심지어 그 일이 벌어지지 않은 것처럼 행동하거나 다른 일에 심취한 듯 행동합니다. 정신 내·외적으로 충격을 방지하는 일이 무엇보다 중요하기 때문에 자신의 감정들을 절제하고 억제합니다. 자신을 분쟁, 소동, 혼란으로부터 방어하며 둔감하게 하고 그런 일이 생기더라도 침착하게 행동합니다. 이와 같은 완고함으로 자신을 보호하고 상황을 조정하고자 합니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">07</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          성장의 포인트 (전환 방법)
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s">
                                            전환은 자신이 스스로에게 주어진 좋은 것들을 어떤 방법으로 왜곡했는지 구체적으로 파악하는 것에서 시작합니다. 특히, 현재의 습관들이 어떻게 형성되었는지, 나의 생활 방식이 어떤 과정으로 설계되었는지 알아보는 것이 중요합니다.
                                            평화롭게 살고자 하는 내 욕망은 평화를 만드는 원동력이 될 수 있습니다. 그러나 동시에, 강박적으로 다툼을 피하려하는 자신을 인식해야 합니다. 세상에 존재하는 각기 다른 입장들끼리 서로의 의견을 듣게 할 필요가 있음을 인정하며 나의 인내심으로 이 과정을 이끌어 낼 수 있다는 것을 믿는 것이 중요합니다.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="step-item border-dash col-group gap24">
                                      <div className="step-item-num">08</div>
                                      <div className="step-item-txt-wrap row-group gap16">
                                        <p className="default-title green">
                                          성장을 위한 질문 던지기
                                        </p>
                                        <div className="row-group gap4">
                                          <p className="default-txt default-txt-s green default-txt-bold dot">
                                            사람들과의 화합을 중요시하는 당신. 모든 사람의 화합을 위해 노력하느라 당신이 놓치고 있는 것은 무엇인가요?
                                          </p>
                                          <p className="default-txt default-txt-s green default-txt-bold dot">
                                            당신이 갈등을 피함으로써 얻는 것과 잃는 것은 무엇인가요?
                                          </p>
                                          <p className="default-txt default-txt-s green default-txt-bold dot">
                                            지금 당신에게 필요한 것은 무엇인가요?
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>)
              }
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[23]}>
          <main className="main">
            <p className="page-num">22</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">05</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  힘의 균형과 날개
                </h2>
                <p className="main-sub-title">
                  02. 유형별 관계 전략 / 성장을 위한 처방
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <BalanceOfPowerWings
                data={BalanceOfPowerWingsData[resultPageData.power_num]}
              />
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    성장을 위한 처방
                  </h3>
                </div>
                <div className="green-border-box bg-green row-group gap4 prescription">
                  {ref12Text[PersonalityTypeValue].desc.map((item, index) => (
                    <p className="default-txt default-txt-l default-txt-bold dot" key={index}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[24]}>
          <main className="main">
            <p className="page-num">23</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">05</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  힘의 균형과 날개
                </h2>
                <p className="main-sub-title">
                  03. 힘의 균형과 날개 & 화살
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    힘의 균형, 그 날개와 화살
                  </h3>
                </div>
                <div className="row-group gap32">
                  <p className="default-txt-l">
                    당신이 어떤 유형이든 우리는 원래 우리가 가지고 태어난 것의 한계가 있고 넘지 못할 선이 있으며 이미 왜곡된 무언가로 만들어 버린 경우들도 있습니다. 우리 자신은 완전함을 위해 만들어졌지만 인생을 통한 경험들은 우리를 수비적으로 만들거나 거친 행동을 하게 압박을 줍니다. <br />
                    <br />
                    우리가 사용하는 힘의 중심은 자신이 그동안 어떤 길을 선택해 왔는지 자각하려고 하는 사람들에게 지도를 제시해 주며, 앞으로 더욱 완전한 존재가 되기 위해 택해야 하는 전환의 길을 보게 해 줍니다.
                  </p>
                  <div className="green-bg-box row-group gap24">
                    <p className="default-txt">
                      ‘날개’가, 자신에게 주어진 상황과 환경에 적응하기 위한 내면 에너지의 활용이라면, ‘화살표’ 방향은 저항을 극복하는 움직임을 표현합니다. 우리는 날개와 화살표를 이해하고 내면에서 일어나는 저항을 극복하여 자신의 삶을 보다 성숙하게 통합하는 방향으로 나아갈 수 있어야 합니다.
                    </p>
                    <div className="col-group gap40">
                      <div className="half-div row-group gap8">
                        <p className="default-txt default-txt-bold green">
                          통합방향
                        </p>
                        <p className="default-txt">
                          내면의 의식을 통합하는 지점으로 의식적인 성찰과 올바른
                          자아 인식에서 비롯됩니다. 이는 긍정적인 노력의 결과로
                          다양함을 포용할 수 있습니다.
                        </p>
                      </div>
                      <div className="half-div row-group gap8">
                        <p className="default-txt default-txt-bold green">
                          분열방향
                        </p>
                        <p className="default-txt">
                          내면의 의식을 돌보지 않거나 저항과 집착이 강할 때 이 같은
                          성격의 틀이 강화됩니다. 자신과 타인에게 부정적이며
                          충동적이고 퇴행적일 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-group gap40">
                    <div className="row-group gap24 half-div">
                      <p className="default-title green">
                        날개(wing) 그래프
                      </p>
                      <img src={images.graph_wing} alt="" />
                      <p className="default-txt">
                        날개란, 자기 유형의 양 옆에 위치한 유형을 말하며 성격을 균형 있게 발전하도록 돕는 역할을 합니다. 잠재력을 개발할 수 있는 가능성의 영역이기도 합니다.
                      </p>
                    </div>
                    <div className="row-group gap24 half-div">
                      <p className="default-title green">
                        화살(arrow) 그래프
                      </p>
                      <img src={images.graph_arrow} alt="" />
                      <p className="default-txt">
                        화살표의 각 유형은 통합의 방향과 분열의 방향으로 나아갑니다. 통합의 방향은 나의 힘과 에너지를 더욱 강하게 만들 수 있는 협력자 유형이며, 분열의 방향은 나의 힘과 에너지를 소진시키는 소진형 유형입니다. 우리는 살아가면서 나의 통합 유형의 에너지를 발견해야 할 것이며 분열의 유형은 잘 피해가야 할 것입니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common page-25' ref={printPageRefs[25]}>
          <main className="main">
            <p className="page-num">24</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="row-group gap56">
                  <div className="col-group gap40">
                    <div className="half-div row-group gap32">
                      <p className="default-title green">
                        {wingsTypeData[resultPageData.power_num][0].name}
                      </p>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              특징
                            </p>
                            <p className="default-txt">
                              {wingsTypeData[resultPageData.power_num][0].desc}
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              장점
                            </p>
                            <div className="row-group gap4">
                              {wingsTypeData[resultPageData.power_num][0].advantage.map((item, index) => (
                                <p className="default-txt dot" key={index}>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              성찰할 점
                            </p>
                            <div className="row-group gap4">
                              {wingsTypeData[resultPageData.power_num][0].reflection.map((item, index) => (
                                <p className="default-txt dot" key={index}>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="half-div row-group gap32">
                      <p className="default-title green">
                        {wingsTypeData[resultPageData.power_num][1].name}
                      </p>
                      <div className="step-item-list border">
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">01</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              특징
                            </p>
                            <p className="default-txt">
                              {wingsTypeData[resultPageData.power_num][1].desc}
                            </p>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">02</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              장점
                            </p>
                            <div className="row-group gap4">
                              {wingsTypeData[resultPageData.power_num][1].advantage.map((item, index) => (
                                <p className="default-txt dot" key={index}>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="step-item border-dash col-group gap24">
                          <div className="step-item-num">03</div>
                          <div className="step-item-txt-wrap row-group gap16">
                            <p className="default-title green">
                              성찰할 점
                            </p>
                            <div className="row-group gap4">
                              {wingsTypeData[resultPageData.power_num][1].reflection.map((item, index) => (
                                <p className="default-txt dot" key={index}>
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="wing-type-section">
                    <div className="row-group gap24">
                      <p className="default-title green">
                        날개 유형
                      </p>
                      <div className="wing-type-wrap">
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              1W9
                            </p>
                            <p className="default-txt default-txt-s">
                              스트레스 상황에 처하거나 시비가 붙으면 <br />
                              도망치려 하거나 움츠러드는 경향이 있습니다. <br />
                              차분하지만 수동적인 면이 강합니다.
                            </p>
                          </div>
                          <div className="num">1번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              1W2
                            </p>
                            <p className="default-txt default-txt-s">
                              더욱 외향적인 성향을 지녔으며, 남들이 자신에게서 <br />
                              어떤 영향을 받는지에 민감하게 반응합니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              2W1
                            </p>
                            <p className="default-txt default-txt-s">
                              완벽주의 기질이 있습니다.
                            </p>
                          </div>
                          <div className="num">2번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              2W3
                            </p>
                            <p className="default-txt default-txt-s">
                              효율적이며 생산적이고 싶어합니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              3W2
                            </p>
                            <p className="default-txt default-txt-s">
                              남들에게 일이 주는 압박이 어떤 영향을 미치는지 살피며, <br />
                              동시에 그들에게 필요한 것에 관심을 기울입니다.
                            </p>
                          </div>
                          <div className="num">3번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              3W4
                            </p>
                            <p className="default-txt default-txt-s">
                              3번이 4번의 독창성을 가지면 일에 창의성이 생겨나 <br />
                              더욱 효과적인 결과를 낼 수 있습니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              4W3
                            </p>
                            <p className="default-txt default-txt-s">
                              자심감이 높고 이벤트에 능합니다.
                            </p>
                          </div>
                          <div className="num">4번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              4W5
                            </p>
                            <p className="default-txt default-txt-s">
                              사려 깊은 면모가 돋보이지만, 자긍심이 낮습니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              5W4
                            </p>
                            <p className="default-txt default-txt-s">
                              생각에 창의적인 표현을 더해 효과를 높이는 경향이 있습니다.
                            </p>
                          </div>
                          <div className="num">5번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              5W6
                            </p>
                            <p className="default-txt default-txt-s">
                              더 조심스럽고 안전에 신경을 많이 씁니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              6W5
                            </p>
                            <p className="default-txt default-txt-s">
                              더욱 조심스럽습니다.
                            </p>
                          </div>
                          <div className="num">6번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              6W7
                            </p>
                            <p className="default-txt default-txt-s">
                              더 재미있고 낙관적입니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              7W6
                            </p>
                            <p className="default-txt default-txt-s">
                              더욱 믿음직스럽고 충성스럽습니다.
                            </p>
                          </div>
                          <div className="num">7번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              7W8
                            </p>
                            <p className="default-txt default-txt-s">
                              더 권위적이고 더욱 강압적으로 될 수도 있습니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              8W7
                            </p>
                            <p className="default-txt default-txt-s">
                              장난기가 심하고, 모든 관심을 독차지 하려고 합니다.
                            </p>
                          </div>
                          <div className="num">8번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              8W9
                            </p>
                            <p className="default-txt default-txt-s">
                              느긋하고 차분하며 세상이 흘러가는 대로 지켜보는 면이 있습니다.
                            </p>
                          </div>
                        </div>
                        <div className="wing-type-group col-group">
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              9W8
                            </p>
                            <p className="default-txt default-txt-s">
                              화가 나거나 짜증이 날 때 더 거칠어집니다. <br />
                              양쪽 날개 모두의 개입을 유도합니다.
                            </p>
                          </div>
                          <div className="num">9번</div>
                          <div className="wing-type-item row-group gap8">
                            <p className="default-txt default-txt-bold green">
                              9W1
                            </p>
                            <p className="default-txt default-txt-s">
                              더 비판적이며 양쪽 날개 모두의 개입을 유도합니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[26]}>
          <main className="main">
            <p className="page-num">25</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">06</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  관계와 소통 분석
                </h2>
                <p className="main-sub-title">
                  01. 자아상태 결과
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    관계와 소통 분석
                  </h3>
                </div>
                <div className="row-group gap32">
                  <div className="ego-result-group col-group gap24">
                    <div className="ego-result-item col-group gap16">
                      <img src={images.icon_ego_jc} alt="" className="icon" />
                      <div className="row-group">
                        <p className="default-txt default-txt-bold">
                          {resultPageData.JC}
                        </p>
                        <p className="default-txt default-txt-s">
                          JC(판단&통제)
                        </p>
                      </div>
                    </div>
                    <div className="ego-result-item col-group gap16">
                      <img src={images.icon_ego_ec} alt="" className="icon" />
                      <div className="row-group">
                        <p className="default-txt default-txt-bold">
                          {resultPageData.EC}
                        </p>
                        <p className="default-txt default-txt-s">
                          EC(허용&보호)
                        </p>
                      </div>
                    </div>
                    <div className="ego-result-item col-group gap16">
                      <img src={images.icon_ego_mr} alt="" className="icon" />
                      <div className="row-group">
                        <p className="default-txt default-txt-bold">
                          {resultPageData.MR}
                        </p>
                        <p className="default-txt default-txt-s">
                          MR(이성&합리)
                        </p>
                      </div>
                    </div>
                    <div className="ego-result-item col-group gap16">
                      <img src={images.icon_ego_fe} alt="" className="icon" />
                      <div className="row-group">
                        <p className="default-txt default-txt-bold">
                          {resultPageData.FE}
                        </p>
                        <p className="default-txt default-txt-s">
                          FE(자율&표현)
                        </p>
                      </div>
                    </div>
                    <div className="ego-result-item col-group gap16">
                      <img src={images.icon_ego_ae} alt="" className="icon" />
                      <div className="row-group">
                        <p className="default-txt default-txt-bold">
                          {resultPageData.AE}
                        </p>
                        <p className="default-txt default-txt-s">
                          AE(순응&의존)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ego-result-chart-wrap col-group gap40">
                    <div className="ego-result-chart-group">
                      <div className="ego-result-title-group col-group">
                        <p className="default-txt">비판적</p>
                        <p className="default-txt">보호적</p>
                        <p className="default-txt">현실적</p>
                        <p className="default-txt">자율적</p>
                        <p className="default-txt">의존적</p>
                      </div>
                      <div className="ego-result-chart">
                        {/* <Line data={chartData} options={chartOptions} plugins={[backgroundPlugin]} /> */}
                        <div style={{ width: '100%', height: '400px' }}>
                          <Line
                            data={chartData}
                            options={chartOptions}
                            plugins={[backgroundPlugin]}
                          />
                        </div>
                      </div>
                      <div className="ego-result-txt-group col-group">
                        <p className="default-txt default-txt-s">
                          JC <br />
                          (판단&통제)
                        </p>
                        <p className="default-txt default-txt-s" style={{ color: '#0077ff' }}>
                          EC <br />
                          (허용&보호)
                        </p>
                        <p className="default-txt default-txt-s" style={{ color: '#0077ff' }}>
                          MR <br />
                          (이성&합리)
                        </p>
                        <p className="default-txt default-txt-s">
                          FE <br />
                          (자율&표현)
                        </p>
                        <p className="default-txt default-txt-s" style={{ color: '#d7262e' }}>
                          AD <br />
                          (순응&의존)
                        </p>
                      </div>
                    </div>

                    <div className="ego-result-score-wrap">
                      <div className="ego-result-score-item row-group gap8">
                        <p className="title">
                          0점 - 19점
                        </p>
                        <p className="txt">
                          낮은 유형
                        </p>
                      </div>
                      <div className="ego-result-score-item row-group gap8">
                        <p className="title">
                          20점 - 35점
                        </p>
                        <p className="txt">
                          적당한 유형
                        </p>
                      </div>
                      <div className="ego-result-score-item row-group gap8">
                        <p className="title">
                          36점 - 50점
                        </p>
                        <p className="txt">
                          높은 유형
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap40">
                  <div className="row-group gap16">
                    <p className="default-title green">
                      양육자
                    </p>
                    <div className="step-item-list border">
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            판단(Judgment) & 통제(Control)
                          </p>
                          <p className="default-txt default-txt-s">
                            JC 자아는 자신의 가치관과 사고방식이 옳다고 생각하면서 법, 도덕, 윤리, 규칙 등을 준수하는 역할을 합니다. 이 자아는 생활에 적합한 규칙과 합리적인 사고를 나타내며, 동시에 교류 속에서 비판과 비난의 역할을 합니다. 이 자아 유형만 너무 높다면, 지배적인 태도와 명령조의 말투를 사용하지 않는지 돌아보아야 합니다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            허용(Embrace) & 보호(Care)
                          </p>
                          <p className="default-txt default-txt-s">
                            EC 자아는 아이의 성장을 지켜봐주는 부모 같은 자아로서 애정, 보호, 헌신, 공감, 배려, 친절, 위로 등 포용적인 언어로 설명할 수 있는 자아입니다. 후배, 동생, 아이 등 손아랫사람을 포용하고 칭찬하는 면이 강하며, 부드럽고 상냥한 양육태도를 지니고 있습니다. EC가 높은 양육자와 자란 아이는 비슷한 양육 태도와 자아상태를 갖게 되지만, 지나치게 높을 경우 아이의 주체적인 의사결정을 방해할 수 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-group gap16">
                    <p className="default-title green">
                      성인
                    </p>
                    <div className="step-item-list border">
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            이성(Mature) & 합리(Rational)
                          </p>
                          <p className="default-txt default-txt-s">
                            MR 자아는 성인으로서 가지는 모든 능력을 활용하여 사고하는 자아상태를 말합니다. ‘이성’을 사용하며 정보를 통한 판단, 냉철한 계산,
                            분석적 사고 등을 통해 외부의 사실을 객관적으로 처리합니다. 즉, 수집한 정보를 수용하거나 평가, 수정합니다. 감정적이기보다 합리적이지만 이것이 이상적인 삶의 방식을 의미하지는 않습니다. MR은 성인으로서 주변과 상호작용하는 관계 안에서 합리적인 성향을 드러내는 것을
                            뜻합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-group gap16">
                    <p className="default-title green">
                      아이
                    </p>
                    <div className="step-item-list border">
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">01</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            자율(Free) & 표현(Express)
                          </p>
                          <p className="default-txt default-txt-s">
                            FE 자아는 모든 자아 중에서 가장 본능적인 부분입니다. 천진난만함, 직관력, 충동적, 호기심 등의 역할을 합니다. 즉, 어떤 것에도 구속되지
                            않는 자발성, 창조성의 원인이며, 인간 본연의 감정을 솔직하게 표현합니다. 이 자아가 활성화 되면 예술적 소질과 직관력 등이 발휘되며,
                            일반적으로 밝고 유머 있는 모습을 보입니다. 그러나 지나치게 높을 경우, 철없고 실없는 행동을 하는 사람처럼 보일 수 있습니다.
                          </p>
                        </div>
                      </div>
                      <div className="step-item border-dash col-group gap24">
                        <div className="step-item-num">02</div>
                        <div className="step-item-txt-wrap row-group gap16">
                          <p className="default-title green">
                            순응(Adapt) & 의존(dEpend)
                          </p>
                          <p className="default-txt default-txt-s">
                            AE 자아는 착한 아이 역할을 하는 어린이 자아입니다. 감정 억제, 타협, 인내, 신중함, 기대 부응능력 등 본연의 자기 기질을 억제하고 부모,
                            교사, 친구 등의 기대에 부응하려고 노력합니다. 그래서 부모의 영향력이 중요하게 작용합니다. 자기주장을 못 하고 타협하거나, 타인에게
                            의존하면서 자발성이 결여된 모습을 보일 수 있습니다. 이 경우 침울, 격노, 반항 등의 모습으로 나타날 수 있습니다. 한편, 감정절제를 잘하고 성숙한 행동을 하는 어른스러운 모습을 보이기도 합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[27]}>
          <main className="main">
            <p className="page-num">26</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">06</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  관계와 소통 분석
                </h2>
                <p className="main-sub-title">
                  02. 의사소통 방식과 리더십
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title section-title-s">
                    {resultPageData.name}님의 교류분석 결과 가장 두드러지는 특징은
                    {aboutJC === '높음' && 'JC '}
                    {aboutEC === '높음' && 'EC '}
                    {aboutMR === '높음' && 'MR '}
                    {aboutFE === '높음' && 'FE '}
                    {aboutAE === '높음' && 'AE '}

                    {(aboutJC === '높음' || aboutEC === '높음' || aboutMR === '높음' || aboutFE === '높음' || aboutAE === '높음') && '이 높은,'}

                    {aboutJC === '낮음' && 'JC '}
                    {aboutEC === '낮음' && 'EC '}
                    {aboutMR === '낮음' && 'MR '}
                    {aboutFE === '낮음' && 'FE '}
                    {aboutAE === '낮음' && 'AE '}
                    {(aboutJC === '낮음' || aboutEC === '낮음' || aboutMR === '낮음' || aboutFE === '낮음' || aboutAE === '낮음') && '이 낮은'}
                    형태라는 점입니다.
                  </h3>
                </div>
                <div className="step-item-list border">
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">01</div>
                    <div className="step-item-txt-wrap row-group gap16">
                      <p className="default-title green">
                        {jcDetail[aboutJC].name}
                      </p>
                      <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(jcDetail[aboutJC].desc) }}>
                        {/* {jcDetail[aboutJC].desc} */}
                      </p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">02</div>
                    <div className="step-item-txt-wrap row-group gap16">
                      <p className="default-title green">
                        {ecDetail[aboutEC].name}
                      </p>

                      <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ecDetail[aboutEC].desc) }}></p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">03</div>
                    <div className="step-item-txt-wrap row-group gap16">
                      <p className="default-title green">
                        {mrDetail[aboutMR].name}
                      </p>
                      <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mrDetail[aboutMR].desc) }}></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[28]}>
          <main className="main">
            <p className="page-num">27</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="step-item-list border">
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">04</div>
                    <div className="step-item-txt-wrap row-group gap16">
                      <p className="default-title green">
                        {feDetail[aboutFE].name}
                      </p>
                      <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feDetail[aboutFE].desc) }}></p>
                    </div>
                  </div>
                  <div className="step-item border-dash col-group gap24">
                    <div className="step-item-num">05</div>
                    <div className="step-item-txt-wrap row-group gap16">
                      <p className="default-title green">
                        {aeDetail[aboutAE].name}
                      </p>
                      <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aeDetail[aboutAE].desc) }}></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    낮은 포인트를 높이는 방법
                  </h3>
                </div>
                <div className="row-group gap32">
                  <p className="default-txt">
                    낮은 부분을 높이면, 반대로 높았던 부분이 저절로 낮아지게 됩니다.
                  </p>
                  <div className="step-item-list border">
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">01</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          JC(판단&통제)
                        </p>
                        <p className="default-txt default-txt-s">
                          시간이나 금전 관리에 조금 더 신경쓰고 철저하게 행동합니다. 일상생활에서 시간표를 만들어 생활의 리듬을 찾고 그것을 지킵니다. 타인의 말과 행동에 조금 더 주의를 기울입니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">02</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          EC(허용&보호)
                        </p>
                        <p className="default-txt default-txt-s">
                          어린 아이를 대할 때는 따뜻한 시선과 부드러운 손짓으로 쓰다듬듯 행동합니다. 비록 잘하지 못하더라도 요리를 만들어 다른 사람에게 대접하거나 손편지로 마음을 전해봅니다. 타인을 배려하고 친절한 말과 태도를 유지할 것을 항상 명심합니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">03</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          MR(이성&합리)
                        </p>
                        <p className="default-txt default-txt-s">
                          뉴스나 시사에 관심을 기울이고, 어렵더라도 끝까지 시청해봅니다. 간단한 메모 형태라도 하루의 일과를 기록합니다. 독서 모임이나 체육활동 등의 친목 모임에 가입하고 또래들과 소통에 주의를 기울이며 참석합니다. 관심 있는 분야의 다큐멘터리를 찾아 집중하는 시간을 갖습니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">04</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          FE(자율&표현)
                        </p>
                        <p className="default-txt default-txt-s">
                          평소 유쾌하고 발랄한 사람들과 어울리려 노력합니다. 유머감각이 있어서 인기가 많은 사람들을 유심히 관찰하고 그들의 특징을 파악해봅니다. 누군가 자신의 의견을 물어올 때 생각이 정리되지 않았더라도 우선 자신의 의견이나 생각을 입 밖으로 말하는 연습을 합니다.
                        </p>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">05</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          AE(순응&의존)
                        </p>
                        <p className="default-txt default-txt-s">
                          주변 사람들의 이야기에 귀 기울이며 그들의 입장에서 생각해봅니다. 누군가 제안하는 영화를 함께 보거나 제안하는 활동에 기꺼이 함께합니다. 드라마나 영화, 예능 프로그램을 시청하면서 주인공의 상황에 감정 이입하고 기뻐하거나 슬퍼하고 화내는 등의 표현을 함께 해봅니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[29]}>
          <main className="main">
            <p className="page-num">28</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">07</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  인생점수
                </h2>
                <p className="main-sub-title">
                  나는 내 인생에 왜 지금과 같은 점수를 주었는지 마인드 인사이트를 통해 <br />
                  체계적으로 점검, 분석해보시기를 추천드립니다.
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="age-wrap col-group gap16">
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={images.age_icon_0_on} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          10세 이전
                        </p>
                        <p className="default-txt default-txt-bold">
                          영유아기
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[0] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[0] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[0]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 10 ? images.age_icon_1_on : images.age_icon_1} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          10~20세
                        </p>
                        <p className="default-txt default-txt-bold">
                          10대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[10] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[10] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[10]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 20 ? images.age_icon_2_on : images.age_icon_2} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          21~30세
                        </p>
                        <p className="default-txt default-txt-bold">
                          20대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[20] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[20] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[20]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 30 ? images.age_icon_3_on : images.age_icon_3} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          31~40세
                        </p>
                        <p className="default-txt default-txt-bold">
                          30대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[30] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[30] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[30]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 40 ? images.age_icon_4_on : images.age_icon_4} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          41~50세
                        </p>
                        <p className="default-txt default-txt-bold">
                          40대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[40] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[40] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[40]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 50 ? images.age_icon_5_on : images.age_icon_5} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          51~60세
                        </p>
                        <p className="default-txt default-txt-bold">
                          50대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[50] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[50] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[50]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 60 ? images.age_icon_6_on : images.age_icon_6} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          61~70세
                        </p>
                        <p className="default-txt default-txt-bold">
                          60대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[60] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[60] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[60]}점
                      </p>
                    </div>
                  </div>
                  <div className="age-item row-group gap48">
                    <div className="col-group gap24 al-ce">
                      <img src={resultPageData.age > 70 ? images.age_icon_7_on : images.age_icon_7} alt="" className="icon" />
                      <div className="row-group gap8">
                        <p className="default-txt default-txt-ss">
                          71~80세
                        </p>
                        <p className="default-txt default-txt-bold">
                          70대
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap4">
                      <div className="age-score-wrap col-group">
                        <div className={`age-score ${resultPageData[70] >= 10 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 20 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 30 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 40 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 50 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 60 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 70 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 80 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 90 ? 'active' : ''}`}></div>
                        <div className={`age-score ${resultPageData[70] >= 100 ? 'active' : ''}`}></div>
                      </div>
                      <p className="default-txt default-txt-ss right">
                        {resultPageData[70]}점
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`section life-score-section ${resultPageData.age < 10 && 'age0' ||
                resultPageData.age < 20 && 'age1' ||
                resultPageData.age < 30 && 'age2' ||
                resultPageData.age < 40 && 'age3' ||
                resultPageData.age < 50 && 'age4' ||
                resultPageData.age < 60 && 'age5' ||
                resultPageData.age < 70 && 'age6' ||
                resultPageData.age < 80 && 'age6'
                }`}>
                <div className="life-score-title-wrap col-group gap16">
                  <img src={images.icon_life_score} alt="" className="img" />
                  <p className="life-score-title">
                    <span className="green">인생점수</span> 결과
                  </p>
                </div>
                <div className="life-score-result-wrap col-group gap56">
                  <div className="row-group gap56">
                    <div className="title-wrap col-group gap40">
                      <div className="icon"></div>
                      <div className="row-group gap24">
                        <div className="txt-group col-group gap32">
                          <p className="default-txt default-txt-bold">
                            {resultPageData.name}
                          </p>
                          <p className="default-txt">
                            {resultPageData.age}세
                          </p>
                        </div>
                        <div className="score">
                          평균 {resultPageData.life_average}점
                        </div>
                      </div>
                    </div>
                    <div className="row-group gap32">
                      <p className="default-txt">
                        본 인생점수는, 지나온 각자의 시간들에 대해 스스로 평가한 <br />
                        만족도 지표입니다.
                      </p>
                      <p className="default-txt default-txt-l default-txt-bold green">
                        {
                          ref29ScoreResult &&
                          ref29ScoreResult[ref29ScoreType] &&
                          ref29ScoreResult[ref29ScoreType].review || 'review가 없습니다'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="chart">
                    <div className="chart-txt">
                      {resultPageData.life_average}점
                    </div>
                    <Doughnut data={chartData2} options={chartOptions2} />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[30]}>
          <main className="main">
            <p className="page-num">29</p>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    <span className="green">R</span>emember 기억하기
                  </h3>
                </div>
                <div className="row-group gap24">
                  <p className="default-txt default-txt-bold">
                    시대는 빠르게 변화하고 있습니다. 내가 틀릴 수도 있다라는 생각으로 변화를 시작해야합니다.
                  </p>
                  <p className="default-txt">
                    {
                      ref29ScoreResult &&
                      ref29ScoreResult[ref29ScoreType] &&
                      ref29ScoreResult[ref29ScoreType].remember || 'remember 없습니다'
                    }
                  </p>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    <span className="green">R</span>einterpretation 재해석하기
                  </h3>
                </div>
                <div className="row-group gap24">
                  <p className="default-txt default-txt-bold">
                    몸을 새로운 마음에 길들여 조화를 이루게 하는 무의식 재학습 프로그램
                  </p>
                  <p className="default-txt">
                    {
                      ref29ScoreResult &&
                      ref29ScoreResult[ref29ScoreType] &&
                      ref29ScoreResult[ref29ScoreType].reinterpretation || 'reinterpretation 없습니다'
                    }
                  </p>
                </div>
              </div>
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">3</div>
                  <h3 className="section-title">
                    <span className="green">R</span>efresh 새롭게 하기
                  </h3>
                </div>
                <div className="row-group gap24">
                  <p className="default-txt default-txt-bold green">
                    '지금여기'에 좋은 사람과 좋은 시간을 보내는 것이 방법입니다.
                  </p>
                  <p className="default-txt">
                    {
                      ref29ScoreResult &&
                      ref29ScoreResult[ref29ScoreType] &&
                      ref29ScoreResult[ref29ScoreType].refresh || 'refresh 없습니다'
                    }
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
        {resultPageData.life_average <= 90 &&
          <div className='page-common' ref={printPageRefs[31]}>
            <main className="main">
              <p className="page-num">29</p>

              <div className="section-wrap row-group">
                <div className="section">
                  <div className="section-title-wrap col-group">
                    <div className="num">4</div>
                    <h3 className="section-title">
                      <span className="green">R</span>eformation 개선하기
                    </h3>
                  </div>
                  <div className="row-group gap24">
                    <p className="default-txt">
                      이러한 생각의 고리들이 당신을 자꾸 수렁으로 밀어 넣고 있는 것입니다. 내 안에서 만들어 놓은 타인과 자신에 대한 부정적인 생각의 고리들을 끊어내야 합니다. 그래야 다시 시작할 수 있습니다. 용기를 내어 인생재건축을 시작해봅니다. 정확한 자기분석은 인생을  변화하는 첫걸음이 될 것입니다.
                    </p>
                    <div className="col-group gap24">
                      {ref29ScoreResult[ref29ScoreType].reformation.map((item, index) => (
                        <div className="green-border-box row-group gap24 center" key={index}>
                          <p className="default-txt default-txt-bold green">
                            {item.name}
                          </p>
                          <p className="default-txt default-txt-s">
                            {item.content}
                          </p>
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down" />
                          <p className="default-txt default-txt-s default-txt-bold">
                            {item.result}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="col-group gap24">
                      {ref29ScoreResult[ref29ScoreType].reformation.map((item, index) => (
                        <div className="green-tip-box row-group gap16 center" key={index}>
                          <div className="icon">TIP</div>
                          <p className="default-txt default-txt-bold">
                            {item.tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="section">
                  <div className="section-title-wrap col-group">
                    <div className="num">5</div>
                    <h3 className="section-title">
                      <span className="green">R</span>econstruction 새로 세우기
                    </h3>
                  </div>
                  <div className="col-group gap56">
                    <img src={images.Reconstruction} alt="" className="recons-img" />
                    <p className="default-txt">
                      {ref29ScoreResult[ref29ScoreType].reconstruction}
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>}
        {resultPageData.life_average > 90 &&
          <div className='page-common' ref={printPageRefs[32]}>
            <main className="main">
              <p className="page-num">30</p>

              <div className="section-wrap row-group">
                <div className="section">
                  <div className="section-title-wrap col-group">
                    <div className="num">4</div>
                    <h3 className="section-title">
                      <span className="green">R</span>eformation 개선하기
                    </h3>
                  </div>
                  <div className="col-group gap40">
                    <div className="row-group gap24 half-div">
                      <div className="green-border-box row-group gap24 center">
                        <p className="default-txt default-txt-bold green">
                          1. 후회하는 태도
                        </p>
                        <p className="default-txt default-txt-s">
                          과거에 ‘더 잘했어야 했는데’라고 생각한다.
                        </p>
                        <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down" />
                        <p className="default-txt default-txt-s">
                          “그런 말을 해서는 안 되는 것이었는데.” <br />
                          “공부를 좀 더 열심히 했어야 했는데.”
                        </p>
                      </div>
                      <div className="green-tip-box col-group gap16">
                        <div className="icon">TIP</div>
                        <p className="default-txt default-txt-bold">
                          지나간 일들에 대해 후회나 원망을 할 필요가 없습니다. <br />
                          당신은 충분히 지금 여기 잘살고 있기 때문입니다.
                        </p>
                      </div>
                    </div>
                    <div className="row-group gap24 half-div">
                      <div className="step-item-list border row-group">
                        <div className="border-dash row-group gap24">
                          <p className="default-txt default-txt-bold green">
                            1. 스스로 비난하는(자기비판 영역)
                          </p>
                          <p className="default-txt default-txt-s">
                            예: 모든 사람들이 나를 비난한다.
                          </p>
                          <img src={images.icon_arrow_bold_down} alt=""
                            className="icon-arrow-down icon-arrow-right" />
                        </div>
                        <div className="border-dash row-group gap24">
                          <p className="default-txt default-txt-bold green">
                            2. 내가 바라는 나
                          </p>
                          <p className="default-txt default-txt-s">
                            예: 모두에게 존경받는
                          </p>
                          <img src={images.icon_arrow_bold_down} alt=""
                            className="icon-arrow-down icon-arrow-right" />
                        </div>
                        <div className="border-dash row-group gap24">
                          <p className="default-txt default-txt-bold green">
                            3. 왜곡된 인지
                          </p>
                          <p className="default-txt default-txt-s">
                            예: 모두에게 인정받는 것은 불가능
                          </p>
                          <img src={images.icon_arrow_bold_down} alt=""
                            className="icon-arrow-down icon-arrow-right" />
                        </div>
                        <div className="border-dash row-group gap24">
                          <p className="default-txt default-txt-bold green">
                            4. 행동의 변화
                          </p>
                          <p className="default-txt default-txt-s">
                            예: 3-3-4 법칙 이해
                          </p>
                          <img src={images.icon_arrow_bold_down} alt=""
                            className="icon-arrow-down icon-arrow-right" />
                        </div>
                      </div>
                      <div className="green-tip-box col-group gap16">
                        <div className="icon">TIP</div>
                        <p className="default-txt default-txt-bold">
                          스스로 자신을 비난하는 영역은 없는지 <br />
                          체크해 보세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section">
                  <div className="section-title-wrap col-group">
                    <div className="num">5</div>
                    <h3 className="section-title">
                      <span className="green">R</span>econstruction 새로 세우기
                    </h3>
                  </div>
                  <div className="col-group gap56">
                    <img src={images.Reconstruction} alt="" className="recons-img" />
                    <p className="default-txt">
                      나도 모르게 ‘나는 부적합한 사람이며 타인에게 거절당할 지도 모른다’는 두려움을
                      갖게됩니다. 이와 동시에 ‘실패’에 대한 두려움에 내 능력을 제대로 발휘하지도
                      못하고, 창피당할 것이 두려워 감정을 숨기는 일이 많았습니다. 이 점은 스스로에 대한
                      과도한 기대 때문에 시작된 것일 수 있습니다. <strong className="green">더 잘해야 하고, 더 유능해 보여야 하고, 더 완벽해야 한다는 기대가 타인과 나를 비교하고 자꾸만 외부 시선을 의식하게 합니다.</strong> <br />
                      <br />
                      다른 사람의 칭찬을 얻기 위해 나 자신의 모습을 저버리는 일을 그만두어야 합니다.
                      그리고 용기를 내어 ‘내 모든 감정은 나의 것이며 나의 생각과 말과 행동은 타인의
                      인정과 감사를 받기 위해서가 아니라 내가 진정 원하기 때문’임을 선언해야 합니다.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>}
        <div className='page-common' ref={printPageRefs[33]}>
          <main className="main">
            <p className="page-num">30</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">08</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  융합역량지수 Meta-Q
                </h2>
                <p className="main-sub-title">
                  01. 융합역량지수 Meta-Q
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="section-title">
                    융합역량지수 Meta-Q
                  </h3>
                </div>
                <div className="result-score-container col-group gap40">
                  <div className="result-score-wrap type2">
                    <div className="result-score-title-wrap col-group sp-bt">
                      <p className="result-score-title">
                        나의 Meta-Q검사 결과
                      </p>
                      <div className="result-score-num">
                        <strong>{resultPageData.metaQ}</strong>
                        점
                      </div>
                    </div>
                    <div className="result-score number">
                      <div className="result-score-gauge" style={{ width: `${(resultPageData.metaQ / 300) * 100}%` }}></div>
                      <div className="line" style={{ left: '25%' }}></div>
                      <div className="line" style={{ left: '50%' }}></div>
                      <div className="line" style={{ left: '75%' }}></div>
                      <div className="result-score-num-wrap col-group">
                        <p className="num">0</p>
                        <p className="num">75</p>
                        <p className="num">150</p>
                        <p className="num">225</p>
                        <p className="num">300</p>
                      </div>
                    </div>

                    <div className="result-score-list row-group">
                      <div className="result-score-item col-group gap24">
                        <div className="num">
                          {nextItem.score}
                        </div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            {nextItem.title}
                          </p>
                          <p className="txt">
                            {nextItem.desc}
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="num">
                          {selectedItem.score}
                        </div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            {selectedItem.title}
                          </p>
                          <p className="txt">
                            {selectedItem.desc}
                          </p>
                        </div>
                      </div>
                      <div className="result-score-item col-group gap24">
                        <div className="num">
                          {previousItem.score}
                        </div>
                        <div className="txt-group row-group gap8">
                          <p className="title">
                            {previousItem.title}
                          </p>
                          <p className="txt">
                            {previousItem.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="result-score-txt-wrap row-group gap40">
                    <div className="result-score-txt type2">
                      당신의 융합역량은 <span className="color">{selectedItem.title}</span>입니다.
                      <img className='result-score-txt-img' data-src={images[selectedItem.img]} src={images[selectedItem.img]} alt='' />
                    </div>
                    <p className="default-txt">
                      {selectedItem.detail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="row-group gap32">
                  <div className="step-item-list border">
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">01</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          존재방식
                        </p>
                        <p className="default-txt">
                          {selectedItem.wayOfBeing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[34]}>
          <main className="main">
            <p className="page-num">31</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">08</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  융합역량지수 Meta-Q
                </h2>
                <p className="main-sub-title">
                  02. 성장을 위한 전략
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="row-group gap32">
                  <div className="step-item-list border">
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">02</div>
                      <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                          의식의 흐름
                        </p>
                        <p className="default-txt">
                          {selectedItem.streamOfConsciousness}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[35]}>
          <main className="main">
            <p className="page-num">31</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">08</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  융합역량지수 Meta-Q
                </h2>
                <p className="main-sub-title">
                  02. 성장을 위한 전략
                </p>
              </div>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">2</div>
                  <h3 className="section-title">
                    성장을 위한 전략
                  </h3>
                </div>
                <div className="row-group gap32">
                  <div className="green-border-box row-group gap24 bg-green strategy-1">
                    <p className="default-title green">
                      “나는 내려놓습니다”
                    </p>
                    <div className="row-group gap4">
                      {ref34ToGrowth[resultPageData.power_num][0].items.map((item, index) => (
                        <p className="default-txt default-txt-bold dot" key={index}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="green-border-box row-group gap24 strategy-2">
                    <p className="default-title green">
                      “나는 받아들입니다”
                    </p>
                    <div className="row-group gap4">
                      {ref34ToGrowth[resultPageData.power_num][1].items.map((item, index) => (
                        <p className="default-txt dot" key={index}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[36]}>
          <main className="main">
            <p className="page-num">32</p>
            <div className="main-title-wrap col-group">
              <div className="num dan green">08</div>
              <div className="main-title-group row-group">
                <h2 className="main-title">
                  융합역량지수 Meta-Q
                </h2>
                <p className="main-sub-title">
                  03. 나의 강점과 핵심가치
                </p>
              </div>
            </div>

            <div className="section-top section-top-08">
              <img src={images.section_top_02} alt="" className="img" />
              <p className="txt">
                나는 지금 어디를 향해 가고 있나요? 내가 가고 있는 길에서 중요한 것은 무엇일까요? <br />
                무엇이 나를 살게 하고, 무엇이 나를 힘들게 하나요? 내가 정말 원하는 것은 무엇일까요?
              </p>
            </div>

            <div className="section-wrap row-group">
              <div className="section">
                <div className="section-title-wrap col-group">
                  <div className="num">1</div>
                  <h3 className="default-title">
                    마인드인사이트를 통해 발견한 나의 강점과 핵심가치 확인하기
                  </h3>
                </div>
                <div className="row-group gap32">
                  <p className="default-title green">
                    Step1 : 나만의 강점은 무엇인가요?
                  </p>
                  <p className="default-txt">
                    마인드 인사이트 결과지를 모두 살펴본 후 당신은, 당신을 얼마나 더 잘 이해하게 되었나요? <br />
                    이미 알고 있었던 면과 새롭게 발견한 면, 인정하는 부분과 받아들이기 어려운 부분까지 그 모든 면이 합쳐져 나를 이루고 있습니다. <br />
                    <br />
                    이제 스스로 각자의 강점을 직접 적어봅니다. 누군가와 비교하거나 자체검열로 주저하지 말고 솔직하게 떠오르는 것들을 그대로 적어봅니다. 개인이 가진 강점의 많은 부분은 어린 시절에 만들어집니다. 지금 당장 떠오르는 강점이 없다면, 과거를 떠올리며 적어봅니다.
                  </p>
                </div>
              </div>
              <div className="section">
                <div className="letter-wrap">
                  <div className="letter-title-wrap row-group gap16">
                    <p className="letter-sub-title">
                      My Strength
                    </p>
                    <p className="letter-title">
                      내가 생각하는 내 강점
                    </p>
                  </div>
                  <div className="row-group gap56 letter-group">
                    <div className="letter-item col-group">
                      <p className="default-txt">
                        나에게는
                      </p>
                      <p className="default-txt">
                        한 특별함이 있습니다.
                      </p>
                    </div>
                    <div className="letter-item col-group">
                      <p className="default-txt">
                        나는
                      </p>
                      <p className="default-txt">
                        을 참 잘합니다.
                      </p>
                    </div>
                    <div className="letter-item col-group">
                      <p className="default-txt">
                        나는
                      </p>
                      <p className="default-txt">
                        을 할 때 시간 가는 줄 모르고 집중합니다.
                      </p>
                    </div>
                    <div className="letter-item col-group">
                      <p className="default-txt">
                        나는
                      </p>
                      <p className="default-txt">
                        을 할 때 나의 존재감을 느낍니다.
                      </p>
                    </div>
                    <div className="letter-item col-group">
                      <p className="default-txt">
                        나는
                      </p>
                      <p className="default-txt">
                        을 하고 싶고, 할 것입니다.
                      </p>
                    </div>
                    <div className="letter-item col-group">
                      <p className="default-txt">
                        나는
                      </p>
                      <p className="default-txt">
                        을 통해 내가 속한 공동체에 기여하고 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[37]}>
          <main className="main">
            <p className="page-num">33</p>

            <div className="section">
              <div className="row-group gap32">
                <div className="row-group gap40">
                  <p className="default-title green">
                    Step2 : 강점리스트 만들기
                  </p>
                  <p className="default-txt">
                    강점은 사전적으로 ‘남보다 우세하거나 더 뛰어난 점’이라고 정의하고 있습니다. 능력과 성과를 중시하는 현대 사회에서는 다양한 분야에서 서로 다른 의미로 사용되고 있기도 한 이 강점은, 단순히 남보다 우세하거나 더 뛰어나다고 해서 쓰이는 말이 아닙니다. <br />
                    <br />
                    자신이 가진 것과 자신에게 없는 것을 있는 그대로 인정하고, 가진 것을 잘 활용하여 좋은 결과를 낼 수 있도록 끊임없이 노력하는 이 성장의 과정이 모두 강점을 만드는 요인입니다. 그러기 위해서는 먼저 자신이 무엇을 가진 사람인지 파악하는 것이 중요합니다.
                  </p>
                </div>
                <div className="check-list col-group">
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      자기 주도적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      겸손한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      인내심이 강한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      긍정적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      원칙을 지키는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      민감한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      배움을 즐기는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      독창적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      성실한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      계획적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      성취감이 높은
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      숙련된
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      승부욕 강한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      추진력 있는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      심사숙고하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      소통을 잘 하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      신념이 강한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      유연한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      전략적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      관계를 중요시하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      정리정돈을 잘하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      존재감 있는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      목표 지향적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      자기 성찰적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      문제해결을 잘하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      책임감이 있는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      성장을 돕는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      강점에 집중하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      이야기를 즐기는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      수용하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      이타적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      중재하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      활기찬
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      단호한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      사교적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      공감을 잘하는
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      솔직한
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      협조적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      독립적인
                    </p>
                  </div>
                  <div className="check-item col-group gap16">
                    <div className="check-icon"></div>
                    <p className="check-txt">
                      신뢰가 가는
                    </p>
                  </div>
                </div>
                <div className="input-box">
                  <i className="icon"></i>
                </div>
                <p className="default-txt">
                  단어들을 천천히 살펴보면서 나에 해당 되는 부분에 동그라미로 표시 해 보세요. <br />
                  제시된 단어 가운데 나의 강점을 표현하는 용어가 없다면 빈 칸에 스스로 적어봅니다. <br />
                  <br />
                  <strong>모두 찾았다면, 선택한 제시어 가운데 몇 개를 골라 예시와 같은 문장으로 만들어 봅니다.</strong>
                </p>
                <div className="example-box">
                  <div className="label">예시</div>
                  <p className="default-txt">
                    나는 공감을 잘하고 강점에 집중하는 사람입니다. 이와 같은 나의 강점은 어려운 사람들의 이야기를 잘 들어주고 지지해줌으로써 그들이 어려움을 헤쳐나갈 수 있도록 돕습니다.
                  </p>
                </div>
                <div className="row-group gap56">
                  <div className="step-item col-group gap24">
                    <div className="step-item-num">01</div>
                    <div className="step-item-txt-wrap">
                      <div className="letter-list row-group gap24">
                        <div className="letter-item col-group min">
                          <p className="default-txt">나는</p>
                          <p className="default-txt">하고,</p>
                          <p className="default-txt">하는 사람입니다.</p>
                        </div>
                        <div className="letter-item col-group">
                          <p className="default-txt">이와 같은 나의 강점은,</p>
                          <p className="default-txt">합니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="step-item col-group gap24">
                    <div className="step-item-num">02</div>
                    <div className="step-item-txt-wrap">
                      <div className="letter-list row-group gap24">
                        <div className="letter-item col-group min">
                          <p className="default-txt">나는</p>
                          <p className="default-txt">하고,</p>
                          <p className="default-txt">하는 사람입니다.</p>
                        </div>
                        <div className="letter-item col-group">
                          <p className="default-txt">이와 같은 나의 강점은,</p>
                          <p className="default-txt">합니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="step-item col-group gap24">
                    <div className="step-item-num">03</div>
                    <div className="step-item-txt-wrap">
                      <div className="letter-list row-group gap24">
                        <div className="letter-item col-group min">
                          <p className="default-txt">나는</p>
                          <p className="default-txt">하고,</p>
                          <p className="default-txt">하는 사람입니다.</p>
                        </div>
                        <div className="letter-item col-group">
                          <p className="default-txt">이와 같은 나의 강점은,</p>
                          <p className="default-txt">합니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="green-tip-box col-group gap24">
                    <div className="icon">TIP</div>
                    <p className="default-txt default-txt-bold">
                      변화는, 있는 그대로의 나를 인정하고 깊이 들여다보는 일에서 시작됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[38]}>
          <main className="main">
            <p className="page-num">34</p>

            <div className="section">
              <div className="row-group gap32">
                <div className="row-group gap40">
                  <p className="default-title green">
                    Step3 : 핵심가치 리스트 만들기
                  </p>
                  <div className="check-list-wrap col-group">
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        사랑
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            영적인 삶
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            의미있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            환대하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            포용적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            이타적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            의지적인
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        도전
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            열정적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            모험하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            용기있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            성취하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            대담한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            자신감 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            경험하는
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        자유
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            창의적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            독립적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            목표의식
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            주도적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            재미있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            유연한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            개방적인
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        사회
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            영향력 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            인정 받는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            리더십 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            성실한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            추진력 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            결단력 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            유능한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            정직한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            완벽한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            협력하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            소속된
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            함께하는
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        성장
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            지혜로운
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            통찰력 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            깨닫는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            깊이 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16 wide">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            자기성찰적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            탐색하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            아는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            의식적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            공부하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            통합하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            멈추지 않는
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        관계
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            공감적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            진정성 있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            사려 깊은
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            열린 마음
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            관대한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            협동적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            도움 주는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            존중하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            나누는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            배려하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            연결된
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        평화
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            조화로운
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            만족하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            평온한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            감사하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            헌신하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            안정적인
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        즐거움
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            유연한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            유머있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            자극적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            활동적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            열정적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            가벼운
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            쉬운
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        지향
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16 wide">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            현재에 집중하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16 wide">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            미래 지향적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            이상적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            현실적인
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        정의
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            합리적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            상식적인
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            공평한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            평등한
                          </p>
                        </div>
                        <div className="check-item col-group gap16 wide">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            배제하지 않는
                          </p>
                        </div>
                        <div className="check-item col-group gap16 wide">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            타협하지 않는
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        아름다움
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            사랑스러운
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            빛이 나는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            눈에 띄는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            세련된
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            우아한
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            교양있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            자연스러운
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="green-border-box row-group gap32">
                      <div className="check-list-title">
                        성공
                      </div>
                      <div className="check-list col-group">
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            도달하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            성취하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            승리하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            지배하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            능력있는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            달성하는
                          </p>
                        </div>
                        <div className="check-item col-group gap16">
                          <div className="check-icon"></div>
                          <p className="check-txt">
                            앞서는
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="input-box">
                  <i className="icon"></i>
                </div>
                <p className="default-txt">
                  단어들을 천천히 살펴보면서 나에 해당 되는 부분에 동그라미로 표시 해 보세요. <br />
                  제시된 단어 가운데 나의 가치를 표현하는 용어가 없다면 빈 칸에 스스로 적어봅니다. <br />
                  <br />
                  <strong>모두 찾았다면, 선택한 제시어 가운데 세 개를 골라 예시와 같은 문장으로 만들어 봅니다.</strong>
                </p>
                <div className="example-box">
                  <div className="label">예시</div>
                  <p className="default-txt">
                    나에게는 영적인 삶이 매우 중요합니다. 이를 위해 의식적으로 항상 깨어있으려 하고 <br />
                    나에게 주어진 삶을 수용적으로 받아들이며 영성을 깨닫기 위해 노력하는 것이 중요합니다.
                  </p>
                </div>
                <div className="row-group gap56">
                  <div className="step-item col-group gap24 al-en">
                    <div className="step-item-num">01</div>
                    <div className="step-item-txt-wrap">
                      <div className="letter-item"></div>
                    </div>
                  </div>
                  <div className="step-item col-group gap24 al-en">
                    <div className="step-item-num">02</div>
                    <div className="step-item-txt-wrap">
                      <div className="letter-item"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className='page-common' ref={printPageRefs[39]}>
          <main className="main">
            <p className="page-num">35</p>

            <div className="section">
              <div className="row-group gap40">
                <p className="default-title green">
                  Step4 : 강점과 신념 활용 셀프코칭
                </p>
                <div className="row-group gap56">
                  <div className="step-item-list border">
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">01</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          위에서 찾은 강점 가운데 스스로 가장 마음에 드는 것은 무엇이며 나는 그 강점을 주로 어떻게 사용하나요?
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">02</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          나를 기쁘게 하고 움직이게 하는 강점은 무엇인가요? 나는 그 강점을 얼마나 자주 사용하나요?
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">03</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          나의 강점으로 선택하지는 못했지만, 갖고 싶은 강점은 무엇인가요? 그 강점이 있다면 나의 무엇이 달라질까요?
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">04</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          나는 나의 모든 강점을 얼마나 잘 활용하고 있나요? 구체적으로 적어봅니다.
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">05</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          위에서 찾은 핵심가치들은 나의 신념에 어떤 영향을 주었을까요? 핵심가치에 의해 만들어진 신념을 찾아 적어봅니다.
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">06</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          살아가면서 나를 힘들게 했던 신념이 있다면 무엇인가요? 그리고 그 신념은 왜, 어떻게 만들어 졌나요?
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                    <div className="step-item border-dash col-group gap24">
                      <div className="step-item-num">07</div>
                      <div className="step-item-txt-wrap row-group gap32">
                        <p className="default-txt default-txt-bold">
                          Step3에서 표시한 핵심가치 가운데, 내 인생에 꼭 필요하다고 생각하는 가치들에만 더 굵게 표시해봅니다. <br />
                          그리고 이 초핵심가치들로 나의 신념을 새롭게 정의해봅니다.
                        </p>
                        <div className="empty-box-wrap col-group">
                          <img src={images.icon_arrow_bold_down} alt="" className="icon-arrow-down icon-arrow-right" />
                          <div className="empty-box"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Container >}
    </div>
  )
}

export default App;

