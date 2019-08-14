import {server} from '../lib/server_init';
import {uploadConfig} from '../api_utils/upload_handler';
import fs from 'fs';
server.route(uploadConfig(
    '/api/upload_test',
    'POST',
    1<<20,
    'file',
    async(request,h,uploadStream)=>{
        let strm = fs.createWriteStream('./file.jpg');
        uploadStream.pipe(strm);
        return 'Success';
    }
));