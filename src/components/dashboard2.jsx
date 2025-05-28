import React, { useCallback, useState, useRef } from "react";
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
import { useEffect } from "react";

const Dashboard = () => {
  // get data from server every 5 seconds
  // analyze it and check if data has been expired

  const [soundStatus, setSoundStatus] = useState({
    loaded: false,
    error: null,
    lastPlayAttempt: null
  });


  const [playBeep, { sound, stop }] = useSound('/1.mp3', {
    volume: 1.0,
    // Add version or timestamp to prevent caching
    format: ['mp3'],
    onload: () => {
      setSoundStatus(prev => ({ ...prev, loaded: true }));
    },
    // Add error handling
    onloaderror: (id, error) => {
      console.error('Sound failed to load:', error);
      setSoundStatus(prev => ({ ...prev, error: error.toString() }));
    },
    // Add playback error handling
    onplayerror: (id, error) => {
      console.error('Sound failed to play:', error);
      setSoundStatus(prev => ({ ...prev, error: error.toString() }));
    }
  });

  const interval = useRef(null);

  useEffect(() => {
    // Create an audio element to test file availability
    const audioTest = new Audio('/1.mp3');

    audioTest.addEventListener('loadeddata', () => {
      setSoundStatus(prev => ({ ...prev, loaded: true }));
    });

    audioTest.addEventListener('error', (e) => {
      console.error('Error loading audio file:', e);
      setSoundStatus(prev => ({
        ...prev,
        error: `Error loading audio: ${e.target.error?.message || 'Unknown error'}`
      }));
    });

    return () => {
      audioTest.remove();
    };
  }, []);

  const testSound = useCallback(() => {
    try {
      playBeep();
      setSoundStatus(prev => ({
        ...prev,
        lastPlayAttempt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error playing sound:', error);
      setSoundStatus(prev => ({ ...prev, error: error.toString() }));
    }
  }, [playBeep]);

  const silenceItems = useSelector((state) => {
    return state.beep.silenceItems;
  });

  const dispatch = useDispatch();

  const [state, setState] = useState({
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
                onClick={() => handleOnAlertBtnClick(item)}
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
              testSound();
            }

            return (
              <UnstyledButton onClick={() => toggleSound(item)}>
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
  });

  const handleOnAlertBtnClick = (item) => {
    const newState = { ...state };
    newState.modalIsOpened = true;
    newState.selectedDevice = item.deviceID;
    newState.message = item.message;
    newState.timeLeft = getTimeDiff(item.englishDatetime);
    setState(newState);
  };

  const toggleSound = (item) => {
    dispatch(toggle({ deviceID: item.deviceID }));
  };

  const tick = async () => {
    try {
      const { data, user, numberOfUserDevices, usersDeviceCountData, message } =
        await init();
      const newState = {
        ...state,
        data,
        user,
        columns,
        numberOfUserDevices,
        usersDeviceCountData,
        message,
        refreshes: state.refreshes + 1,
      };
      setState(newState);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnCloseModalBtnClick = () => {
    const state = { ...state };
    state.modalIsOpened = false;
    state.selectedDevice = null;
    setState(state);
  };

  const getTimeDiff = (rowDateStr) => {
    const now = new Date();
    const rowDate = new Date(rowDateStr);
    const diff = now.getTime() - rowDate.getTime();
    return Math.ceil(diff / (1000 * 60));
  };

  const {
    user,
    columns,
    data,
    usersDeviceCountData,
    userDeviceNumberColumns,
    numberOfUserDevices,
  } = state;

  const getData = useCallback(async () => {
      const {
        data,
        user,
        numberOfUserDevices,
        usersDeviceCountData,
        interval: updateInterval,
        messageForUser,
      } = await init();

      setState({
        ...state,
        data,
        user,
        numberOfUserDevices,
        usersDeviceCountData,
        updateInterval,
        messageForUser,
      });
      interval.current = setInterval(() => {
        tick();
      }, 10000);

  }, [interval]);

  useEffect(() => {
    getData();
    return () => {
      clearInterval(interval);
    };
  }, [getData, interval]);





  return (
    <React.Fragment>
      <Modal opened={state.modalIsOpened} onClose={handleOnCloseModalBtnClick}>
        <b>
          از زمان آخرین گزارش
          <span>{state.timeLeft}</span>&nbsp;دقیقه گذشته است
        </b>
        {state.message ? (
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
            {state.message}
          </Alert>
        ) : null}
      </Modal>
      <section className='mb-2'>
        <div className='section-header d-flex flex-column align-items-sta  rt'>
          <h1 className='section-title'>{user.nickname + " خوش آمدید"}</h1>
          {state.messageForUser ? (
            <div className='mb-2'>
              <Alert icon={<IconAlertCircle size={16} />} color='yellow'>
                {state.messageForUser}
              </Alert>
            </div>
          ) : null}
        </div>
        <div className='section-content d-flex flex-column px-5'>
          {!authData.isAdmin ? (
            <NumberOfStatistics count={numberOfUserDevices} />
          ) : (
            <div className='px-5 text-center d-flex align-self-center'>
              {usersDeviceCountData ? (
                <StatisticsTable
                  data={usersDeviceCountData}
                  columns={userDeviceNumberColumns}
                  title='تعداد دستگاه‌های کاربران'
                />
              ) : null}
            </div>
          )}

          {!authData.isAdmin && (data !== undefined || data.length !== 0) ? (
            <h4 style={{ width: "100%", textAlign: "center" }}>
              خلاصه وضعیت سیستم های شما بر اساس آخرین داده های دریافتی
            </h4>
          ) : null}

          <div className='dashboard-table-container'>
            {data && data.length > 0 ? (
              <StatisticsTable
                updateInterval={state.updateInterval}
                data={data}
                columns={columns}
                title=''
              />
            ) : null}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Dashboard;
