/**
 * Datepicker View Class
 * @class ViewsDatePicker
 */
var ViewsDatePicker = {
    /**
     * All Css Class Define Here
     * @property cssClass
     * @type object
     */
    cssClass: {
        datePickerPlotArea: "datepicker-plot-area",
        yearView: "datepicker-year-view",
        monthView: "datepicker-month-view",
        dayView: "datepicker-day-view",
        timeView: "datepicker-time-view",
        navigator: "navigator",
        toolbox: "toolbox "
    },
    /**
     * All Conatiner Element push to this
     * @property container
     * @type object
     */
    container: {},
    /**
     * View Definition
     * @property views
     * @type object
     */
    views: {
        "default": {
            render: function (self) {
                'use strict';
                self.view_data = {
                    css: self.cssClass
                };
                self.element = {};
                self.element.main = $.tmplMustache(TEMPLATE.datepciker, self.view_data).appendTo($("body"));
                self.view.fixPosition(self);
                // SHow Hide Picker
                ///////////////////////////////////////////////
                self.inputElem.focus(function () {
                    self.show();
                });
                self.inputElem.click(function (e) {
                    e.stopPropagation();
                    return false;
                });
                self.inputElem.blur(function () {
                    if (!$.browser.msie) {
                        self.hide();
                    }
                });
                $(document).click(function () {
                    self.inputElem.blur();
                    self.hide();
                });
                $(self.element.main).mousedown(function (e) {
                    e.stopPropagation();
                    return false;
                });
                // Define Containers
                self.container.navigator = $(self.element.main).children('.' + self.cssClass.navigator);
                self.container.dayView = $(self.element.main).children('.' + self.cssClass.dayView);
                self.container.monthView = $(self.element.main).children('.' + self.cssClass.monthView);
                self.container.yearView = $(self.element.main).children('.' + self.cssClass.yearView);
                self.container.timeView = $(self.element.main).children('.' + self.cssClass.timeView);
                self.container.toolbox = $(self.element.main).children('.' + self.cssClass.toolbox);
                // Append Navigator
                ///////////////////////////////////////////////
                self.navigator = new Navigator({datepicker: self}, self.container.navigator);
                // Append Toolbox
                ///////////////////////////////////////////////
                if (self.toolbox) {
                    self.toolbox = new Toolbox({datepicker: self}, self.container.toolbox);
                } else {
                    self.container.toolbox.remove();
                }
                ///////////////////////////////////////////////

                if (self.dayPicker.enabled) {
                    self.dayPicker = new Daypicker({datepicker: self}, self.container.dayView);
                    self._pickers.day = self.dayPicker;
                } else {
                    self.container.dayView.hide();
                    self.dayPicker = false;
                }
                if (self.monthPicker.enabled) {
                    self.monthPicker = new MonthPicker({datepicker: self}, self.container.monthView);
                    self._pickers.month = self.monthPicker;
                } else {
                    self.monthPicker = false;
                    self.container.monthView.hide();
                }
                if (self.yearPicker.enabled) {
                    self.yearPicker = new YearPicker({datepicker: self}, self.container.yearView);
                    self._pickers.year = self.yearPicker;

                } else {
                    self.yearPicker = false;
                    self.container.yearView.hide();
                }
                if (self.timePicker.enabled) {
                    self.timePicker = new TimePicker($.extend(true, {datepicker: self}, self.timepicker),
                        self.container.timeView);
                    //self._pickers.template = self.timePicker;
                } else {
                    self.container.timeView.hide();
                }

                self.changeView(self.viewMode);
                self._syncWithImportData(self.state.unixDate);
                return this;
            },
            fixPosition: function (self) {
                var inputX = self.inputElem.offset().top;
                var inputY = self.inputElem.offset().left;
                if (self.position == "auto") {
                    var inputHeight = self.fullHeight(self.inputElem);
                    self.element.main.css({
                        top: (inputX + inputHeight) + 'px',
                        left: inputY + 'px'
                    });
                } else {
                    self.element.main.css({
                        top: (inputX + self.position[0]) + 'px',
                        left: (inputY + self.position[1]) + 'px'
                    });
                }
                return this;
            }
        }
    }
};