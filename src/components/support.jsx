import React, { Component } from "react";
import qr from "../images/qr.jpg";

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
              <span>
                لرستان - خرم آباد - میدان کیو (۲۲ بهمن) - بلوار جام جم
                (جهادگران) - نبش خیابان صدرا - مرکز رشد واحدهای فناور جهاد
                دانشگاهی لرستان - طبقه همکف
              </span>
              <span>شماره تماس:</span>
              <span>۰۹۱۶۹۸۰۱۱۲۹ - ۰۹۱۶۰۸۶۹۶۸۵</span>
              <span>پست الکترونیک:</span>
              <span>tmb.iran98@gmail.com</span>
              <span></span>
              <span>
                <img
                  className="mt-3"
                  style={{ width: "150px" }}
                  src={qr}
                  alt="qr"
                />
              </span>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Support;
