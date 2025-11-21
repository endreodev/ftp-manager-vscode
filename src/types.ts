export interface FtpConnection {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
    path: string;
    secure: boolean;
}

export interface FtpFile {
    name: string;
    path: string;
    isDirectory: boolean;
    size?: number;
    modified?: Date;
}

export enum FtpItemType {
    File = 'ftpFile',
    Directory = 'ftpDirectory'
}