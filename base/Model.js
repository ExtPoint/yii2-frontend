export default class Model {

    static meta() {
        return {};
    }

    static getMetaItem(attribute) {
        const meta = this.meta();
        if (!meta[attribute]) {
            throw new Error(`Not found meta item for attribute '${attribute}' in meta model '${this.constructor.name}'`);
        }

        return {
            appType: 'string',
            label: '',
            hint: '',
            required: false,
            ...meta[attribute],
        };
    }
}