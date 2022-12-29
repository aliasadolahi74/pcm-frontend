import React, { Component } from "react";
import "../services/httpServices";
import StatisticsTable from "./statisticsTable";
import init from "./../services/dashboardServices";
import NumberOfStatistics from "./numberOfStatistics";
import { authData } from "../services/authServices";
import { Link } from "react-router-dom";
import { Modal, UnstyledButton, Alert } from "@mantine/core";
import useSound from "use-sound";
import { IconAlertCircle, IconBellOff, IconBellRinging } from "@tabler/icons";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/beepSlice";

const Dashboard = () => {
  const [playBeep, { stop }] = useSound("/1.mp3", { interrupt: true });

  const silenceItems = useSelector((state) => {
    return state.beep.silenceItems;
  });
  console.log(silenceItems);
  const dispatch = useDispatch();

  class Dashboard extends Component {
    state = {
      user: {},
      refreshes: 0,
      modalIsOpened: false,
      columns: [
        {
          name: "deviceName",
          label: "عنوان دستگاه",
          content: (item) => (
            <Link to={`/admin/device/${item.deviceID}/11`}>
              {item.deviceName}
            </Link>
          ),
        },
        { name: "security", label: "وضعیت سیستم امنیتی" },
        { name: "controlFaze", label: "وضعیت کنترل فاز" },
        { name: "pump", label: "وضعیت موتور" },
        { name: "message", label: "پیام پشتیبان" },
        { name: "datetime", label: "آخرین زمان گزارش" },
        {
          name: "icon",
          label: "",
          content: (item) => {
            if (item.icon) {
              return (
                <UnstyledButton
                  onClick={() => this.handleOnAlertBtnClick(item)}
                  style={{ padding: 10 }}
                >
                  {item.icon}
                </UnstyledButton>
              );
            }
          },
        },
        {
          name: "mute",
          label: "",
          content: (item) => {
            if (item.icon || item.hasBeep) {
              const index = _.findIndex(
                silenceItems,
                (i) => i.deviceID === item.deviceID
              );

              if (index === -1) {
                playBeep();
              }

              return (
                <UnstyledButton onClick={() => this.toggleSound(item)}>
                  {index === -1 ? <IconBellRinging /> : <IconBellOff />}
                </UnstyledButton>
              );
            }
          },
        },
      ],
      userDeviceNumberColumns: [
        { name: "nickname", label: "نام کاربر" },
        { name: "count", label: "تعداد دستگاه‌ها" },
      ],
      data: [],
      numberOfUserDevices: 0,
      updateInterval: null,
      selectedDevice: null,
    };

    handleOnAlertBtnClick = (item) => {
      const state = { ...this.state };
      state.modalIsOpened = true;
      state.selectedDevice = item.deviceID;
      state.message = item.message;
      state.timeLeft = this.getTimeDiff(item.englishDatetime);
      this.setState(state);
    };

    toggleSound = (item) => {
      dispatch(toggle({ deviceID: item.deviceID }));
    };

    tick = async () => {
      try {
        const {
          data,
          user,
          numberOfUserDevices,
          usersDeviceCountData,
          message,
        } = await init();
        this.setState((state) => ({
          data,
          user,
          numberOfUserDevices,
          usersDeviceCountData,
          message,
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
        messageForUser,
      } = await init();

      this.setState({
        data,
        user,
        numberOfUserDevices,
        usersDeviceCountData,
        updateInterval,
        messageForUser,
      });
      this.interval = setInterval(() => {
        this.tick();
      }, 10000);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    handleOnCloseModalBtnClick = () => {
      const state = { ...this.state };
      state.modalIsOpened = false;
      state.selectedDevice = null;
      this.setState(state);
    };

    getTimeDiff = (rowDateStr) => {
      const now = new Date();
      const rowDate = new Date(rowDateStr);

      console.log(now.getTime());
      console.log(rowDate.getTime());
      const diff = now.getTime() - rowDate.getTime();
      console.log(diff);
      return Math.ceil(diff / (1000 * 60));
    };

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
          <Modal
            opened={this.state.modalIsOpened}
            onClose={this.handleOnCloseModalBtnClick}
          >
            <b>
              از زمان آخرین گزارش
              <span>{this.state.timeLeft}</span>&nbsp;دقیقه گذشته است
            </b>
            {this.state.message ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title='پیام پشتیبان'
                color='red'
                styles={{
                  root: {
                    direction: "rtl",
                    marginTop: "20px",
                  },
                }}
              >
                {this.state.message}
              </Alert>
            ) : null}
          </Modal>
          <section className='mb-2'>
            <div className='section-header d-flex flex-column align-items-start'>
              <h1 className='section-title'>{user.nickname + " خوش آمدید"}</h1>
              {this.state.messageForUser ? (
                <div className='mb-2'>
                  <Alert icon={<IconAlertCircle size={16} />} color='yellow'>
                    {this.state.messageForUser}
                  </Alert>
                </div>
              ) : null}
            </div>
            <div className='section-content d-flex flex-column px-5'>
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

              {!authData.isAdmin &&
              (data !== undefined || data.length !== 0) ? (
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

  return <Dashboard />;
};

export default React.memo(Dashboard);
