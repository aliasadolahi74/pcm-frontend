import React, { Component } from "react";
import LoginForm from "./loginForm";
import icon from "../images/logo.png";
import jwtDecode from "jwt-decode";

const dir = process.env.REACT_APP_CUSTOM_DIR;

class Login extends Component {
  render() {
    const websiteURL = process.env.REACT_APP_WEBSITE;
    const token = localStorage.getItem("token");
    const now = new Date().getTime();
    let expireTimestamp = 0;
    try {
      const decodedToken = jwtDecode(token);
      expireTimestamp = decodedToken["expire"];
    } catch (e) {}
    if (token !== null && expireTimestamp > now) {
      window.location = `${dir}/admin/dashboard`;
      return null;
    } else {
      return (
        <div className='background'>
          <div className='login-page-container'>
            <div className='container-fluid p-5 h-100 w-100 main-section'>
              <div className='d-flex justify-content-center align-items-center flex-column login-form-container'>
                <a href={websiteURL}>
                  <img src={icon} className='tmb-logo' alt='logo' />
                </a>
                <LoginForm />
              </div>
              <div className='d-flex w-100 flex-column align-items-center justify-content-center about-us-container'>
                <div className='content p-5 w-100 h-100 d-flex justify-content-center'>
                  <h4 className='mb-4 nowrap'>
                    سامانه تله متری سیستم های حفاظت،کنترل و پایش تجهیزات و
                    تاسیسات الکتریکی
                  </h4>
                  <p className='about-us-text'>
                    شرکت طراحان مدار باختر در سال ۱۳۹۴ با هدف تولید و بروزآوری
                    محصولات مورد نیاز صنایع «در حوزه‌های برق، الکترونیک،
                    مخابرات، کنترل و ابزار دقیق» و توسعه اقتصاد دانش‌محور و
                    ایجاد فرایندی جهت تبدیل ایده به تکنولوژی تأسیس گردید. از
                    مهمترین اهداف این شرکت تجاری‌‌سازی نتایج تحقیقات و عرضه
                    آن‌ها به صنایع می‌باشد.
                  </p>
                  <h6>خط مشی شرکت:</h6>
                  <ul>
                    <li>
                      طراحی و توسعه محصولات جدید متناسب با نیاز‌های حال و آینده
                    </li>
                    <li>حفظ ارتقاء کیفیت تولید، پشتیبانی و خدمات پس از فروش</li>
                    <li>ارتقاء مستمر دانش فنی</li>
                    <li>الزام به مشتری مداری</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Login;
