import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from "path";
import * as url from "url";

const server = http.createServer();
const publicDir = p.resolve(__dirname, "public");

server.on("request", (request: IncomingMessage, response: ServerResponse) => {
    //将请求中的url命名为path
    const {method, url: path, headers} = request;
    //使用url模块来处理查询参数
    const object = url.parse(path);
    //裸路径名
    const {pathname} = object;
    //请求处理
    const filename = pathname.substr(1) || "index.html";

    if (method !== "GET") {
        response.statusCode = 405;
        response.end("该服务器无法响应post请求");
        return;
    }
    fs.readFile(p.resolve(publicDir, filename), (error, data) => {
        if (error) {
            if (error.errno === -4058) {
                response.statusCode = 404;
                fs.readFile(p.resolve(publicDir, "404.html"), (error, data) => {
                    response.end(data);
                });
            } else if (error.errno === -4068) {
                response.statusCode = 403;
                response.end("无权访问");
            } else {
                response.statusCode = 500;
                response.end("服务器繁忙请稍后重试");
            }
        } else {
            //返回数据,添加缓存
            response.setHeader("Cache-Control", "public,max-age=3");
            response.end(data);
        }
    });

});
server.listen(8888);
//
// console.log(request.url);
// console.log(request.httpVersion);
// const data = [];
// request.on("data", (chunk) => {
//     data.push(chunk);
// });
// request.on("end", () => {
//     console.log(Buffer.concat(data).toString());
//     response.statusCode = 400;
//     response.setHeader("x-hhh", "hhh");
//     response.write("这是响应的写入\n");
//     response.end("hi");
// });
// switch (pathname) {
//     case "/index.html":
//         fs.readFile(p.resolve(publicDir, "index.html"), (error, data) => {
//             if (error) {
//                 throw new Error();
//             }
//             response.end(data.toString());
//         });
//         break;
//     case "/style.css":
//         fs.readFile(p.resolve(publicDir, "style.css"), (error, data) => {
//             if (error) {
//                 throw new Error();
//             }
//             response.end(data.toString());
//         });
//         break;
//     case "/main.js":
//         fs.readFile(p.resolve(publicDir, "main.js"), (error, data) => {
//             if (error) {
//                 throw new Error();
//             }
//             response.end(data.toString());
//         });
//         break;
//     default:
//         response.statusCode = 404;
//         response.end();
//         break;
// }