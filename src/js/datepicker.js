/**
 * Datepicker Class
 * @class ClassDatepicker
 * @constructor Datepicker
 */
var ClassDatepicker = {

    _pickers: {},

    /**
     * Change View
     * @param {String} viewName
     * @method changeView
     * @return Datepicker
     */
    _getNextState: function (action) {
        var currentState = this.currentView;
        var nextState = this.currentView;
        if (action == 'next') {
            if (currentState == 'month' && this.dayPicker) {
                nextState = 'day';
            }
            if (currentState == 'year') {
                if (this.monthPicker) {
                    nextState = 'month';
                } else {
                    if (this.dayPicker) {
                        nextState = 'day';
                    }
                }
            }
        }
        else if (action == 'prev') {
            if (currentState == 'month' && this.yearPicker) {
                nextState = 'year';
            }
            if (currentState == 'day') {
                if (this.monthPicker) {
                    nextState = 'month';
                } else {
                    if (this.yearPicker) {
                        nextState = 'year';
                    }
                }
            }
        }
        return nextState;
    },
    changeView: function (state, action) {
        'use strict';
        var self = this;
        var newState;
        if (!action) {
            newState = state;
        } else {
            newState = this._getNextState(action);
        }
        self.publishInDic(self._pickers, 'hide');
        self._pickers[newState].show();
        self.navigator.switchRelation(newState);
        self.currentView = newState;
        return this;
    },
    /**
     * Use As Flag For Define Self Manipulation
     * @private
     * @property _flagSelfManipulate
     */
    _flagSelfManipulate: true,

    selectTime: function (key, val) {
        'use strict';
        this.state.setTime(key, val);
        this._updateInputElement();
        this.onSelect(key, this);
    },


    /**
     * selectDate
     * @param {string} key
     * @param {number} unixDate
     * @method selectDate
     * @return Datepicker
     */
    selectDate: function (key, unixDate) {
        'use strict';
        var self = this;
        self.state.setSelected('unix', unixDate);
        this.state.syncViewWithelected();
        switch (self.currentView) {
            case ('month'):
                self.monthPicker.selectMonth();
                break;
            case ('year'):
                self.yearPicker.selectYear();
                break;
            case ('day'):
                self.dayPicker.selectDay();
                break;
        }
        self._updateInputElement();
        self.onSelect(unixDate, this);
        if (self.autoClose) {
            self.element.main.hide();
        }
        return this;
    },

    /**
     * selectMonth
     * @param {number} monthNum
     * @method selectMonth
     * @return Datepicker
     */
    selectMonth: function (monthNum) {
        'use strict';
        var self = this;
        self.state.setSelected('month', monthNum);
        self.state.syncViewWithelected();
        self.state.setSelected('year', self.state.view.year);
        self._updateInputElement();
        self.changeView(self.currentView, 'next');
        return this;
    },

    /**
     * selectYear
     * @param {number} yearNum
     * @method selectYear
     * @return Datepicker
     */
    selectYear: function (yearNum) {
        var self = this;

        self.state.setSelected('year', yearNum);
        self.state.syncViewWithelected();
        self._updateInputElement();
        self.changeView(self.currentView, 'next');
        return this;
    },


    /**
     * _formatDigit
     * @param {number} digit
     * @private
     * @method _formatDigit
     * @return formatted Digit
     */
    _formatDigit: function (digit) {
        if (this.persianDigit && digit)
            return digit.toString().toPersianDigit();
        else
            return digit;
    },


    /**
     * destroy instant of plugin and remove dom element
     * @method destroy
     * @return Datepicker
     */
    destroy: function () {
        this.inputElem.removeClass(self.cssClass);
        this.element.main.remove();
        return this;
    },


    /**
     * Sync Datepicker With Pasted Data
     * @method _syncWithImportData
     * @private
     * @return Datepicker
     */
    _syncWithImportData: function (pasted) {
        var self = this;
        if (jQuery.isNumeric(pasted)) {
            var newPersainDate = new persianDate(pasted);
            self.state.setSelected('unix', newPersainDate);
            self._updateInputElement();
        } else {
            var persianDateArray = self.validatePersianDateString(pasted);
            if (persianDateArray != null) {
                delay(function () {
                    var newPersainDate = new persianDate(persianDateArray);
                    self.selectDate('unix', newPersainDate.valueOf());
                }, self.inputDelay)
            }
        }
        return this;
    },


    /**
     * Bind Evenet
     * @method _attachEvents
     * @private
     * @return Datepicker
     */
    _attachEvents: function () {
        var self = this;
        $(window).resize(function () {
            self.view.fixPosition(self);
        });
        if (self.observer) {
            /////////////////   Manipulate by Copy And paste
            self.inputElem.bind('paste', function (e) {
                delay(function () {
                    self._syncWithImportData(e.target.value)
                }, 60);
            });
            /////////////////   Manipulate by alt changes
            $(self.altField).bind("change", function () {
                if (!self._flagSelfManipulate) {
                    var newDate = new Date($(this).val());
                    if (newDate != "Invalid Date") {
                        var newPersainDate = new persianDate(newDate);
                        self.selectDate('unix', newPersainDate.valueOf());
                    }
                }
            });
            /////////////////   Manipulate by keyboard
            var ctrlDown = false;
            var ctrlKey = [17, 91], vKey = 86, cKey = 67;
            $(document).keydown(function (e) {
                if ($.inArray(e.keyCode, ctrlKey) > 0)
                    ctrlDown = true;
            }).keyup(function (e) {
                if ($.inArray(e.keyCode, ctrlKey) > 0)
                    ctrlDown = false;
            });
            self.inputElem.bind("keyup", function (e) {
                var $self = $(this);
                if (!self._flagSelfManipulate) {
                    var trueKey = false;
                    if (e.keyCode == 8 || e.keyCode < 105 && e.keyCode > 96 || e.keyCode < 58 && e.keyCode > 47 || (ctrlDown && (e.keyCode == vKey || $.inArray(e.keyCode, ctrlKey) > 0  ))) {
                        trueKey = true;
                    }
                    if (trueKey) {
                        self._syncWithImportData($self.val());
                    }
                }
            });
        }
        return this;
    },


    /**
     * Update Input Element
     * @method _updateInputElement
     * @private
     * @return Datepicker
     */
    _updateInputElement: function () {
        var self = this;
        self._flagSelfManipulate = true;
        // Update Alt Field
        $(self.altField).val(self.altFieldFormatter(self.state.selected.unixDate));
        // Update Display Field
        self.inputElem.val(self.formatter(self.state.selected.unixDate));
        self._flagSelfManipulate = false;
        return self;
    },
    /**
     * On Init Plugin run and define default date of datepicker
     * @method _defineOnInitState
     * @private
     * @return Datepicker
     */
    _defineOnInitState: function () {
        if (this.isValidGreguranDate(this.inputElem.val())) {
            this.state.unixDate = new Date(this.inputElem.val()).valueOf();
        }
        else {
            this.state.unixDate = new Date().valueOf();
        }
        this.state.setSelected('unix', this.state.unixDate);
        this.state.setTime('unix', this.state.unixDate);
        this.state.setView('unix', this.state.unixDate);
        return this;
    },

    /**
     * @property events
     * @type object
     */
    events: {},


    /**
     * @property _viewed
     * @type boolean
     * @default false
     * @private
     */
    _viewed: false,


    /**
     * Initilize Datepicler
     * @method init
     * @private
     * @return Datepicker
     */
    init: function () {
        var self = this;
        this.state = new State({datepicker: self});
        this._defineOnInitState();
        this._updateInputElement();
        this.view = this.views['default'];
        this.view.render(this);
        this.inputElem.data("datepicker", this);
        this.inputElem.addClass(self.cssClass);
        this._attachEvents();
        return this;
    }
};


/**
 * My Datepicker Constructor
 *
 * @method Datepicker
 * @param [object] mainElem
 * @param [object] option
 */
var Datepicker = function (mainElem, options) {
    return inherit(this, [Class_Sprite, ClassDatepicker, ClassConfig, ViewsDatePicker, options, {
        inputElem: $(mainElem),
        inputAltElem: $(options.altField)
    }]);
};

