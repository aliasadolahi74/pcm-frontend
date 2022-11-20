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
    columns: [
      { name: "deviceName", label: "عنوان دستگاه" },
      { name: "security", label: "وضعیت سیستم امنیتی" },
      { name: "controlFaze", label: "وضعیت کنترل فاز" },
      { name: "pump", label: "وضعیت موتور" },
      { name: "datetime", label: "آخرین زمان گزارش" },
      { name: "icon", label: "" },
    ],
    userDeviceNumberColumns: [
      { name: "nickname", label: "نام کاربر" },
      { name: "count", label: "تعداد دستگاه‌ها" },
    ],
    data: [],
    numberOfUserDevices: 0,
    updateInterval: null,
  };

  tick = async () => {
    try {
      const { data, user, numberOfUserDevices, usersDeviceCountData } =
        await init();
      this.setState((state) => ({
        data,
        user,
        numberOfUserDevices,
        usersDeviceCountData,
      }));
    } catch (e) {
      console.log(e);
    }
    this.setState((state) => ({ ...state, refreshes: state.refreshes + 1 }));
  };

  async componentDidMount() {
    const {
      data,
      user,
      numberOfUserDevices,
      usersDeviceCountData,
      interval: updateInterval,
    } = await init();

    this.setState({
      data,
      user,
      numberOfUserDevices,
      usersDeviceCountData,
      updateInterval,
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
      columns,
      data,
      usersDeviceCountData,
      userDeviceNumberColumns,
      numberOfUserDevices,
    } = this.state;
    return (
      <React.Fragment>
        <section className='mb-2'>
          <div className='section-header'>
            <h1 className='section-title'>{user.nickname + " خوش آمدید"}</h1>
          </div>

          <div className='section-content d-flex flex-column mt-5 px-5'>
            {!authData.isAdmin ? (
              <NumberOfStatistics count={numberOfUserDevices} />
            ) : (
              <div className='px-5 text-center d-flex align-self-center'>
                <StatisticsTable
                  data={usersDeviceCountData}
                  columns={userDeviceNumberColumns}
                  title='تعداد دستگاه‌های کاربران'
                />
              </div>
            )}

            {!authData.isAdmin && (data !== undefined || data.length !== 0) ? (
              <h4 style={{ width: "100%", textAlign: "center" }}>
                خلاصه وضعیت سیستم های شما بر اساس آخرین داده های دریافتی
              </h4>
            ) : null}

            <div className='dashboard-table-container'>
              <StatisticsTable
                updateInterval={this.state.updateInterval}
                data={data}
                columns={columns}
                title=''
              />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Dashboard;
