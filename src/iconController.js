/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { hourlyModule, forecastModule, printModule } from './printWeather';

const iconHandler = (() => {
    function printToday(type, img, obj) {
        const icon = `${img}@2x.png`;
        printModule.check(img);
    }

    function operator(type, img) {
        switch (true) {
        case type === 'current':
            printToday(type, img);
            break;
        }
    }
    return {
        operator,
    };
})();

export default iconHandler;
