/*
*main
*/
(function(){

    var taskinfo={
        "value": {
            "salesTargetChartItems": [
                {
                    "monthNo": 1,
                    "salesTargetAmount": 190000,
                    "winAmount": 0
                },
                {
                    "monthNo": 2,
                    "salesTargetAmount": 210000,
                    "winAmount": 0
                },
                {
                    "monthNo": 3,
                    "salesTargetAmount": 200000,
                    "winAmount": 0
                },
                {
                    "monthNo": 4,
                    "salesTargetAmount": 210000,
                    "winAmount": 0
                },
                {
                    "monthNo": 5,
                    "salesTargetAmount": 190000,
                    "winAmount": 0
                },
                {
                    "monthNo": 6,
                    "salesTargetAmount": 200000,
                    "winAmount": 0
                },
                {
                    "monthNo": 7,
                    "salesTargetAmount": 190000,
                    "winAmount": 50000
                },
                {
                    "monthNo": 8,
                    "salesTargetAmount": 200000,
                    "winAmount": 0
                },
                {
                    "monthNo": 9,
                    "salesTargetAmount": 210000,
                    "winAmount": 0
                },
                {
                    "monthNo": 10,
                    "salesTargetAmount": 220000,
                    "winAmount": 0
                },
                {
                    "monthNo": 11,
                    "salesTargetAmount": 180000,
                    "winAmount": 0
                },
                {
                    "monthNo": 12,
                    "salesTargetAmount": 200000,
                    "winAmount": 0
                }
            ]
        },
        "type":"a"
    };
    var taskChart=new app.Typea('#chart-line',taskinfo);



    var funnelinfo={
        "value": {
            "pipelineColumns": [
                {
                    "salesStageNo": 2,
                    "name": "立项跟踪很长很长很长很长很长很长很长很长很长的字",
                    "winRate": 35,
                    "amount": 2
                },
                {
                    "salesStageNo": 3,
                    "name": "呈报方案很长很长很长很长很长很长很长很长很长很长很长的字",
                    "winRate": 50,
                    "amount": 0
                },
                {
                    "salesStageNo": 4,
                    "name": "789很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的字",
                    "winRate": 60,
                    "amount": 0
                },
                {
                    "salesStageNo": 5,
                    "name": "1212很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的字",
                    "winRate": 90,
                    "amount": 0
                },
                {
                    "salesStageNo": 10,
                    "name": "赢单",
                    "winRate": 100,
                    "amount": 0
                }
            ],
            "salesTargetAmount": 0,
            "pipelineAmount": 2,
            "maybeWinAmount": 0.7,
            "salesForecastAmount": 0.7,
            "winAmount": 0
        },
        "type":"b",
    };
    var funnelChart=new app.Typeb('#chart-funnel',funnelinfo); 

    var returninfo={
        "value": {
            "PaymentItems": [
                {
                    "value": 1,
                    "value1": 0
                },
                {
                    "value": 2,
                    "value1": 0
                },
                {
                    "value": 3,
                    "value1": 0
                },
                {
                    "value": 4,
                    "value1": 0
                },
                {
                    "value": 5,
                    "value1": 0
                },
                {
                    "value": 6,
                    "value1": 0
                },
                {
                    "value": 7,
                    "value1": 23992.69
                },
                {
                    "value": 8,
                    "value1": 61220
                },
                {
                    "value": 9,
                    "value1": 0
                },
                {
                    "value": 10,
                    "value1": 0
                },
                {
                    "value": 11,
                    "value1": 0
                },
                {
                    "value": 12,
                    "value1": 0
                }
            ]
        },
        "type": "c"
    };
    var returnChart=new app.Typec('#chart-return',returninfo);

    var newinfo={
        "value": {
            "fCustomerContactNumChartItems": [
                {
                    "monthNo": 1,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 2,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 3,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 4,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 5,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 6,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 7,
                    "contactsCount": 57,
                    "fCustomersCount": 20
                },
                {
                    "monthNo": 8,
                    "contactsCount": 34,
                    "fCustomersCount": 24
                },
                {
                    "monthNo": 9,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 10,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 11,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                },
                {
                    "monthNo": 12,
                    "contactsCount": 0,
                    "fCustomersCount": 0
                }
            ]
        },
        "type": "d"
    };
    var newChart=new app.Typed('#chart-new',newinfo);


})();

