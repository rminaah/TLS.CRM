var MscrmControls;
! function (MscrmControls) {
    var DateRangeControl;
    ! function (DateRangeControl) {
        "use strict";
        /*Jallali Date*/
        /*
          Jalaali years starting the 33-year rule.
        */
        var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178]

        /*
          Converts a Gregorian date to Jalaali.
        */
        function GetJalaaliToString(gy, gm, gd) {
            var res = toJalaali(gy, gm, gd);

            return res.jy + '/' + res.jm + '/' + res.jd
        }

        function toJalaali(gy, gm, gd) {
            if (Object.prototype.toString.call(gy) === '[object Date]') {
                gd = gy.getDate()
                gm = gy.getMonth() + 1
                gy = gy.getFullYear()
            }
            return d2j(g2d(gy, gm, gd))
        }

        /*
          Converts a Jalaali date to Gregorian.
        */
        function toGregorian(jy, jm, jd) {
            return d2g(j2d(jy, jm, jd))
        }

        /*
          Checks whether a Jalaali date is valid or not.
        */
        function isValidJalaaliDate(jy, jm, jd) {
            return jy >= -61 && jy <= 3177 &&
                jm >= 1 && jm <= 12 &&
                jd >= 1 && jd <= jalaaliMonthLength(jy, jm)
        }

        /*
          Is this a leap year or not?
        */
        function isLeapJalaaliYear(jy) {
            return jalCalLeap(jy) === 0
        }

        /*
          Number of days in a given month in a Jalaali year.
        */
        function jalaaliMonthLength(jy, jm) {
            if (jm <= 6) return 31
            if (jm <= 11) return 30
            if (isLeapJalaaliYear(jy)) return 30
            return 29
        }

        /*
            This function determines if the Jalaali (Persian) year is
            leap (366-day long) or is the common year (365 days)
            @param jy Jalaali calendar year (-61 to 3177)
            @returns number of years since the last leap year (0 to 4)
         */
        function jalCalLeap(jy) {
            var bl = breaks.length,
                jp = breaks[0],
                jm, jump, leap, n, i

            if (jy < jp || jy >= breaks[bl - 1])
                throw new Error('Invalid Jalaali year ' + jy)

            for (i = 1; i < bl; i += 1) {
                jm = breaks[i]
                jump = jm - jp
                if (jy < jm)
                    break
                jp = jm
            }
            n = jy - jp

            if (jump - n < 6)
                n = n - jump + div(jump + 4, 33) * 33
            leap = mod(mod(n + 1, 33) - 1, 4)
            if (leap === -1) {
                leap = 4
            }

            return leap
        }

        /*
          This function determines if the Jalaali (Persian) year is
          leap (366-day long) or is the common year (365 days), and
          finds the day in March (Gregorian calendar) of the first
          day of the Jalaali year (jy).
          @param jy Jalaali calendar year (-61 to 3177)
          @param withoutLeap when don't need leap (true or false) default is false
          @return
            leap: number of years since the last leap year (0 to 4)
            gy: Gregorian year of the beginning of Jalaali year
            march: the March day of Farvardin the 1st (1st day of jy)
          @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
          @see: http://www.fourmilab.ch/documents/calendar/
        */
        function jalCal(jy, withoutLeap) {
            var bl = breaks.length,
                gy = jy + 621,
                leapJ = -14,
                jp = breaks[0],
                jm, jump, leap, leapG, march, n, i

            if (jy < jp || jy >= breaks[bl - 1])
                throw new Error('Invalid Jalaali year ' + jy)

            // Find the limiting years for the Jalaali year jy.
            for (i = 1; i < bl; i += 1) {
                jm = breaks[i]
                jump = jm - jp
                if (jy < jm)
                    break
                leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
                jp = jm
            }
            n = jy - jp

            // Find the number of leap years from AD 621 to the beginning
            // of the current Jalaali year in the Persian calendar.
            leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
            if (mod(jump, 33) === 4 && jump - n === 4)
                leapJ += 1

            // And the same in the Gregorian calendar (until the year gy).
            leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

            // Determine the Gregorian date of Farvardin the 1st.
            march = 20 + leapJ - leapG

            // Find how many years have passed since the last leap year.
            if (!withoutLeap) {
                if (jump - n < 6)
                    n = n - jump + div(jump + 4, 33) * 33
                leap = mod(mod(n + 1, 33) - 1, 4)
                if (leap === -1) {
                    leap = 4
                }
            }

            return {
                leap: leap,
                gy: gy,
                march: march
            }
        }

        /*
          Converts a date of the Jalaali calendar to the Julian Day number.
          @param jy Jalaali year (1 to 3100)
          @param jm Jalaali month (1 to 12)
          @param jd Jalaali day (1 to 29/31)
          @return Julian Day number
        */
        function j2d(jy, jm, jd) {
            var r = jalCal(jy, true)
            return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
        }

        /*
          Converts the Julian Day number to a date in the Jalaali calendar.
          @param jdn Julian Day number
          @return
            jy: Jalaali year (1 to 3100)
            jm: Jalaali month (1 to 12)
            jd: Jalaali day (1 to 29/31)
        */
        function d2j(jdn) {
            var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
                ,
                jy = gy - 621,
                r = jalCal(jy, false),
                jdn1f = g2d(gy, 3, r.march),
                jd, jm, k

            // Find number of days that passed since 1 Farvardin.
            k = jdn - jdn1f
            if (k >= 0) {
                if (k <= 185) {
                    // The first 6 months.
                    jm = 1 + div(k, 31)
                    jd = mod(k, 31) + 1
                    return {
                        jy: jy,
                        jm: jm,
                        jd: jd
                    }
                } else {
                    // The remaining months.
                    k -= 186
                }
            } else {
                // Previous Jalaali year.
                jy -= 1
                k += 179
                if (r.leap === 1)
                    k += 1
            }
            jm = 7 + div(k, 30)
            jd = mod(k, 30) + 1
            return {
                jy: jy,
                jm: jm,
                jd: jd
            }
        }

        /*
          Calculates the Julian Day number from Gregorian or Julian
          calendar dates. This integer number corresponds to the noon of
          the date (i.e. 12 hours of Universal Time).
          The procedure was tested to be good since 1 March, -100100 (of both
          calendars) up to a few million years into the future.
          @param gy Calendar year (years BC numbered 0, -1, -2, ...)
          @param gm Calendar month (1 to 12)
          @param gd Calendar day of the month (1 to 28/29/30/31)
          @return Julian Day number
        */
        function g2d(gy, gm, gd) {
            var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
                div(153 * mod(gm + 9, 12) + 2, 5) +
                gd - 34840408
            d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
            return d
        }

        /*
          Calculates Gregorian and Julian calendar dates from the Julian Day number
          (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
          calendars) to some millions years ahead of the present.
          @param jdn Julian Day number
          @return
            gy: Calendar year (years BC numbered 0, -1, -2, ...)
            gm: Calendar month (1 to 12)
            gd: Calendar day of the month M (1 to 28/29/30/31)
        */
        function d2g(jdn) {
            var j, i, gd, gm, gy
            j = 4 * jdn + 139361631
            j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
            i = div(mod(j, 1461), 4) * 5 + 308
            gd = div(mod(i, 153), 5) + 1
            gm = mod(div(i, 153), 12) + 1
            gy = div(j, 1461) - 100100 + div(8 - gm, 6)
            return {
                gy: gy,
                gm: gm,
                gd: gd
            }
        }

        /*
          Utility helper functions.
        */

        function div(a, b) {
            return ~~(a / b)
        }

        function mod(a, b) {
            return a - ~~(a / b) * b
        }
        /*Jallali Date*/



        var FRIDAY = 5,
            DateRangeInput = function () {
                function DateRangeInput() { }
                return DateRangeInput.initialize = function (_localizedStrings) {
                    DateRangeInput.Today = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_TODAY, DateRangeInput.Yesterday = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_YESTERDAY, DateRangeInput.ThisWeek = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_THISWEEK, DateRangeInput.LastWeek = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_LASTWEEK, DateRangeInput.ThisMonth = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_THISMONTH, DateRangeInput.LastMonth = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_LASTMONTH, DateRangeInput.MonthToDate = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_MONTHTODATE, DateRangeInput.ThisQuarter = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_THISQUARTER, DateRangeInput.LastQuarter = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_LASTQUARTER, DateRangeInput.CustomTimeFrame = _localizedStrings.DATERANGEFILTER_DATERANGEINPUT_CUSTOMTIMEFRAME, DateRangeInput.FormattedDateRange = _localizedStrings.DATERANGEFILTER_BUTTON_FORMATTEDDATERANGETEXT, DateRangeInput.DateRangeInputByTimeFrame = [DateRangeInput.Today, DateRangeInput.Yesterday, DateRangeInput.ThisWeek, DateRangeInput.LastWeek, DateRangeInput.ThisMonth, DateRangeInput.LastMonth, DateRangeInput.MonthToDate, DateRangeInput.ThisQuarter, DateRangeInput.LastQuarter, DateRangeInput.CustomTimeFrame]
                }, DateRangeInput.ConvertStringToDate = function (dateStr) {
                    var newDateStr = dateStr.replace(/-/g, "/");
                    return new Date(newDateStr)
                }, DateRangeInput.GenerateStartEndDateForTimeFrame = function (timeFrame) {
                    var startDate = toJalaali(new Date()),
                        endDate = toJalaali(new Date());
                    switch (timeFrame) {
                        case 0:
                        case DateRangeInput.Today:
                            endDate = startDate;
                            break;
                        case 1:
                        case DateRangeInput.Yesterday:
                            startDate.setDate(startDate.getDate() - 1), endDate = startDate;
                            break;
                        case 2:
                        case DateRangeInput.ThisWeek:
                            console.log("startDate.getDay() >> ", startDate.getDay());
                            console.log("startDate.getDate() >> ", startDate.getDate());
                            console.log("else >> ", startDate.getDate() - startDate.getDay() - 1);
                            startDate.setDate(startDate.getDay() === FRIDAY ? startDate.getDate() - 6 : startDate.getDate() - startDate.getDay() - 1), endDate.getDay() !== FRIDAY && endDate.setDate(endDate.getDate() + 5 - endDate.getDay());
                            break;
                        case 3:
                        case DateRangeInput.LastWeek:
                            startDate.setDate(startDate.getDay() === FRIDAY ? startDate.getDate() - 13 : startDate.getDate() - startDate.getDay() - 8), endDate.setDate(endDate.getDay() === FRIDAY ? endDate.getDate() - 5 : endDate.getDate() - endDate.getDay() - 2);
                            break;
                        case 4:
                        case DateRangeInput.ThisMonth:
                            var jalDateStart = toJalaali(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
                            console.log("1.jalDateStart >> ", jalDateStart);
                            var greDateStart = toGregorian(jalDateStart.jy, jalDateStart.jm, 1)
                            console.log("2.greDateStart >> ", greDateStart);
                            startDate.setFullYear(greDateStart.gy);
                            startDate.setMonth(greDateStart.gm - 1);
                            startDate.setDate(greDateStart.gd);
                            console.log("3.startDate >> ", startDate);

                            var daysOfMonth = 0;
                            if (jalDateStart.jm <= 6) daysOfMonth = 31
                            if (jalDateStart.jm >= 7 && jalDateStart.jm <= 11) daysOfMonth = 30
                            if (jalDateStart.jm == 12 && isLeapJalaaliYear(jalDateStart.jy)) daysOfMonth = 30
                            else if (jalDateStart.jm == 12 && !isLeapJalaaliYear(jalDateStart.jy)) daysOfMonth = 29
                            console.log("4.daysOfMonth >> ", daysOfMonth);
                            console.log("5.toGregorian >> ", jalDateStart.jy, jalDateStart.jm, daysOfMonth);

                            // var greDateEnd = toGregorian(jalDateStart.jy, jalDateStart.jm -1, daysOfMonth)
                            // console.log("6.greDateEnd >> ", greDateEnd);

                            endDate.setFullYear(startDate.getFullYear());
                            endDate.setMonth(startDate.getMonth());
                            // endDate.setMonth(endDate.getMonth() - 1);
                            // endDate.setMonth(endDate.getMonth() - 1);
                            endDate.setDate(startDate.getDate() + (daysOfMonth - 1));
                            console.log("7.endDate >> ", endDate);
                            console.log("7.getMonth >> ", endDate.getMonth());

                            //startDate.setDate(1), endDate.setDate(0), endDate.setMonth(endDate.getMonth() + 1);
                            break;
                        case 5:
                        case DateRangeInput.LastMonth:
                            var jalDateStart = toJalaali(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                            console.log("1.jalDateStart >> ", jalDateStart);
                            var greDateStart = toGregorian(jalDateStart.jy, jalDateStart.jm - 1, 1)
                            console.log("2.greDateStart >> ", greDateStart);
                            startDate.setFullYear(greDateStart.gy);
                            startDate.setMonth(greDateStart.gm);
                            startDate.setDate(greDateStart.gd);
                            console.log("3.startDate >> ", startDate);
                            console.log("3.jalDateStart.jm >> ", jalDateStart.jm);

                            var daysOfMonth = 0;
                            if (jalDateStart.jm <= 6) daysOfMonth = 31
                            if (jalDateStart.jm >= 7 && jalDateStart.jm <= 11) daysOfMonth = 30
                            if (jalDateStart.jm == 12 && isLeapJalaaliYear(jalDateStart.jy)) daysOfMonth = 30
                            else if (jalDateStart.jm == 12 && !isLeapJalaaliYear(jalDateStart.jy)) daysOfMonth = 29
                            console.log("4.daysOfMonth >> ", daysOfMonth);
                            console.log("5.toGregorian >> ", jalDateStart.jy, jalDateStart.jm, daysOfMonth);

                            var greDateEnd = toGregorian(jalDateStart.jy, jalDateStart.jm - 1, daysOfMonth)
                            console.log("6.greDateEnd >> ", greDateEnd);

                            endDate.setFullYear(startDate.getFullYear());
                            endDate.setMonth(startDate.getMonth());
                            // endDate.setMonth(endDate.getMonth() - 1);
                            // endDate.setMonth(endDate.getMonth() - 1);
                            endDate.setDate(startDate.getDate() + (daysOfMonth - 1));
                            console.log("7.endDate >> ", endDate);
                            console.log("7.getMonth >> ", endDate.getMonth());
                            //startDate.setDate(1), startDate.setMonth(startDate.getMonth() - 1), endDate.setDate(0);
                            break;
                        case 6:
                        case DateRangeInput.MonthToDate:
                            var jalDateStart = toJalaali(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
                            var greDateStart = toGregorian(jalDateStart.jy, jalDateStart.jm, 1);

                            startDate.setFullYear(greDateStart.gy);
                            startDate.setMonth(greDateStart.gm - 1);
                            startDate.setDate(greDateStart.gd);

                            //startDate.setDate(1);
                            break;
                        case 7:
                        case DateRangeInput.ThisQuarter:
                            var jalDateStart = toJalaali(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
                            var greDateStart = {};
                            var greDateEnd = {};
                            console.log("1.jalDateStart >> ", jalDateStart);

                            if (jalDateStart.jm >= 1 && jalDateStart.jm <= 3) {
                                greDateStart = toGregorian(jalDateStart.jy, 1, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 3, 31);
                            } else if (jalDateStart.jm >= 4 && jalDateStart.jm <= 6) {
                                greDateStart = toGregorian(jalDateStart.jy, 4, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 6, 31);
                            } else if (jalDateStart.jm >= 7 && jalDateStart.jm <= 9) {
                                greDateStart = toGregorian(jalDateStart.jy, 7, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 9, 30);
                            } else if (jalDateStart.jm >= 10 && jalDateStart.jm <= 12) {
                                greDateStart = toGregorian(jalDateStart.jy, 10, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 12, isLeapJalaaliYear(jalDateStart.jy) ? 30 : 29);
                            }

                            startDate.setFullYear(greDateStart.gy);
                            startDate.setMonth(greDateStart.gm - 1);
                            //                            startDate.setMonth(startDate.getMonth() - 1);
                            startDate.setDate(greDateStart.gd);

                            endDate.setFullYear(greDateEnd.gy);
                            endDate.setMonth(greDateEnd.gm - 1);
                            //endDate.setMonth(endDate.getMonth() - 1);
                            endDate.setDate(greDateEnd.gd);

                            //startDate.setDate(1), startDate.setMonth(3 * Math.floor(startDate.getMonth() / 3)), endDate.setDate(1), endDate.setMonth(startDate.getMonth() + 3), endDate.setDate(0);
                            break;
                        case 8:
                        case DateRangeInput.LastQuarter:
                            var jalDateStart = toJalaali(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
                            var greDateStart = {};
                            var greDateEnd = {};
                            console.log("1.jalDateStart >> ", jalDateStart);

                            if (jalDateStart.jm >= 1 && jalDateStart.jm <= 3) {
                                greDateStart = toGregorian(jalDateStart.jy - 1, 10, 1);
                                greDateEnd = toGregorian(jalDateStart.jy - 1, 12, isLeapJalaaliYear(jalDateStart.jy - 1) ? 30 : 29);
                            } else if (jalDateStart.jm >= 4 && jalDateStart.jm <= 6) {
                                greDateStart = toGregorian(jalDateStart.jy, 1, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 3, 31);
                            } else if (jalDateStart.jm >= 7 && jalDateStart.jm <= 9) {
                                greDateStart = toGregorian(jalDateStart.jy, 4, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 6, 31);
                            } else if (jalDateStart.jm >= 10 && jalDateStart.jm <= 12) {
                                greDateStart = toGregorian(jalDateStart.jy, 7, 1);
                                greDateEnd = toGregorian(jalDateStart.jy, 9, 30);
                            }

                            startDate.setFullYear(greDateStart.gy);
                            startDate.setMonth(greDateStart.gm - 1);
                            //startDate.setMonth(startDate.getMonth() - 1);
                            startDate.setDate(greDateStart.gd);

                            endDate.setFullYear(greDateEnd.gy);
                            endDate.setMonth(greDateEnd.gm - 1);
                            //endDate.setMonth(endDate.getMonth() - 1);
                            endDate.setDate(greDateEnd.gd);
                        //startDate.setDate(1), startDate.setMonth(3 * Math.floor(startDate.getMonth() / 3) - 3), endDate.setDate(1), endDate.setMonth(startDate.getMonth() + 3), endDate.setDate(0), endDate.setFullYear(startDate.getFullYear())
                    }
                    return {
                        StartDate: startDate,
                        EndDate: endDate
                    }
                }, DateRangeInput.GetUTCDateString = function (inputDate) {
                    return inputDate.getFullYear() + "-" + (inputDate.getMonth() + 1) + "-" + inputDate.getDate()
                }, DateRangeInput.GetDateConditionExpression = function (startDate, endDate, attributeName) {
                    var conditionExpressionArr = [];
                    return conditionExpressionArr.push({
                        attributeName: attributeName,
                        conditionOperator: 27,
                        value: DateRangeInput.GetUTCDateString(startDate)
                    }), conditionExpressionArr.push({
                        attributeName: attributeName,
                        conditionOperator: 26,
                        value: DateRangeInput.GetUTCDateString(endDate)
                    }), conditionExpressionArr
                }, DateRangeInput.GetDefaultDateConditionExpression = function (attributeName, timeFrame) {
                    var conditionExp = [],
                        startEndDate = DateRangeInput.GenerateStartEndDateForTimeFrame(timeFrame);
                    return conditionExp = DateRangeInput.GetDateConditionExpression(startEndDate[DateRangeInput.StartDate], startEndDate[DateRangeInput.EndDate], attributeName)
                }, DateRangeInput.GetFormattedDateRangeFromUTCDateStrings = function (start, end, context) {
                    var startDate = DateRangeInput.ConvertStringToDate(start),
                        endDate = DateRangeInput.ConvertStringToDate(end);
                    return DateRangeInput.GetFormattedDateRange(startDate, endDate, context)
                }, DateRangeInput.GetFormattedDateRange = function (startDate, endDate, context) {
                    var output = DateRangeInput.FormattedDateRange;
                    return context && context.formatting && context.formatting.formatDateShort ? output.replace(/\{0\}/g, GetJalaaliToString(startDate)).replace(/\{1\}/g, GetJalaaliToString(endDate)) : output.replace(/\{0\}/g, GetJalaaliToString(startDate)).replace(/\{1\}/g, GetJalaaliToString(endDate))
                }, DateRangeInput.StartDate = "StartDate", DateRangeInput.EndDate = "EndDate", DateRangeInput
            }();
        DateRangeControl.DateRangeInput = DateRangeInput
    }(DateRangeControl = MscrmControls.DateRangeControl || (MscrmControls.DateRangeControl = {}))
}(MscrmControls || (MscrmControls = {}));
var MscrmControls;
! function (MscrmControls) {
    var DateRangeControl;
    ! function (DateRangeControl) {
        "use strict";
        var MILLISECONDS_IN_MINUTE = 6e4,
            DateRangeFilterControl = function () {
                function DateRangeFilterControl() {
                    this._dateConditionExpArr = [], this._isOpen = !1, this._isCustomDatePaneOpen = !1, this._buttonText = "Time Range", this.context = null, this._changeHandler = this._onChange.bind(this)
                }
                return DateRangeFilterControl.prototype._onChange = function (type, change) {
                    change && (type === DateRangeControl.DateRangeInput.StartDate ? this._valueFromStartDateControlInput = this._correctDate(change, this._valueFromStartDateControlInput) : this._valueFromEndDateControlInput = this._correctDate(change, this._valueFromEndDateControlInput), this._isCustomDatePaneOpen ? this.context.utils.requestRender() : this._isCustomTimeFrameApplyClicked && !this._isCustomDatePaneOpen && (this._applyButtonClickHandler(this), this._isCustomTimeFrameApplyClicked = !1))
                }, DateRangeFilterControl.prototype._correctDate = function (change, controlValue) {
                    return isNaN(Date.parse(change)) ? controlValue : new Date(change)
                }, DateRangeFilterControl.prototype.optionsClickHandler = function () {
                    this.optionsClickHandlerSetFocus(), event.stopPropagation(), event.preventDefault()
                }, DateRangeFilterControl.prototype.optionsClickHandlerSetFocus = function () {
                    var _this = this;
                    window.setTimeout(function () {
                        if (document.getElementById(_this.context.accessibility.getUniqueId("DateRangeFilter"))) {
                            var element = document.getElementById(_this.context.accessibility.getUniqueId("DateRangeFilter"));
                            element.focus()
                        } else _this.optionsClickHandlerSetFocus()
                    }, 100)
                }, DateRangeFilterControl.prototype._updateButtonText = function (label) {
                    this._valueFromStartDateControl = this._valueFromStartDateControlInput, this._valueFromEndDateControl = this._valueFromEndDateControlInput, this._valueFromEndDateControlInput && this._valueFromStartDateControlInput ? this._buttonText = label + " " + DateRangeControl.DateRangeInput.GetFormattedDateRange(this._valueFromStartDateControlInput, this._valueFromEndDateControlInput, this.context) : label ? this._buttonText = label : this._buttonText = " "
                }, DateRangeFilterControl.prototype.handleDateRangeButtonClick = function (event) {
                    var dateRangeButtonAriaExpandedValue = this._isOpen ? "true" : "false",
                        dateRangeButton = document.getElementById(this.context.accessibility.getUniqueId("DateRangeFilter"));
                    dateRangeButton.setAttribute("aria-expanded", dateRangeButtonAriaExpandedValue), this._isOpen && (this.dateRangeFilterFlyout = this.context.accessibility.getUniqueId("DateRangeFilterFlyout"), dateRangeButton.setAttribute("aria-controls", this.dateRangeFilterFlyout))
                }, DateRangeFilterControl.prototype.init = function (context, notifyOutputChanged, state) {
                    this.context = context, this._localizedStrings = DateRangeControl.DateRangeFilterControlUtils.getLocalizedStrings(this.context), DateRangeControl.DateRangeInput.initialize(this._localizedStrings), this.context.parameters && this.context.parameters.DateRangeAttribute && this.context.parameters.DateRangeAttribute.raw && (this._attributeName = this.context.parameters.DateRangeAttribute.raw), this.context.parameters && this.context.parameters.DateRangeTimeframe && this.context.parameters.DateRangeTimeframe.raw && (this._defaultTimeFrame = +this.context.parameters.DateRangeTimeframe.raw), this._notifyOutputChangedInternal = notifyOutputChanged, this.context.accessibility.registerShortcut([17, 18, 68], this.dateRangeFilterControlShortCut.bind(this), !0, "DateRange_Filter_Button", "DATERANGEFILTERBUTTONSHORTCUT")
                }, DateRangeFilterControl.prototype.dateRangeFilterControlShortCut = function () {
                    var element = document.getElementById(this.context.accessibility.getUniqueId("DateRangeFilter"));
                    element && element.click()
                }, DateRangeFilterControl.prototype.updateView = function (context) {
                    if (this.context = context, DateRangeControl.DateRangeInput.initialize(this._localizedStrings), !this.context.parameters || !this._defaultTimeFrame && 0 !== this._defaultTimeFrame || this.context.parameters.DateRangeTimeframe && this.context.parameters.DateRangeTimeframe.raw || (this._defaultTimeFrame = null, this._buttonText = ""), this.context.parameters && this.context.parameters.DateRangeTimeframe && this.context.parameters.DateRangeTimeframe.raw) {
                        var canNotifyFilterChanged = !!this._dateRangeTimeframe,
                            timeFrameString = DateRangeControl.DateRangeInput.DateRangeInputByTimeFrame[+this.context.parameters.DateRangeTimeframe.raw],
                            startEndDate = void 0,
                            isValueChanged = !1;
                        if (9 === +this.context.parameters.DateRangeTimeframe.raw && this.context.parameters.CustomTimeFrameStartDate && this.context.parameters.CustomTimeFrameStartDate.raw && this.context.parameters.CustomTimeFrameEndDate && this.context.parameters.CustomTimeFrameEndDate.raw && (this._customTimeFrameEndDate != this.context.parameters.CustomTimeFrameEndDate.raw || this._customTimeFrameStartDate != this.context.parameters.CustomTimeFrameStartDate.raw) && this.context.parameters.CustomTimeFrameEndDate.raw >= this.context.parameters.CustomTimeFrameStartDate.raw ? (startEndDate = {}, this._dateRangeTimeframe = this.context.parameters.DateRangeTimeframe.raw, startEndDate[DateRangeControl.DateRangeInput.StartDate] = DateRangeControl.DateRangeInput.ConvertStringToDate(this.context.parameters.CustomTimeFrameStartDate.raw), startEndDate[DateRangeControl.DateRangeInput.EndDate] = DateRangeControl.DateRangeInput.ConvertStringToDate(this.context.parameters.CustomTimeFrameEndDate.raw), this._customTimeFrameStartDate = this.context.parameters.CustomTimeFrameStartDate.raw, this._customTimeFrameEndDate = this.context.parameters.CustomTimeFrameEndDate.raw, isValueChanged = !0) : this._dateRangeTimeframe != this.context.parameters.DateRangeTimeframe.raw && (startEndDate = DateRangeControl.DateRangeInput.GenerateStartEndDateForTimeFrame(timeFrameString), this._dateRangeTimeframe = this.context.parameters.DateRangeTimeframe.raw, isValueChanged = !0), this._valueFromStartDateControlInput > this._valueFromEndDateControlInput) {
                            var tempEndDate = new Date(this._valueFromStartDateControlInput.getTime());
                            tempEndDate.setDate(tempEndDate.getDate() + 1), this._valueFromEndDateControlInput = tempEndDate, this._isCustomTimeFrameApplyClicked && (this._customTimeFrameStartDate = this._valueFromStartDateControlInput.toString(), this._customTimeFrameEndDate = this._valueFromEndDateControlInput.toString(), timeFrameString = DateRangeControl.DateRangeInput.CustomTimeFrame, _a = {}, _a[DateRangeControl.DateRangeInput.StartDate] = this._valueFromStartDateControlInput, _a[DateRangeControl.DateRangeInput.EndDate] = this._valueFromEndDateControlInput, startEndDate = _a, isValueChanged = !0), this.context.utils.requestRender()
                        }
                        isValueChanged && (this._valueFromStartDateControlInput = startEndDate[DateRangeControl.DateRangeInput.StartDate], this._valueFromEndDateControlInput = startEndDate[DateRangeControl.DateRangeInput.EndDate], this._updateButtonText(timeFrameString), this._updateDateConditionExpression(), this._notifyOutputChanged(timeFrameString, canNotifyFilterChanged))
                    }
                    var filterIcon = this.context.factory.createElement("MICROSOFTICON", {
                        id: "DateRangeFilterIcon",
                        key: "DateRangeFilterIcon",
                        type: 82,
                        style: {
                            fontSize: "16px",
                            color: this.context.theming.colors.grays.gray07
                        }
                    }),
                        components = [],
                        text = this.context.factory.createElement("LABEL", {
                            id: "DateRangeFilterText",
                            key: "DateRangeFilterText",
                            style: {
                                cursor: "pointer",
                                textOverflow: this.context.parameters.DashboardColumns ? void 0 : "ellipsis",
                                whiteSpace: this.context.parameters.DashboardColumns ? void 0 : "nowrap",
                                overflow: this.context.parameters.DashboardColumns ? void 0 : "hidden"
                            }
                        }, this._buttonText),
                        icon = this.context.factory.createElement("MICROSOFTICON", {
                            id: "DateRangeFilterDownIcon",
                            key: "DateRangeFilterDownIcon",
                            type: 72,
                            style: {
                                fontSize: "16px",
                                color: this.context.theming.colors.base.black,
                                paddingTop: "6px",
                                paddingBottom: "6px",
                                paddingRight: this.context.parameters.DashboardColumns ? this.context.theming.measures.measure100 : 0,
                                paddingLeft: this.context.parameters.DashboardColumns ? this.context.theming.measures.measure100 : this.context.theming.measures.measure050,
                                ":hover": {
                                    backgroundColor: this.context.theming.colors.grays.gray02
                                }
                            }
                        });
                    if (this.context.parameters.DashboardWidth && this.context.parameters.DashboardWidth.raw < +this.context.theming.breakpoints.dimensionm ? components.push(filterIcon) : (components.push(text), components.push(icon)), this._isOpen) {
                        var flyout = this._createFlyout();
                        components.push(flyout)
                    } else if (this._isCustomDatePaneOpen) {
                        var flyout = this._createCustomDateTimeFlyout();
                        components.push(flyout)
                    }
                    var _this = this,
                        filterBy = this.context.parameters && this.context.parameters.DisplayName && this.context.parameters.DisplayName.raw ? this.context.parameters.DisplayName.raw : "",
                        button = this.context.factory.createElement("BUTTON", {
                            id: "DateRangeFilter",
                            key: "DateRangeFilter",
                            accessibilityHasPopup: !0,
                            accessibilityLabel: filterBy + " : " + _this._buttonText,
                            accessibilityExpanded: this._isOpen,
                            controlsElementId: this._isOpen ? this.dateRangeFilterFlyout : null,
                            style: {
                                flexDirection: "row",
                                justifyContent: "space-around",
                                whiteSpace: "nowrap",
                                width: this.context.parameters.DashboardColumns && 1 === this.context.parameters.DashboardColumns.raw ? "calc(16px + " + this.context.theming.measures.measure200 + ")" : "100%",
                                height: "30px",
                                overflow: "hidden",
                                fontSize: this.context.theming.fontsizes.font100,
                                fontFamilies: this.context.theming.fontfamilies.semibold,
                                color: this.context.theming.colors.grays.gray05,
                                backgroundColor: this.context.theming.colors.whitebackground,
                                border: "none",
                                alignItems: "center",
                                cursor: "pointer",
                                paddingRight: this.context.parameters.DashboardWidth && this.context.parameters.DashboardWidth.raw < +this.context.theming.breakpoints.dimensionm ? this.context.theming.measures.measure100 : 0,
                                paddingLeft: this.context.parameters.DashboardColumns ? this.context.theming.measures.measure100 : 0,
                                flexShrink: 1
                            },
                            onKeyDown: function (event) {
                                40 === event.keyCode && event.currentTarget.click()
                            },
                            onClick: function () {
                                _this._toggleFlyout(_this), _this.handleDateRangeButtonClick(_this), _this._setFocusOnSelectedElement(_this.context.accessibility.getUniqueId("DateRangeFilter_FlyoutText" + DateRangeControl.DateRangeInput.DateRangeInputByTimeFrame[0]), _this.context.theming.colors.grays.gray03)
                            }
                        }, components);
                    return button;
                    var _a
                }, DateRangeFilterControl.prototype.addCircularTabbing = function (event, elementId) {
                    var element = event.target,
                        container = document.getElementById(elementId);
                    if (container) {
                        for (var containerElements = container.querySelectorAll("li "), tabbableElements = [], i = 0; i < containerElements.length; i++) tabbableElements.push(containerElements[i]);
                        if (tabbableElements && 0 !== tabbableElements.length) {
                            for (var targetIndex, index = 0; index < tabbableElements.length; index++) tabbableElements[index] === event.target && (targetIndex = index);
                            var nextFocusElement = null;
                            38 === event.keyCode ? nextFocusElement = element.id === tabbableElements[0].id ? tabbableElements[tabbableElements.length - 1] : tabbableElements[targetIndex - 1] : event.shiftKey && 9 === event.keyCode ? element.id === tabbableElements[0].id ? (this._isOpen = !this._isOpen, this.context.utils.requestRender(), this.optionsClickHandler()) : nextFocusElement = tabbableElements[targetIndex - 1] : 40 === event.keyCode ? nextFocusElement = element.id === tabbableElements[tabbableElements.length - 1].id ? tabbableElements[0] : tabbableElements[targetIndex + 1] : 9 !== event.keyCode || event.shiftKey || (element.id === tabbableElements[tabbableElements.length - 1].id ? (this._isOpen = !this._isOpen, this.context.utils.requestRender(), this.optionsClickHandler()) : nextFocusElement = tabbableElements[targetIndex + 1]), nextFocusElement && (element.removeAttribute("style"), nextFocusElement.focus(), nextFocusElement.style.backgroundColor = this.context.theming.colors.grays.gray03, event.preventDefault())
                        }
                    }
                }, DateRangeFilterControl.prototype._keyDownHelper = function (event) {
                    event.target;
                    event && this.addCircularTabbing(event, this.context.accessibility.getUniqueId("DateRangeFilterFlyout"))
                }, DateRangeFilterControl.prototype._setFocusOnSelectedElement = function (listItemKey, style, outline) {
                    var _this = this;
                    window.setTimeout(function () {
                        document.getElementById(_this.context.accessibility.getUniqueId("DateRangeFilterFlyout")) ? _this._getSelectedElement(listItemKey, style, outline) : _this._setFocusOnSelectedElement(listItemKey, style, outline)
                    }, 100)
                }, DateRangeFilterControl.prototype._getSelectedElement = function (listItemKey, style, outline) {
                    for (var selectedElementText, focussedElement, container = document.getElementById(this.context.accessibility.getUniqueId("DateRangeFilterFlyout")), listElements = container.querySelectorAll("li"), textLabel = this._buttonText, index = 0; index < DateRangeControl.DateRangeInput.DateRangeInputByTimeFrame.length; index++) textLabel.indexOf(DateRangeControl.DateRangeInput.DateRangeInputByTimeFrame[index]) >= 0 && (selectedElementText = DateRangeControl.DateRangeInput.DateRangeInputByTimeFrame[index]);
                    for (var i = 0; i < listElements.length; i++) listElements[i].title === selectedElementText ? focussedElement = listElements[i] : selectedElementText || (focussedElement = listElements[listElements.length - 1].parentElement);
                    focussedElement && (focussedElement.tabIndex = 0, focussedElement.focus(), focussedElement.style.backgroundColor = style, outline && (focussedElement.style.outline = outline))
                }, DateRangeFilterControl.prototype._setFocusOnElement = function (listItemKey, style, outline) {
                    var elementId = listItemKey,
                        element = document.getElementById(elementId);
                    element && (element.tabIndex = 0, element.focus(), element.style.backgroundColor = style, outline && (element.style.outline = outline))
                }, DateRangeFilterControl.prototype._setFocus = function (listItemKey, style, outline) {
                    var _this = this;
                    window.setTimeout(function () {
                        document.getElementById(_this.context.accessibility.getUniqueId("DateRangeFilterFlyout")) || document.getElementById(_this.context.accessibility.getUniqueId("DateRangeFilter_ParentCustomDateContainer")) ? _this._setFocusOnElement(listItemKey, style, outline) : _this._setFocus(listItemKey, style, outline)
                    }, 100)
                }, DateRangeFilterControl.prototype._setFocusOnCalendarControl = function (listItemKey, style) {
                    var elementId = listItemKey,
                        element = document.getElementById(elementId);
                    element && (element.tabIndex = 0, element.focus(), element.style.backgroundColor = style)
                }, DateRangeFilterControl.prototype.getOutputs = function () {
                    var result = {
                        DateRangeOutput: JSON.stringify(this._dateConditionExpArr),
                        TimeFrameOutput: this._currentTimeFrame
                    };
                    return result
                }, DateRangeFilterControl.prototype._notifyOutputChanged = function (timeFrameLabel, canNotifyFilterChanged) {
                    void 0 === canNotifyFilterChanged && (canNotifyFilterChanged = !0), this._notifyOutputChangedInternal();
                    var timeFrame = DateRangeControl.DateRangeInput.DateRangeInputByTimeFrame.indexOf(timeFrameLabel);
                    if (canNotifyFilterChanged) {
                        this._currentTimeFrame = timeFrame.toString();
                        var filterChange = {
                            filter: this._dateConditionExpArr,
                            timeFrame: this._currentTimeFrame
                        };
                        this.context.utils.fireEvent("onFilterChanged", filterChange)
                    }
                    this._reportDateRangeTelemetry(timeFrame)
                }, DateRangeFilterControl.prototype._reportDateRangeTelemetry = function (timeFrame) {
                    var startTime = DateRangeControl.DateRangeInput.ConvertStringToDate(DateRangeControl.DateRangeInput.GetUTCDateString(this._valueFromStartDateControlInput)),
                        endTime = DateRangeControl.DateRangeInput.ConvertStringToDate(DateRangeControl.DateRangeInput.GetUTCDateString(this._valueFromEndDateControlInput)),
                        dateRangeEvent = {
                            eventName: "uci_daterangefilter",
                            eventParameters: [{
                                name: "TimeFrame",
                                value: timeFrame
                            }, {
                                name: "StartTime",
                                value: startTime
                            }, {
                                name: "EndTime",
                                value: endTime
                            }, {
                                name: "Attribute",
                                value: this._attributeName
                            }]
                        };
                    this.context.reporting.reportEvent(dateRangeEvent)
                }, DateRangeFilterControl.prototype.destroy = function () { }, DateRangeFilterControl.prototype._createCustomDateTimeFlyout = function () {
                    var components = [];
                    components.push(this._createDateTimeControlHeader(this)), components.push(this.createDateTimeControlRow(this)), components.push(this._createDateTimeControlFooter(this));
                    var parentCustomDateContainer = this.context.factory.createElement("CONTAINER", {
                        id: "DateRangeFilter_ParentCustomDateContainer",
                        key: "DateRangeFilter_ParentCustomDateContainer",
                        style: {
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            backgroundColor: this.context.theming.colors.whitebackground,
                            border: this.context.theming.borders.border02,
                            boxShadow: "4px 4px 4px 1px rgba(0, 0, 0, 0.5);"
                        }
                    }, components),
                        _this = this,
                        flyout = this.context.factory.createElement("FLYOUT", {
                            id: "DateRangeFilter_CustomDateFlyout",
                            key: "DateRangeFilter_CustomDateFlyout",
                            positionType: "relative",
                            flyoutDirection: 3,
                            relativeToElementId: !this.context.parameters.DashboardColumns || 1 !== this.context.parameters.DashboardColumns.raw && 2 !== this.context.parameters.DashboardColumns.raw ? "DateRangeFilterDownIcon" : "DateRangeFilter",
                            onOutsideClick: function () {
                                return _this._toggleCustomDateSelector(_this)
                            },
                            groupId: "DateRangeFilterCustomDateFlyoutGroup"
                        }, [parentCustomDateContainer]);
                    return flyout
                }, DateRangeFilterControl.prototype._createFlyout = function () {
                    var _this = this,
                        listItems = [],
                        listOptionHeader = this.context.factory.createElement("LABEL", {
                            id: "DateRangeFilter_FlyoutTextModified",
                            key: "DateRangeFilter_FlyoutTextModified",
                            style: {
                                paddingTop: this.context.theming.measures.measure075,
                                paddingBottom: this.context.theming.measures.measure050,
                                paddingLeft: this.context.theming.measures.measure150,
                                paddingRight: this.context.theming.measures.measure150,
                                fontSize: this.context.theming.fontsizes.font100,
                                fontFamilies: this.context.theming.fontfamilies.semibold,
                                border: this.context.theming.borders.border02,
                                color: this.context.theming.colors.base.black,
                                listStyleType: "none"
                            }
                        }, th