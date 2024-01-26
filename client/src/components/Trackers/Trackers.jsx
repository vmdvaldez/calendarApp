import { useEffect, useState } from 'react';
import styles from '../../styles/Trackers/Trackers.module.css';

import date from '../../helper/date';
import WeeklyActivityTracker from './WeeklyActivityTracker';
import MonthlyActivityTracker from './MonthlyActivityTracker';
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



    // TODO HERE next DATE


    // const data = [
    //     {
    //       "Activity": "Basketball",
    //       "value": "1"
    //     //   "hot dogColor": "hsl(32, 70%, 50%)",
    //     //   "burger": 15,
    //     //   "burgerColor": "hsl(292, 70%, 50%)",
    //     //   "sandwich": 0,
    //     //   "sandwichColor": "hsl(107, 70%, 50%)",
    //     //   "kebab": 179,
    //     //   "kebabColor": "hsl(243, 70%, 50%)",
    //     //   "fries": 37,
    //     //   "friesColor": "hsl(187, 70%, 50%)",
    //     //   "donut": 106,
    //     //   "donutColor": "hsl(315, 70%, 50%)"
    //     },
    //     {
    //         "Activity": "Tennis",
    //         "value": 2
    //     },
    //     {
    //         "Activity": "Snowboarding",
    //         "value": 3
    //     }
    //     // {
    //     //   "country": "AE",
    //     //   "hot dog": 53,
    //     //   "hot dogColor": "hsl(16, 70%, 50%)",
    //     //   "burger": 11,
    //     //   "burgerColor": "hsl(273, 70%, 50%)",
    //     //   "sandwich": 24,
    //     //   "sandwichColor": "hsl(71, 70%, 50%)",
    //     //   "kebab": 125,
    //     //   "kebabColor": "hsl(105, 70%, 50%)",
    //     //   "fries": 200,
    //     //   "friesColor": "hsl(44, 70%, 50%)",
    //     //   "donut": 131,
    //     //   "donutColor": "hsl(15, 70%, 50%)"
    //     // },
    //     // {
    //     //   "country": "AF",
    //     //   "hot dog": 155,
    //     //   "hot dogColor": "hsl(50, 70%, 50%)",
    //     //   "burger": 12,
    //     //   "burgerColor": "hsl(17, 70%, 50%)",
    //     //   "sandwich": 111,
    //     //   "sandwichColor": "hsl(81, 70%, 50%)",
    //     //   "kebab": 85,
    //     //   "kebabColor": "hsl(118, 70%, 50%)",
    //     //   "fries": 47,
    //     //   "friesColor": "hsl(51, 70%, 50%)",
    //     //   "donut": 165,
    //     //   "donutColor": "hsl(11, 70%, 50%)"
    //     // },
    //     // {
    //     //   "country": "AG",
    //     //   "hot dog": 92,
    //     //   "hot dogColor": "hsl(152, 70%, 50%)",
    //     //   "burger": 177,
    //     //   "burgerColor": "hsl(172, 70%, 50%)",
    //     //   "sandwich": 155,
    //     //   "sandwichColor": "hsl(349, 70%, 50%)",
    //     //   "kebab": 2,
    //     //   "kebabColor": "hsl(351, 70%, 50%)",
    //     //   "fries": 180,
    //     //   "friesColor": "hsl(51, 70%, 50%)",
    //     //   "donut": 167,
    //     //   "donutColor": "hsl(80, 70%, 50%)"
    //     // },
    //     // {
    //     //   "country": "AI",
    //     //   "hot dog": 158,
    //     //   "hot dogColor": "hsl(191, 70%, 50%)",
    //     //   "burger": 45,
    //     //   "burgerColor": "hsl(198, 70%, 50%)",
    //     //   "sandwich": 138,
    //     //   "sandwichColor": "hsl(341, 70%, 50%)",
    //     //   "kebab": 41,
    //     //   "kebabColor": "hsl(87, 70%, 50%)",
    //     //   "fries": 11,
    //     //   "friesColor": "hsl(132, 70%, 50%)",
    //     //   "donut": 69,
    //     //   "donutColor": "hsl(242, 70%, 50%)"
    //     // },
    //     // {
    //     //   "country": "AL",
    //     //   "hot dog": 142,
    //     //   "hot dogColor": "hsl(264, 70%, 50%)",
    //     //   "burger": 22,
    //     //   "burgerColor": "hsl(33, 70%, 50%)",
    //     //   "sandwich": 87,
    //     //   "sandwichColor": "hsl(163, 70%, 50%)",
    //     //   "kebab": 115,
    //     //   "kebabColor": "hsl(35, 70%, 50%)",
    //     //   "fries": 29,
    //     //   "friesColor": "hsl(81, 70%, 50%)",
    //     //   "donut": 155,
    //     //   "donutColor": "hsl(195, 70%, 50%)"
    //     // },
    //     // {
    //     //   "country": "AM",
    //     //   "hot dog": 76,
    //     //   "hot dogColor": "hsl(91, 70%, 50%)",
    //     //   "burger": 180,
    //     //   "burgerColor": "hsl(164, 70%, 50%)",
    //     //   "sandwich": 105,
    //     //   "sandwichColor": "hsl(234, 70%, 50%)",
    //     //   "kebab": 49,
    //     //   "kebabColor": "hsl(353, 70%, 50%)",
    //     //   "fries": 167,
    //     //   "friesColor": "hsl(328, 70%, 50%)",
    //     //   "donut": 48,
    //     //   "donutColor": "hsl(233, 70%, 50%)"
    //     // }
    //   ]

    return(
        <section className={styles.trackers}>
            <WeeklyActivityTracker/>
            <MonthlyActivityTracker/>
        </section>
    )
}