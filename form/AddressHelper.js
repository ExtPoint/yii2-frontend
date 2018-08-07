import {formValueSelector} from 'redux-form';
import _values from 'lodash-es/values';
import _findLast from 'lodash-es/findLast';

import {http, types} from 'components';
import {getLabels} from '../reducers/formList';

export default class AddressHelper {

    static TYPE_COUNTRY = 'country';
    static TYPE_REGION = 'region';
    static TYPE_CITY = 'city';
    static TYPE_METRO_STATION = 'metroStation';
    static TYPE_ADDRESS = 'address';
    static TYPE_LONGITUDE = 'longitude';
    static TYPE_LATITUDE = 'latitude';

    static _detectCallbacks = null;
    static _detectedAddress = null;

    static detectAddress(ymaps) {
        if (this._detectedAddress) {
            return Promise.resolve(this._detectedAddress);
        }

        if (this._detectCallbacks === null) {
            let coordinates = null;

            ymaps.geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            })
                .then(result => {
                    const geoObject = result.geoObjects.get(0);
                    coordinates = geoObject.geometry.getCoordinates();

                    // Get ids for country, city and metro
                    return http.post('/address/auto-complete/ids/', {
                        country: this._getAddressComponent(geoObject, 'country'),
                        city: this._getAddressComponent(geoObject, 'locality'),
                        region: this._getAddressComponent(geoObject, 'province'),
                    });
                })
                .then(result => {
                    result = {
                        ...result,
                        coordinates,
                    };

                    this._detectedAddress = result;
                    this._detectCallbacks.forEach(callback => callback(result));
                })
                .catch(e => console.error(e)); // eslint-disable-line no-console

            this._detectCallbacks = [];
        }

        return new Promise(resolve => {
            this._detectCallbacks.push(resolve);
        });
    }

    static _getAddressComponent(geoObject, kind) {
        const components = geoObject.properties.get('metaDataProperty').GeocoderMetaData.Address.Components;
        const component = _findLast(components, com => com.kind === kind);
        return component && component.name || '';
    }

    static getParentMap() {
        return {
            [this.TYPE_REGION]: this.TYPE_COUNTRY,
            [this.TYPE_CITY]: this.TYPE_REGION,
            [this.TYPE_METRO_STATION]: this.TYPE_CITY,
        };
    }

    static getTypes() {
        return [
            this.TYPE_COUNTRY,
            this.TYPE_REGION,
            this.TYPE_CITY,
            this.TYPE_METRO_STATION,
            this.TYPE_ADDRESS,
            this.TYPE_LONGITUDE,
            this.TYPE_LATITUDE,
        ];
    }

    static getTypeWithLabel() {
        return [
            this.TYPE_COUNTRY,
            this.TYPE_REGION,
            this.TYPE_CITY,
            this.TYPE_METRO_STATION,
        ];
    }

    static getParentId(state, formId, model, prefix, attribute, attributePrefix) {
        const meta = types.getModelMeta(model);
        const metaItem = types.getMetaItem(model, attribute);
        const addressType = metaItem.addressType;
        const parentAddressType = AddressHelper.getParentMap()[addressType];
        if (!parentAddressType) {
            return null;
        }

        const parentName = Object.keys(meta).find(attributeName => {
            // A kludge to separate address fieldsets on the same page with the different prefix
            if (attributePrefix && attributeName.indexOf(attributePrefix) !== 0) {
                return false;
            }
            return meta[attributeName].addressType === parentAddressType;
        });
        const parentId = parentName ? formValueSelector(formId)(state, prefix + parentName) : null;
        return parentId ? parseInt(parentId) : null;
    }

    static getNames(model, prefix, attributePrefix) {
        const meta = types.getModelMeta(model);
        return AddressHelper.getTypes().reduce((obj, addressType) => {
            const attribute = Object.keys(meta).find(
                attributeName =>
                    // Check that attribute is of the addresType
                    meta[attributeName].addressType === addressType
                    // Check if the attribute has given prefix (if the prefix exists)
                    && (attributePrefix ? attributeName.indexOf(attributePrefix) === 0 : true)
            ) || null;
            if (attribute) {
                obj[addressType] = prefix + attribute;
            }
            return obj;
        }, {});
    }

    static getValues(state, formId, model, prefix, attribute, attributePrefix) {
        const selector = formValueSelector(formId);
        const addressNames = AddressHelper.getNames(model, prefix, attributePrefix);
        const addressNamesWithoutPrefix = AddressHelper.getNames(model, '');

        return Object.keys(addressNames).reduce((obj, addressType) => {
            if (addressNames[addressType]) {
                obj[addressType] = [].concat(selector(state, addressNames[addressType]))[0];
                if (AddressHelper.getTypeWithLabel().indexOf(addressType) !== -1) {
                    if (addressType === AddressHelper.TYPE_COUNTRY) {
                        const metaItem = types.getMetaItem(model, attribute);
                        const countryModelClass = types.getFieldConfig(metaItem.appType).countryModelClass;
                        obj[addressType + 'Label'] = types.getEnumLabel(countryModelClass, obj[addressType]);
                    } else {
                        obj[addressType + 'Label'] = _values(getLabels(state, `${formId}_${addressNamesWithoutPrefix[addressType]}`, obj[addressType])).join(', ');
                    }
                }
            }
            return obj;
        }, {});
    }

}