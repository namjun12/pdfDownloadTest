import DOMPurify from 'dompurify'
import React from 'react'

const ResultScoreTextWrap = ({scoreType, DetailText}) => {
   return (
      <div className="result-score-txt-wrap row-group gap40">
         <div className={`result-score-txt ${scoreType}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(DetailText.title) }} />
         <p className="default-txt" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(DetailText.desc) }} />
      </div>
   )
}

export default ResultScoreTextWrap