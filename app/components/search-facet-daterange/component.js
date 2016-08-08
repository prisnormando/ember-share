import Ember from 'ember';
import moment from 'moment';
import { dateRangeFilter } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.updateFilter(this.get('state.start'), this.get('state.end'));
    },

    didInsertElement() {
        this._super(...arguments);

        let dateRanges = {
            'Past week': [moment().subtract(1, 'week'), moment()],
            'Past month': [moment().subtract(1, 'month'), moment()],
            'Past year': [moment().subtract(1, 'year'), moment()],
            'Past decade': [moment().subtract(10, 'year'), moment()]
        };

        let picker = this.$('.date-range');
        picker.daterangepicker({
            ranges: dateRanges,
            autoUpdateInput: false,
            locale: { cancelLabel: 'Clear' }
        });

        picker.on('apply.daterangepicker', (ev, picker) => {
            Ember.run(() => {
                let start = picker.startDate;
                let end = picker.endDate;
                this.updateFilter(start, end);
            });
        });

        picker.on('cancel.daterangepicker', () => {
            Ember.run(() => {
                this.send('clear');
            });
        });

        Ember.run.scheduleOnce('actions', this, function() {
            this.filterUpdated();
        });

    },

    filterUpdated: Ember.observer('state', function() {
        let state = this.get('state');
        if (state.start) {
            let start = moment(this.get('state.start'));
            let end = moment(this.get('state.end'));
            let picker = this.$('.date-range').data('daterangepicker');
            picker.setStartDate(start);
            picker.setEndDate(end);
            if (picker.chosenLabel && picker.chosenLabel !== 'Custom Range') {
                this.set('pickerValue', picker.chosenLabel);
            } else  {
                let format = 'Y-MM-DD';
                this.set('pickerValue', `${start.format(format)} - ${end.format(format)}`);
            }
        } else {
            this.noFilter();
        }
    }),

    buildQueryObject(start, end) {
        let key = this.get('key');
        return dateRangeFilter(key, start, end);
    },

    updateFilter(start, end) {
        let key = this.get('key');
        let value = start && end ? {start: moment(start).format(), end: moment(end).format()} : {start: '', end: ''};
        this.sendAction('onChange', key, this.buildQueryObject(start, end), value);
    },

    noFilter() {
        this.set('pickerValue', 'All time');
    },

    actions: {
        clear() {
            this.noFilter();
            this.sendAction('onChange', this.get('key'), this.buildQueryObject(null, null), {start: '', end: ''});
        }
    }
});
