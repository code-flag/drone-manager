/**
 * @author Francis Olawumi Awe <awefrancolaz@gmail.com>
 * This is file contains method that maybe difficult to implement in controller directly
 * So its being implemented for generic use
 */


/**
 * This method helps to update any record inside the object or document of a nested array in a document
 * @example - 
 * { arr: [
 *  {nestedArr: [{key: val}]}
 * ]}
 * @param model - Mongodb model
 * @param queryId - this must be mongodb unique record id
 * @param input - this is the request body for nested array data object
 * @param docFieldName - this is the document array field name
 * @param docObjKey - this is the key or field of one of the object or document in the array
 * @param docMatchQuery - this is the match query for a specific obj or document inside the array
 * @example - {email: email} or {teamId: teamId}
 */
export const updateNestedArrayOfDocument = async (model: any, queryId: string, input: any, docFieldName: string, docObjKey: string, docMatchQuery: any): Promise<any> => {
    let queryData: any = {};

    Object.keys(input).forEach((key) => {
         queryData[`${docFieldName}.$.${docObjKey}.${key}`] = input[key];
     });

    return await model.findOneAndUpdate(
        { $and: [ {"_id": queryId}, {[docFieldName]: {$elemMatch: docMatchQuery}}] },
        { $set: queryData},
        { "new": true}
        );
}

/**
 * This method is used to update a single record in the nested document
 * @example - 
 * { arr: [{key: val} ]}
 * @param model - Mongodb model
 * @param queryId - this must be mongodb unique record id
 * @param input - this is the request body 
 * @param docFieldName - this is the document array field name
 * @param docMatchQuery - this is the match query for a specific obj or document inside the array
 * @example - {email: email} or {teamId: teamId}
 * @returns {model} model
 */

export const updateDocumentOfArray = async (model: any, queryId: string, input: any, docFieldName: string, docMatchQuery: any): Promise<any> => {
    
    let queryData: any = {};

    Object.keys(input).forEach((key) => {
         queryData[`${docFieldName}.$.${key}`] = input[key];
     });
        
     return await model.findOneAndUpdate(
         { $and: [ {"_id": queryId}, {[docFieldName] : {$elemMatch: docMatchQuery}}] },
         { $set: queryData }, {'new': true}
       );
}

/**
 * This method is used to delete document from array of document using a unique field in the record
 * @example - 
 * { arr: [{key: val}, {key2: val} ]}
 * @param model - Mongodb model
 * @param queryId - this must be mongodb unique record id
 * @param input - this is the request body 
 * @param docFieldName - this is the document array field name
 * @param docMatchQuery - this is the match query for a specific obj or document inside the array
 * @example - {email: email} or {teamId: teamId}
 * @returns {model} model
 */
export const deleteRecordFromArray = async (model: any, queryId: string, docFieldName: string, docMatchQuery: any): Promise<any> => {
    return await model.findOneAndUpdate( {"_id": queryId},
      {
        $pull: {
            [docFieldName] : docMatchQuery
         } 
      }, {safe:true});
}

/**
 * This method helps to update any record inside the object or document of a nested array in a document
 * @example - 
 * { arr: [
 *  {nestedArr: [{key: val}]}
 * ]}
 * @param model - Mongodb model
 * @param queryId - this must be mongodb unique record id
 * @param docFieldName - this is the document array field name
 * @param docObjKey - this is the key or field of one of the object or document in the array
 * @param docMatchQuery - this is the match query for a specific obj or document inside the array
 * @example - {email: email} or {teamId: teamId}
 */
export const deleteNestedArrayOfDocument = async (model: any, queryId: string, docFieldName: string, docObjKey: string, docMatchQuery: any): Promise<any> => {

    return await model.findOneAndUpdate(
        {"_id": queryId}, {
            $pull: {
                [`${docFieldName}.$.${docObjKey}`]: docMatchQuery
            } 
        },
        { safe: true}
        );
}
