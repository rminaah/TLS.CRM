var ViewModel = null;
//var ParentXrm = window.parent.Xrm;

function ChartViewModel() {

    var self = this;

    //> Attributes
    self.WebAPIURL = "";
    self.Step = ko.observable(0);
    self.ShamsiStartDate = ko.observable();
    self.ShamsiEndDate = ko.observable();
    self.MiladiStartDate = ko.observable();
    self.MiladiEndDate = ko.observable();
    self.ChartTitle = ko.observable();
    self.SeriesName = ko.observable();
    self.ChartsDataViewModel = new ChartsDataViewModel();
    self.CleaningUserIds = [];
    self.BranchList = ko.observableArray([]);
    //>

    //> Date frame methods
    self.showDateFrames = function () {
        $(".customFilterDate").hide();
        $(".filterDateContainer").show();
    }
    self.hideCustomDateFrame = function () {
        $(".customFilterDate").hide();
    }
    self.getToday = function () {
        var date = new persianDate();

        self.ShamsiStartDate(date.year() + '/' + date.month() + '/' + date.date());
        self.ShamsiEndDate(date.year() + '/' + date.month() + '/' + date.date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getYesterday = function () {
        var date = new persianDate().subtract('days', 1);

        self.ShamsiStartDate(date.year() + '/' + date.month() + '/' + date.date());
        self.ShamsiEndDate(date.year() + '/' + date.month() + '/' + date.date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getThisWeek = function () {
        var startDate = new persianDate().startOf('week');
        self.ShamsiStartDate(startDate.year() + '/' + startDate.month() + '/' + startDate.date());

        var endDate = new persianDate().endOf('week');
        self.ShamsiEndDate(endDate.year() + '/' + endDate.month() + '/' + endDate.date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getLastWeek = function () {
        var date = new persianDate().subtract('weeks', 1);

        var startDate = date.startOf('week');
        self.ShamsiStartDate(startDate.year() + '/' + startDate.month() + '/' + startDate.date());

        var endDate = date.endOf('week');
        self.ShamsiEndDate(endDate.year() + '/' + endDate.month() + '/' + endDate.date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getThisMonthTillToday = function () {
        var date = new persianDate();

        var startDate = date.startOf('month');
        self.ShamsiStartDate(startDate.year() + '/' + startDate.month() + '/' + startDate.date());

        self.ShamsiEndDate(date.year() + '/' + date.month() + '/' + date.date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getThisYear = function () {
        var date = new persianDate();

        var startDate = date.startOf('year');
        self.ShamsiStartDate(startDate.year() + '/' + startDate.month() + '/' + startDate.date());

        var endDate = date.endOf('year');
        self.ShamsiEndDate(endDate.year() + '/' + endDate.month() + '/' + endDate.date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getTheSeason = function () {
        var year = new persianDate().year();
        var month = new persianDate().month();
        if (month < 4) {
            self.ShamsiStartDate(year + '/01/01');
            self.ShamsiEndDate(year + '/03/31');
        }
        if (month < 7 && month > 3) {
            self.ShamsiStartDate(year + '/04/01');
            self.ShamsiEndDate(year + '/06/31');
        }
        if (month < 10 && month > 6) {
            self.ShamsiStartDate(year + '/07/01');
            self.ShamsiEndDate(year + '/09/30');
        }
        if (month <= 12 && month > 9) {
            self.ShamsiStartDate(year + '/10/01');
            self.ShamsiEndDate(year + '/12/30');
        }

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getLastSeason = function () {
        var date = new persianDate();
        var year = date.year();
        var month = date.month();
        if (month < 4) {
            self.ShamsiStartDate(date.subtract('years', 1).year() + '/10/01');
            self.ShamsiEndDate(date.subtract('years', 1).year() + '/12/30');
        }
        if (month < 7 && month > 3) {
            self.ShamsiStartDate(year + '/01/01');
            self.ShamsiEndDate(year + '/03/31');
        }
        if (month < 10 && month > 6) {
            self.ShamsiStartDate(year + '/04/01');
            self.ShamsiEndDate(year + '/06/31');
        }
        if (month <= 12 && month > 9) {
            self.ShamsiStartDate(year + '/07/01');
            self.ShamsiEndDate(year + '/09/30');
        }

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getThisMonth = function () {
        var date = new persianDate();

        self.ShamsiStartDate(date.year() + '/' + date.month() + '/' + date.startOf('month').date());
        self.ShamsiEndDate(date.year() + '/' + date.month() + '/' + date.endOf('month').date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.getLastMonth = function () {
        var date = new persianDate().subtract('months', 1);
        self.ShamsiStartDate(date.year() + '/' + date.month() + '/' + date.startOf('month').date());
        self.ShamsiEndDate(date.year() + '/' + date.month() + '/' + date.endOf('month').date());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        $(".filterDateContainer").hide();
        self.createCharts();
    }
    self.showCustomFilterDates = function () {
        $(".filterDateContainer").hide();
        $(".customFilterDate").show();
    }
    self.setCustomDates = function () {
        $(".customFilterDate").hide();
        self.ShamsiStartDate($("#startDate").val());
        self.ShamsiEndDate($("#endDate").val());

        self.MiladiStartDate(self.convertToMiladi(self.ShamsiStartDate()));
        self.MiladiEndDate(self.convertToMiladi(self.ShamsiEndDate()));

        self.createCharts();
    }
    self.convertToMiladi = function (date) {
        date = date.split('/');
        var miladiDate =
            new persianDate([
                parseInt(fixNumbers(date[0])), parseInt(fixNumbers(date[1])), parseInt(fixNumbers(date[2]))
            ]).toCalendar('gregorian');
        return miladiDate.year() + '/' + miladiDate.month() + '/' + miladiDate.date();
    }
    self.convertDateToJSONFormat = function (stringDate, type) {
        //convert to js Date format
        if (stringDate.length < 9) {
            stringDate = stringDate.split('/');
            if (stringDate[1].length < 2) stringDate[1] = '0' + stringDate[1];
            if (stringDate[2].length < 2) stringDate[2] = '0' + stringDate[2];
            stringDate.join('/');
        }
        var date = new Date(new Date(stringDate));
        if (type == "end")
            date = new Date(date.setDate(date.getDate() +
                1)); //چون کوچکتر مساوی اکی نبود یک روز اضافه کردم از کوچکتر استفاده بشه
        //return "2021-04-19T19:30:00.000Z"
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
    }
    //>

    //> Step 0 methods - without date filter
    self.createDevicesBasedOnModelChart = function () {
        $.ajax({
            method: "GET",
            url: self.WebAPIURL +
                "/tlp_devices?$apply=filter(tlp_location_status ne 4 and _tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 )/groupby((tlp_product/name),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);
                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های سپ موجود در شرکت بر اساس مدل");
                var total = 0, counter = 0;

                $("#allDevicesBasedOnModel").empty();
                $("#allDevicesBasedOnModel").append(`
                                <div class='col-md-3'><table id='devicesBasedOnModel0' class="table">
                                    <tr>
                                        <th>نام مدل</th>
                                        <th>تعداد</th>
                                        <th>درصد</th>
                                    </tr>
                                </table></div>`);

                response.value.forEach(function (item, index) {
                    total += item.total;
                });

                while (counter < response.value.length) {
                    $("#allDevicesBasedOnModel div:last-child table").append(`<tr><td>` +
                        response.value[counter].product_name +
                        `</td><td>` +
                        response.value[counter].total +
                        `</td><td>` +
                        ((response.value[counter].total * 100) / total).toFixed(2) +
                        `</td></tr>`);
                    counter++;
                    if (counter != 0 && counter % 10 == 0) {
                        $("#allDevicesBasedOnModel")
                            .append("<div class='col-md-3'><table id='devicesBasedOnModel" +
                                counter +
                                "' class='table'><tr><th>نام مدل</th><th>تعداد</th><th>درصد</th></tr></table></div>");
                    }
                }

                //var dataList = [];
                //dataList.push({ category: item.product_name, value: item.total })
                //self.createPieChart("#allDevicesChartBasedOnModel", dataList, false, true);
            }
        });
    }
    self.createDevicesBasedOnBrandChart = function () {
        $("#allDevicesColumnChartBasedOnBrand").empty();
        $("#allDevicesPieChartBasedOnBrand").empty();
        $("#allDevicesColumnChartBasedOnBrand").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        $("#allDevicesPieChartBasedOnBrand").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        $.ajax({
            method: "GET",
            url: self.WebAPIURL +
                "/tlp_devices?$apply=filter(tlp_location_status ne 4 and _tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 )/groupby((tlp_product/tlp_brand),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);
                var dataList = [];
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var totalCount = 0;
                response.value.forEach(function (item, index) {
                    if (item.product_tlp_brand == 1) item.product_tlp_brand = "verifone";
                    else if (item.product_tlp_brand == 2) item.product_tlp_brand = "PAX";
                    else if (item.product_tlp_brand == 3) item.product_tlp_brand = "ingenico";
                    else if (item.product_tlp_brand == 4) item.product_tlp_brand = "newland";
                    else if (item.product_tlp_brand == 5) item.product_tlp_brand = "bitel";
                    else if (item.product_tlp_brand == 6) item.product_tlp_brand = "talento";
                    else if (item.product_tlp_brand == 7) item.product_tlp_brand = "sagem";
                    dataList.push({ category: item.product_tlp_brand, value: item.total });
                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(item.product_tlp_brand);
                    totalCount += item.total;
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ موجود در شرکت بر اساس برند - تعداد کل: " + totalCount);

                self.createColumnChart("#allDevicesColumnChartBasedOnBrand");
                self.createPieChart("#allDevicesPieChartBasedOnBrand", dataList, true, false);
            }
        });
    }
    self.createAllDevicesChart = function () {
        $("#allDevicesChart").empty();
        $("#allDevicesChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        $.ajax({
            method: "GET",
            url: self.WebAPIURL +
                "/tlp_devices?$filter=tlp_location_status ne 4 and _tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 &$apply=aggregate($count as total)",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);

                var dataList = [];

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var inDevices = response.value[0].total;
                dataList.push({ category: "پایانه های وارده", value: inDevices });

                self.ChartsDataViewModel.SeriesList.push(response.value[0].total);
                self.ChartsDataViewModel.CategoryList.push("پایانه های وارده");

                $.ajax({
                    method: "GET",
                    url: self.WebAPIURL +
                        "/tlp_devices?$filter=tlp_location_status eq 4 and _tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 &$apply=aggregate($count as total)",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    data: {},
                    beforeSend: function (XMLHttpRequest) {
                        //Specifying this header ensures that the results will be returned as JSON.
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    },
                    success: function (response) {
                        console.log(response);

                        var allDevicesCount = inDevices + response.value[0].total;
                        dataList.push({ category: "پایانه های تحویلی", value: response.value[0].total });
                        self.createPieChart("#allDevicesPieChart", dataList, true, false);

                        self.ChartsDataViewModel.SeriesList.push(response.value[0].total);
                        self.ChartsDataViewModel.CategoryList.push("پایانه های تحویلی");

                        self.SeriesName("تعداد دستگاه ها");
                        self.ChartTitle("همه ی پایانه های فروش سپ - تعداد کل : " + allDevicesCount);
                        self.createColumnChart("#allDevicesColumnChart");
                    }
                });
            }
        });

    }
    self.getAllUnitsChartInfo = function () {
        $("#allUnitsChart").empty();
        $("#allUnitsChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        $.ajax({
            method: "GET",
            url: self.WebAPIURL +
                "/tlp_devices?$filter=_tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 &$apply=groupby((tlp_location_status),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);

                var allDevicesCount = 0;

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                response.value.forEach(function (item, index) {

                    if (item.tlp_location_status == 1) item.tlp_location_status = "پذیرش";
                    if (item.tlp_location_status == 2) item.tlp_location_status = "فنی";
                    if (item.tlp_location_status == 3) item.tlp_location_status = "کنترل کیفیت";
                    if (item.tlp_location_status == 4) item.tlp_location_status = "تحویلی";
                    if (item.tlp_location_status == undefined) item.tlp_location_status = "ثبت اولیه";

                    allDevicesCount += item.total;

                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(item.tlp_location_status);
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ موجود در هر واحد - تعداد کل : " + allDevicesCount);
                self.createColumnChart("#allUnitsChart");
            }
        });
    }
    self.createUnrepairedChart = function () {
        $("#unrepairedChart").empty();
        $("#unrepairedChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        var fetchXml = `<fetch distinct="true" aggregate="true" >
  <entity name="tlp_repaire">
    <attribute name="tlp_repaireid" alias="count" aggregate="count" />
    <attribute name="statuscode" alias="Status" groupby="true" />
    <filter type="and">
      <condition attribute="statuscode" operator="in">
        <value>100000000</value>
        <value>100000001</value>
      </condition>
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device">
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL +
                "/tlp_repaires?fetchXml=" +
                encodeURIComponent(
                    fetchXml), //$apply=filter(statuscode eq 100000000 or statuscode eq 100000001)/groupby((statuscode),aggregate($count as total))
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var total = 0;

                response.value.forEach(function (item, index) {
                    if (item.Status == '100000000') item.Status = 'منتظر قطعه';
                    else if (item.Status == '100000001') item.Status = 'غیرقابل تعمیر';
                    self.ChartsDataViewModel.SeriesList.push(item.count);
                    self.ChartsDataViewModel.CategoryList.push(item.Status);
                    total += item.count;
                });
                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("تعمیر نشده های سپ - تعداد کل : " + total);
                self.createColumnChart("#unrepairedChart");
            }
        });
    }
    //>

    //> Step 1 methods - all unit
    self.createInOutDevicesChart = function () {
        $("#inOutChart").empty();
        $("#inOutChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
          <entity name="tlp_device_history" >
            <attribute name="tlp_name" alias="name" groupby="true" />
            <attribute name="tlp_device_historyid" alias="count" aggregate="count" />
            <filter type="and" >
              <filter type="or" >
                <condition attribute="tlp_name" operator="eq" value="ثبت رسید قطعی دستگاه" />
              </filter>
              <condition attribute="createdon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
              <condition attribute="createdon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
            </filter>
            <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="ac" >
              <filter type="and" >
                <condition attribute="tlp_curent_newcontract" operator="eq" uitype="entitlement" value="{E48A46E0-6B46-EA11-B806-00505695E326}" />
              </filter>
            </link-entity>
          </entity>
        </fetch>`;
        $.ajax({
            method: "GET",
            url:
                self.WebAPIURL +
                "/tlp_device_histories?fetchXml=" +
                encodeURIComponent(
                    fetchXml), //$apply=filter(createdon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) + " and createdon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + " and (tlp_name eq 'ثبت رسید قطعی دستگاه' or tlp_name eq 'صدور حواله خروج'))/groupby((tlp_name),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response.value);

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                if (response.value.length > 0) {
                    self.ChartsDataViewModel.SeriesList.push(response.value[0].count);
                    self.ChartsDataViewModel.CategoryList.push("دستگاه های ورودی");
                }
                fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_device_history" >
    <attribute name="tlp_name" alias="name" groupby="true" />
    <attribute name="tlp_device_historyid" alias="count" aggregate="count" />
    <filter type="and" >
      <filter type="or" >
        <condition attribute="tlp_name" operator="eq" value="صدور حواله خروج" />
      </filter>
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="ac" >
      <filter type="and" >
        <condition attribute="tlp_curent_newcontract" operator="eq" uitype="entitlement" value="{E48A46E0-6B46-EA11-B806-00505695E326}" />
      </filter>
    </link-entity>
    <link-entity name="tlp_exit" from="tlp_exitid" to="tlp_exit_record" link-type="inner" alias="Exit" >
      <filter type="and" >
        <condition attribute="tlp_date" operator="eq" value="`+ self.convertDateToJSONFormat(self.MiladiEndDate()) + `" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

                $.ajax({
                    method: "GET",
                    url:
                        self.WebAPIURL +
                        "/tlp_device_histories?fetchXml=" +
                        encodeURIComponent(
                            fetchXml), //"/tlp_devices?$filter=modifiedon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) + " and modifiedon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + " and tlp_location_status eq 4 and _tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 &$apply=groupby((tlp_product/name),aggregate($count as total))",//
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    data: {},
                    beforeSend: function (XMLHttpRequest) {
                        //Specifying this header ensures that the results will be returned as JSON.
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    },
                    success: function (response) {
                        console.log(response.value);
                        if (response.value.length > 0) {
                            self.ChartsDataViewModel.SeriesList.push(response.value[0].count);
                            self.ChartsDataViewModel.CategoryList.push("دستگاه های خروجی");
                        }
                        self.SeriesName("تعداد دستگاه ها");
                        self.ChartTitle("پایانه های فروش سپ");
                        self.createColumnChart("#inOutChart");
                    }
                });

            }
        });
    }
    self.createdOutDevicesBasedOnModelChart = function () {
        $("#inOutModelChart").empty();
        $("#inOutModelChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_device_history" >
    <filter type="and" >
      <condition attribute="tlp_name" operator="eq" value="صدور حواله خروج" />
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="outer" alias="Device" >
      <attribute name="tlp_product" alias="DeviceModel" groupby="true" />
      <attribute name="tlp_deviceid" alias="total" aggregate="countcolumn" />
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
        <link-entity name="tlp_exit" from="tlp_exitid" to="tlp_exit_record" link-type="inner" alias="Exit" >
            <filter type="and" >
            <condition attribute="tlp_date" operator="eq" value="`+ self.convertDateToJSONFormat(self.MiladiEndDate()) + `" />
            </filter>
            </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url:
                self.WebAPIURL +
                "/tlp_device_histories?fetchXml=" +
                encodeURIComponent(
                    fetchXml), //"/tlp_devices?$filter=modifiedon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) + " and modifiedon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + " and tlp_location_status eq 4 and _tlp_curent_newcontract_value eq E48A46E0-6B46-EA11-B806-00505695E326 &$apply=groupby((tlp_product/name),aggregate($count as total))",//
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response.value);
                var total = 0;
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                response.value.forEach(function (item, index) {
                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(
                        item["DeviceModel@OData.Community.Display.V1.FormattedValue"]);
                    total += item.total;
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ خارج شده بر اساس مدل - تعداد کل :" + total);
                self.createColumnChart("#inOutModelChart");
            }
        });
    }
    self.createTechnicalUnitInOutChart = function () {
        $("#technicalInOutChart").empty();
        $("#technicalInOutChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch distinct="true" aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="statuscode" alias="statuscode" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL +
                "/tlp_repaires?fetchXml=" +
                encodeURIComponent(
                    fetchXml), //"$apply=filter(modifiedon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) +
            //    " and modifiedon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + ")/groupby((statuscode),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var total = 0;

                response.value.forEach(function (item, index) {
                    if (item.statuscode == 1) item.statuscode = 'در دست اقدام';
                    else if (item.statuscode == 100000000) item.statuscode = 'منتظر قطعه';
                    else if (item.statuscode == 2) item.statuscode = 'تعمیر شده';
                    else if (item.statuscode == 100000001) item.statuscode = 'غیر قابل تعمیر';
                    else if (item.statuscode == 854570000) item.statuscode = 'خروج دستی دستگاه';
                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(item.statuscode);
                    total += item.total;
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ واحد فنی - تعداد کل : " + total);
                self.createColumnChart("#technicalInOutChart");
            }
        });
    }
    self.createQCUnitInOutChart = function () {
        $("#qcInOutChart").empty();
        $("#qcInOutChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch distinct="true" aggregate="true" >
  <entity name="tlp_qc" >
    <attribute name="tlp_qcid" alias="total" aggregate="count" />
    <attribute name="statuscode" alias="statuscode" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_qcs?fetchXml=" + encodeURIComponent(fetchXml),
            //$apply=filter(modifiedon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) +
            //    " and modifiedon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + ")/groupby((statuscode),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);
                var total = 0;
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                response.value.forEach(function (item, index) {
                    if (item.statuscode == 1) item.statuscode = 'در دست اقدام';
                    else if (item.statuscode == 2) item.statuscode = 'تایید شده';
                    else if (item.statuscode == 100000000) item.statuscode = 'تایید نشده';
                    else if (item.statuscode == 854570000) item.statuscode = 'خروج دستی دستگاه';
                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(item.statuscode);
                    total += item.total;
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ واحد کنترل کیفیت - تعداد کل: " + total);
                self.createColumnChart("#qcInOutChart");
            }
        });
    }
    self.createCleaningUnitInOutChart = function () {
        $("#cleaningInOutChart").empty();
        $("#cleaningInOutChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch distinct="true" aggregate="true" >
  <entity name="tlp_cleaningandtest" >
    <attribute name="tlp_cleaningandtestid" alias="total" aggregate="count" />
    <attribute name="statuscode" alias="statuscode" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_cleaningandtests?fetchXml=" + encodeURIComponent(fetchXml),
            //$apply=filter(modifiedon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) +
            //    " and modifiedon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + ")/groupby((statuscode),aggregate($count as total))",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);

                var total = 0;
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                response.value.forEach(function (item, index) {
                    if (item.statuscode == 1) item.statuscode = 'در دست اقدام';
                    else if (item.statuscode == 2) item.statuscode = 'تنظیف شده';
                    else if (item.statuscode == 100000000) item.statuscode = 'تایید نشده';
                    else if (item.statuscode == 854570000) item.statuscode = 'خروج دستی دستگاه';
                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(item.statuscode);
                    total += item.total;
                });

                fetchXml = `<fetch aggregate="true" >
                              <entity name="tlp_exit_device" >
                                <attribute name="tlp_exit_deviceid" alias="total" aggregate="count" />
                                <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="ad" >
                                  <filter type="and" >
                                    <condition attribute="tlp_curent_newcontract" operator="eq" uiname="??" uitype="entitlement" value="{E48A46E0-6B46-EA11-B806-00505695E326}" />
                                  </filter>
                                </link-entity>
                                <link-entity name="tlp_exit" from="tlp_exitid" to="tlp_exit" link-type="inner" alias="ae" >
                                  <filter type="and" >
                                      <condition attribute="modifiedon" operator="ge" value="` +
                    self.convertDateToJSONFormat(self.MiladiStartDate()) +
                    `" />
                                      <condition attribute="modifiedon" operator="lt" value="` +
                    self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
                    `" />
                                    <condition attribute="statuscode" operator="eq" value="1" />
                                  </filter>
                                </link-entity>
                              </entity>
                            </fetch>`;
                $.ajax({
                    method: "GET",
                    url: self.WebAPIURL + "/tlp_exit_devices?fetchXml=" + encodeURIComponent(fetchXml),
                    //$apply=filter(modifiedon ge " + self.convertDateToJSONFormat(self.MiladiStartDate()) +
                    //    " and modifiedon lt " + self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + ")/groupby((statuscode),aggregate($count as total))",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    data: {},
                    beforeSend: function (XMLHttpRequest) {
                        //Specifying this header ensures that the results will be returned as JSON.
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    },
                    success: function (response) {
                        console.log(response);

                        response.value.forEach(function (item, index) {
                            self.ChartsDataViewModel.SeriesList.push(item.total);
                            self.ChartsDataViewModel.CategoryList.push("آماده خروج");
                            total += item.total;
                        });
                        self.SeriesName("تعداد دستگاه ها");
                        self.ChartTitle("پایانه های فروش سپ واحد پذیرش - تعداد کل : " + total);
                        self.createColumnChart("#cleaningInOutChart");
                    }
                });
            }
        });
    }
    //>

    //> Step 2 methods - technical unit
    self.createOnHandTechnicalChart = function () {
        $("#technicalOnHandChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_repaires?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);

                var total = 0, counter = 0;

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                self.SeriesName("تعداد دستگاه ها");

                $("#technicalOnHandChart").empty();

                if (response.value.length == 0) {
                    self.ChartTitle("پایانه های فروش سپ در دست تعمیر واحد فنی - تعداد کل : " + total);
                    $("#technicalOnHandChart").append("<div class='chart'><div id='technicalOnHandChart_" +
                        counter +
                        "'></div></div>");
                    self.createColumnChart("#technicalOnHandChart_" + counter);
                }

                while (counter < response.value.length) {
                    if (response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(response.value[counter].total);
                        self.ChartsDataViewModel.CategoryList.push(
                            response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += response.value[counter].total;
                    }
                    if ((counter != 0 && counter % 10 == 0) || counter == response.value.length - 1) {
                        self.ChartTitle("پایانه های فروش سپ در دست تعمیر واحد فنی - تعداد کل : " + total);

                        $("#technicalOnHandChart").append("<div class='chart'><div id='technicalOnHandChart_" +
                            counter +
                            "'></div></div>");
                        self.createColumnChart("#technicalOnHandChart_" + counter);

                        total = 0;
                        self.ChartsDataViewModel.SeriesList = [];
                        self.ChartsDataViewModel.CategoryList = [];
                    }
                    counter++;
                }
            }
        });
    }
    self.createReturnTechnicalChart = function () {
        $("#technicalReturnChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="tlp_odat" operator="eq" value="1" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_repaires?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);

                var total = 0, counter = 0;

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                self.SeriesName("تعداد دستگاه ها");

                $("#technicalReturnChart").empty();

                if (response.value.length == 0) {
                    self.ChartTitle("پایانه های فروش سپ عودت داده شده واحد فنی - تعداد کل : " + total);
                    $("#technicalReturnChart").append("<div class='chart'><div id='technicalReturnChart_" +
                        counter +
                        "'></div></div>");
                    self.createColumnChart("#technicalReturnChart_" + counter);
                }

                while (counter < response.value.length) {
                    if (response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(response.value[counter].total);
                        self.ChartsDataViewModel.CategoryList.push(
                            response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += response.value[counter].total;
                    }
                    if ((counter != 0 && counter % 10 == 0) || counter == response.value.length - 1) {
                        self.ChartTitle("پایانه های فروش سپ عودت داده شده واحد فنی - تعداد کل : " + total);

                        $("#technicalReturnChart").append("<div class='chart'><div id='technicalReturnChart_" +
                            counter +
                            "'></div></div>");
                        self.createColumnChart("#technicalReturnChart_" + counter);

                        total = 0;

                        self.ChartsDataViewModel.SeriesList = [];
                        self.ChartsDataViewModel.CategoryList = [];
                    }
                    counter++;
                }
            }
        });
    }
    self.createRepairedTechnicalChart = function () {
        $("#technicalRepairedChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statuscode" operator="eq" value="2" />
      <condition attribute="tlp_odat" operator="eq" value="0" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_repaires?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);

                var total = 0, counter = 0;

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                self.SeriesName("تعداد دستگاه ها");

                $("#technicalRepairedChart").empty();

                if (response.value.length == 0) {
                    self.ChartTitle("پایانه های فروش سپ تعمیر شده واحد فنی - تعداد کل : " + total);
                    $("#technicalRepairedChart").append("<div class='chart'><div id='technicalRepairedChart_" +
                        counter +
                        "'></div></div>");
                    self.createColumnChart("#technicalRepairedChart_" + counter);
                }

                while (counter < response.value.length) {
                    if (response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(response.value[counter].total);
                        self.ChartsDataViewModel.CategoryList.push(
                            response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += response.value[counter].total;
                    }
                    if ((counter != 0 && counter % 10 == 0) || counter == response.value.length - 1) {
                        self.ChartTitle("پایانه های فروش سپ تعمیر شده واحد فنی - تعداد کل : " + total);

                        $("#technicalRepairedChart").append("<div class='chart'><div id='technicalRepairedChart_" +
                            counter +
                            "'></div></div>");
                        self.createColumnChart("#technicalRepairedChart_" + counter);

                        total = 0;
                        self.ChartsDataViewModel.SeriesList = [];
                        self.ChartsDataViewModel.CategoryList = [];
                    }
                    counter++;
                }
            }
        });
    }
    self.createWaitForPartTechnicalChart = function () {
        $("#technicalWaitForPartChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statuscode" operator="eq" value="100000000" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_repaires?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);

                var total = 0, counter = 0;

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                $("#technicalWaitForPartChart").empty();

                self.SeriesName("تعداد دستگاه ها");

                if (response.value.length == 0) {
                    self.ChartTitle("پایانه های فروش سپ منتظر قطعه واحد فنی - تعداد کل : " + total);
                    $("#technicalWaitForPartChart").append("<div class='chart'><div id='technicalWaitForPartChart_" +
                        counter +
                        "'></div></div>");
                    self.createColumnChart("#technicalWaitForPartChart_" + counter);
                }

                while (counter < response.value.length) {
                    if (response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(response.value[counter].total);
                        self.ChartsDataViewModel.CategoryList.push(
                            response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += response.value[counter].total;
                    }
                    if ((counter != 0 && counter % 10 == 0) || counter == response.value.length - 1) {
                        self.ChartTitle("پایانه های فروش سپ منتظر قطعه واحد فنی - تعداد کل : " + total);

                        $("#technicalWaitForPartChart")
                            .append("<div class='chart'><div id='technicalWaitForPartChart_" +
                                counter +
                                "'></div></div>");
                        self.createColumnChart("#technicalWaitForPartChart_" + counter);

                        total = 0;

                        self.ChartsDataViewModel.SeriesList = [];
                        self.ChartsDataViewModel.CategoryList = [];
                    }
                    counter++;
                }
            }
        });
    }
    self.createUnrepairedTechnicalChart = function () {
        $("#technicalUnrepairedChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statuscode" operator="eq" value="100000001" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_repaires?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);

                var total = 0, counter = 0;

                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];

                self.SeriesName("تعداد دستگاه ها");

                $("#technicalUnrepairedChart").empty();

                if (response.value.length == 0) {
                    self.ChartTitle("پایانه های فروش سپ غیر قابل تعمیر واحد فنی - تعداد کل : " + total);
                    $("#technicalUnrepairedChart").append("<div class='chart'><div id='technicalUnrepairedChart_" +
                        counter +
                        "'></div></div>");
                    self.createColumnChart("#technicalUnrepairedChart_" + counter);
                }

                while (counter < response.value.length) {
                    if (response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(response.value[counter].total);
                        self.ChartsDataViewModel.CategoryList.push(
                            response.value[counter]["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += response.value[counter].total;
                    }
                    if ((counter != 0 && counter % 10 == 0) || counter == response.value.length - 1) {
                        self.ChartTitle("پایانه های فروش سپ غیر قابل تعمیر واحد فنی - تعداد کل : " + total);

                        $("#technicalUnrepairedChart").append("<div class='chart'><div id='technicalUnrepairedChart_" +
                            counter +
                            "'></div></div>");
                        self.createColumnChart("#technicalUnrepairedChart_" + counter);

                        total = 0;

                        self.ChartsDataViewModel.SeriesList = [];
                        self.ChartsDataViewModel.CategoryList = [];
                    }
                    counter++;
                }
            }
        });
    }
    self.createRepairUsedPartsChart = function () {
        $("#repairUsedPartsChart").empty();
        $("#repairUsedPartsChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        $.ajax({
            method: "POST",
            url: self.WebAPIURL + "/tls_GetQCUsedPartsChartAxes",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: JSON.stringify({
                StartDate: new Date(self.MiladiStartDate()),
                EndDate: new Date(self.MiladiEndDate())
            }),
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);
                var chartAxes = JSON.parse(response.ChartAxes);
                self.SeriesName("تعداد قطعات استفاده شده");
                self.ChartTitle("قطعات استفاده شده در تعمیرات");
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                chartAxes.forEach(function (item, index) {
                    self.ChartsDataViewModel.SeriesList.push(item.Value);
                    self.ChartsDataViewModel.CategoryList.push(item.Key);
                });
                self.createColumnChart("#repairUsedPartsChart");
            }
        });
    }
    //>

    //> Step 3 methods - qc unit
    self.createOnHandQCChart = function () {
        $("#QCOnHandChart").empty();
        $("#QCOnHandChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_qc" >
    <attribute name="tlp_qcid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_qcs?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                var total = 0;
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                response.value.forEach(function (item, index) {
                    if (item["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(item.total);
                        self.ChartsDataViewModel.CategoryList.push(
                            item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += item.total;
                    }
                });


                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ در دست اقدام واحد کنترل کیفیت - تعداد کل : " + total);
                self.createColumnChart("#QCOnHandChart");
            }
        });
    }
    self.createDoneQCChart = function () {
        $("#QCDoneChart").empty();
        $("#QCDoneChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_qc" >
    <attribute name="tlp_qcid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statecode" operator="eq" value="1" />
      <condition attribute="statuscode" operator="ne" value="854570000" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_qcs?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                var total = 0;
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                response.value.forEach(function (item, index) {
                    if (item["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(item.total);
                        self.ChartsDataViewModel.CategoryList.push(
                            item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += item.total;
                    }
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ QC شده ی واحد کنترل کیفیت - تعداد کل : " + total);
                self.createColumnChart("#QCDoneChart");
            }
        });
    }
    self.createQCUsedPartsChart = function () {
        $("#qcUsedPartsChart").empty();
        $("#qcUsedPartsChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        $.ajax({
            method: "POST",
            url: self.WebAPIURL + "/tls_GetQCUsedPartsChartAxes",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: JSON.stringify({
                StartDate: new Date(self.MiladiStartDate()),
                EndDate: new Date(self.MiladiEndDate())
            }),
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);
                var chartAxes = JSON.parse(response.ChartAxes);
                self.SeriesName("تعداد قطعات استفاده شده");
                self.ChartTitle("قطعات استفاده شده در کنترل کیفیت");
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                chartAxes.forEach(function (item, index) {
                    self.ChartsDataViewModel.SeriesList.push(item.Value);
                    self.ChartsDataViewModel.CategoryList.push(item.Key);
                });
                self.createColumnChart("#qcUsedPartsChart");
            }
        });
    }
    //>

    //> Step 4 methods - cleaning unit
    self.createOnHandCleaningChart = function () {
        $("#cleaningOnHandChart").empty();
        $("#cleaningOnHandChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_cleaningandtest" >
    <attribute name="tlp_cleaningandtestid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_cleaningandtests?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var total = 0
                response.value.forEach(function (item, index) {
                    if (item["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(item.total);
                        self.ChartsDataViewModel.CategoryList.push(
                            item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += item.total;
                    }
                });

                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("پایانه های فروش سپ در دست اقدام واحد تنظیف - تعداد کل : " + total);
                self.createColumnChart("#cleaningOnHandChart");
            }
        });
    }
    self.createDoneCleaningChart = function () {
        $("#cleaningDoneChart").empty();
        $("#cleaningDoneChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_cleaningandtest" >
    <attribute name="tlp_cleaningandtestid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statuscode" operator="ne" value="854570000" />
      <condition attribute="statecode" operator="eq" value="1" />
    </filter>    
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="0" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_cleaningandtests?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var total = 0;
                response.value.forEach(function (item, index) {
                    if (item["OwnerId@OData.Community.Display.V1.FormattedValue"] != "راهبر سیستم") {
                        self.ChartsDataViewModel.SeriesList.push(item.total);
                        self.ChartsDataViewModel.CategoryList.push(
                            item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                        total += item.total;
                    }
                });
                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle(" پایانه های فروش سپ تنظیف شده ی واحد تنظیف - تعداد کل : " + total);
                self.createColumnChart("#cleaningDoneChart");
            }
        });
    }
    self.createOnHandBasedOnModel = function () {
        $("#cleaningOnHandBasedOnModelChart").empty();
        $("#cleaningOnHandBasedOnModelChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");


        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_cleaningandtest" >
    <attribute name="tlp_cleaningandtestid" alias="total" aggregate="count" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="` +
            self.convertDateToJSONFormat(self.MiladiStartDate()) +
            `" />
      <condition attribute="modifiedon" operator="lt" value="` +
            self.convertDateToJSONFormat(self.MiladiEndDate(), "end") +
            `" />
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <attribute name="tlp_product" alias="model" groupby="true" />
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_cleaningandtests?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var total = 0;
                response.value.forEach(function (item, index) {
                    self.ChartsDataViewModel.SeriesList.push(item.total);
                    self.ChartsDataViewModel.CategoryList.push(item["model@OData.Community.Display.V1.FormattedValue"]);
                    total += item.total;
                });
                self.ChartTitle(" پایانه های فروش سپ در دست تنظیف بر اساس مدل - تعداد کل : " + total);
                self.createColumnChart("#cleaningOnHandBasedOnModelChart");
            }
        });
    }
    self.getCleaningUsers = function () {
        var fetchXml = `< fetch version = "1.0" output-format="xml-platform" mapping = "logical" distinct = "false" >
            <entity name="systemuser">
                <attribute name="systemuserid" />
                <filter type="and">
                    <condition attribute="businessunitid" operator="eq" uiname="پذیرش" uitype="businessunit" value="{78997693-8C45-EA11-B806-00505695E326}" />
                    <condition attribute="isdisabled" operator="eq" value="0" />
                </filter>
            </entity>
        </fetch >`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/users?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response);
                response.value.forEach(function (item, index) {
                    self.CleaningUserIds.push(item.systemuserid);
                });
            }
        });
    }
    //>

    //> Step 5 methods - disable users
    self.createChartForCleaningDisableUsers = function () {
        $("#cleaningDisableUsersChart").empty();
        $("#cleaningDisableUsersChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_cleaningandtest" >
    <attribute name="tlp_cleaningandtestid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <attribute name="statecode" alias="StatusCode" groupby="true" />
    <order alias="OwnerId" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="`+ self.convertDateToJSONFormat(self.MiladiStartDate()) + `" />
      <condition attribute="modifiedon" operator="lt" value="`+ self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + `" />
    </filter>
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="1" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_cleaningandtests?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("کاربران واحد تنظیف");
                self.ChartsDataViewModel.SeriesList = [];
                self.ChartsDataViewModel.CategoryList = [];
                var onHandList = []; var doneList = [];
                self.ChartsDataViewModel.CategoryList = [];
                response.value.forEach(function (item, index) {
                    if (!self.ChartsDataViewModel.CategoryList.includes(item["OwnerId@OData.Community.Display.V1.FormattedValue"])) {
                        self.ChartsDataViewModel.CategoryList.push(item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                    }
                    if (item.StatusCode == 0) onHandList.push(item.total);
                    if (item.StatusCode == 1) doneList.push(item.total);
                });
                self.createDisableUsersChart("#cleaningDisableUsersChart", doneList, onHandList);
            }
        });
    }
    self.createChartForQCDisableUsers = function () {
        $("#qcDisableUsersChart").empty();
        $("#qcDisableUsersChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_qc" >
    <attribute name="tlp_qcid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <attribute name="statecode" alias="StatusCode" groupby="true" />
    <order alias="OwnerId" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="`+ self.convertDateToJSONFormat(self.MiladiStartDate()) + `" />
      <condition attribute="modifiedon" operator="lt" value="`+ self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + `" />
    </filter>
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="1" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_qcs?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("کاربران واحد کنترل کیفیت");
                var onHandList = []; var doneList = [];
                self.ChartsDataViewModel.CategoryList = [];
                response.value.forEach(function (item, index) {
                    if (!self.ChartsDataViewModel.CategoryList.includes(item["OwnerId@OData.Community.Display.V1.FormattedValue"])) {
                        self.ChartsDataViewModel.CategoryList.push(item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                    }
                    if (item.StatusCode == 0) onHandList.push(item.total);
                    if (item.StatusCode == 1) doneList.push(item.total);
                });
                self.createDisableUsersChart("#qcDisableUsersChart", doneList, onHandList);
            }
        });
    }
    self.createChartForTechnicalDisableUsers = function () {
        $("#techDisableUsersChart").empty();
        $("#techDisableUsersChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_repaire" >
    <attribute name="tlp_repaireid" alias="total" aggregate="count" />
    <attribute name="ownerid" alias="OwnerId" groupby="true" />
    <attribute name="statecode" alias="StatusCode" groupby="true" />
    <order alias="OwnerId" />
    <filter type="and" >
      <condition attribute="modifiedon" operator="ge" value="`+ self.convertDateToJSONFormat(self.MiladiStartDate()) + `" />
      <condition attribute="modifiedon" operator="lt" value="`+ self.convertDateToJSONFormat(self.MiladiEndDate(), "end") + `" />
    </filter>
    <link-entity name="systemuser" from="systemuserid" to="ownerid" link-type="inner" >
      <filter>
        <condition attribute="isdisabled" operator="eq" value="1" />
      </filter>
    </link-entity>    
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="Device" >
      <filter>
        <condition attribute="tlp_curent_newcontract" operator="eq" value="e48a46e0-6b46-ea11-b806-00505695e326" uitype="entitlement" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_repaires?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            },
            success: function (response) {
                console.log(response);
                self.SeriesName("تعداد دستگاه ها");
                self.ChartTitle("کاربران واحد فنی");
                var onHandList = []; var doneList = [];
                self.ChartsDataViewModel.CategoryList = [];
                response.value.forEach(function (item, index) {
                    if (!self.ChartsDataViewModel.CategoryList.includes(item["OwnerId@OData.Community.Display.V1.FormattedValue"])) {
                        self.ChartsDataViewModel.CategoryList.push(item["OwnerId@OData.Community.Display.V1.FormattedValue"]);
                    }
                    if (item.StatusCode == 0) onHandList.push(item.total);
                    if (item.StatusCode == 1) doneList.push(item.total);
                });
                self.createDisableUsersChart("#techDisableUsersChart", doneList, onHandList);
            }
        });
    }
    //>

    //> Step 6 - chart per month
    var diff = 0;
    var inDevicesCount = [];
    var outDevicesCount = [];
    self.checkYear = function () {
        $("#devicesPerMonthChart").empty();
        $("#devicesPerMonthChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        var regExp = new RegExp("^[0-9]{4}$", "");
        if (!regExp.test($("input[name='year']").val()))
            alert("Correct the year!!");
        else {
            self.createInOutChartPerMonth();
            self.createOutDevicesBasedOnCommunication();
        }
    }
    self.createInOutChartPerMonth = function () {

        //get year
        var year = $("input[name='year']").val();
        //get months
        var startMonth = $("#startMonth").find(":selected").val();
        var endMonth = $("#endMonth").find(":selected").val();

        var startDate, endDate;
        self.ChartsDataViewModel.CategoryList = [];
        self.ChartsDataViewModel.SeriesList = [];
        diff = endMonth - startMonth + 1;
        inDevicesCount = []; outDevicesCount = [];

        for (var i = startMonth; i <= endMonth; i++) {

            startDate = year + "/" + i + "/1";
            var month = $($('option[value=' + i + ']')[0]).text();
            self.ChartsDataViewModel.CategoryList.push(month);

            if (i < 7)
                endDate = year + "/" + i + "/31";
            else
                endDate = year + "/" + i + "/30";

            self.getDeviceCountBy(startDate, endDate, self.fillInOutDevicesCountArrayPerMonth);
        }
    }
    self.fillInOutDevicesCountArrayPerMonth = function (response) {
        if (response.value.length == 0) {
            outDevicesCount.push(0);
            inDevicesCount.push(0);
        }
        else if (response.value.length == 1) {
            if (response.value[0]["name"] == "صدور حواله خروج")
                inDevicesCount.push(0);
            else if (response.value[0]["name"] == "ثبت رسید قطعی دستگاه")
                outDevicesCount.push(0);
        }
        response.value.forEach(function (item, index) {
            if (item.name == "صدور حواله خروج") {
                item.name = "دستگاه های خروجی";
                outDevicesCount.push(item.count);
            }
            else if (item.name == "ثبت رسید قطعی دستگاه") {
                item.name = "دستگاه های ورودی";
                inDevicesCount.push(item.count);
            }
        });
        self.ChartTitle("دستگاه های ورودی و خروجی سپ بر اساس ماه");
        if (outDevicesCount.length == diff)
            self.createPointChart("#devicesPerMonthChart", inDevicesCount, outDevicesCount);
    }
    self.createOutDevicesPerCommunationModules = function () {
        $("#devicesPerComunicationModuleChart").empty();
        $("#devicesPerComunicationModuleChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        //get year
        var year = $("input[name='year']").val();
        //get months
        var startMonth = $("#startMonth").find(":selected").val();
        var endMonth = $("#endMonth").find(":selected").val();

        var startDate, endDate;
        self.ChartsDataViewModel.CategoryList = [];
        self.ChartsDataViewModel.SeriesList = [];
        diff = endMonth - startMonth + 1;
        inDevicesCount = []; outDevicesCount = [];

        for (var i = startMonth; i <= endMonth; i++) {

            startDate = year + "/" + i + "/1";
            var month = $($('option[value=' + i + ']')[0]).text();
            self.ChartsDataViewModel.CategoryList.push(month);

            if (i < 7)
                endDate = year + "/" + i + "/31";
            else
                endDate = year + "/" + i + "/30";

            self.getDeviceCountBy(startDate, endDate, self.fillInOutDevicesCountArrayPerMonth);
        }
    }
    self.createOutDevicesBasedOnCommunication = function () {
        $("#devicesPerComunicationModuleChart").empty();
        $("#devicesPerComunicationModuleChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");

        var year = $("input[name='year']").val();
        var startMonth = $("#startMonth").find(":selected").val();
        var endMonth = $("#endMonth").find(":selected").val();
        var startDate, endDate;
        startDate = year + "/" + startMonth + "/1";
        if (endMonth < 7)
            endDate = year + "/" + endMonth + "/31";
        else
            endDate = year + "/" + endMonth + "/30";

        var fetchXml = `<fetch aggregate="true" >
  <entity name="tlp_device_history" >
    <filter type="and" >
        <filter type="or" >
            <condition attribute="tlp_name" operator="eq" value="صدور حواله خروج" />
        </filter>
        <condition attribute="createdon" operator="ge" value="`+ self.convertDateToJSONFormat(self.convertToMiladi(startDate)) + `" />
        <condition attribute="createdon" operator="lt" value="`+ self.convertDateToJSONFormat(self.convertToMiladi(endDate)) + `" />
    </filter>
    <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="ac" >
      <attribute name="tlp_deviceid" alias="count" aggregate="count" />
      <attribute name="tlp_product" alias="model" groupby="true" />
      <filter type="and" >
        <condition attribute="tlp_curent_newcontract" operator="eq" uitype="entitlement" value="{E48A46E0-6B46-EA11-B806-00505695E326}" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_device_histories?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            async: false,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response.value);
                var respLength = response.value;
                var pinPad = 0;
                var gprs_wifi = 0;
                var gprs = 0;
                var wifi = 0;
                var dialup_eth_gprs = 0;
                var dialup_eth_wifi = 0;
                var dialup_eth = 0;
                var dialup = 0;
                var total = 0;
                self.ChartsDataViewModel.CategoryList = [];
                self.ChartsDataViewModel.SeriesList = [];
                response.value.forEach(function (item, index) {
                    if (item["model@OData.Community.Display.V1.FormattedValue"] == "SP 20"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 20 RFID"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 20 MSR") {
                        pinPad += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "S 90 DC"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 90 CL"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 90 CL DS"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 900 LU"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 900 NU"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "D 210 GPRS"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 920"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "N 910"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 630"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 600"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "MOVE 3500"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "VX 675"
                    ) {
                        gprs += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "D 210 WIFI") {
                        wifi += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "D 210 COMBO"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 600 WIFI") {
                        gprs_wifi += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "VX 520 GPRS"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "VX 520 GPRS DS") {
                        dialup_eth_gprs += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "SP 830 WIFI") {
                        dialup_eth_wifi += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "S 80"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 80 PLUS"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 800 LU"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 800 NU"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "S 80 RFID"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 50"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "SP 830"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "DESK 3500"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "5100 LAN"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "5500 LAN"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "VX 510 LAN"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "VX 520") {
                        dialup_eth += item.count;
                    }
                    else if (item["model@OData.Community.Display.V1.FormattedValue"] == "5100"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "5500"
                        || item["model@OData.Community.Display.V1.FormattedValue"] == "VX 510"
                    ) {
                        dialup += item.count;
                    }
                });

                self.ChartsDataViewModel.CategoryList.push("PinPad");
                self.ChartsDataViewModel.CategoryList.push("Wifi");
                self.ChartsDataViewModel.CategoryList.push("GPRS/Wifi");
                self.ChartsDataViewModel.CategoryList.push("GPRS");
                self.ChartsDataViewModel.CategoryList.push("DialUp/Eth/GPRS");
                self.ChartsDataViewModel.CategoryList.push("DialUp/Eth/WIFI");
                self.ChartsDataViewModel.CategoryList.push("DialUp/Eth");
                self.ChartsDataViewModel.CategoryList.push("DialUp");

                self.ChartsDataViewModel.SeriesList.push(pinPad);
                self.ChartsDataViewModel.SeriesList.push(wifi);
                self.ChartsDataViewModel.SeriesList.push(gprs_wifi);
                self.ChartsDataViewModel.SeriesList.push(gprs);
                self.ChartsDataViewModel.SeriesList.push(dialup_eth_gprs);
                self.ChartsDataViewModel.SeriesList.push(dialup_eth_wifi);
                self.ChartsDataViewModel.SeriesList.push(dialup_eth);
                self.ChartsDataViewModel.SeriesList.push(dialup);
                total = pinPad + wifi + gprs_wifi + gprs + dialup_eth_gprs + dialup_eth_wifi + dialup_eth + dialup;
                self.ChartTitle("دستگاه های سپ خروجی بر اساس ماژول ارتباطی در بازه زمانی منتخب - تعداد کل: " + total);
                self.createColumnChart("#devicesPerComunicationModuleChart");
            }
        });
    }
    //>

    //> Step 7 - chart per year
    self.checkYears = function () {
        $("#devicesPerYearChart").empty();
        $("#devicesPerYearChart").append("<p style='text-align:center; direction:ltr'>Loading...</p>");
        var regExp = new RegExp("^[0-9]{4}$", "");
        if (!regExp.test($("input[name='endYear']").val()) || !regExp.test($("input[name='startYear']").val()))
            alert("Correct the years!!");
        else
            self.createInOutChartPerYear();
    }
    self.createInOutChartPerYear = function () {

        //get years
        var startYear = $("input[name='startYear']").val();
        var endYear = $("input[name='endYear']").val();

        var startDate, endDate;
        self.ChartsDataViewModel.CategoryList = [];
        self.ChartsDataViewModel.SeriesList = [];
        diff = endYear - startYear + 1;
        inDevicesCount = []; outDevicesCount = [];

        for (var i = startYear; i <= endYear; i++) {

            startDate = i + "/1/1";
            self.ChartsDataViewModel.CategoryList.push(i);
            endDate = i + "/12/30";

            self.getDeviceCountBy(startDate, endDate, self.fillInOutDevicesCountArrayPerYear);
        }
    }
    self.fillInOutDevicesCountArrayPerYear = function (response) {
        if (response.value.length == 0) {
            outDevicesCount.push(0);
            inDevicesCount.push(0);
        }
        else if (response.value.length == 1) {
            if (response.value[0]["name"] == "صدور حواله خروج")
                inDevicesCount.push(0);
            else if (response.value[0]["name"] == "ثبت رسید قطعی دستگاه")
                outDevicesCount.push(0);
        }
        response.value.forEach(function (item, index) {
            if (item.name == "صدور حواله خروج") {
                item.name = "دستگاه های خروجی";
                outDevicesCount.push(item.count);
            }
            else if (item.name == "ثبت رسید قطعی دستگاه") {
                item.name = "دستگاه های ورودی";
                inDevicesCount.push(item.count);
            }
        });
        self.ChartTitle("دستگاه های ورودی و خروجی سپ بر اساس سال");
        if (outDevicesCount.length == diff)
            self.createPointChart("#devicesPerYearChart", inDevicesCount, outDevicesCount);
    }
    //>

    self.getDeviceCountBy = function (startDate, endDate, callback) {
        var fetchXml = `<fetch aggregate="true" >
              <entity name="tlp_device_history" >
                <attribute name="tlp_name" alias="name" groupby="true" />
                <attribute name="tlp_device_historyid" alias="count" aggregate="count" />
                <filter type="and" >
                  <filter type="or" >
                    <condition attribute="tlp_name" operator="eq" value="ثبت رسید قطعی دستگاه" />
                    <condition attribute="tlp_name" operator="eq" value="صدور حواله خروج" />
                  </filter>
                  <condition attribute="createdon" operator="ge" value="`+ self.convertDateToJSONFormat(self.convertToMiladi(startDate)) + `" />
                  <condition attribute="createdon" operator="lt" value="`+ self.convertDateToJSONFormat(self.convertToMiladi(endDate)) + `" />
                </filter>
                <link-entity name="tlp_device" from="tlp_deviceid" to="tlp_device" link-type="inner" alias="ac" >
                  <filter type="and" >
                    <condition attribute="tlp_curent_newcontract" operator="eq" uitype="entitlement" value="{E48A46E0-6B46-EA11-B806-00505695E326}" />
                  </filter>
                </link-entity>
              </entity>
            </fetch>`;
        $.ajax({
            method: "GET",
            url: self.WebAPIURL + "/tlp_device_histories?fetchXml=" + encodeURIComponent(fetchXml),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: {},
            async: false,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response) {
                console.log(response.value);
                callback(response);
            }
        });
    }
    self.changeStep = function (step, data, event) {

        self.Step(step);

        $("button").removeClass("active");
        $(event.target).addClass("active");

        self.createCharts();
    }
    self.createCharts = function () {
        $("div.chart div").empty();

        if (self.Step() == 0) {
            self.createAllDevicesChart();
            setTimeout(function () {
                self.createUnrepairedChart();
            }, 1500);
            setTimeout(function () {
                self.getAllUnitsChartInfo();
            }, 2000);
            self.createDevicesBasedOnModelChart();
            self.createDevicesBasedOnBrandChart();
        }
        else if (self.Step() == 1) {

            self.createTechnicalUnitInOutChart();
            self.createQCUnitInOutChart();
            self.createCleaningUnitInOutChart();

            setTimeout(function () {
                self.createInOutDevicesChart();
            }, 1500);
            self.createdOutDevicesBasedOnModelChart();


        }
        else if (self.Step() == 2) {
            self.createRepairedTechnicalChart();
            self.createOnHandTechnicalChart();
            self.createWaitForPartTechnicalChart();
            self.createUnrepairedTechnicalChart();
            self.createReturnTechnicalChart();
            //self.createRepairUsedPartsChart();
        }
        else if (self.Step() == 3) {
            self.createDoneQCChart();
            self.createOnHandQCChart();
            //self.createQCUsedPartsChart();
        }
        else if (self.Step() == 4) {
            self.createDoneCleaningChart();
            self.createOnHandCleaningChart();
            self.createOnHandBasedOnModel();
        }
        else if (self.Step() == 5) {
            self.createChartForTechnicalDisableUsers();
            self.createChartForCleaningDisableUsers();
            self.createChartForQCDisableUsers();
        }
    }
    self.getBranches = function(){
        self.BranchList.push({name: 'tehran', id: 'th'})
    }
    //> Create kendo charts methods
    self.createColumnChart = function (divId) {
        $(divId).empty();
        if (!self.ChartsDataViewModel.SeriesList.some(item => item > 0)) {
            $(divId).append('<text text-anchor="end" style="font: 16px Arial, Helvetica, sans - serif; white - space: pre; " x="454" y="29" stroke="none" fill="#8e8e8e" fill-opacity="1">' + self.ChartTitle() + '</text><br /><br /><p style="text-align:center">رکوردی موجود نیست</p>');
        }
        else {
            $(divId).kendoChart({
                title: {
                    text: self.ChartTitle()
                },
                seriesDefaults: {
                    type: "column"
                },
                legend: {
                    position: "top",
                    labels: {
                        margin: { right: 20 },
                        padding: { right: 15 }
                    },
                    visible: false
                },
                series: [{
                    overlay: {
                        gradient: "none"
                    },
                    name: self.SeriesName(),
                    data: self.ChartsDataViewModel.SeriesList,
                    color: "rgb(153, 235, 237)",
                    labels: {
                        visible: true,
                        background: 'transparent',
                        template: "#if (value > 0) {# #: value # #}#"
                    },
                    border: {
                        color: "rgb(153, 235, 237)"
                    }
                }],
                valueAxis: {
                    min: 0,
                    line: {
                        visible: true
                    },
                    minorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "auto"
                    }
                },
                categoryAxis: {
                    categories: self.ChartsDataViewModel.CategoryList,
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "auto",
                        margin: { top: 10 }
                    }
                },
                tooltip: {
                    visible: false,
                    template: "#= series.name #: #= value #"
                }
            });
        }
    }
    self.createDisableUsersChart = function (divId, doneList, onHandList) {
        $(divId).empty();
        if (!doneList.some(item => item > 0) || !onHandList.some(item => item > 0)) {
            $(divId).append('<text text-anchor="end" style="font: 16px Arial, Helvetica, sans - serif; white - space: pre; " x="454" y="29" stroke="none" fill="#8e8e8e" fill-opacity="1">' + self.ChartTitle() + '</text><br /><br /><p style="text-align:center">رکوردی موجود نیست</p>');
        }
        else {
            $(divId).kendoChart({
                title: {
                    text: self.ChartTitle()
                },
                seriesDefaults: {
                    type: "column"
                },
                legend: {
                    position: "top",
                    labels: {
                        margin: { right: 20 },
                        padding: { right: 15 }
                    }
                },
                series: [{
                    overlay: {
                        gradient: "none"
                    },
                    name: "در دست اقدام",
                    data: onHandList,
                    labels: {
                        visible: true,
                        background: 'transparent',
                        template: "#if (value > 0) {# #: value # #}#"
                    },
                    color: "#FF8300",
                    border: {
                        color: "#FF8300"
                    }
                },
                {
                    overlay: {
                        gradient: "none"
                    },
                    name: "تکمیل شده",
                    data: doneList,
                    color: "rgb(153, 235, 237)",
                    labels: {
                        visible: true,
                        background: 'transparent',
                        template: "#if (value > 0) {# #: value # #}#"
                    },
                    border: {
                        color: "rgb(153, 235, 237)"
                    }
                }],
                valueAxis: {
                    min: 0,
                    line: {
                        visible: true
                    },
                    minorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "auto"
                    }
                },
                categoryAxis: {
                    categories: self.ChartsDataViewModel.CategoryList,
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: "auto",
                        margin: { top: 10 }
                    }
                },
                tooltip: {
                    visible: false,
                    template: "#= series.name #: #= value #"
                }
            });
        }
    }
    self.createPieChart = function (divId, seriesData, canDisplaylabels, canDisplayTooltip) {
        $(divId).empty();
        if (seriesData.some(item => item.value > 0) == false) $(divId).append('<text text-anchor="end" style="font: 16px Arial, Helvetica, sans - serif; white - space: pre; " x="454" y="29" stroke="none" fill="#8e8e8e" fill-opacity="1">' + self.ChartTitle() + '</text><br /><br /><p style="text-align:center">رکوردی موجود نیست</p>');
        else {
            $(divId).kendoChart({
                title: {
                    text: self.ChartTitle()
                },
                legend: {
                    position: "left",
                    labels: {
                        template: "#= text #  -  #= kendo.format('{0:P}', percentage)#"
                    }
                },
                seriesDefaults: {
                    labels: {
                        template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "outsideEnd",
                        visible: canDisplaylabels,
                        margin: { right: 7 },
                        background: "transparent"
                    }
                },
                series: [{
                    type: "pie",
                    data: seriesData
                }],
                seriesColors: [
                    "#F9CCD3", "#F4B9B8", "#FFAEBC",
                    "#FF8DA7", "#FF5F84", "#FB4570",
                    "#FF3161", "#FF033E", "#D40032", "#A60027",
                    "#78001C", "#3B0918", "#6D0E10", "#961316",
                    "#BF181D", "#c52233", "#E32227", "#E84B4F",
                    "#DF362D", "#FF4500", "#FF8300", "#FEDE00",
                    "#ECF87F", "#CDD193", "#BACC81", "#81B622",
                    "#59981A", "#116530", "#013A20", "#1B2E3C",
                    "#0C0C1E", "#000C66", "#0000FF", "#0461B1",
                    "#145DA0", "#189AB4", "#21B6A8", "#75E6DA",
                    "#A0E7E5", "#7EC8E3", "#B1D4E0", "#FBE7C6", "#F9F1F0",
                ],
                tooltip: {
                    template: " #= kendo.format('{0:P}', percentage) # - #= category #",
                    color: "white",
                    visible: canDisplayTooltip,
                }
            });
        }
    }
    self.createTechnicalUsersChart = function (divId, onHandList, repairedList, waitingForPartList, unrepairedList) {
        $(divId).empty();
        $(divId).kendoChart({
            title: {
                text: self.ChartTitle()
            },
            seriesDefaults: {
                type: "column"
            },
            legend: {
                position: "top",
                labels: {
                    margin: { right: 20 },
                    padding: { right: 15 }
                }
            },
            series: [{
                overlay: {
                    gradient: "none"
                },
                name: "تعمیر شده",
                data: repairedList,
                color: "rgb(153, 235, 237)",
                labels: {
                    visible: true,
                    background: 'transparent',
                    template: "#if (value > 0) {# #: value # #}#"
                },
                border: {
                    color: "rgb(153, 235, 237)"
                }
            },
            {
                overlay: {
                    gradient: "none"
                },
                name: "در دست اقدام",
                data: onHandList,
                labels: {
                    visible: true,
                    background: 'transparent',
                    template: "#if (value > 0) {# #: value # #}#"
                },
                color: "#FEDE00",
                border: {
                    color: "#FEDE00"
                }
            },

            {
                overlay: {
                    gradient: "none"
                },
                name: "منتظر قطعه",
                data: waitingForPartList,
                labels: {
                    visible: true,
                    background: 'transparent',
                    template: "#if (value > 0) {# #: value # #}#"
                }
            },
            {
                overlay: {
                    gradient: "none"
                },
                name: "غیر قابل تعمیر",
                data: unrepairedList,
                labels: {
                    visible: true,
                    background: 'transparent',
                    template: "#if (value > 0) {# #: value # #}#"
                }
            }],
            valueAxis: {
                min: 0,
                line: {
                    visible: true
                },
                minorGridLines: {
                    visible: false
                },
                labels: {
                    rotation: "auto"
                }
            },
            categoryAxis: {
                categories: self.ChartsDataViewModel.CategoryList,
                majorGridLines: {
                    visible: false
                },
                labels: {
                    rotation: "auto",
                    margin: { top: 10 }
                }
            },
            tooltip: {
                visible: false,
                template: "#= series.name #: #= value #"
            }
        });
    }
    self.createPointChart = function (divId, inDevicesCount, outDevicesCount) {
        $(divId).empty();
        if (!inDevicesCount.some(item => item > 0) && !outDevicesCount.some(item => item > 0)) {
            $(divId).append('<text text-anchor="end" style="font: 16px Arial, Helvetica, sans - serif; white - space: pre; " x="454" y="29" stroke="none" fill="#8e8e8e" fill-opacity="1">' + self.ChartTitle() + '</text><br /><br /><p style="text-align:center">رکوردی موجود نیست</p>');
        }
        else {
            $(divId).kendoChart({
                title: {
                    text: self.ChartTitle()
                },
                seriesDefaults: {
                    type: "line",
                    labels: {
                        position: "right",
                        visible: true,
                        margin: { top: 20 },
                        font: "100px"
                    }
                },
                legend: {
                    position: "top",
                    labels: {
                        margin: { right: 20, bottom: 40 },
                        padding: { right: 15 }
                    },
                    visible: true
                },
                series: [{
                    name: "دستگاه های ورودی",
                    data: inDevicesCount,
                    color: "#dc3545",
                    labels: {
                        color: "#dc3545",
                        position: "right"
                    }
                },
                {
                    name: "دستگاه های خروجی",
                    data: outDevicesCount,
                    color: "#0b4c82",
                    labels: {
                        color: "#0b4c82",
                        position: "left"
                    }
                }],
                valueAxis: {
                    min: 0,
                    line: {
                        visible: true
                    },
                    labels: {
                        rotation: "auto"
                    }
                },
                categoryAxis: {
                    categories: self.ChartsDataViewModel.CategoryList,
                    labels: {
                        rotation: "auto",
                        margin: { top: 10 }
                    }
                }
            });
        }
    }
    //>
}

