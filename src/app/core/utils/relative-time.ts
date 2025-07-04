
export function timeDifference(inputDate: Date, past = 'ago', future = 'from now'): string {

    const pl = (n: number, word: string) => {
        return n === 1 ? word : word + 's';
    }

    const currentTime = new Date();

    const dif = currentTime.getTime() - inputDate.getTime();
    let postfix = past;

    if (dif <= 0) {
        postfix = future;
    }

    const differenceInMilliseconds = Math.abs(dif);

    const differenceInMinutes = Math.floor((differenceInMilliseconds / (1000 * 60)) % 60);
    const differenceInHours = Math.floor((differenceInMilliseconds / (1000 * 60 * 60)) % 24);
    const differenceInDays = Math.floor((differenceInMilliseconds / (1000 * 60 * 60 * 24)) % 7);
    const differenceInWeeks = Math.floor((differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7)) % 4.3482);
    const differenceInMonths = Math.floor((differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7 * 4.3482)) % 12);
    const differenceInYears = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7 * 4.3482 * 12));

    if (differenceInYears > 0) {
        return `${differenceInYears} ${pl(differenceInYears, 'year')} and ${differenceInMonths} ${pl(differenceInMonths, 'month')} ${postfix}`;
    } else if (differenceInMonths > 0) {
        return `${differenceInMonths} ${pl(differenceInMonths, 'month')} and ${differenceInWeeks} ${pl(differenceInWeeks, 'week')} ${postfix}`;
    } else if (differenceInWeeks > 0) {
        return `${differenceInWeeks} ${pl(differenceInWeeks, 'week')} and ${differenceInDays} ${pl(differenceInDays, 'day')} ${postfix}`;
    } else if (differenceInDays > 0) {
        return `${differenceInDays} ${pl(differenceInDays, 'day')} and ${differenceInHours} ${pl(differenceInHours, 'hour')} ${postfix}`;
    } else if (differenceInHours > 0) {
        return `${differenceInHours} ${pl(differenceInHours, 'hour')} and ${differenceInMinutes} ${pl(differenceInMinutes, 'minute')} ${postfix}`;
    } else {
        return `${differenceInMinutes} ${pl(differenceInMinutes, 'minute')} ${postfix}`;
    }
}