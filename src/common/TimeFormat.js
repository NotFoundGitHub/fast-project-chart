const TimeUtil = {
    formatDate: function (time) {
        let date = new Date(time);
        let year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        // 拼接
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    },
    formatDay: function (time) {
        let date = new Date(time);
        let year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        // 拼接
        return year + '-' + month + '-' + day;
    },
    diffDay: function(first, second) {
        return Math.floor((first - second) / (24 * 60 * 60 * 1000));
    },
    getLastDays: function(count) {
        // 拼接时间
        let timeArr = [];
        for (let i = 0; i <= count; i++) {
            let time2 = new Date()
            time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * i))
            let Y2 = time2.getFullYear()
            let M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
            let D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
            timeArr.push(Y2 + '-' + M2 + '-' + D2);
        }
        return timeArr;
    }

}
export default TimeUtil;
