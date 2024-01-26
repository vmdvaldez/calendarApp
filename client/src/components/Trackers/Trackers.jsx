import { useEffect, useState } from 'react';
import styles from '../../styles/Trackers/Trackers.module.css';
import { ResponsiveBar } from '@nivo/bar'

import date from '../../helper/date';
/*
https://nivo.rocks/time-range/
https://nivo.rocks/calendar/
https://nivo.rocks/bump/
https://nivo.rocks/line/
https://nivo.rocks/bar/
https://nivo.rocks/guides/theming/

*/

export default function Trackers(){
    /*TODO:
        - get Date Week (Monday is the start);
    */
    const [weekStartingDate, setWeekStartingDate] = useState(date.getStartOfWeek(new Date()));
    const [weeklyActivityData, setWeeklyActivityData] = useState(null);


    console.log(weeklyActivityData);

    // TODO HERE next DATE

    useEffect(()=>{
        
        const getWeeklyEvents = async () =>{
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const query = new URLSearchParams(
                {
                    startDate: weekStartingDate.toISOString(), 
                    endDate: date.getNextWeek(weekStartingDate).toISOString()
                })
            const res = await fetch(`${protocol}${url}:${port}/events?${query}`, {
                method: "GET",
                headers:{
                    mode: "cors"
                }
            })
            return await res.json();
        }

        const events = getWeeklyEvents();
        
        events.then(event=>{
            const activities = event.map(e=>e.activity).filter(e=>e)
            const activityCount = {}
            activities.forEach(a =>{
                if (activityCount[a] === undefined){
                    activityCount[a] = 0;
                }
                activityCount[a] += 1;
            });
            setWeeklyActivityData(activityCount);
        })

    },[weekStartingDate]);


    const data = [
        {
          "Activity": "Basketball",
          "value": "1"
        //   "hot dogColor": "hsl(32, 70%, 50%)",
        //   "burger": 15,
        //   "burgerColor": "hsl(292, 70%, 50%)",
        //   "sandwich": 0,
        //   "sandwichColor": "hsl(107, 70%, 50%)",
        //   "kebab": 179,
        //   "kebabColor": "hsl(243, 70%, 50%)",
        //   "fries": 37,
        //   "friesColor": "hsl(187, 70%, 50%)",
        //   "donut": 106,
        //   "donutColor": "hsl(315, 70%, 50%)"
        },
        {
            "Activity": "Tennis",
            "value": 2
        },
        {
            "Activity": "Snowboarding",
            "value": 3
        }
        // {
        //   "country": "AE",
        //   "hot dog": 53,
        //   "hot dogColor": "hsl(16, 70%, 50%)",
        //   "burger": 11,
        //   "burgerColor": "hsl(273, 70%, 50%)",
        //   "sandwich": 24,
        //   "sandwichColor": "hsl(71, 70%, 50%)",
        //   "kebab": 125,
        //   "kebabColor": "hsl(105, 70%, 50%)",
        //   "fries": 200,
        //   "friesColor": "hsl(44, 70%, 50%)",
        //   "donut": 131,
        //   "donutColor": "hsl(15, 70%, 50%)"
        // },
        // {
        //   "country": "AF",
        //   "hot dog": 155,
        //   "hot dogColor": "hsl(50, 70%, 50%)",
        //   "burger": 12,
        //   "burgerColor": "hsl(17, 70%, 50%)",
        //   "sandwich": 111,
        //   "sandwichColor": "hsl(81, 70%, 50%)",
        //   "kebab": 85,
        //   "kebabColor": "hsl(118, 70%, 50%)",
        //   "fries": 47,
        //   "friesColor": "hsl(51, 70%, 50%)",
        //   "donut": 165,
        //   "donutColor": "hsl(11, 70%, 50%)"
        // },
        // {
        //   "country": "AG",
        //   "hot dog": 92,
        //   "hot dogColor": "hsl(152, 70%, 50%)",
        //   "burger": 177,
        //   "burgerColor": "hsl(172, 70%, 50%)",
        //   "sandwich": 155,
        //   "sandwichColor": "hsl(349, 70%, 50%)",
        //   "kebab": 2,
        //   "kebabColor": "hsl(351, 70%, 50%)",
        //   "fries": 180,
        //   "friesColor": "hsl(51, 70%, 50%)",
        //   "donut": 167,
        //   "donutColor": "hsl(80, 70%, 50%)"
        // },
        // {
        //   "country": "AI",
        //   "hot dog": 158,
        //   "hot dogColor": "hsl(191, 70%, 50%)",
        //   "burger": 45,
        //   "burgerColor": "hsl(198, 70%, 50%)",
        //   "sandwich": 138,
        //   "sandwichColor": "hsl(341, 70%, 50%)",
        //   "kebab": 41,
        //   "kebabColor": "hsl(87, 70%, 50%)",
        //   "fries": 11,
        //   "friesColor": "hsl(132, 70%, 50%)",
        //   "donut": 69,
        //   "donutColor": "hsl(242, 70%, 50%)"
        // },
        // {
        //   "country": "AL",
        //   "hot dog": 142,
        //   "hot dogColor": "hsl(264, 70%, 50%)",
        //   "burger": 22,
        //   "burgerColor": "hsl(33, 70%, 50%)",
        //   "sandwich": 87,
        //   "sandwichColor": "hsl(163, 70%, 50%)",
        //   "kebab": 115,
        //   "kebabColor": "hsl(35, 70%, 50%)",
        //   "fries": 29,
        //   "friesColor": "hsl(81, 70%, 50%)",
        //   "donut": 155,
        //   "donutColor": "hsl(195, 70%, 50%)"
        // },
        // {
        //   "country": "AM",
        //   "hot dog": 76,
        //   "hot dogColor": "hsl(91, 70%, 50%)",
        //   "burger": 180,
        //   "burgerColor": "hsl(164, 70%, 50%)",
        //   "sandwich": 105,
        //   "sandwichColor": "hsl(234, 70%, 50%)",
        //   "kebab": 49,
        //   "kebabColor": "hsl(353, 70%, 50%)",
        //   "fries": 167,
        //   "friesColor": "hsl(328, 70%, 50%)",
        //   "donut": 48,
        //   "donutColor": "hsl(233, 70%, 50%)"
        // }
      ]
    const MyResponsiveBar = (data) => (
        <ResponsiveBar
            data={data}
            keys={["value"]}
            // keys={[
            //     'Basketball',
            //     'tennis'
            // ]}
            indexBy="Activity"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'green_blue' }}
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
                legend: 'Count',
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
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
        />
    )
    return(
        <div className={styles.bar}>
            {weeklyActivityData && MyResponsiveBar(data)}
        </div>
    )
}