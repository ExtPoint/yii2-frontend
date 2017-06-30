import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change, getFormInitialValues} from 'redux-form';

import {html, resource} from 'components';
import DropDownField from './DropDownField';
import StringField from './StringField';
import AddressHelper from 'shared/map/AddressHelper';

const bem = html.bem('AddressField');

class AddressField extends React.Component {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        hint: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        item: PropTypes.shape({
            addressType: PropTypes.string,
            relationName: PropTypes.string,
        }),
        parentId: PropTypes.number,
        addressValues: PropTypes.shape({
            country: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            countryLabel: PropTypes.string,
            region: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            regionLabel: PropTypes.string,
            city: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            cityLabel: PropTypes.string,
            metroStation: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            metroStationLabel: PropTypes.string,
            address: PropTypes.string,
            longitude: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            latitude: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
        }),
        onChange: PropTypes.func,
    };

    constructor() {
        super(...arguments);

        this._api = null;

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        if (this.props.metaItem.addressType === AddressHelper.TYPE_ADDRESS) {
            resource.loadYandexMap()
                .then(ymaps => {
                    this._api = ymaps;
                    this._initSuggest();
                });
        }
    }

    render() {
        let content = null;
        switch (this.props.metaItem.addressType) {
            case AddressHelper.TYPE_COUNTRY:
            case AddressHelper.TYPE_REGION:
            case AddressHelper.TYPE_CITY:
            case AddressHelper.TYPE_METRO_STATION:
                content = this.renderDropDown();
                break;

            case AddressHelper.TYPE_ADDRESS:
            case AddressHelper.TYPE_LONGITUDE:
            case AddressHelper.TYPE_LATITUDE:
                content = this.renderString();
                break;
        }

        return (
            <div className={bem.block()}>
                {content}
            </div>
        );
    }

    renderDropDown() {
        const props = {...this.props};
        if (this.props.metaItem.addressType === AddressHelper.TYPE_COUNTRY) {
            props.item = {
                enumClassName: 'app\\address\\models\\Country',
            };
        } else {
            props.autoComplete = '/address/auto-complete/search/';
            props.autoCompleteParams = {
                addressType: this.props.metaItem.addressType,
                parentId: this.props.parentId || null,
            };
        }

        return (
            <DropDownField
                {...props}
                onChange={this._onChange}
            />
        );
    }

    renderString() {
        return (
            <StringField
                {...this.props}
                onChange={this._onChange}
            />
        );
    }

    _onChange(value) {
        let isFined = false;
        Object.keys(this.props.addressNames).forEach(key => {
            const name = this.props.addressNames[key];
            if (this.props.input.name === name && key !== 'metroStation') {
                isFined = true;
            } else if (isFined) {
                this.props.dispatch(change(this.props.formId, name, null));
            }
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    _initSuggest() {
        const input = ReactDOM.findDOMNode(this).querySelector('input[type=text]');
        const suggestView = new this._api.SuggestView(input, {
            offset: [0, 10],
            provider: {
                suggest: searchQuery => {
                    const areaLabels = [AddressHelper.TYPE_COUNTRY, AddressHelper.TYPE_REGION, AddressHelper.TYPE_CITY]
                        .map(addressType => this.props.addressValues[addressType + 'Label'])
                        .filter(Boolean)
                        .join(', ');
                    return this._api.suggest(areaLabels + ', ' + searchQuery);
                }
            }
        });

        suggestView.events.add('select', event => {
            const address = event.get('item').value;

            this._api.geocode(address)
                .then(result => {
                    const coordinates = result.geoObjects.get(0).geometry.getCoordinates();
                    this.props.dispatch(change(this.props.formId, this.props.addressNames.longitude, coordinates[0]));
                    this.props.dispatch(change(this.props.formId, this.props.addressNames.latitude, coordinates[1]));
                });
        });
    }

}

export default connect(
    (state, props) => ({
        parentId: AddressHelper.getParentId(state, props.formId, props.model, props.attribute),
        addressNames: AddressHelper.getNames(props.model, props.prefix),
        addressValues: AddressHelper.getValues(state, props.formId, props.model, props.prefix),
        initialValues: getFormInitialValues(props.formId)(state),
    })
)(AddressField);
