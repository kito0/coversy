import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { GetUserPayrolls } from 'redux/payroll';

export const Payroll = () => {
    const payrolls = useSelector((state) => state.payroll.payrolls);

    useEffect(() => {
        GetUserPayrolls();
    }, []);

    return (
        <>
            <section className='dashboard'>
                <div className='container'>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Period</TableCell>
                                <TableCell>Pay</TableCell>
                                <TableCell>Deductions</TableCell>
                                <TableCell>Net Pay</TableCell>
                                <TableCell>View</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payrolls?.map((payroll, k) => (
                                <TableRow key={k}>
                                    <TableCell>{payroll.period}</TableCell>
                                    <TableCell>
                                        ${payroll.pay?.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        ${payroll.deductions?.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        ${payroll.netPay?.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            href={`/payroll/report/${payroll.period}`}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </>
    );
};
