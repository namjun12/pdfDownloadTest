import React from 'react'

const BalanceOfPowerWings = ({ data }) => {
   return (
      <div className="section">
         <div className="section-title-wrap col-group">
            <div className="num">1</div>
            <h3 className="section-title">
               {data.title}
            </h3>
         </div>
         <div className="step-item-list border">
            {data.contents.map((item, index) => (
               item.descType === 'p' ? (
                  <div className="step-item border-dash col-group gap24" key={index}>
                     <div className="step-item-num">0{index+1}</div>
                     <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                           갈등이 발생하는 원인
                        </p>
                        <p className="default-txt">
                           {item.desc}
                        </p>
                     </div>
                  </div>
               ) : (
                  <div className="step-item border-dash col-group gap24" key={index}>
                     <div className="step-item-num">0{index+1}</div>
                     <div className="step-item-txt-wrap row-group gap16">
                        <p className="default-title green">
                           {index === 1 ? '갈등을 예방하기 위한 관계 전략' : '성장 전략'}
                        </p>
                        <div className="row-group gap4">
                           {(Array.isArray(item.desc) ? item.desc : []).map((descItem, descIndex) => (
                              <p className="default-txt dot" key={descIndex}>
                                 {descItem}
                              </p>
                           ))}
                        </div>
                     </div>
                  </div>
               )
            ))}
         </div>
      </div>
   )
}

export default BalanceOfPowerWings