import React, { Component } from "react";
import LoginForm from "./loginForm";
import icon from "../images/logo.png";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class Login extends Component {
  render() {
    console.log(process.env);
    const token = localStorage.getItem("token");
    if (token !== null) {
      window.location = `${dir}/admin/dashboard`;
      return null;
    } else {
      return (
        <div className="background">
          <div className="login-page-container">
            <div className="container-fluid p-5 h-100 w-100 main-section">
              <div className="d-flex justify-content-center align-items-center flex-column login-form-container">
                <img src={icon} className="tmb-logo" alt="logo" />
                <LoginForm />
              </div>
              <div className="d-flex w-100 flex-column align-items-center justify-content-center about-us-container">
                <div className="content p-5 w-75 h-100 d-flex justify-content-center">
                  <p className="about-us-text">
                    شرکت طراحان مدار باختر در سال ۱۳۹۴ با هدف تولید و بروزآوری
                    محصولات مورد نیاز صنایع «در حوزه‌های برق، الکترونیک،
                    مخابرات، کنترل و ابزار دقیق» و توسعه اقتصاد دانش محور و
                    ایجاد فرایندی جهت تبدیل ایده به تکنولوژی تاسیس گردید. از
                    مهمترین اهداف این شرکت تجار ‌سازی نتایج تحقیقات و عرضه آن ها
                    به صنایع می‌باشد.
                  </p>
                  <h5>خط مشی شرکت:</h5>
                  <ul>
                    <li>
                      طراحی و توسعه محصولات جدید متناسب با نیاز‌های حال و آینده
                      صنعت کشور
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
