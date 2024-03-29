import { useEffect, useState } from 'react';
import styles from '../../styles/Trackers/ActivityTracker.module.css';
import { ResponsiveBar } from '@nivo/bar'

export default function ActivityTracker({theme, barColors, 
    startDate, endDate, title, subTitle,prev, next, extraClass
    }){
    // const [weekStartingDate, setWeekStartingDate] = useState(date.getStartOfWeek(new Date()));
    const [activityData, setActivityData] = useState(null);

    useEffect(()=>{
        
        const getEvents = async () =>{
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const query = new URLSearchParams(
                {
                    startDate: startDate.toISOString(), 
                    endDate: endDate.toISOString()
                })
            const res = await fetch(`${protocol}${url}:${port}/events?${query}`, {
                method: "GET",
                headers:{
                    mode: "cors"
                }
            })
            return await res.json();
        }

        const events = getEvents();
        
        events.then(event=>{
            const activities = event.map(e=>e.activity).filter(e=>e)
            const activityCount = {}
            const activityCountData = []

            activities.forEach(a =>{
                if (activityCount[a] === undefined){
                    activityCount[a] = 0;
                }
                activityCount[a] += 1;
            });
            for (const [key, val] of Object.entries(activityCount)){
                activityCountData.push({Activity: key, value: val})
            }
            setActivityData(activityCountData);
        })

    },[startDate, endDate]);

    const MyResponsiveBar = (data) => (
        <ResponsiveBar
            theme={theme}
            data={data}
            // keys={["value"]}
            indexBy="Activity"
            colorBy="Activity"
            margin={{ top: 50, right: 0, bottom: 50, left: 50 }}
            padding={0.2}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={barColors}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'fries'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'sandwich'
                    },
                    id: 'lines'
                }
            ]}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Activity',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'frequency',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            labelSkipWidth={12}
            labelSkip   ={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            // legends={[
            //     {
            //         dataFrom: 'keys',
            //         anchor: 'bottom-right',
            //         direction: 'column',
            //         justify: false,
            //         translateX: 120,
            //         translateY: 0,
            //         itemsSpacing: 2,
            //         itemWidth: 100,
            //         itemHeight: 20,
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 0.85,
            //         symbolSize: 20,
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemOpacity: 1
            //                 }
            //             }
            //         ]
            //     }
            // ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
        />
    )

    return(
        <div className={`${styles.activityTrackerContainer} ${extraClass}`}>
            <button className={styles.navigation} onClick={prev}></button>
            <div className={styles.ActivitySummary}>
                <h2>{title}</h2>
                <p>{subTitle}</p>
                <div className={styles.barGraph}>
                    {activityData && MyResponsiveBar(activityData)}
                </div>
            </div>
            <button className={styles.navigation} onClick={next}></button>
        </div>

    )
}