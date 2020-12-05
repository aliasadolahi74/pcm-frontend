import React, { Component } from "react";

class Support extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <section className="mb-2">
          <div className="section-header mb-5">
            <h1 className="section-title">پشتیبانی</h1>
          </div>
          <div className="section-content">
            <h5 className="mb-2 d-block">راه‌های ارتباط با ما:</h5>
            <div className="info-container mt-4">
              <span>آدرس:</span>
              <span></span>
              <span>شماره تماس:</span>
              <span></span>
              <span>پست الکترونیک:</span>
              <span></span>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Support;
