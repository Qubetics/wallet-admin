import React from "react";
import "./CommonCard.scss";
function CommonCard({ image, heading, date, text, subText, className, data }) {
  return (
    <div className={`commonCard ${className}`}>
      <div className="commonCard_top">
        <img src={image} width={52} height={52} alt="rewarded" />
        <h3>{heading}</h3>
        <p>{date}</p>
      </div>
      <div className="commonCard_bottom">
        {data.length > 0 &&
          data.map((val, idx) => (
            <div key={idx} className="commonCard_bottom_text">
              <p className="totalSwap">{val.text}</p>
              <p className="valuetext">{val.valuetext}</p>
              <p className="swap">{val.subText}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
export default CommonCard;
