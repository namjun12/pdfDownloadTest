import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { images } from './images';

const Container = styled.div`
position: absolute;
top: -9999px;
left: -9999px;
background-color: #fff;

img{
  width: 100%;
}

/* 페이지 공통 */
.page-common{
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1920px;
  max-width: 100%;
  height: 2717px;
  background-color: #fff;
}
.page-5{
   .step-item-sub-title, .tip-item{
      font-size: 22px;
   }
   .step-item-list .border-dash{
      padding: 18px 0px;
   }
}
.page-25{
   .row-group{
      gap: 32px;
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
   font-size: 22px; 
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
.main {  position: relative; max-width: 1560px; padding: 6.5625vw 0; }
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
.result-score .line { position: absolute; width: 0; height: 64px; border-left: 2px dashed #202020; top: 50%; transform: translateY(-50%); }
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
.result-score-wrap.type2 .result-score-item:nth-child(2) .txt { font-weight: bold; color: #ff5b36; }
.result-score-wrap.type2 .result-score-gauge { background: #ff5b36; }
.result-score-wrap.type2 .result-score-item:nth-child(2) .icon { background-image: url(${images.icon_result_score_02_active}); }
.result-score-wrap.type3 .result-score-item:nth-child(3) .title { font-size: 26px; }
.result-score-wrap.type3 .result-score-item:nth-child(3) .txt { font-size: 30px; }
.result-score-wrap.type3 .result-score-num, 
.result-score-wrap.type3 .result-score-num *,
.result-score-wrap.type3 .result-score-item:nth-child(3) .title,
.result-score-wrap.type3 .result-score-item:nth-child(3) .txt { font-weight: bold; color: #d7262e; }
.result-score-wrap.type3 .result-score-gauge { background: #d7262e; }
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
.result-score-txt.type1 .color { color: #0077ff; }
/* .result-score-txt.type1::after { background-image: url(${images.result_score_img_01}); } */
.result-score-txt.type2 .color { color: #ff5b36; }
/* .result-score-txt.type2::after { background-image: url(${images.result_score_img_02}); } */
.result-score-txt.type3 .color { color: #d7262e; }
.result-score-txt.type3::after { background-image: url(${images.result_score_img_03}); }
.result-score-txt.type4 .color { color: #d7262e; }
/* .result-score-txt.type4::after { background-image: url(${images.result_score_img_04}); } */

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
.step-item-list.border { padding: 0 32px; border: 3px solid #00754a; border-radius: 16px; background-color: #ffffff; }
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
.meta-q-icon.lang { background-image: url(${images.icon_lang_red}); }
.red .meta-q-icon.lang { background-image: url(${images.icon_lang_red}); }
.green .meta-q-icon.lang { background-image: url(${images.icon_lang_green}); }
.meta-q-icon.logic { background-image: url(${images.icon_lang_red}); }
.red .meta-q-icon.logic { background-image: url(${images.icon_logic_red}); }
.green .meta-q-icon.logic { background-image: url(${images.icon_logic_green}); }
.meta-q-icon.music { background-image: url(${images.icon_lang_red}); }
.red .meta-q-icon.music { background-image: url(${images.icon_music_red}); }
.green .meta-q-icon.music { background-image: url(${images.icon_music_green}); }
.meta-q-icon.physical { background-image: url(${images.icon_physical}); }
.red .meta-q-icon.physical { background-image: url(${images.icon_physical_red}); }
.green .meta-q-icon.physical { background-image: url(${images.icon_physical_green}); }
.meta-q-icon.space { background-image: url(${images.icon_space}); }
.red .meta-q-icon.space { background-image: url(${images.icon_space_red}); }
.green .meta-q-icon.space { background-image: url(${images.icon_space_green}); }
.meta-q-icon.nature { background-image: url(${images.icon_nature}); }
.red .meta-q-icon.nature { background-image: url(${images.icon_nature_red}); }
.green .meta-q-icon.nature { background-image: url(${images.icon_nature_green}); }
.meta-q-icon.friendly { background-image: url(${images.icon_friendly}); }
.red .meta-q-icon.friendly { background-image: url(${images.icon_friendly_red}); }
.green .meta-q-icon.friendly { background-image: url(${images.icon_friendly_green}); }
.meta-q-icon.personal { background-image: url(${images.icon_personal}); }
.red .meta-q-icon.personal { background-image: url(${images.icon_personal_red}); }
.green .meta-q-icon.personal { background-image: url(${images.icon_personal_green}); }

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
.wing-type-section::after { content: ''; display: block; width: 100vw; height: calc( 100% + 104px + 6.5625vw ); background: #d9eee6; position: absolute; top: -104px; z-index: -1; left: calc( ( -100vw + 1560px ) / 2 ); }
.wing-type-group { padding: 24px 0; gap: 120px; position: relative; z-index: 0; }
.wing-type-group:not(:last-child) { border-bottom: 2px dashed #00754a; }
.wing-type-group:not(:last-child)::after { content: ''; display: block; position: absolute; width: 3px; height: 100%; background: #00754a; left: 50%; top: 50%; transform: translateX(-50%); z-index: -1; }
.wing-type-group .num { position: absolute; width: 64px; height: 64px; border-radius: 50%; border: 3px solid #00754a; text-align: center; line-height: 58px; background: #fff; font-size: 24px; font-weight: bold; color: #00754a; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.wing-type-item { width: calc( 50% - 60px ); }
.wing-type-item:first-child { align-items: flex-end; text-align: right; }

/* 융합역량지수-06-01 관계와 소통 분석 */
.ego-result-item { width: 100%; height: 135px; border-radius: 20px; box-shadow: 1px 2px 8px 0 rgba(0, 0, 0, 0.16); background: #fff; align-items: center; justify-content: center; }
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
.life-score-section::after { content: ''; display: block; width: 100vw; height: calc( 100% + 6.5625vw ); background-color: #d9eee6; position: absolute; bottom: -6.5625vw; z-index: -1; left: calc( ( -100vw + 1560px ) / 2 ); background-repeat: no-repeat; background-size: 1920px; background-position: center bottom 100px; }
.life-score-title-wrap { margin-bottom: 40px; align-items: flex-end; }
.life-score-section.age0::after { background-image: url(${images.life_score_section_0}); }
.life-score-section.age1::after { background-image: url(${images.life_score_section_1}); }
.life-score-section.age2::after { background-image: url(${images.life_score_section_2}); }
.life-score-section.age3::after { background-image: url(${images.life_score_section_3}); }
.life-score-section.age4::after { background-image: url(${images.life_score_section_4}); }
.life-score-section.age5::after { background-image: url(${images.life_score_section_5}); }
.life-score-section.age6::after { background-image: url(${images.life_score_section_6}); }
.life-score-section.age7::after { background-image: url(${images.life_score_section_7}); }
.life-score-title-wrap .img { width: 56px; }
.life-score-title { font-size: 48px; font-weight: bold; }
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
.green-tip-box { width: 100%; padding: 32px 24px; background: #d9eee6; border-radius: 16px; align-items: baseline; }
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
.result-score-wrap.type1 .result-score-item:nth-child(1) .num { border-color: #007a10; color: #fff; background: #007a10; }
.result-score-wrap.type2 .result-score-item:nth-child(2) .num { border-color: #ff5b36; color: #fff; background: #ff5b36; }
.result-score-wrap.type3 .result-score-item:nth-child(3) .num,
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
.letter-wrap { width: 1120px; margin: 0 auto; background: #fff; border-radius: 20px; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16); border: solid 3px #eee; padding: 0 104px; padding-bottom: 560px; padding-top: 95px; position: relative; }
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

  // 데이터
  const [resultPageData, setResultPageData] = useState();
  const fetchData = async () => {
    try {
      const response = await axios.post('https://test.behwan.co.kr/api/test/data')
      setResultPageData(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  // 페이지 리스트
  const printPageRefs = Array.from({ length: 2 }, () => React.createRef());
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
          console.log('fail: ', element)
          continue;
        }
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage(); // 첫 페이지는 addPage 필요 없음
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      } catch (error) {
        console.log(error)
      }
    }

    //   ========== PDF 저장 ========== 
    pdf.save(`insight_pdf_file.pdf`);
    alert('완료 되었습니다.')

  }
  useEffect(() => {
    fetchData();
  }, [])

  if(!resultPageData) return;


  return (
    <div className="App">
      <button onClick={handleDownloadPdf}>PDf 다운로드</button>
      <Container>
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
      </Container>
    </div>
  );
}

export default App;
