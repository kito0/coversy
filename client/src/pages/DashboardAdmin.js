import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import { LogoutUser } from 'redux/user';
import { Calendar } from 'react-calendar';
import Time from 'react-pure-time';
import { FileUploader } from "react-drag-drop-files";
import {
    Box,
    Typography,
    Modal,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import Papa from 'papaparse';

// Update to use date objects
const createData = (name, startTime, endTime,classname) => {
    return { name, startTime, endTime,classname };
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
// Update to use date objects
const rows = [
    createData('John doe', new Date(), new Date(),'Gym'),
    createData('Jane Doe', new Date(), new Date(),'Math'),
];
const fileTypes = [".CSV"];

export const DashboardAdmin = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [value, setValue] = useState(new Date());
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
    };
    
    useEffect(() => {
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (res) => {
                    console.log(res.data);
                },
            });
        }
    }, [file]);

    return (
        <section className='dashboard'>
            <section className='nav'>
                <div className='container'>
                    <h2>Coversy</h2>
                    <div className='button-cont'>
                        <Button
                            variant='outlined'
                            className='button logout-btn'
                            onClick={() => {
                                <Navigate to='/login' />;
                                LogoutUser();
                            }}
                        >
                            Logout
                        </Button>
                        <Button
                            variant='outlined'
                            color='secondary'
                            href='/DashboardAdmin'
                            className='button'
                        >
                            Dashboard
                        </Button>
                        <Button
                            variant='outlined'
                            className='button logout-btn'
                            onClick={() => {
                                <Navigate to='/PayrollAdmin' />;
                            }}
                        >
                            Payroll
                        </Button>
                    </div>
                </div>
            </section>
            <div className='container'>
                <div className='col left'>
                    <Calendar onChange={setValue} value={value} />
                    <div className='upload_btn'>
                        <Button variant='contained' className='btnFullWidth' onClick={handleOpen} >Upload Schedule</Button>
                    </div>
                   
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            Upload Schedule
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                             <FileUploader handleChange={handleChange} name="file"  label="Drop files to upload or"  accept='.csv' types={fileTypes} />
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleClose}
                                className='button margin10'
                            >
                                Upload
                            </Button>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={handleClose}
                                className='button margin10'
                            >
                                Cancel
                            </Button>
                            </Typography>
                        </Box>
                    </Modal>
                </div>
                <div className='col right'>
                    <div className='shift_table'>
                        <h2>Shift</h2>
                    </div>
                    <Table className='table'>
                        <TableHead className='table__head'>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Shift Date</TableCell>
                                <TableCell align='right'>Shift Time</TableCell>
                                <TableCell align='right'>Class</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className='table__body'>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell scope='row'>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Time value={row.startTime} format="M d, Y" />
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Time value={row.endTime} format="M d, Y" />
                                    </TableCell>
                                    <TableCell align='right'>
                                        {row.classname}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
};
