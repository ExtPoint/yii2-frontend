import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change, getFormInitialValues} from 'redux-form';
import {saveToCache} from 'extpoint-yii2/actions/formList';

import {view, resource} from 'components';
import AddressHelper from './AddressHelper';

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
        metaItem: PropTypes.shape({
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
        countryModelClass: PropTypes.string,
        autoCompleteUrl: PropTypes.string,
        autoDetect: PropTypes.bool,
        addressNames: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this._api = null;
        this._isSentDetect = false;
        this.state = {
            isDetecting: this.props.autoDetect,
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        resource.loadYandexMap()
            .then(ymaps => {
                this._api = ymaps;

                if (this.props.metaItem.addressType === AddressHelper.TYPE_ADDRESS) {
                    this._initSuggest();
                }
                if (this.props.autoDetect && [AddressHelper.TYPE_COUNTRY, AddressHelper.TYPE_REGION, AddressHelper.TYPE_CITY].indexOf(this.props.metaItem.addressType) !== -1) {
                    this._detectAddress();
                }
            });
    }

    render() {
        const props = {...this.props};

        switch (this.props.metaItem.addressType) {
            case AddressHelper.TYPE_COUNTRY:
            case AddressHelper.TYPE_REGION:
            case AddressHelper.TYPE_CITY:
            case AddressHelper.TYPE_METRO_STATION:
                props.dropDownProps = {
                    ...props,
                    onChange: this._onChange,
                    labelProps: null,
                    hintProps: null,
                    errorProps: null,
                };
                if ([AddressHelper.TYPE_COUNTRY, AddressHelper.TYPE_REGION, AddressHelper.TYPE_CITY].indexOf(this.props.metaItem.addressType) !== -1) {
                    props.dropDownProps.placeholder = this.state.isDetecting ? 'Определение...' : undefined;
                }
                if (this.props.metaItem.addressType === AddressHelper.TYPE_COUNTRY) {
                    props.dropDownProps.enumClassName = this.props.countryModelClass;
                } else {
                    props.dropDownProps.autoComplete = {
                        method: this.props.autoCompleteUrl,
                        addressType: this.props.metaItem.addressType,
                        parentId: this.props.parentId || null,
                    };
                }
                break;

            case AddressHelper.TYPE_ADDRESS:
            case AddressHelper.TYPE_LONGITUDE:
            case AddressHelper.TYPE_LATITUDE:
                props.stringProps = {
                    ...props,
                    onChange: this._onChange,
                    labelProps: null,
                    hintProps: null,
                    errorProps: null,
                };
                break;
        }

        const AddressFieldView = this.props.view || view.getFormView('AddressFieldView');
        return (
            <AddressFieldView {...props}/>
        );
    }


    _onChange(value) {
        let isFined = false;
        Object.keys(this.props.addressNames).forEach(key => {
            const name = this.props.addressNames[key];
            if (this.props.input.name === name && key !== AddressHelper.TYPE_METRO_STATION) {
                isFined = true;
            } else if (isFined) {
                this.props.dispatch(change(this.props.formId, name, null));
            }
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    _detectAddress() {
        if (!this._api.geolocation || this._isSentDetect) {
            return;
        }
        this._isSentDetect = true;

        this.setState({
            isDetecting: true,
        });

        AddressHelper.detectAddress(this._api)
            .then(data => {
                const toDispatch = [];
                Object.keys(data).map(addressType => {
                    const item = data[addressType];
                    if (this.props.addressNames[addressType]) {
                        toDispatch.push(saveToCache(
                            `${this.props.formId}_${this.props.addressNamesWithoutPrefix[addressType]}`,
                            {
                                [item.id]: {
                                    id: item.id,
                                    label: item.title,
                                },
                            }
                        ));

                        toDispatch.push(change(
                            this.props.formId,
                            this.props.addressNames[addressType],
                            item.id
                        ));
                    }
                });
                this.props.dispatch(toDispatch);

                this.setState({
                    isDetecting: false,
                });
            })
            .catch(e => console.error(e)); // eslint-disable-line no-console
    }

    _initSuggest() {
        const input = ReactDOM.findDOMNode(this).querySelector('input[type=text]');
        const suggestView = new this._api.SuggestView(input, {
            offset: [-1, 5],
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
                    this.props.dispatch([
                        //change(this.props.formId, this.props.addressNames.address, address),
                        change(this.props.formId, this.props.addressNames.longitude, coordinates[0]),
                        change(this.props.formId, this.props.addressNames.latitude, coordinates[1]),
                    ]);
                });
        });
    }

}

export default connect(
    (state, props) => ({
        parentId: AddressHelper.getParentId(state, props.formId, props.model, props.prefix, props.attribute, props.attributePrefix),
        addressNames: AddressHelper.getNames(props.model, props.prefix || ''),
        addressNamesWithoutPrefix: AddressHelper.getNames(props.model, ''),
        addressValues: AddressHelper.getValues(state, props.formId, props.model, props.prefix, props.attribute),
        initialValues: getFormInitialValues(props.formId)(state),
    })
)(AddressField);
