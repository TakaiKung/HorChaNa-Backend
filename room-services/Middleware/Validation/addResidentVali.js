const Validate = require("fastest-validator");

const addResidentValidator = async (data) => {
    const validator = new Validate();
    const schema = {
        resident_info : { 
            type : 'object',
            props : {
                name : { type : 'string', empty : false },
                password : { type : 'string', empty : false },
                tel  : { type : 'string', empty : false, numeric : true }
                // entrance_date : { type : 'date', convert : true },
                // entrance_code : { type : 'string', empty : false }
            } 
        }
    }

    const checker = await validator.compile(schema);

    return checker(data);
}

module.exports = addResidentValidator;