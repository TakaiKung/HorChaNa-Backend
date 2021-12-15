import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Meter from './Meter.meter';
import axios from 'axios';

const  MeterInterface = () => {

    const [meterList, setMeterLists] = useState([]);

    /**
     * ! This is useEffect area
     */
    useEffect(async () => {
        const fetcMeterList = await FetchMeterList();
        setMeterLists(fetcMeterList);
    })

    /**
     * ! This is method area
     */
    const FetchMeterList = async () => {
        try {
            const meterList = await axios.get('http://localhost:3001/api/meter/get/meterlist');
            return meterList.data.roomsData;
        }
        catch (err) {
            return console.log(err);
        }
    }


    return (  
        <>
            <Container fluid >
                <Row xs={1} md={4} className="g-4">
                    {
                        meterList.map((meterData) => (
                            <Col key={ meterData._id } style={{ marginBottom : 0 }}>
                                 <Meter meterData={ meterData } key={ meterData._id }/>
                            </Col>
                        ))
                    }
                </Row>
            </Container>
        </>
    );
}
 
export default MeterInterface ;