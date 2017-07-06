import {formValueSelector} from 'redux-form';
import _values from 'lodash/values';

import {types} from 'components';
import {getLabels} from '../reducers/formList';

export default class AddressHelper {

    static TYPE_COUNTRY = 'country';
    static TYPE_REGION = 'region';
    static TYPE_CITY = 'city';
    static TYPE_METRO_STATION = 'metroStation';
    static TYPE_ADDRESS = 'address';
    static TYPE_LONGITUDE = 'longitude';
    static TYPE_LATITUDE = 'latitude';

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

    static getParentId(state, formId, model, prefix, attribute) {
        const meta = types.getModelMeta(model);
        const metaItem = types.getMetaItem(model, attribute);
        const addressType = metaItem.addressType;
        const parentAddressType = AddressHelper.getParentMap()[addressType];
        if (!parentAddressType) {
            return null;
        }

        const parentName = Object.keys(meta).find(key => meta[key].addressType === parentAddressType) || null;
        const parentId = parentName ? formValueSelector(formId)(state, prefix + parentName) : null;
        return parentId ? parseInt(parentId) : null;
    }

    static getNames(model, prefix) {
        const meta = types.getModelMeta(model);
        return AddressHelper.getTypes().reduce((obj, addressType) => {
            const attribute = Object.keys(meta).find(key => meta[key].addressType === addressType) || null;
            if (attribute) {
                obj[addressType] = prefix + attribute;
            }
            return obj;
        }, {});
    }

    static getValues(state, formId, model, prefix, attribute) {
        const selector = formValueSelector(formId);
        const addressNames = AddressHelper.getNames(model, prefix);
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