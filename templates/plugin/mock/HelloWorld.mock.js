/* eslint-disable no-useless-computed-key */
module.exports = {
    ["GET /api/users"]: (req, res)=>{
        res.status(200).json({
            page_param: {
                total: 2,
                page_index: 1,
                page_size: 1,
            },
            data: [
                {
                    birthday: "et qui quis culpa",
                    gender: "enim consequat anim veniam",
                    user_name: "eiusmod cupidatat voluptate",
                    classification: null,
                    work_phone: "in",
                    user_code: "laboris exercitation in",
                    user_id: 1,
                    identity_no: null,
                    position: null,
                    email: "veniam commodo enim magna",
                    status: 1,
                },
                {
                    birthday: "laboris Ut",
                    gender: "reprehenderit d",
                    user_name: "ut eu",
                    classification: null,
                    work_phone: "nisi",
                    user_code: "Excepteur ut sunt commodo",
                    user_id: 2,
                    identity_no: null,
                    position: null,
                    email: "eu in tempor",
                    status: 0,
                },
            ]
        });
    },
    ["POST /api/users"]: (req, res)=>{
        res.status(200).send(`post 请求成功. ${JSON.stringify(req.body)}`);
    },
    ["PUT /api/users"]: (req, res)=>{
        res.status(200).send(`put 请求成功. ${JSON.stringify(req.body)}`);
    },
    ["DELETE /api/users"]: (req, res)=>{
        res.status(200).send(`del 请求成功. ${JSON.stringify(req.body)}`);
    },
    
};



