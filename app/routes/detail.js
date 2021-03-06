import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RouteHistoryMixin from 'ember-route-history/mixins/routes/route-history';

import { FRAGMENT_MAP, CONTROLLER_MAP } from '../utils/mappings';
import ENV from '../config/environment';


export default Route.extend(RouteHistoryMixin, {
    session: service(),

    model(params) {
        // TODO consolidate graphql queries in a util or service or something (SHARE-1031)
        return $.ajax({
            url: `${ENV.apiBaseUrl}/api/v2/graph/`,
            method: 'POST',
            crossDomain: true,
            xhrFields: { withCredentials: true },
            headers: {
                'X-CSRFTOKEN': this.get('session.data.authenticated.csrfToken'),
            },
            data: {
                variables: '',
                query: `query {
                    shareObject(id: "${params.id}") {
                        id,
                        type: __typename,
                        types,
                        extra,
                        sources { id, title, icon },

                        ${Object.keys(FRAGMENT_MAP).map(type => `...on ${type} ${FRAGMENT_MAP[type]}`).join('\n')}
                    }
                }`,
            },
        }).then(this._handleErrors.bind(this));
    },

    afterModel(model, transition) {
        if (!model) {
            // If the model could not be loaded. Do nothing.
            return;
        }

        // If the type slug /:SLUG/:SHARE-ID is not the type of the object
        // Correct the url
        const slug = model.type.classify().toLowerCase();
        if (slug !== transition.params.detail.type) {
            return this.replaceWith('detail', slug, model.id);
        }
    },

    actions: {
        error() {
            return this.intermediateTransitionTo('notfound');
        },
    },

    setup(model, transition) {
        if (!model) {
            // If the model could not be loaded. Do nothing.
            return this._super(model, transition);
        }

        // Find the most specific template available for the found type
        let view = null;
        for (let i = 0; i < model.types.length; i++) {
            view = CONTROLLER_MAP[model.types[i]];
            if (view) {
                break;
            }
        }

        this.set('templateName', view);
        this.set('controllerName', view);
        return this._super(model, transition);
    },

    _handleErrors(data) {
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        return data.data.shareObject;
    },
});
