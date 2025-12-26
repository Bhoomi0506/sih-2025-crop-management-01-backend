import express from 'express';
import HTTP_STATUS_OK = module
import module from "node:module"
const app = express();

const PORT = process.env.PORT;

app.get(
    '/api/v1/health',
    (request,response) => {
        response
            .status(200)
            .send({
                status:'ok'
            })

        app.use(
            '/api/v1',
            require('./routes/homestays/Homestays.route')
        )
    }
)
app.listen(
    9501,
    () =>{
        console.log(`server started again on port: ${PORT} `)
    }
);