var ChartsDataViewModel = function () {
    this.SeriesList = [];
    this.CategoryList = [];
}

$(document).ready(function () {
    $('#id-41f108f6-f9a7-eb11-b819-0050569513ff-1-WebResource_DeviceCharts-webResourceLabelControlWrapper iframe', window.parent.document).css('border', 'none');

    ViewModel = new ChartViewModel();
    ko.applyBindings(ViewModel, document.getElementById("charts"));
    ViewModel.getBranches(); 
    $("input#startDate").persianDatepicker({
        observer: true,
        format: 'YYYY/MM/DD',
        altField: '.observer-example-alt',
        autoClose: true,
        navigator: {
            text: {
                btnNextText: "بعدی",
                btnPrevText: "قبلی",
            }
        }
    });
    $("input#endDate").persianDatepicker({
        observer: true,
        format: 'YYYY/MM/DD',
        altField: '.observer-example-alt',
        autoClose: true,
        navigator: {
            text: {
                btnNextText: "بعدی",
                btnPrevText: "قبلی",
            }
        }
    });

    //ViewModel.getThisWeek();

    //$('div.chartContainer').click(function () { $(".filterDateContainer").hide() });
    //$('div.btn-group').click(function () { $(".filterDateContainer").hide() });

    //$(document).bind("kendo:skinChange", ViewModel.createColumnChart);
    //$(document).bind("kendo:skinChange", ViewModel.createPieChart);
});

var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    fixNumbers = function (str) {
        if (typeof str === 'string') {
            for (var i = 0; i < 10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
    };
