import { sdataSchema, getSdataDefault } from '../data/sdata-schema'

export const initSdata = () => {
	const context = getSdataDefault();
	const fieldName = getSdataDefault(context);
	const fieldValue = getSdataDefault(context, fieldName);
	const radiobuttons = 'Absolute';

	return {
		valid: true,
		result: {
			context,
			fieldName,
			fieldValue,
			radiobuttons,
			type: 'DAT'
		}
	}
};

export function sdataReducer(state, action) {
	const actionContext = action.data.result.context;
	const actionFieldName = action.data.result.fieldName;

	let newstate = null;

	if (actionContext !== state.result.context)
		newstate = onContextChange(state, action.data.result);
	else  if (actionFieldName !== state.result.fieldName)
		newstate = onFieldNameChange(state, action.data.result);

	newstate = newstate || Object.assign({}, state, action.data.result);

	return correctErrors(newstate, action.data.result);

}

const correctErrors = (state, payload) => {
	const { valid, errors } = payload;
	const { fieldName, fieldValue } = state.result;

	return {
		...state,
		valid: valid && fieldName && fieldValue,
		errors: errors,
	};
};

const onContextChange = (state, payload) => {
	const { context, fieldValue } = payload;

	const fieldName = getSdataDefault(context);

	let fValue = fieldValue;
	if (fValue === state.result.fieldValue)
		fValue = getSdataDefault(context, fieldName);

	return {
		result: {
			...payload,
			context,
			fieldName,
			fieldValue: fValue
		}
	};
};

const onFieldNameChange = (state, payload) => {
	let { fieldName } = payload;

	const context = state.result.context;

	let fieldValue = payload.fieldValue;

	if (sdataSchema[context][fieldName]) {
		fieldValue = getSdataDefault(context, fieldName);
	}

	if (fieldValue === state.result.fieldValue && sdataSchema[context][state.result.fieldName])
		fieldValue = '';

	return {
		result: {
			...payload,
			fieldName,
			fieldValue,
		}
	};
};
