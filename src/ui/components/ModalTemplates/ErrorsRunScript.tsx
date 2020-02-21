import React, { FC, memo } from "react";
import { Alert } from "react-bootstrap";

interface ErrorsRunScript {
    //modalName: string;
    text?: string;
    errors?: string[];
}

const ErrorsRunScript: FC<ErrorsRunScript> = ({ text, errors }) => {
    return (
        (errors && errors.length > 0 && (
            <Alert variant="danger" className="text-left error-list">
                <ul>
                    {errors.map(er => (
                        <li className="error-string">{er}</li>
                    ))}
                </ul>
            </Alert>
        )) ||
        null
    );
};
export default memo(ErrorsRunScript);
