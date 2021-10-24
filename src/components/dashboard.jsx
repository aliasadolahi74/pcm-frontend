import React, { Component } from "react";
import "../services/httpServices";
import StatisticsTable from "./statisticsTable";
import init from "./../services/dashboardServices";
import NumberOfStatistics from "./numberOfStatistics";
import { authData } from "../services/authServices";

class Dashboard extends Component {
  state = {
    user: {},
    refreshes: 0,
    pumpColumns: [
      { name: "deviceName", label: "عنوان دستگاه" },
      { name: "pump", label: "وضعیت موتور" },
      { name: "controlFaze", label: "وضعیت کنترل فاز" },
      { name: "datetime", label: "آخرین زمان گزارش" },
    ],

    userDeviceNumberColumns: [
      { name: "nickname", label: "نام کاربر" },
      { name: "count", label: "تعداد دستگاه‌ها" },
    ],

    usersDeviceCountData: [],

    securityColumns: [
      { name: "deviceName", label: "عنوان دستگاه" },
      { name: "security", label: "وضعیت" },
      { name: "datetime", label: "آخرین زمان گزارش" },
    ],

    analogColumns: [
      { name: "deviceName", label: "عنوان دستگاه" },
      { name: "analog1", label: "آنالوگ (حجم متر مکعب)" },
      { name: "analog2", label: "آنالوگ (ارتفاع سانتیمتر)" },
      { name: "analog3", label: "آنالوگ (نامشخص)" },
      { name: "datetime", label: "آخرین زمان گزارش" },
    ],
    securityData: [],
    pumpData: [],
    analogData: [],
    numberOfUserDevices: 0,
  };

  tick = () => {
    const refreshes = this.state.refreshes;
    console.log(refreshes);
    this.setState({ refreshes: refreshes + 1 });
  };

  async componentDidMount() {
    const {
      pumpData,
      securityData,
      analogData,
      user,
      numberOfUserDevices,
      usersDeviceCountData,
    } = await init();
    this.setState({
      pumpData,
      securityData,
      analogData,
      user,
      numberOfUserDevices,
      usersDeviceCountData,
    });
    this.interval = setInterval(() => {
      this.tick();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {
      user,
      pumpData,
      pumpColumns,
      analogData,
      analogColumns,
      securityData,
      securityColumns,
      usersDeviceCountData,
      userDeviceNumberColumns,
      numberOfUserDevices,
    } = this.state;
    return (
      <React.Fragment>
        <section className="mb-2">
          <div className="section-header">
            <h1 className="section-title">{user.nickname + " خوش آمدید"}</h1>
          </div>

          <div className="section-content d-flex flex-column mt-5 px-5">
            {!authData.isAdmin ? (
              <NumberOfStatistics count={numberOfUserDevices} />
            ) : (
              <div className="px-5 text-center d-flex align-self-center">
                <StatisticsTable
                  data={usersDeviceCountData}
                  columns={userDeviceNumberColumns}
                  title="تعداد دستگاه‌های کاربران"
                />
              </div>
            )}

            <div className="dashboard-table-container">
              <StatisticsTable
                data={pumpData}
                columns={pumpColumns}
                title={
                  "گزارش وضعیت روشن یا خاموش بودن موتورها / پمپ‌ها" +
                  "\n" +
                  " بر اساس آخرین داده‌های دریافت"
                }
              />
              <StatisticsTable
                data={securityData}
                columns={securityColumns}
                title={
                  "گزارش وضعیت سیستم‌های امنیتی" +
                  "\n" +
                  " بر اساس آخرین داده‌های دریافت"
                }
              />
              <StatisticsTable
                data={analogData}
                columns={analogColumns}
                title={
                  "جدول داده‌های آنالوگ به دیجیتال" +
                  "\n" +
                  " بر اساس آخرین داده‌های دریافت"
                }
              />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Dashboard;
