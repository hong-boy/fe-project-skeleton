import Mock from "mockjs";

// 构造模拟数据
Mock.mock("/api/users", "get", options => {
    const body = {
        // 分页
        page_param: {
            total: 2,
            page_index: 1,
            page_size: 1,
        },
        // 数据
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
        ],
    };

    return options;
});

Mock.mock("/api/users", "post", options => {
    return options;
});

Mock.mock("/api/users/0", "delete", options => {
    return options;
});

Mock.mock("/api/users", "put", options => {
    return options;
});
