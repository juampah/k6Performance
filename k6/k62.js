import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
    stages:[
        {duration: '60s', target: 60},
        {duration: '60s', target: 60},
        { duration: "30s", target: 0}    
    ]
}

export function setup() {
    var url = "https://staging.chek-accounts-engine.heypay.cl/accessTokens"
    var payload = JSON.stringify(
        {
            "clientId": "5vvsTWdXJ3gjxS5njzOa",
            "privateKey": "7SzMHShGKfHN2Dd3pHuT",
            "scope": "admin"
            
        }
    );

    var headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    } 

    var result = http.post(url, payload, headers);
    console.log(result.body)

    return {
        authResponse : JSON.parse(result.body)  
    }
}

export default function (data) {
    var url = 'https://staging.chek-accounts-engine.heypay.cl/accounts/qYsWJ8A0zT0zpyUF4Wz6'

    let headers = {
        headers: {
            'Authorization' : 'Bearer ' +  data.authResponse.accessToken
        }
    }
    var result = http.get(url, headers);

    check(result, {
        'status was 200': r => r.status == 200
    })
    sleep(1);
}

