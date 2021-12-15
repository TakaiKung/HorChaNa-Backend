const Validate = require("fastest-validator");

const createRoomValidator = async (data) => {
    const validator = new Validate();
    const schema = {
        room_id : { type : 'string'},
        electric_meterId : { type : 'string', empty : false },
        water_meterId : { type : 'string', empty : false },
        room_price : { type : 'number', positive : true, },
        resident_info : { 
            type : 'object',
            props : {
                // name : { type : 'string', empty : false },
                // password : { type : 'string', empty : false },
                // tel  : { type : 'string', empty : false, numeric : true },
                // entrance_date : { type : 'date', convert : true },
                entrance_code : { type : 'string', empty : false }
            } 
        }
    }
    
    const checker =  await validator.compile(schema);

    return checker(data);
}

const testCreateRoomValidator = async () => {
    const dummyData = {
        roomId : '12',
        electric_meterId : '',
        water_meterId : 9855555,
        room_price : '5000',
        resident_info : {
            name : '',
            tel : 087012345687 ,
            entrance_date : new Date(),
            entrance_code : 56897
        }
    }
    
    let a = await createRoomValidator(dummyData);
    console.log(a);
}

module.exports.createRoomValidator = createRoomValidator;
module.exports.testCreateRoomValidator = testCreateRoomValidator;