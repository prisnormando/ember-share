import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedTypes.[]', function() {
        return this.get('selectedTypes').contains(this.get('type'));
    }),

    click() {
        let type = this.get('selected') ? null : this.get('type');
        if (!type) {
            this.$().blur();
        }
        this.sendAction('onClick', type);
    }
});
