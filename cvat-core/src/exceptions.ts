// Copyright (C) 2019-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import Platform from 'platform';
import ErrorStackParser from 'error-stack-parser';
// import config from './config';

/**
 * Base exception class
 * @memberof module:API.cvat.exceptions
 * @extends Error
 * @ignore
 */
export class Exception extends Error {
    private readonly time: string;
    private readonly system: string;
    private readonly client: string;
    private readonly info: string;
    private readonly filename: string;
    private readonly line: number;
    private readonly column: number;

    /**
     * @param {string} message - Exception message
     */
    constructor(message) {
        super(message);
        const time = new Date().toISOString();
        const system = Platform.os.toString();
        const client = `${Platform.name} ${Platform.version}`;
        const info = ErrorStackParser.parse(this)[0];
        const filename = `${info.fileName}`;
        const line = info.lineNumber;
        const column = info.columnNumber;

        // TODO: NOT IMPLEMENTED?
        // const {
        //     jobID, taskID, clientID, projID,
        // } = config;

        Object.defineProperties(
            this,
            Object.freeze({
                system: {
                    /**
                     * @name system
                     * @type {string}
                     * @memberof module:API.cvat.exceptions.Exception
                     * @readonly
                     * @instance
                     */
                    get: () => system,
                },
                client: {
                    /**
                     * @name client
                     * @type {string}
                     * @memberof module:API.cvat.exceptions.Exception
                     * @readonly
                     * @instance
                     */
                    get: () => client,
                },
                time: {
                    /**
                     * @name time
                     * @type {string}
                     * @memberof module:API.cvat.exceptions.Exception
                     * @readonly
                     * @instance
                     */
                    get: () => time,
                },
                // jobID: {
                //     /**
                //      * @name jobID
                //      * @type {number}
                //      * @memberof module:API.cvat.exceptions.Exception
                //      * @readonly
                //      * @instance
                //      */
                //     get: () => jobID,
                // },
                // taskID: {
                //     /**
                //      * @name taskID
                //      * @type {number}
                //      * @memberof module:API.cvat.exceptions.Exception
                //      * @readonly
                //      * @instance
                //      */
                //     get: () => taskID,
                // },
                // projID: {
                //     /**
                //      * @name projID
                //      * @type {number}
                //      * @memberof module:API.cvat.exceptions.Exception
                //      * @readonly
                //      * @instance
                //      */
                //     get: () => projID,
                // },
                // clientID: {
                //     /**
                //      * @name clientID
                //      * @type {number}
                //      * @memberof module:API.cvat.exceptions.Exception
                //      * @readonly
                //      * @instance
                //      */
                //     get: () => clientID,
                // },
                filename: {
                    /**
                     * @name filename
                     * @type {string}
                     * @memberof module:API.cvat.exceptions.Exception
                     * @readonly
                     * @instance
                     */
                    get: () => filename,
                },
                line: {
                    /**
                     * @name line
                     * @type {number}
                     * @memberof module:API.cvat.exceptions.Exception
                     * @readonly
                     * @instance
                     */
                    get: () => line,
                },
                column: {
                    /**
                     * @name column
                     * @type {number}
                     * @memberof module:API.cvat.exceptions.Exception
                     * @readonly
                     * @instance
                     */
                    get: () => column,
                },
            }),
        );
    }

    /**
     * Save an exception on a server
     * @name save
     * @method
     * @memberof Exception
     * @instance
     * @async
     */
    async save(): Promise<void> {
        const exceptionObject = {
            system: this.system,
            client: this.client,
            time: this.time,
            // job_id: this.jobID,
            // task_id: this.taskID,
            // proj_id: this.projID,
            // client_id: this.clientID,
            message: this.message,
            filename: this.filename,
            line: this.line,
            column: this.column,
            stack: this.stack,
        };

        try {
            const serverProxy = require('./server-proxy').default;
            await serverProxy.server.exception(exceptionObject);
        } catch (exception) {
            // add event
        }
    }
}

/**
 * Exceptions are referred with arguments data
 * @memberof module:API.cvat.exceptions
 * @extends module:API.cvat.exceptions.Exception
 */
export class ArgumentError extends Exception {
    /**
     * @param {string} message - Exception message
     */
}

/**
 * Unexpected problems with data which are not connected with a user input
 * @memberof module:API.cvat.exceptions
 * @extends module:API.cvat.exceptions.Exception
 */
export class DataError extends Exception {
    /**
     * @param {string} message - Exception message
     */
}

/**
 * Unexpected situations in code
 * @memberof module:API.cvat.exceptions
 * @extends module:API.cvat.exceptions.Exception
 */
export class ScriptingError extends Exception {
    /**
     * @param {string} message - Exception message
     */
}

/**
 * Plugin-referred exceptions
 * @memberof module:API.cvat.exceptions
 * @extends module:API.cvat.exceptions.Exception
 */
export class PluginError extends Exception {
    /**
     * @param {string} message - Exception message
     */
}

/**
 * Exceptions in interaction with a server
 * @memberof module:API.cvat.exceptions
 * @extends module:API.cvat.exceptions.Exception
 */
export class ServerError extends Exception {
    /**
     * @param {string} message - Exception message
     * @param {(string|number)} code - Response code
     */
    constructor(message, code) {
        super(message);

        Object.defineProperties(
            this,
            Object.freeze({
                /**
                 * @name code
                 * @type {(string|number)}
                 * @memberof module:API.cvat.exceptions.ServerError
                 * @readonly
                 * @instance
                 */
                code: {
                    get: () => code,
                },
            }),
        );
    }
}
