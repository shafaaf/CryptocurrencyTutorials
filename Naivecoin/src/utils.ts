import * as CryptoJS from "crypto-js";

const calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
): string => CryptoJS.SHA256 (
                index +
                previousHash +
                timestamp +
                data
             ).toString();

export { calculateBlockHash };
