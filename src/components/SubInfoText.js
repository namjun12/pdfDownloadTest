import React from 'react'

const SubInfoText = ({ subText }) => {
   return (
      <div className='sub-info-text-wrap'>
         <span className='sub-info-text'>※</span>
         <span className='sub-info-text'>{subText}</span>
      </div>
   )
}

export default SubInfoText