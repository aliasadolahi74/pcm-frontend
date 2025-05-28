import React, { useState, useRef, useEffect, useMemo} from "react";
import "../services/httpServices";
import StatisticsTable from "./statisticsTable";
import init from "./../services/dashboardServices";
import NumberOfStatistics from "./numberOfStatistics";
import {authData} from "../services/authServices";
import {Link} from "react-router-dom";
import {Modal, UnstyledButton, Alert} from "@mantine/core";
import useSound from "use-sound";
import {IconAlertCircle, IconBellOff, IconBellRinging} from "@tabler/icons";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "../redux/beepSlice";
import {analyze} from "./utils/reportTableAnalyze";

const Dashboard = () => {
    // get data from server every 5 seconds
    // analyze it and check if data has been expired
    const dispatch = useDispatch();
    const interval = useRef(null);

    const hiddenButtonRef = useRef(null);

    const [analyzedData, setAnalyzedData] = useState([]);
    const [state, setState] = useState(null);
    const [updateInterval, setUpdateInterval] = useState(null)

    useEffect(() => {
        if(state && state.data && state.data.length > 0) {
            const clonedData = _.cloneDeep(state.data);
            const analyzedData = analyze(clonedData, updateInterval);
            analyzedData.then((resolve) => {
                setAnalyzedData(resolve);
            });
        }
    }, [state]);

    const [playBeep, {stop}] = useSound('/1.mp3', {interrupt: true});

    const toggleSound = (item) => {
        dispatch(toggle({deviceID: item.deviceID}));
    };

    const silenceItems = useSelector((state) => {
        return state?.beep.silenceItems;
    });

    useEffect(() => {
        analyzedData.forEach(item => {
            if ((item.icon || item.hasBeep) && !silenceItems.find(i => item.deviceID === i.deviceID)) {
                hiddenButtonRef.current.click();
            }
        })

        return () => {
            stop();
        }
    }, [silenceItems, analyzedData]);



    const handleOnCloseModalBtnClick = () => {
        const draft = {...state};
        draft.modalIsOpened = false;
        draft.selectedDevice = null;
        setState(draft);
    };


    const handleOnAlertBtnClick = (item) => {
        const newState = {...state};
        newState.modalIsOpened = true;
        newState.selectedDevice = item.deviceID;
        newState.message = item.message;
        newState.timeLeft = getTimeDiff(item.englishDatetime);
        setState(newState);
    };





    const columns = useMemo(() => {
        return [
            {
                name: "deviceName",
                label: "عنوان دستگاه",
                content: (item) => (
                    <Link to={`/admin/device/${item.deviceID}/11`}>
                        {item.deviceName}
                    </Link>
                ),
            },
            {name: "security", label: "وضعیت سیستم امنیتی"},
            {name: "controlFaze", label: "وضعیت کنترل فاز"},
            {name: "pump", label: "وضعیت موتور"},
            {name: "message", label: "پیام پشتیبان"},
            {name: "datetime", label: "آخرین زمان گزارش"},
            {
                name: "icon",
                label: "",
                content: (item) => {
                    if (item.icon) {
                        return (
                            <UnstyledButton
                                onClick={() => handleOnAlertBtnClick(item)}
                                style={{padding: 10}}
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
                        const isSilenced = silenceItems.find(i => i.deviceID === item.deviceID);
                        return (
                            <UnstyledButton onClick={() => toggleSound(item)}>
                                {isSilenced ? <IconBellOff/> : <IconBellRinging/>}
                            </UnstyledButton>
                        );
                    }
                },
            },
        ]
    }, [silenceItems]);



    const tick = async () => {
        try {
             const {data, user, numberOfUserDevices, usersDeviceCountData, messageForUser,  interval: updateInterval} =
                await init();

            setUpdateInterval(updateInterval);
            const newState = {
                ...state,
                data,
                user,
                numberOfUserDevices,
                usersDeviceCountData,
                messageForUser,
                refreshes: state?.refreshes + 1,
            };
            setState(newState);
        } catch (e) {
            console.error(e);
        }
    };



    const getTimeDiff = (rowDateStr) => {
        const now = new Date();
        const rowDate = new Date(rowDateStr);
        const diff = now.getTime() - rowDate.getTime();
        return Math.ceil(diff / (1000 * 60));
    };


    useEffect(() => {
        tick();
        interval.current = setInterval(tick, 10000);

        return () => {
            clearInterval(interval.current);
        };
    }, []);

    if (state) {
        const {
            user,
            data,
            usersDeviceCountData,
            numberOfUserDevices,
        } = state;


        return (
            <React.Fragment>
                <button style={{display: "none"}} ref={hiddenButtonRef} onClick={() => playBeep()}>fasdfadfafd</button>
                <Modal opened={state?.modalIsOpened} onClose={handleOnCloseModalBtnClick}>
                    <b>
                        از زمان آخرین گزارش
                        <span>{state?.timeLeft}</span>&nbsp;دقیقه گذشته است
                    </b>
                    {state?.message ? (
                        <Alert
                            icon={<IconAlertCircle size={16}/>}
                            title='پیام پشتیبان'
                            color='red'
                            styles={{
                                root: {
                                    direction: "rtl",
                                    marginTop: "20px",
                                },
                            }}
                        >
                            {state?.message}
                        </Alert>
                    ) : null}
                </Modal>
                <section className='mb-2'>
                    <div className='section-header d-flex flex-column align-items-sta  rt'>
                        <h1 className='section-title'>{user?.nickname + " خوش آمدید"}</h1>
                        {state?.messageForUser ? (
                            <div className='mb-2'>
                                <Alert icon={<IconAlertCircle size={16}/>} color='yellow'>
                                    {state?.messageForUser}
                                </Alert>
                            </div>
                        ) : null}
                    </div>
                    <div className='section-content d-flex flex-column px-5'>
                        {!authData.isAdmin ? (
                            <NumberOfStatistics count={numberOfUserDevices}/>
                        ) : (
                            <div className='px-5 text-center d-flex align-self-center'>
                                {usersDeviceCountData ? (
                                    <StatisticsTable
                                        data={usersDeviceCountData}
                                        columns={[
                                            {name: "nickname", label: "نام کاربر"},
                                            {name: "count", label: "تعداد دستگاه‌ها"},
                                        ]}
                                        title='تعداد دستگاه‌های کاربران'
                                        updateInterval={updateInterval}
                                    />
                                ) : null}
                            </div>
                        )}

                        {!authData.isAdmin && (data !== undefined || data.length !== 0) ? (
                            <h4 style={{width: "100%", textAlign: "center"}}>
                                خلاصه وضعیت سیستم های شما بر اساس آخرین داده های دریافتی
                            </h4>
                        ) : null}

                        <div className='dashboard-table-container'>
                            {analyzedData && analyzedData.length > 0 ? (
                                <StatisticsTable
                                    updateInterval={updateInterval}
                                    data={analyzedData}
                                    columns={columns}
                                    title=''
                                />
                            ) : null}
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    } else {
        return null;
    }


};

export default Dashboard;
