import { HttpResponseInit } from '@azure/functions';
import HttpStatus, { createExceptionResponse } from './_httpHelpers.js';

export function validateFields(
  fields: { [key: string]: any },
  ignoreFields?: { [key: string]: boolean | any }
): undefined | HttpResponseInit {
  let missingFields: string[] = [];
  if (!!fields) {
    //assumes all fields are specified on the fields object
    missingFields = Object.keys(fields).filter((key) => {
      if (typeof fields[key] === 'object') {
        const newIgnoreFields =
          !!ignoreFields && typeof ignoreFields[0] === 'object'
            ? ignoreFields[key]
            : undefined;
        return validateFields(fields[key], newIgnoreFields) !== undefined;
      }

      return fields[key] === undefined || fields[key] === null;
    });
  }
  //does not validate if field not on fields and ignoreFields[item] === false
  if (!!ignoreFields) {
    Object.keys(ignoreFields).forEach((key) => {
      if (ignoreFields[key] === true) {
        const index = missingFields.indexOf(key);
        if (index > -1) {
          missingFields.splice(index, 1);
        }
      }
    });
  }

  if (missingFields.length > 0) {
    console.error('Missing required fields', missingFields);
    return createExceptionResponse(
      HttpStatus.BAD_REQUEST,
      'Missing required fields',
      { fields: missingFields }
    );
  }

  return undefined;
}
