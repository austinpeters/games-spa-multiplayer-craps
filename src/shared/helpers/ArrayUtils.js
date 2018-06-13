const ArrayUtils = {

    first: array => {
        return array.values().next().value;
    },

    last: array => array[array.length - 1],

    next: (array, startObject) => {
        const cleanArray = array.filter(cleanup => true);
        const first = cleanArray[0];
        const startObjectIndex = cleanArray.indexOf(startObject);

        if (startObjectIndex >= cleanArray.length - 1) {
            return first;
        } else if (startObjectIndex === -1) {
            return undefined;
        } else {
            return cleanArray[startObjectIndex + 1];
        }
    },

    remove: (array, banishedObject) => {
        const banishedObjectIndex = array.indexOf(banishedObject);
        if (banishedObjectIndex > -1) {
            array.splice(banishedObjectIndex, 1);
        }
    }
};

export default ArrayUtils;