import { useEffect, useState } from "react";
import { ButtonGroup, Button, Card, Modal, ToggleButton } from "react-bootstrap";
import axios from 'axios';
import { io } from "socket.io-client";

const Meter = ({ meterData }) => {

    const [electModal, setElectModal] = useState(false);
    const [waterModal, setWaterModal] = useState(false);
    const [electBtn, setElectBtn] = useState(null);
    const [waterBtn, setWaterBtn] = useState(null);
    const [qrCode, setQrCode] = useState('Not Have QR code source');

    const [socketElectric, setSocketElectric] = useState('');
    const [socketWater, setSocketWater] = useState('');

    const [electInterval, setElectInterval] = useState('');
    const [waterInterval, setWaterInterval] = useState('');
    // Electric Meter Socket to gen Unit
    useEffect(function socketElectricCon() {
        if (electBtn === true) {
            console.log(meterData.roomId+" electric : "+electBtn);
            const socket = io('http://localhost:3001/', {query: `roomId=${ meterData.roomId } : electric`});
            setSocketElectric(socket);
            const genUnit = setInterval(() => {
                let random = parseFloat((Math.random()*10).toFixed(2));
                console.log(random)
                socket.emit ('runUnitElectric', { roomId : meterData.roomId, meterId : meterData.electric_meterId, unit : random});
            }, 1*500); 
            setElectInterval(genUnit);
        }
        if (electBtn === false) {
            console.log(meterData.roomId+" electric : "+electBtn);
            socketElectric.disconnect(true, { query:`roomId=${ meterData.roomId } : electric`});
            clearInterval(electInterval)
        }
    }, [electBtn]);

    // Water Meter Socket to gen Unit
    useEffect(function socketWaterCon() {
        if (waterBtn === true) {
            console.log(meterData.roomId+" water : "+waterBtn);
            const socket = io('http://localhost:3001/', {query: `roomId=${ meterData.roomId } : water`});
            setSocketWater(socket);
            const genUnit = setInterval(() => {
                let random = parseFloat((Math.random()*10).toFixed(2));
                console.log(random)
                socket.emit ('runUnitWater', { roomId : meterData.roomId, meterId : meterData.water_meterId, unit : random });
            }, 1*1000); 
            setWaterInterval(genUnit);
        }
        if (waterBtn === false) {
            console.log(meterData.roomId+" water : "+waterBtn);
            socketWater.disconnect(true, { query:`roomId=${ meterData.roomId } : water`});
            clearInterval(waterInterval)
        }
    }, [waterBtn])

    const makeReqToQrCode = async (meterType, roomId) => {
        console.log(`makeReqToQrCode---Run...`);
        try {
            const genQr = await axios.post('http://localhost:3001/api/meter/registeration', { meterType : meterType, roomId : roomId });
            const QrCode = genQr.data.src;
            if (meterType === 'waterMeter') {
                setQrCode(QrCode);
                setWaterModal(true);
                
            }
            if (meterType === 'electricMeter') {
                setQrCode(QrCode);
                setElectModal(true);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    
    const genUnit = () => {
        
    }

    return ( 
        <Card>
            <Card.Header className="bg-dark"><h5 className="text-light  ">Room Id : { meterData.roomId }</h5></Card.Header>
            <Card.Body>
                <Card.Title style={{ fontSize : 16 }}>
                    ⚡ Electric Meter Id :
                    {
                        !meterData.electric_meterId ? '⚠️ Pls add meter' : meterData.electric_meterId
                    }
                </Card.Title>
                <Card.Title style={{ fontSize : 16 }}> 
                    🌊 Water Meter Id :
                    {
                        !meterData.water_meterId ? '⚠️ Pls add meter' : meterData.water_meterId 
                    }
                </Card.Title>
                <ButtonGroup className="d-flex justify-content-center">
                    { 
                        meterData.electric_meterId ?
                        <ToggleButton
                            variant="warning"
                            id={ meterData.electric_meterId }
                            type="checkbox"
                            checked={ electBtn }
                            onChange={ (e) => { setElectBtn(e.currentTarget.checked);} }
                        > run ⚡ Electric </ToggleButton> :
                        <Button variant="warning" onClick={ () => { makeReqToQrCode('electricMeter', meterData.roomId) }  }>
                            Gen ⚡ QR CODE
                        </Button>
                    }
                    {
                        meterData.water_meterId ?
                        <ToggleButton
                            variant="primary"
                            id={ meterData.water_meterId }
                            type="checkbox"
                            checked={ waterBtn }
                            onChange={ (e) => setWaterBtn(e.currentTarget.checked) }
                        > run 🌊 Water </ToggleButton> :
                        <Button variant="primary" onClick={ () => { makeReqToQrCode('waterMeter', meterData.roomId) } }>
                            Gen 🌊 QR CODE
                        </Button>
                    }
                </ButtonGroup>
            
                {/* ---------------Modal Section-------------------- */}

                <Modal show={ electModal } onHide={ () => setElectModal(false) } backdrop="static" keyboard={ false }>
                    <Modal.Header closeButton>
                        <Modal.Title>Gen QR code for Electric Meter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {
                            qrCode !== 'Not have an src' ? <img src={ qrCode }></img> : <Text> Not Have Src </Text>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={ () => setElectModal(false) }>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={ waterModal } onHide={ () => setWaterModal(false) } backdrop="static" keyboard={ false }>
                    <Modal.Header closeButton>
                        <Modal.Title>Gen QR code for Water Meter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {
                            qrCode !== 'Not have an src' ? <img src={ qrCode }></img> : <Text> Not Have Src </Text>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={ () => setWaterModal(false) }>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
}
 
export default Meter;