import { useEffect, useState } from 'react';
import styles from '../../styles/Trackers/Trackers.module.css';

import date from '../../helper/date';
import ActivityTracker from './ActivityTracker';
/*
https://nivo.rocks/time-range/
https://nivo.rocks/calendar/
https://nivo.rocks/bump/
https://nivo.rocks/line/
https://nivo.rocks/bar/
https://nivo.rocks/guides/theming/

*/

export default function Trackers(){
    const backgroundColor = "#2d3142"
    const barColors = ["#E2E2E2"]

    const theme ={
        "background": backgroundColor,
        "text": {
            "fontSize": 11,
            "fill": "#000000",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
        "axis": {
            "domain": {
                "line": {
                    "stroke": "#e8e3e3",
                    "strokeWidth": 0
                }
            },
            "legend": {
                "text": {
                    "fontSize": 12,
                    "fill": "#e2e2e2",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            },
            "ticks": {
                "line": {
                    "stroke": "#777777",
                    "strokeWidth": 0
                },
                "text": {
                    "fontSize": 11,
                    "fill": "#e2e2e2",
                    "outlineWidth": 0,
                    "outlineColor": "#000000"
                }
            }
        },
        "grid": {
            "line": {
                "stroke": "#525252",
                "strokeWidth": 1
            }
        },
        "legends": {
            "title": {
                "text": {
                    "fontSize": 15,
                    "fill": "#333333",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            },
            "text": {
                "fontSize": 11,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            },
            "ticks": {
                "line": {},
                "text": {
                    "fontSize": 10,
                    "fill": "#333333",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            }
        },
        "annotations": {
            "text": {
                "fontSize": 13,
                "fill": "#333333",
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            },
            "link": {
                "stroke": "#000000",
                "strokeWidth": 1,
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            },
            "outline": {
                "stroke": "#000000",
                "strokeWidth": 2,
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            },
            "symbol": {
                "fill": "#000000",
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            }
        },
        "tooltip": {
            "container": {
                "background": "#ffffff",
                "fontSize": 12
            },
            "basic": {},
            "chip": {},
            "table": {},
            "tableCell": {},
            "tableCellValue": {}
        }
    }
    
    const today = new Date()
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const [weekStartingDate, setWeekStartingDate] = useState(date.getStartOfWeek(today));
    const [monthStartingDate, setMonthStartingDate] = useState(date.getStartOfMonth(today));
    const [yearStartingDate, setYearStartingDate] = useState(date.getStartOfYear(today));

    function nextWeek(){
        setWeekStartingDate(date.getNextWeek(weekStartingDate))
    }
    function prevWeek(){
        setWeekStartingDate(date.getPrevWeek(weekStartingDate));
    }

    function nextMonth(){
        setMonthStartingDate(date.getNextMonth(monthStartingDate));
    }

    function prevMonth(){
        setMonthStartingDate(date.getPrevMonth(monthStartingDate));
    }

    function prevYear(){
        setYearStartingDate(date.getPrevYear(yearStartingDate));
    }

    function nextYear(){
        setYearStartingDate(date.getNextYear(yearStartingDate));
    }

    console.log(weekStartingDate)
    console.log(date.getNextWeek(weekStartingDate))

    return(
        <main className={styles.trackers}>
            <section className={styles.activitySection}>
                <h1>Activity Tracker</h1>
                <div className={styles.activityTracker}>
                    <ActivityTracker 
                        extraClass={styles.weekly}
                        title="Weekly Summary"
                        subTitle={
                            `Week Of 
                            ${date.parseDate(weekStartingDate).month}
                            ${date.parseDate(weekStartingDate).date}
                            ${date.parseDate(weekStartingDate).year}`}
                        theme={theme} 
                        barColors={barColors} 
                        startDate={weekStartingDate}
                        endDate={date.getNextWeek(weekStartingDate)}
                        prev={prevWeek}
                        next={nextWeek}
                        />
                    <ActivityTracker
                        extraClass={styles.monthly}
                        title="Monthly Summary"
                        subTitle={
                            `Month of
                            ${date.parseDate(monthStartingDate).month}
                            ${date.parseDate(monthStartingDate).year}
                            `
                        }
                        theme={theme} 
                        barColors={barColors}
                        startDate={monthStartingDate}
                        endDate={date.getNextMonth(monthStartingDate)}
                        prev={prevMonth}
                        next={nextMonth}
                        />
                    <ActivityTracker
                        extraClass={styles.yearly}
                        title="Yearly Summary"
                        subTitle={`Year of ${date.parseDate(yearStartingDate).year}`}
                        theme={theme}
                        barColors={barColors}
                        startDate={yearStartingDate}
                        endDate={date.getNextYear(yearStartingDate)}
                        prev={prevYear}
                        next={nextYear}
                    />
                </div>
            </section>
            {/* <section className={styles.categoryTrackers}>

            </section> */}
        </main>

    )
}